const CACHE_NAME = 'ai-code-note-v1';

// ⚠️ 중요: 자신의 깃허브 저장소(Repository) 이름을 꼭 적어주세요!
// 예: 주소가 https://gildong.github.io/my-quiz-app/ 이라면 저장소 이름은 'my-quiz-app' 입니다.
const REPO_NAME = '/AI_centered_world_assignmnet'; 

const FILES_TO_CACHE = [
  `${REPO_NAME}/`,
  `${REPO_NAME}/index.html`,
  `${REPO_NAME}/style.css`,
  `${REPO_NAME}/script.js`,
  `${REPO_NAME}/manifest.json`,
  `${REPO_NAME}/icon-192.png`,
  `${REPO_NAME}/icon-512.png`
];

// 서비스 워커 설치 및 파일 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] 파일 사전 캐싱 중...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 서비스 워커 활성화 (이전 버전의 캐시 정리)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] 오래된 캐시 제거 중:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 네트워크 요청을 가로채 캐시된 파일이 있으면 우선 반환
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시에 있으면 캐시 반환, 없으면 네트워크에서 가져옴
      return response || fetch(event.request);
    })
  );
});
