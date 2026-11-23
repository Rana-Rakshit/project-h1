/* ===== STYLE HOUSE – script.js (Vanilla JS) ===== */
(() => {
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* ---------- Product data (edit freely) ----------
   g = gender group, t = type, p = price, o = old price, c = colour.
   Real photos: put images/p1.jpg ... p16.jpg in an "images" folder. */
const PRODUCTS = [
 {n:'Classic Cotton Tee',g:'men',t:'tshirt',p:690,o:890,c:'#8aa391'},
 {n:'Oversized Graphic Tee',g:'men',t:'tshirt',p:790,o:990,c:'#c9b79c'},
 {n:'Linen Casual Shirt',g:'men',t:'shirt',p:1490,o:1890,c:'#d6cdb8'},
 {n:'Oxford Formal Shirt',g:'men',t:'shirt',p:1690,o:2090,c:'#9fb4c7'},
 {n:'Urban Fleece Hoodie',g:'men',t:'hoodie',p:2490,o:2990,c:'#2f5342'},
 {n:'Premium Zip Hoodie',g:'women',t:'hoodie',p:2290,o:2790,c:'#b79a7a'},
 {n:'Slim Fit Denim',g:'men',t:'jeans',p:2190,o:2690,c:'#46607f'},
 {n:'Relaxed Straight Jeans',g:'women',t:'jeans',p:2090,o:2590,c:'#6f8bab'},
 {n:'Embroidered Panjabi',g:'men',t:'panjabi',p:2890,o:3490,c:'#e6dcc6'},
 {n:'Festive Silk Panjabi',g:'men',t:'panjabi',p:3490,o:4190,c:'#7d2e3a'},
 {n:'Floral Midi Dress',g:'women',t:'dress',p:2390,o:2990,c:'#c98f8f'},
 {n:'Satin Evening Dress',g:'women',t:'dress',p:3190,o:3890,c:'#2f5342'},
 {n:'Everyday Casual Tee',g:'women',t:'tshirt',p:650,o:850,c:'#e2c8b8'},
 {n:'Cotton Kurti Top',g:'women',t:'shirt',p:1390,o:1690,c:'#a8b89a'},
 {n:'Cargo Casual Pants',g:'men',t:'jeans',p:1890,o:2290,c:'#8b7a5e'},
 {n:'Premium Wool Hoodie',g:'men',t:'hoodie',p:3290,o:3990,c:'#3b3b36'}
];
const LABEL = {tshirt:'T-Shirts',shirt:'Shirts',jeans:'Jeans',panjabi:'Panjabi',hoodie:'Hoodies',dress:'Dresses'};
const taka = n => '৳' + n.toLocaleString('en-IN');

/* ---------- Fallback illustration (used if a photo is missing) ---------- */
const SHAPES = {
 tshirt:'M60 40L90 30Q100 45 110 30L140 40L175 75L155 95L140 85V200H60V85L45 95L25 75Z',
 shirt:'M60 40L90 30L100 62L110 30L140 40L175 75L155 95L140 85V205H60V85L45 95L25 75Z',
 hoodie:'M55 50L85 32Q100 55 115 32L145 50L180 95L158 112L145 100V205H55V100L42 112L20 95Z',
 jeans:'M55 30H145L155 215H108L100 90L92 215H45Z',
 panjabi:'M62 30L90 24Q100 40 110 24L138 30L170 70L150 90L140 80L145 215H55L60 80L50 90L30 70Z',
 dress:'M80 25H120L125 80L165 215H35L75 80Z'
};
function fallback(type, color = '#b79a7a'){
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><rect width="200" height="260" fill="#f3ecdf"/><circle cx="100" cy="120" r="88" fill="#e9dcc6"/><path d="${SHAPES[type]||SHAPES.tshirt}" transform="translate(0 14)" fill="${color}" stroke="#1f3a2d" stroke-width="2" stroke-linejoin="round"/><text x="100" y="250" text-anchor="middle" font-family="Georgia" font-size="11" fill="#1f3a2d" letter-spacing="3">STYLE HOUSE</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
// Any <img> that fails to load gets the illustration instead
function guard(img){
  const swap = () => { img.onerror = null; img.src = fallback(img.dataset.fb, img.dataset.c); };
  img.onerror = swap;
  if (img.complete && img.naturalWidth === 0) swap();
}

/* ---------- State (localStorage) ---------- */
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
let cart = load('sh_cart', {});     // {id: qty}
let wish = load('sh_wish', []);     // [id]

/* ---------- Toast ---------- */
let tt;
function toast(m){ const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2200); }

/* ---------- Render products ---------- */
function render(filter = 'all'){
  const grid = $('#grid');
  grid.innerHTML = PRODUCTS.map((x, i) => ({x, i}))
    .filter(({x}) => filter === 'all' || x.g === filter || x.t === filter)
    .map(({x, i}) => {
      const off = Math.round((1 - x.p / x.o) * 100);
      return `<article class="card">
        <div class="im"><img src="images/p${i+1}.jpg" data-fb="${x.t}" data-c="${x.c}" alt="${x.n} – ${x.g === 'men' ? "men's" : "women's"} ${LABEL[x.t]}" loading="lazy">
        <span class="disc">-${off}%</span>
        <button class="wish ${wish.includes(i)?'on':''}" data-id="${i}" aria-label="Add to wishlist">${wish.includes(i)?'♥':'♡'}</button></div>
        <div class="info"><h3>${x.n}</h3><small>${x.g === 'men' ? "Men's" : "Women's"} · ${LABEL[x.t]}</small>
        <p class="price">${taka(x.p)}<s>${taka(x.o)}</s></p>
        <button class="add" data-id="${i}">Add to Cart</button></div></article>`;
    }).join('');
  $$('img', grid).forEach(guard);
}

function updateCount(){ $('#cartCount').textContent = Object.values(cart).reduce((a, b) => a + b, 0); }

/* ---------- Grid actions (event delegation) ---------- */
$('#grid').addEventListener('click', e => {
  const add = e.target.closest('.add'), w = e.target.closest('.wish');
  if (add){ const id = +add.dataset.id; cart[id] = (cart[id] || 0) + 1; save('sh_cart', cart); updateCount(); toast(PRODUCTS[id].n + ' added to cart'); }
  if (w){
    const id = +w.dataset.id, on = wish.includes(id);
    wish = on ? wish.filter(v => v !== id) : [...wish, id]; save('sh_wish', wish);
    w.classList.toggle('on', !on); w.textContent = on ? '♡' : '♥';
    toast(on ? 'Removed from wishlist' : 'Saved to wishlist');
  }
});

/* ---------- Category filter ---------- */
$('#filters').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#filters button').forEach(x => x.classList.remove('on')); b.classList.add('on');
  render(b.dataset.f);
});

