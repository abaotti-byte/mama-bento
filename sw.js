// 離線備援：有網路時一律抓最新版，沒網路時才用上次存下的畫面
const CACHE = 'mama-bento-v2.12';
const SHELL = ["./assets/ingredients/star-anise.webp","./assets/ingredients/sichuan-pepper.webp","./assets/ingredients/cumin-powder.webp","./assets/ingredients/fried-shallots.webp","./assets/ingredients/honey.webp","./assets/ingredients/flat-rice-noodles.webp","./assets/ingredients/glutinous-rice.webp",'./assets/ingredients/abalone.webp', './assets/ingredients/dried-shrimp.webp', './assets/ingredients/whitebait.webp', './assets/ingredients/bitter-melon.webp', './assets/ingredients/pumpkin.webp', './assets/ingredients/winter-melon.webp', './assets/ingredients/fish-cake.webp', './assets/ingredients/glass-noodles.webp', './assets/ingredients/sausage.webp', './assets/ingredients/rice-vermicelli.webp', './assets/ingredients/misua.webp', './assets/ingredients/squid.webp', './assets/ingredients/small-squid.webp', './', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png',
"./assets/ingredients/beef.webp","./assets/ingredients/pork.webp","./assets/ingredients/chicken.webp","./assets/ingredients/fish.webp","./assets/ingredients/shrimp.webp","./assets/ingredients/clam-dark.webp","./assets/ingredients/cuttlefish.webp","./assets/ingredients/oyster.webp","./assets/ingredients/tofu.webp","./assets/ingredients/dried-tofu.webp","./assets/ingredients/milk.webp","./assets/ingredients/meatballs.webp","./assets/ingredients/napa.webp","./assets/ingredients/sweet-potato-leaf.webp","./assets/ingredients/bok-choy.webp","./assets/ingredients/broccoli.webp","./assets/ingredients/cauliflower.webp","./assets/ingredients/eggplant.webp","./assets/ingredients/green-pepper.webp","./assets/ingredients/carrot.webp","./assets/ingredients/daikon.webp","./assets/ingredients/cucumber.webp","./assets/ingredients/luffa.webp","./assets/ingredients/tomato.webp","./assets/ingredients/water-spinach.webp","./assets/ingredients/spinach.webp","./assets/ingredients/celery.webp","./assets/ingredients/bottle-gourd.webp","./assets/ingredients/amaranth.webp","./assets/ingredients/bean-sprouts.webp","./assets/ingredients/onion.webp","./assets/ingredients/potato.webp","./assets/ingredients/green-beans.webp","./assets/ingredients/bamboo.webp","./assets/ingredients/asparagus.webp","./assets/ingredients/corn.webp","./assets/ingredients/black-beans.webp","./assets/ingredients/preserved-radish.webp","./assets/ingredients/shiitake.webp","./assets/ingredients/king-oyster.webp","./assets/ingredients/enoki.webp","./assets/ingredients/scallion.webp","./assets/ingredients/ginger.webp","./assets/ingredients/garlic.webp","./assets/ingredients/chili.webp","./assets/ingredients/basil.webp","./assets/ingredients/cilantro.webp","./assets/ingredients/dried-chili.webp","./assets/ingredients/chili-bean-sauce.webp","./assets/ingredients/bonito.webp","./assets/ingredients/curry-yellow.webp","./assets/ingredients/ketchup.webp","./assets/ingredients/sweet-sour.webp","./assets/ingredients/pepper-salt.webp","./assets/ingredients/white-vinegar.webp","./assets/ingredients/black-vinegar.webp","./assets/ingredients/sesame-oil.webp","./assets/ingredients/fragrant-oil.webp","./assets/ingredients/shacha-tin.webp","./assets/ingredients/soy-sauce.webp","./assets/ingredients/salt.webp","./assets/ingredients/potato-starch.webp","./assets/ingredients/sweet-potato-starch.webp","./assets/ingredients/five-spice.webp","./assets/ingredients/seasoning-jar.webp","./assets/ingredients/oil.webp","./assets/ingredients/white-wine.webp","./assets/ingredients/white-sugar.webp","./assets/ingredients/granulated-sugar.webp","./assets/ingredients/butter.webp","./assets/ingredients/water.webp","./assets/ingredients/rice-wine.webp","./assets/ingredients/rock-sugar.webp","./assets/ingredients/rice.webp","./assets/ingredients/noodles.webp","./assets/ingredients/flour.webp","./assets/ingredients/egg.webp","./assets/ingredients/cabbage.webp"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('mama-bento-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 資料庫和照片不經過這裡
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(req);
        if (hit) return hit;
        if (req.mode === 'navigate') {
          const page = await caches.match('./index.html');
          if (page) return page;
        }
        return Response.error();
      })
  );
});
