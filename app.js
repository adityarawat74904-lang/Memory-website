// ── MEMORA — App Logic ──────────────────────────────────────

const CATEGORY_EMOJI = {
  adventure: '🗺️',
  family: '👨‍👩‍👧',
  love: '💛',
  milestone: '🏆',
  travel: '✈️',
  fun: '🎉'
};

const CATEGORY_LABELS = {
  adventure: 'Adventure',
  family: 'Family',
  love: 'Love',
  milestone: 'Milestone',
  travel: 'Travel',
  fun: 'Fun'
};

// Default sample memories
const DEFAULT_MEMORIES = [
  {
    id: 1,
    title: "My First Road Trip",
    desc: "The summer we drove 1,200 miles with no plan, only vibes and terrible playlists. Every gas station felt like an adventure.",
    date: "2019-06",
    category: "adventure",
    color: "#2a1a3e #1a3e2a",
    favorite: true
  },
  {
    id: 2,
    title: "Grandma's Kitchen",
    desc: "Sunday mornings with the smell of cardamom chai and her legendary aloo paratha. Some places exist only in memory now.",
    date: "2015-01",
    category: "family",
    color: "#e8b4a0 #d4847a",
    favorite: true
  },
  {
    id: 3,
    title: "Graduation Day",
    desc: "Standing on stage, diploma in hand, completely terrified and totally alive. Four years of doubt, one perfect moment.",
    date: "2021-05",
    category: "milestone",
    color: "#a0c4e8 #6a8fd4",
    favorite: false
  },
  {
    id: 4,
    title: "Monsoon in Coorg",
    desc: "Woke up to the sound of rain on a tin roof, coffee estate stretched to the horizon. The world was entirely green.",
    date: "2022-07",
    category: "travel",
    color: "#a0e8b4 #6ad4a0",
    favorite: false
  },
  {
    id: 5,
    title: "Late Night Rooftop",
    desc: "Three friends, bad wine, the Delhi skyline. We solved all our problems and none of them. Best night in years.",
    date: "2023-11",
    category: "fun",
    color: "#d4a0e8 #b46ad4",
    favorite: false
  },
  {
    id: 6,
    title: "When You Said Yes",
    desc: "A tiny restaurant, a nervous question, and a yes that changed everything. I still can't believe I pulled it off.",
    date: "2020-02",
    category: "love",
    color: "#e8a0c4 #d46a9a",
    favorite: true
  }
];

// ── State ──
let memories = [];
let currentFilter = 'all';
let selectedColor = "#e8b4a0 #d4847a";
let editingId = null;
let detailId = null;

// ── Init ──
function init() {
  const saved = localStorage.getItem('memora_memories');
  memories = saved ? JSON.parse(saved) : [...DEFAULT_MEMORIES];
  renderGrid();
  updateFeatured();
  setupScrollNav();
}

function save() {
  localStorage.setItem('memora_memories', JSON.stringify(memories));
}

// ── Navbar scroll ──
function setupScrollNav() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── Featured ──
function updateFeatured() {
  const favs = memories.filter(m => m.favorite);
  const mem = favs.length ? favs[Math.floor(Math.random() * favs.length)] : memories[0];
  if (!mem) return;

  const card = document.getElementById('featured-card');
  const [c1, c2] = (mem.color || '#2a1a3e #1a3e2a').split(' ');
  card.style.background = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
  document.getElementById('featured-title').textContent = mem.title;
  document.getElementById('featured-desc').textContent = mem.desc;
  document.getElementById('featured-date').textContent = `📅 ${formatDate(mem.date)}`;
  document.getElementById('featured-category').textContent =
    `${CATEGORY_EMOJI[mem.category] || ''} ${CATEGORY_LABELS[mem.category] || mem.category}`;

  card.onclick = () => openDetail(mem.id);
}