/* ---------- Mobile menu ---------- */
const menu = $('#menu');
$('#burger').addEventListener('click', () => menu.classList.toggle('open'));
$$('a', menu).forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

/* ---------- FAQ accordion ---------- */
$$('.q button').forEach(btn => btn.addEventListener('click', () => {
  const q = btn.parentElement, panel = btn.nextElementSibling, open = q.classList.contains('open');
  $$('.q.open').forEach(o => { o.classList.remove('open'); o.lastElementChild.style.maxHeight = 0; o.firstElementChild.setAttribute('aria-expanded', 'false'); });
  if (!open){ q.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; btn.setAttribute('aria-expanded', 'true'); }
}));

/* ---------- Form validation (demo only – no backend) ---------- */
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = v => /^(\+?88)?01[3-9]\d{8}$/.test(v.replace(/[\s-]/g, '')); // Bangladesh mobile
function show(el, text, ok){ el.textContent = text; el.className = 'msg ' + (ok ? 'ok' : 'err'); }

$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, msg = $('#contactMsg'); let err = '';
  $$('input,textarea', f).forEach(i => i.classList.remove('bad'));
  const bad = (i, m) => { f[i].classList.add('bad'); err = err || m; };
  if (f.name.value.trim().length < 2) bad('name', 'Please enter your name.');
  if (!emailOk(f.email.value.trim())) bad('email', 'Please enter a valid email.');
  if (!phoneOk(f.phone.value)) bad('phone', 'Enter a valid Bangladesh mobile number (01XXXXXXXXX).');
  if (f.message.value.trim().length < 10) bad('message', 'Message must be at least 10 characters.');
  if (err) return show(msg, err, false);
  show(msg, 'Thank you! Your message was validated (demo – connect a backend to send).', true); f.reset();
});

$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const i = e.target.querySelector('input'), m = $('#newsMsg');
  emailOk(i.value.trim()) ? (show(m, 'Subscribed! (demo)', true), i.value = '') : show(m, 'Enter a valid email.', false);
});

/* ---------- Back to top ---------- */
const top = $('#toTop');
addEventListener('scroll', () => top.classList.toggle('show', scrollY > 500), {passive: true});
top.addEventListener('click', () => scrollTo({top: 0, behavior: 'smooth'}));

/* ---------- Static images fallback + init ---------- */
$$('img[data-fb]').forEach(guard);
render(); updateCount();
})();
