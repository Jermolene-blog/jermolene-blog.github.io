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
	"version": "2740e919c51f17e0",
	"urls": [
		"/toys/",
		"/toys/apple-touch-icon.png",
		"/toys/bear-beat/apple-touch-icon.png",
		"/toys/bear-beat/bear-model.js",
		"/toys/bear-beat/icon-192.png",
		"/toys/bear-beat/icon-512.png",
		"/toys/bear-beat/icon.svg",
		"/toys/bear-beat/",
		"/toys/bear-beat/manifest.webmanifest",
		"/toys/blobbles/apple-touch-icon.png",
		"/toys/blobbles/icon-192.png",
		"/toys/blobbles/icon-512.png",
		"/toys/blobbles/icon.svg",
		"/toys/blobbles/",
		"/toys/blobbles/manifest.webmanifest",
		"/toys/engravery/apple-touch-icon.png",
		"/toys/engravery/icon-192.png",
		"/toys/engravery/icon-512.png",
		"/toys/engravery/icon.svg",
		"/toys/engravery/",
		"/toys/engravery/manifest.webmanifest",
		"/toys/flowing-field/apple-touch-icon.png",
		"/toys/flowing-field/icon-192.png",
		"/toys/flowing-field/icon-512.png",
		"/toys/flowing-field/icon.svg",
		"/toys/flowing-field/",
		"/toys/flowing-field/manifest.webmanifest",
		"/toys/fractaliser/apple-touch-icon.png",
		"/toys/fractaliser/icon-192.png",
		"/toys/fractaliser/icon-512.png",
		"/toys/fractaliser/icon.svg",
		"/toys/fractaliser/",
		"/toys/fractaliser/manifest.webmanifest",
		"/toys/icon-192.png",
		"/toys/icon-512.png",
		"/toys/knottery/apple-touch-icon.png",
		"/toys/knottery/icon-192.png",
		"/toys/knottery/icon-512.png",
		"/toys/knottery/icon.svg",
		"/toys/knottery/",
		"/toys/knottery/manifest.webmanifest",
		"/toys/manifest.webmanifest",
		"/toys/marblelous/apple-touch-icon.png",
		"/toys/marblelous/icon-192.png",
		"/toys/marblelous/icon-512.png",
		"/toys/marblelous/icon.svg",
		"/toys/marblelous/",
		"/toys/marblelous/manifest.webmanifest",
		"/toys/mimic/apple-touch-icon.png",
		"/toys/mimic/icon-192.png",
		"/toys/mimic/icon-512.png",
		"/toys/mimic/icon.svg",
		"/toys/mimic/",
		"/toys/mimic/manifest.webmanifest",
		"/toys/pwa.js",
		"/toys/radialator/apple-touch-icon.png",
		"/toys/radialator/icon-192.png",
		"/toys/radialator/icon-512.png",
		"/toys/radialator/icon.svg",
		"/toys/radialator/",
		"/toys/radialator/manifest.webmanifest",
		"/toys/rug-addict/apple-touch-icon.png",
		"/toys/rug-addict/icon-192.png",
		"/toys/rug-addict/icon-512.png",
		"/toys/rug-addict/icon.svg",
		"/toys/rug-addict/",
		"/toys/rug-addict/manifest.webmanifest",
		"/toys/spotty-sphericle/apple-touch-icon.png",
		"/toys/spotty-sphericle/icon-192.png",
		"/toys/spotty-sphericle/icon-512.png",
		"/toys/spotty-sphericle/icon.svg",
		"/toys/spotty-sphericle/",
		"/toys/spotty-sphericle/manifest.webmanifest",
		"/toys/sunthesis/apple-touch-icon.png",
		"/toys/sunthesis/icon-192.png",
		"/toys/sunthesis/icon-512.png",
		"/toys/sunthesis/icon.svg",
		"/toys/sunthesis/",
		"/toys/sunthesis/manifest.webmanifest",
		"/static/static.css",
		"/images/banner.jpg",
		"/favicon.ico",
		"/screenshots/toys/bear-beat.webp",
		"/screenshots/toys/blobbles.webp",
		"/screenshots/toys/engravery.webp",
		"/screenshots/toys/flowing-field.webp",
		"/screenshots/toys/fractaliser.webp",
		"/screenshots/toys/knottery.webp",
		"/screenshots/toys/marblelous.webp",
		"/screenshots/toys/mimic.webp",
		"/screenshots/toys/radialator.webp",
		"/screenshots/toys/rug-addict.webp",
		"/screenshots/toys/spotty-sphericle.webp",
		"/screenshots/toys/sunthesis.webp"
	],
	"external": [
		"https://fonts.googleapis.com/css2?family=Monoton&family=Manrope:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Inter:wght@500;800&display=swap",
		"https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500&family=Space+Mono&display=swap",
		"https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@600;800&family=Zen+Kaku+Gothic+New:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700&family=JetBrains+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Instrument+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,500;0,700;1,500&family=Alegreya+Sans:wght@400;500;700&family=Cutive+Mono&display=swap",
		"https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Familjen+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
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
