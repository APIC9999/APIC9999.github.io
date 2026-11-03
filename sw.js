// 홈 화면 추가(설치) 요건용 최소 서비스워커 - 캐시 없이 항상 최신 페이지를 사용
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',()=>{});
