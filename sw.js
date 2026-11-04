// 一水千田 離線快取（v20）
// 遊戲程式：先用快取、背景更新。可抽換的內容（content.json、img/、models/、font/）：先抓網路，抓不到才用快取。
const CACHE='yishui-v20';
const FILES=['./','./index.html','./qr.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const LIVE=/\/(content\.json|img\/|models\/|font\/)/;
self.addEventListener('fetch',e=>{const req=e.request,u=new URL(req.url);
  if(req.method!=='GET'||u.origin!==location.origin)return;
  const put=r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r};
  if(LIVE.test(u.pathname)){e.respondWith(fetch(req).then(put).catch(()=>caches.match(req,{ignoreSearch:true})));return}
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>{const net=fetch(req).then(put).catch(()=>hit);return hit||net}))});