// ── Grid ──
function renderGrid() {
  const grid = document.getElementById('memory-grid');
  const empty = document.getElementById('empty-state');
  const filtered = currentFilter === 'all'
    ? memories
    : memories.filter(m => m.category === currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = filtered.map(m => {
    const [c1, c2] = (m.color || '#1a1a26 #26261a').split(' ');
    const emoji = CATEGORY_EMOJI[m.category] || '💭';
    return `
      <div class="memory-card" onclick="openDetail(${m.id})">
        <div class="card-thumb" style="background: linear-gradient(135deg, ${c1}, ${c2})">
          <span>${emoji}</span>
          ${m.favorite ? '<span class="card-fav-badge">⭐</span>' : ''}
        </div>
        <div class="card-body">
          <div class="card-category">${CATEGORY_LABELS[m.category] || m.category}</div>
          <div class="card-title">${escHtml(m.title)}</div>
          <div class="card-desc">${escHtml(m.desc)}</div>
          <div class="card-date">${formatDate(m.date)}</div>
        </div>
      </div>`;
  }).join('');
}

function filterCategory(cat) {
  currentFilter = cat;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  event.target.classList.add('active');
  renderGrid();
}

// ── Add Modal ──
function openModal() {
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal')) return;
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
  resetForm();
}

function resetForm() {
  document.getElementById('mem-title').value = '';
  document.getElementById('mem-desc').value = '';
  document.getElementById('mem-date').value = '';
  document.getElementById('mem-category').value = 'adventure';
  document.getElementById('mem-fav').checked = false;
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
  selectedColor = "#e8b4a0 #d4847a";
  editingId = null;
}

function selectColor(btn) {
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
  btn.classList.add('selected');
  selectedColor = btn.dataset.color;
}

function saveMemory() {
  const title = document.getElementById('mem-title').value.trim();
  const desc = document.getElementById('mem-desc').value.trim();
  const date = document.getElementById('mem-date').value;
  const category = document.getElementById('mem-category').value;
  const favorite = document.getElementById('mem-fav').checked;

  if (!title) { alert('Please give your memory a title.'); return; }

  const mem = {
    id: editingId || Date.now(),
    title, desc, date, category,
    color: selectedColor,
    favorite
  };

  if (editingId) {
    memories = memories.map(m => m.id === editingId ? mem : m);
  } else {
    memories.unshift(mem);
  }

  save();
  renderGrid();
  updateFeatured();
  closeModal();
}

// ── Detail Modal ──
function openDetail(id) {
  const mem = memories.find(m => m.id === id);
  if (!mem) return;
  detailId = id;

  const [c1, c2] = (mem.color || '#1a1a26 #26261a').split(' ');
  const header = document.getElementById('detail-header');
  header.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  header.textContent = CATEGORY_EMOJI[mem.category] || '💭';

  document.getElementById('detail-title').textContent = mem.title;
  document.getElementById('detail-desc').textContent = mem.desc || 'No description yet.';
  document.getElementById('detail-date').textContent = `📅 ${formatDate(mem.date)}`;
  document.getElementById('detail-category').textContent =
    `${CATEGORY_EMOJI[mem.category] || ''} ${CATEGORY_LABELS[mem.category] || mem.category}`;

  const favBtn = document.getElementById('detail-fav-btn');
  favBtn.textContent = mem.favorite ? '⭐ Favorited' : '☆ Add to Favorites';

  document.getElementById('detail-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDetail(e) {
  if (e && e.target !== document.getElementById('detail-modal')) return;
  document.getElementById('detail-modal').classList.remove('open');
  document.body.style.overflow = '';
  detailId = null;
}

function toggleFavFromDetail() {
  const mem = memories.find(m => m.id === detailId);
  if (!mem) return;
  mem.favorite = !mem.favorite;
  save();
  renderGrid();
  updateFeatured();
  const btn = document.getElementById('detail-fav-btn');
  btn.textContent = mem.favorite ? '⭐ Favorited' : '☆ Add to Favorites';
}

function deleteFromDetail() {
  if (!confirm('Delete this memory?')) return;
  memories = memories.filter(m => m.id !== detailId);
  save();
  renderGrid();
  updateFeatured();
  closeDetail();
}

// ── Helpers ──
function formatDate(val) {
  if (!val) return 'No date';
  const [y, m] = val.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1] || ''} ${y}`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showSection(s) {
  if (s === 'favorites') {
    currentFilter = 'all';
    const favs = memories.filter(m => m.favorite);
    const grid = document.getElementById('memory-grid');
    const empty = document.getElementById('empty-state');
    if (favs.length === 0) {
      grid.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    currentFilter = 'all';
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.pill')[0].classList.add('active');
    const savedFilter = currentFilter;
    memories = [...memories];
    const grid2 = document.getElementById('memory-grid');
    grid2.innerHTML = favs.map(m => {
      const [c1, c2] = (m.color || '#1a1a26').split(' ');
      const emoji = CATEGORY_EMOJI[m.category] || '💭';
      return `
        <div class="memory-card" onclick="openDetail(${m.id})">
          <div class="card-thumb" style="background: linear-gradient(135deg, ${c1}, ${c2})">
            <span>${emoji}</span>
            <span class="card-fav-badge">⭐</span>
          </div>
          <div class="card-body">
            <div class="card-category">${CATEGORY_LABELS[m.category] || m.category}</div>
            <div class="card-title">${escHtml(m.title)}</div>
            <div class="card-desc">${escHtml(m.desc)}</div>
            <div class="card-date">${formatDate(m.date)}</div>
          </div>
        </div>`;
    }).join('');
    grid2.scrollIntoView({ behavior: 'smooth' });
  } else {
    renderGrid();
  }
}

// ── Keyboard close ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeDetail();
  }
});

// ── Start ──
init();
