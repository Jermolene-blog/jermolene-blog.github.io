/*
Service worker for the toys at /toys/, the games at /games/ and the tools at
/tools/: their index pages and every toy beneath them. It is served from the
root of the site, so that its scope covers all three sections and they can be
installed together as one app, and it is registered by pwa.js, which the
index pages and each toy include. Its scope also covers the rest of the site,
whose pages and resources it leaves alone.

build-pwa.js replaces the importScripts() line below with the list of files
to cache, along with a version derived from their contents. Any change to a
toy therefore changes the bytes of this worker, so the browser notices the
change when it checks for updates. The new version is installed into a fresh
cache, and the old one is discarded on activation, along with the caches of
the earlier workers that each looked after one section.

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
	"version": "fb90901eb9901e68",
	"urls": [
		"/games/",
		"/toys/",
		"/tools/",
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
		"/games/plong/apple-touch-icon.png",
		"/games/plong/icon-192.png",
		"/games/plong/icon-512.png",
		"/games/plong/icon.svg",
		"/games/plong/",
		"/games/plong/manifest.webmanifest",
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
		"/toys/clockwork-marble-flick/apple-touch-icon.png",
		"/toys/clockwork-marble-flick/icon-192.png",
		"/toys/clockwork-marble-flick/icon-512.png",
		"/toys/clockwork-marble-flick/icon.svg",
		"/toys/clockwork-marble-flick/",
		"/toys/clockwork-marble-flick/manifest.webmanifest",
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
		"/toys/lozengineer/apple-touch-icon.png",
		"/toys/lozengineer/icon-192.png",
		"/toys/lozengineer/icon-512.png",
		"/toys/lozengineer/icon.svg",
		"/toys/lozengineer/",
		"/toys/lozengineer/manifest.webmanifest",
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
		"/tools/apple-touch-icon.png",
		"/tools/canon-eos-r10-field-guide/apple-touch-icon.png",
		"/tools/canon-eos-r10-field-guide/icon-192.png",
		"/tools/canon-eos-r10-field-guide/icon-512.png",
		"/tools/canon-eos-r10-field-guide/icon.svg",
		"/tools/canon-eos-r10-field-guide/",
		"/tools/canon-eos-r10-field-guide/manifest.webmanifest",
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
		"/screenshots/games/animal-island.webp",
		"/screenshots/toys/bear-beat.webp",
		"/screenshots/toys/blobbles.webp",
		"/screenshots/games/bowling-bear.webp",
		"/screenshots/games/catflap.webp",
		"/screenshots/toys/clockwork-marble-flick.webp",
		"/screenshots/toys/engravery.webp",
		"/screenshots/tools/canon-eos-r10-field-guide.webp",
		"/screenshots/toys/flowing-field.webp",
		"/screenshots/toys/fractaliser.webp",
		"/screenshots/tools/jpegulator.webp",
		"/screenshots/games/jumbleword.webp",
		"/screenshots/toys/knottery.webp",
		"/screenshots/games/lala-yala.webp",
		"/screenshots/toys/lozengineer.webp",
		"/screenshots/games/marble-flick.webp",
		"/screenshots/toys/marblelous.webp",
		"/screenshots/games/meadow-games.webp",
		"/screenshots/toys/mimic.webp",
		"/screenshots/tools/over-underiser.webp",
		"/screenshots/games/plong.webp",
		"/screenshots/games/quizbuzz.webp",
		"/screenshots/toys/radialator.webp",
		"/screenshots/toys/rug-addict.webp",
		"/screenshots/toys/spotty-sphericle.webp",
		"/screenshots/toys/sunthesis.webp",
		"/screenshots/tools/lenticulator.webp",
		"/screenshots/games/trackaholic.webp",
		"/screenshots/games/trundle-world.webp",
		"/screenshots/tools/tunerful.webp",
		"/screenshots/tools/vectorious.webp"
	],
	"external": [
		"https://fonts.googleapis.com/css2?family=Grandstander:wght@700;900&family=Nunito:wght@600;800&display=swap",
		"https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
		"https://fonts.googleapis.com/css2?family=Monoton&family=Manrope:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Inter:wght@500;800&display=swap",
		"https://fonts.googleapis.com/css2?family=Bowlby+One+SC&family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@500;600;700&display=swap",
		"https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&display=swap",
		"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Barlow+Condensed:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
		"https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js",
		"https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500&family=Space+Mono&display=swap",
		"https://fonts.googleapis.com/css2?family=Chivo:wght@400;600;800&family=Chivo+Mono:wght@400;600&display=swap",
		"https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js",
		"https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/environments/RoomEnvironment.js",
		"https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@600;800&family=Zen+Kaku+Gothic+New:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700&family=JetBrains+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Shrikhand&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&display=swap",
		"https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap",
		"https://fonts.googleapis.com/css2?family=Monoton&family=Barlow+Semi+Condensed:wght@400;500;600&display=swap",
		"https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap",
		"https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap",
		"https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Instrument+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,500;0,700;1,500&family=Alegreya+Sans:wght@400;500;700&family=Cutive+Mono&display=swap",
		"https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Familjen+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
		"https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Chakra+Petch:wght@500;700&display=swap",
		"https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js",
		"https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js",
		"https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
	]
};

const PRECACHE = "apps-precache-" + self.PRECACHE.version,
	RUNTIME = "apps-runtime",
	SECTIONS = /^\/(games|toys|tools)(\/|$)/,
	PRECACHED_PATHS = new Set(self.PRECACHE.urls);

// Whether a cross-origin request was made by one of the toys or their
// indexes, rather than by a page elsewhere on the site
async function isFromToy(event,url) {
	if(self.PRECACHE.external.includes(url.href)) {
		return true;
	}
	const client = event.clientId && await self.clients.get(event.clientId);
	return !!client && SECTIONS.test(new URL(client.url).pathname);
}

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
			.filter(key => /^(apps|games|toys|tools)-/.test(key) && key !== PRECACHE && key !== RUNTIME)
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
	// The rest of the site is left to the browser. Third party resources
	// can only be told apart once the page that asked for them has been
	// looked up, and those of other pages are then fetched as normal
	if(url.origin === self.location.origin && !SECTIONS.test(url.pathname) && !PRECACHED_PATHS.has(url.pathname)) {
		return;
	}
	event.respondWith((async () => {
		if(url.origin !== self.location.origin && !await isFromToy(event,url)) {
			return fetch(request);
		}
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
