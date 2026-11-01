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
	"version": "d76024685228dac5",
	"urls": [
		"/games/",
		"/games/animal-island/apple-touch-icon.png",
		"/games/animal-island/icon-192.png",
		"/games/animal-island/icon-512.png",
		"/games/animal-island/icon.svg",
		"/games/animal-island/",
		"/games/animal-island/manifest.webmanifest",
		"/games/apple-touch-icon.png",
		"/games/bowling-bear/apple-touch-icon.png",
		"/games/bowling-bear/icon-192.png",
		"/games/bowling-bear/icon-512.png",
		"/games/bowling-bear/icon.svg",
		"/games/bowling-bear/",
		"/games/bowling-bear/manifest.webmanifest",
		"/games/cat/cat-actor.js",
		"/games/cat/cat-puppet/arm.js",
		"/games/cat/cat-puppet/face.js",
		"/games/cat/cat-puppet/upright.js",
		"/games/cat/cat-puppet/walker.js",
		"/games/cat/cat-puppet.js",
		"/games/cat/cat-sprites/beg.webp",
		"/games/cat/cat-sprites/groom.webp",
		"/games/cat/cat-sprites/loaf.webp",
		"/games/cat/cat-sprites/look-away.webp",
		"/games/cat/cat-sprites/look-down.webp",
		"/games/cat/cat-sprites/look-up.webp",
		"/games/cat/cat-sprites/lounge.webp",
		"/games/cat/cat-sprites/pair.webp",
		"/games/cat/cat-sprites/paw-down.webp",
		"/games/cat/cat-sprites/paw-up.webp",
		"/games/cat/cat-sprites/roll.webp",
		"/games/cat/cat-sprites/sit.webp",
		"/games/cat/cat-sprites/stroll.webp",
		"/games/cat/cat-sprites/upright.webp",
		"/games/cat/cat-sprites/yawn.webp",
		"/games/cat/cat-voice.js",
		"/games/catflap/apple-touch-icon.png",
		"/games/catflap/icon-192.png",
		"/games/catflap/icon-512.png",
		"/games/catflap/icon.svg",
		"/games/catflap/",
		"/games/catflap/manifest.webmanifest",
		"/games/icon-192.png",
		"/games/icon-512.png",
		"/games/jumbleword/apple-touch-icon.png",
		"/games/jumbleword/icon-192.png",
		"/games/jumbleword/icon-512.png",
		"/games/jumbleword/icon.svg",
		"/games/jumbleword/",
		"/games/jumbleword/manifest.webmanifest",
		"/games/lala-yala/apple-touch-icon.png",
		"/games/lala-yala/icon-192.png",
		"/games/lala-yala/icon-512.png",
		"/games/lala-yala/icon.svg",
		"/games/lala-yala/",
		"/games/lala-yala/manifest.webmanifest",
		"/games/manifest.webmanifest",
		"/games/marble-flick/apple-touch-icon.png",
		"/games/marble-flick/icon-192.png",
		"/games/marble-flick/icon-512.png",
		"/games/marble-flick/icon.svg",
		"/games/marble-flick/",
		"/games/marble-flick/manifest.webmanifest",
		"/games/meadow-games/apple-touch-icon.png",
		"/games/meadow-games/icon-192.png",
		"/games/meadow-games/icon-512.png",
		"/games/meadow-games/icon.svg",
		"/games/meadow-games/",
		"/games/meadow-games/manifest.webmanifest",
		"/games/meadow-games/models.js",
		"/games/pwa.js",
		"/games/quizbuzz/apple-touch-icon.png",
		"/games/quizbuzz/icon-192.png",
		"/games/quizbuzz/icon-512.png",
		"/games/quizbuzz/icon.svg",
		"/games/quizbuzz/",
		"/games/quizbuzz/manifest.webmanifest",
		"/games/trackaholic/apple-touch-icon.png",
		"/games/trackaholic/icon-192.png",
		"/games/trackaholic/icon-512.png",
		"/games/trackaholic/icon.svg",
		"/games/trackaholic/",
		"/games/trackaholic/manifest.webmanifest",
		"/games/trundle-world/apple-touch-icon.png",
		"/games/trundle-world/icon-192.png",
		"/games/trundle-world/icon-512.png",
		"/games/trundle-world/icon.svg",
		"/games/trundle-world/",
		"/games/trundle-world/manifest.webmanifest",
		"/static/static.css",
		"/images/banner.jpg",
		"/favicon.ico",
		"/screenshots/games/animal-island.webp",
		"/screenshots/games/bowling-bear.webp",
		"/screenshots/games/catflap.webp",
		"/screenshots/games/jumbleword.webp",
		"/screenshots/games/lala-yala.webp",
		"/screenshots/games/marble-flick.webp",
		"/screenshots/games/meadow-games.webp",
		"/screenshots/games/quizbuzz.webp",
		"/screenshots/games/trackaholic.webp",
		"/screenshots/games/trundle-world.webp"
	],
	"external": [
		"https://fonts.googleapis.com/css2?family=Grandstander:wght@700;900&family=Nunito:wght@600;800&display=swap",
		"https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
		"https://fonts.googleapis.com/css2?family=Bowlby+One+SC&family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@500;600;700&display=swap",
		"https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&display=swap",
		"https://fonts.googleapis.com/css2?family=Shrikhand&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&display=swap",
		"https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap",
		"https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap",
		"https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js",
		"https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap",
		"https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Chakra+Petch:wght@500;700&display=swap",
		"https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js",
		"https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js"
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
