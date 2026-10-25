/*
Service worker for the toys index at /toys/ and every toy beneath it. It is
registered by pwa.js, which the index page and each toy include.

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
	"version": "5144d7c8841dfcbe",
	"urls": [
		"/toys/",
		"/toys/animal-island/apple-touch-icon.png",
		"/toys/animal-island/icon-192.png",
		"/toys/animal-island/icon-512.png",
		"/toys/animal-island/icon.svg",
		"/toys/animal-island/",
		"/toys/animal-island/manifest.webmanifest",
		"/toys/apple-touch-icon.png",
		"/toys/blobbles/apple-touch-icon.png",
		"/toys/blobbles/icon-192.png",
		"/toys/blobbles/icon-512.png",
		"/toys/blobbles/icon.svg",
		"/toys/blobbles/",
		"/toys/blobbles/manifest.webmanifest",
		"/toys/bowling-bear/apple-touch-icon.png",
		"/toys/bowling-bear/icon-192.png",
		"/toys/bowling-bear/icon-512.png",
		"/toys/bowling-bear/icon.svg",
		"/toys/bowling-bear/",
		"/toys/bowling-bear/manifest.webmanifest",
		"/toys/cat/cat-actor.js",
		"/toys/cat/cat-puppet/arm.js",
		"/toys/cat/cat-puppet/face.js",
		"/toys/cat/cat-puppet/upright.js",
		"/toys/cat/cat-puppet/walker.js",
		"/toys/cat/cat-puppet.js",
		"/toys/cat/cat-sprites/beg.webp",
		"/toys/cat/cat-sprites/groom.webp",
		"/toys/cat/cat-sprites/loaf.webp",
		"/toys/cat/cat-sprites/look-away.webp",
		"/toys/cat/cat-sprites/look-down.webp",
		"/toys/cat/cat-sprites/look-up.webp",
		"/toys/cat/cat-sprites/lounge.webp",
		"/toys/cat/cat-sprites/pair.webp",
		"/toys/cat/cat-sprites/paw-down.webp",
		"/toys/cat/cat-sprites/paw-up.webp",
		"/toys/cat/cat-sprites/roll.webp",
		"/toys/cat/cat-sprites/sit.webp",
		"/toys/cat/cat-sprites/stroll.webp",
		"/toys/cat/cat-sprites/upright.webp",
		"/toys/cat/cat-sprites/yawn.webp",
		"/toys/cat/cat-voice.js",
		"/toys/catflap/apple-touch-icon.png",
		"/toys/catflap/icon-192.png",
		"/toys/catflap/icon-512.png",
		"/toys/catflap/icon.svg",
		"/toys/catflap/",
		"/toys/catflap/manifest.webmanifest",
		"/toys/engravery/apple-touch-icon.png",
		"/toys/engravery/icon-192.png",
		"/toys/engravery/icon-512.png",
		"/toys/engravery/icon.svg",
		"/toys/engravery/",
		"/toys/engravery/manifest.webmanifest",
		"/toys/fractaliser/apple-touch-icon.png",
		"/toys/fractaliser/icon-192.png",
		"/toys/fractaliser/icon-512.png",
		"/toys/fractaliser/icon.svg",
		"/toys/fractaliser/",
		"/toys/fractaliser/manifest.webmanifest",
		"/toys/icon-192.png",
		"/toys/icon-512.png",
		"/toys/icon.svg",
		"/toys/jpegulator/apple-touch-icon.png",
		"/toys/jpegulator/icon-192.png",
		"/toys/jpegulator/icon-512.png",
		"/toys/jpegulator/icon.svg",
		"/toys/jpegulator/",
		"/toys/jpegulator/manifest.webmanifest",
		"/toys/jumbleword/apple-touch-icon.png",
		"/toys/jumbleword/icon-192.png",
		"/toys/jumbleword/icon-512.png",
		"/toys/jumbleword/icon.svg",
		"/toys/jumbleword/",
		"/toys/jumbleword/manifest.webmanifest",
		"/toys/knottery/apple-touch-icon.png",
		"/toys/knottery/icon-192.png",
		"/toys/knottery/icon-512.png",
		"/toys/knottery/icon.svg",
		"/toys/knottery/",
		"/toys/knottery/manifest.webmanifest",
		"/toys/lenticulator/app.js",
		"/toys/lenticulator/apple-touch-icon.png",
		"/toys/lenticulator/icon-192.png",
		"/toys/lenticulator/icon-512.png",
		"/toys/lenticulator/icon.svg",
		"/toys/lenticulator/",
		"/toys/lenticulator/manifest.webmanifest",
		"/toys/lenticulator/pico.min.css",
		"/toys/lenticulator/styles.css",
		"/toys/loujain-yahya/apple-touch-icon.png",
		"/toys/loujain-yahya/icon-192.png",
		"/toys/loujain-yahya/icon-512.png",
		"/toys/loujain-yahya/icon.svg",
		"/toys/loujain-yahya/",
		"/toys/loujain-yahya/manifest.webmanifest",
		"/toys/manifest.webmanifest",
		"/toys/marble-flick/apple-touch-icon.png",
		"/toys/marble-flick/icon-192.png",
		"/toys/marble-flick/icon-512.png",
		"/toys/marble-flick/icon.svg",
		"/toys/marble-flick/",
		"/toys/marble-flick/manifest.webmanifest",
		"/toys/marblelous/apple-touch-icon.png",
		"/toys/marblelous/icon-192.png",
		"/toys/marblelous/icon-512.png",
		"/toys/marblelous/icon.svg",
		"/toys/marblelous/",
		"/toys/marblelous/manifest.webmanifest",
		"/toys/meadow-games/apple-touch-icon.png",
		"/toys/meadow-games/icon-192.png",
		"/toys/meadow-games/icon-512.png",
		"/toys/meadow-games/icon.svg",
		"/toys/meadow-games/",
		"/toys/meadow-games/manifest.webmanifest",
		"/toys/meadow-games/models.js",
		"/toys/mimic/apple-touch-icon.png",
		"/toys/mimic/icon-192.png",
		"/toys/mimic/icon-512.png",
		"/toys/mimic/icon.svg",
		"/toys/mimic/",
		"/toys/mimic/manifest.webmanifest",
		"/toys/over-underiser/apple-touch-icon.png",
		"/toys/over-underiser/icon-192.png",
		"/toys/over-underiser/icon-512.png",
		"/toys/over-underiser/icon.svg",
		"/toys/over-underiser/",
		"/toys/over-underiser/manifest.webmanifest",
		"/toys/pwa.js",
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
		"/toys/trundle-world/apple-touch-icon.png",
		"/toys/trundle-world/icon-192.png",
		"/toys/trundle-world/icon-512.png",
		"/toys/trundle-world/icon.svg",
		"/toys/trundle-world/",
		"/toys/trundle-world/manifest.webmanifest",
		"/toys/tunerful/apple-touch-icon.png",
		"/toys/tunerful/icon-192.png",
		"/toys/tunerful/icon-512.png",
		"/toys/tunerful/icon.svg",
		"/toys/tunerful/",
		"/toys/tunerful/manifest.webmanifest",
		"/toys/vectorious/apple-touch-icon.png",
		"/toys/vectorious/icon-192.png",
		"/toys/vectorious/icon-512.png",
		"/toys/vectorious/icon.svg",
		"/toys/vectorious/",
		"/toys/vectorious/manifest.webmanifest",
		"/static/static.css",
		"/images/banner.jpg",
		"/favicon.ico",
		"/screenshots/toys/animal-island.webp",
		"/screenshots/toys/blobbles.webp",
		"/screenshots/toys/bowling-bear.webp",
		"/screenshots/toys/catflap.webp",
		"/screenshots/toys/engravery.webp",
		"/screenshots/toys/fractaliser.webp",
		"/screenshots/toys/jpegulator.webp",
		"/screenshots/toys/jumbleword.webp",
		"/screenshots/toys/knottery.webp",
		"/screenshots/toys/loujain-yahya.webp",
		"/screenshots/toys/marble-flick.webp",
		"/screenshots/toys/marblelous.webp",
		"/screenshots/toys/meadow-games.webp",
		"/screenshots/toys/mimic.webp",
		"/screenshots/toys/over-underiser.webp",
		"/screenshots/toys/rug-addict.webp",
		"/screenshots/toys/spotty-sphericle.webp",
		"/screenshots/toys/sunthesis.webp",
		"/screenshots/toys/lenticulator.webp",
		"/screenshots/toys/trundle-world.webp",
		"/screenshots/toys/tunerful.webp",
		"/screenshots/toys/vectorious.webp"
	],
	"external": [
		"https://fonts.googleapis.com/css2?family=Grandstander:wght@700;900&family=Nunito:wght@600;800&display=swap",
		"https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
		"https://fonts.googleapis.com/css2?family=Inter:wght@500;800&display=swap",
		"https://fonts.googleapis.com/css2?family=Bowlby+One+SC&family=Barlow:wght@400;600;700&family=Kalam:wght@400;700&display=swap",
		"https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js",
		"https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js",
		"https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&display=swap",
		"https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500&family=Space+Mono&display=swap",
		"https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700&family=JetBrains+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Shrikhand&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&display=swap",
		"https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap",
		"https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap",
		"https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js",
		"https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap",
		"https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,500;0,700;1,500&family=Alegreya+Sans:wght@400;500;700&family=Cutive+Mono&display=swap",
		"https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Familjen+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
		"https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js",
		"https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js",
		"https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
	]
};

const PRECACHE = "toys-precache-" + self.PRECACHE.version,
	RUNTIME = "toys-runtime";

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
			.filter(key => key !== PRECACHE && key !== RUNTIME)
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
