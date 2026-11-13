// 오프라인에서도 실행되도록 게임 파일을 캐시한다
const CACHE='lhmb-v6',FILES=['./','index.html','css/style.css','js/core.js','js/music.js','js/art.js','js/portrait.js','js/paint.js','js/scenes.js','js/story_a.js','js/story_b.js','js/ending.js','icon.png','manifest.webmanifest','img/port/seoyun.jpg','img/port/mrAdult.jpg','img/port/mrTeen.jpg','img/port/mrChild.jpg','img/port/mrBride.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request)));});
