/*
Service worker for one section of the site, the toys at /toys/, the games at
/games/ or the tools at /tools/: its index and every toy beneath it. build-pwa.js
copies it into each section, and it is registered by pwa.js, which the index
pages and each toy include. The workers share the origin's caches, so each
names its caches after its own section and only ever deletes its own.

build-pwa.js replaces the importScripts() line below with the list of files
to cache, along with a version derived from their contents. Any change to a
toy therefore changes the bytes of this worker, so the browser notices the
change when it checks for updates. The new version is installed into a fresh
cache, and the old one is discarded on activation.

The toys' own files are fetched from the network first, so that a visit when
online always shows the latest version, even before an updated worker has
been installed. Fresh copies replace the cached ones. If the network fails,
or is too slow to answer, the cached copy is used instead, so the toys still
work offline.

Third party resources, such as the toys' web fonts and pinned versions of
libraries, never change, so they are answered from the cache first. Anything
not in the precache, such as the large sample images that are deliberately
left out of it, is remembered in a runtime cache once it has been seen.
Cross-origin resources are fetched without CORS so that their opaque
responses can still be stored.
*/

"use strict";

self.PRECACHE = {
	"version": "05fcf9a4351ce8d7",
	"urls": [
		"/tools/",
		"/tools/apple-touch-icon.png",
		"/tools/icon-192.png",
		"/tools/icon-512.png",
		"/tools/jpegulator/apple-touch-icon.png",
		"/tools/jpegulator/icon-192.png",
		"/tools/jpegulator/icon-512.png",
		"/tools/jpegulator/icon.svg",
		"/tools/jpegulator/",
		"/tools/jpegulator/manifest.webmanifest",
		"/tools/lenticulator/app.js",
		"/tools/lenticulator/apple-touch-icon.png",
		"/tools/lenticulator/icon-192.png",
		"/tools/lenticulator/icon-512.png",
		"/tools/lenticulator/icon.svg",
		"/tools/lenticulator/",
		"/tools/lenticulator/manifest.webmanifest",
		"/tools/lenticulator/pico.min.css",
		"/tools/lenticulator/styles.css",
		"/tools/manifest.webmanifest",
		"/tools/over-underiser/apple-touch-icon.png",
		"/tools/over-underiser/icon-192.png",
		"/tools/over-underiser/icon-512.png",
		"/tools/over-underiser/icon.svg",
		"/tools/over-underiser/",
		"/tools/over-underiser/manifest.webmanifest",
		"/tools/pwa.js",
		"/tools/tunerful/apple-touch-icon.png",
		"/tools/tunerful/icon-192.png",
		"/tools/tunerful/icon-512.png",
		"/tools/tunerful/icon.svg",
		"/tools/tunerful/",
		"/tools/tunerful/manifest.webmanifest",
		"/tools/vectorious/apple-touch-icon.png",
		"/tools/vectorious/icon-192.png",
		"/tools/vectorious/icon-512.png",
		"/tools/vectorious/icon.svg",
		"/tools/vectorious/",
		"/tools/vectorious/manifest.webmanifest",
		"/static/static.css",
		"/images/banner.jpg",
		"/favicon.ico",
		"/screenshots/tools/jpegulator.webp",
		"/screenshots/tools/over-underiser.webp",
		"/screenshots/tools/lenticulator.webp",
		"/screenshots/tools/tunerful.webp",
		"/screenshots/tools/vectorious.webp"
	],
	"external": [
		"https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
	]
};

const SECTION = new URL(self.registration.scope).pathname.split("/").filter(Boolean)[0] || "toys",
	PRECACHE = SECTION + "-precache-" + self.PRECACHE.version,
	RUNTIME = SECTION + "-runtime";

self.addEventListener("install",event => {
	event.waitUntil((async () => {
		const cache = await caches.open(PRECACHE);
		// Bypass the HTTP cache so that a new version really is new
		await cache.addAll(self.PRECACHE.urls.map(url => new Request(url,{cache: "reload"})));
		// Third party scripts and stylesheets are best effort: a failure here
		// must not prevent the toys themselves from being installed
		await Promise.all(self.PRECACHE.external.map(async url => {
			try {
				const response = await fetch(new Request(url,{mode: "no-cors", cache: "reload"}));
				await cache.put(url,response);
			} catch(e) {
				// Left for the runtime cache to pick up later
			}
		}));
		await self.skipWaiting();
	})());
});

self.addEventListener("activate",event => {
	event.waitUntil((async () => {
		const keys = await caches.keys();
		await Promise.all(keys
			.filter(key => key.startsWith(SECTION + "-") && key !== PRECACHE && key !== RUNTIME)
			.map(key => caches.delete(key)));
		await self.clients.claim();
	})());
});

// Alternative URLs under which a precached page may be requested: a folder
// without its trailing slash, or with an explicit index.html
function pageAliases(url) {
	const aliases = [],
		pathname = url.pathname;
	if(pathname.endsWith("/index.html")) {
		aliases.push(pathname.slice(0,-"index.html".length));
	} else if(!pathname.endsWith("/") && !/\.[a-z0-9]+$/i.test(pathname)) {
		aliases.push(pathname + "/");
	}
	return aliases.map(alias => url.origin + alias);
}

// How long to wait for the network before falling back to the cache
const NETWORK_TIMEOUT_MS = 4000;

// Fetch from the network, storing a good response in the given cache. A
// response that has not arrived within the timeout settles as null, but the
// fetch carries on and still updates the cache when it completes
function fetchAndStore(event,request,cache,cacheKey,options) {
	let stored = null;
	const network = fetch(request,options).then(response => {
		if((response.ok && !response.redirected) || response.type === "opaque") {
			stored = cache.put(cacheKey,response.clone());
		}
		return response;
	});
	event.waitUntil(network.then(() => stored).catch(() => {}));
	const timeout = new Promise(resolve => setTimeout(() => resolve(null),NETWORK_TIMEOUT_MS));
	return {network, settled: Promise.race([network.catch(() => null),timeout])};
}

self.addEventListener("fetch",event => {
	const request = event.request;
	if(request.method !== "GET") {
		return;
	}
	const url = new URL(request.url);
	event.respondWith((async () => {
		const precache = await caches.open(PRECACHE),
			runtime = await caches.open(RUNTIME),
			matchOptions = {ignoreSearch: true, ignoreVary: true};
		// Find the precache entry, under any of the page's alternative URLs
		let cacheKey = null,
			cached = await precache.match(request,matchOptions);
		if(cached) {
			cacheKey = url.origin + url.pathname;
		} else if(request.mode === "navigate") {
			for(const alias of pageAliases(url)) {
				cached = await precache.match(alias,matchOptions);
				if(cached) {
					cacheKey = alias;
					break;
				}
			}
		}
		const cache = cached ? precache : runtime;
		if(url.origin === self.location.origin) {
			// Network first, falling back to the cache when offline, slow or
			// redirected: Safari refuses a redirected response to a
			// navigation. Revalidate with the server rather
			// than trusting the browser's HTTP cache, which may be minutes old
			const {network, settled} = fetchAndStore(event,request,cache,cacheKey || request,{cache: "no-cache"});
			const response = await settled;
			if(response && !response.redirected) {
				return response;
			}
			const fallback = cached || await runtime.match(request,matchOptions);
			return fallback || response || network;
		}
		if(cached) {
			return cached;
		}
		const fallback = await runtime.match(request,matchOptions);
		if(fallback) {
			return fallback;
		}
		return fetchAndStore(event,request,runtime,request).network;
	})());
});
