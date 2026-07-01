/**
 * AI Nav — 主应用逻辑
 * 功能：分类筛选、搜索、收藏、排序、弹窗、动画数字
 */

// ========== 状态管理 ==========
let currentCategory = 'all';
let currentView = 'all'; // 'all' | 'favorites'
let currentSort = 'hot';
let searchQuery = '';
let favorites = JSON.parse(localStorage.getItem('ainav_favorites') || '[]');

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  renderCategories();
  renderTools();
  updateStats();
  bindSearch();
});

// ========== 分类渲染 ==========
function renderCategories() {
  const container = document.getElementById('categoryScroll');
  const catCounts = {};
  AI_TOOLS.forEach(t => {
    catCounts[t.category] = (catCounts[t.category] || 0) + 1;
  });

  container.innerHTML = CATEGORIES.map(cat => {
    const count = cat.key === 'all' ? AI_TOOLS.length : (catCounts[cat.key] || 0);
    const isActive = currentCategory === cat.key;
    return `
      <button class="cat-btn ${isActive ? 'active' : ''}" onclick="switchCategory('${cat.key}')">
        <span class="cat-icon">${cat.icon}</span>
        <span>${cat.name}</span>
        <span class="cat-count">(${count})</span>
      </button>
    `;
  }).join('');
}

function switchCategory(key) {
  currentCategory = key;
  renderCategories();
  renderTools();
  const cat = CATEGORIES.find(c => c.key === key);
  document.getElementById('toolsTitle').textContent = key === 'all' ? '全部工具' : cat.name;
}

// ========== 搜索 ==========
function bindSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');

  input.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    clearBtn.classList.toggle('visible', searchQuery.length > 0);
    renderTools();
  });

  // ESC 清空搜索
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideModal();
    }
  });
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  input.value = '';
  searchQuery = '';
  document.getElementById('searchClear').classList.remove('visible');
  renderTools();
  input.focus();
}

// ========== 收藏 ==========
function toggleFavorite(id) {
  const idx = favorites.indexOf(id);
  if (idx > -1) {
    favorites.splice(idx, 1);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('ainav_favorites', JSON.stringify(favorites));
  renderTools();
}

function toggleView() {
  const btn = document.getElementById('viewToggle');
  currentView = currentView === 'all' ? 'favorites' : 'all';
  btn.classList.toggle('active', currentView === 'favorites');
  renderTools();
  document.getElementById('toolsTitle').textContent = currentView === 'favorites' ? '我的收藏' : (currentCategory === 'all' ? '全部工具' : CATEGORIES.find(c => c.key === currentCategory)?.name || '全部工具');
}

function isFavorite(id) {
  return favorites.includes(id);
}

// ========== 排序 ==========
function handleSort(value) {
  currentSort = value;
  renderTools();
}

function sortTools(tools) {
  const sorted = [...tools];
  switch (currentSort) {
    case 'hot':
      sorted.sort((a, b) => b.hot - a.hot);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'new':
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
  }
  return sorted;
}

// ========== 过滤 & 渲染 ==========
function getFilteredTools() {
  let tools = AI_TOOLS;

  // 收藏视图
  if (currentView === 'favorites') {
    tools = tools.filter(t => favorites.includes(t.id));
  }

  // 分类筛选
  if (currentCategory !== 'all') {
    tools = tools.filter(t => t.category === currentCategory);
  }

  // 搜索过滤
  if (searchQuery) {
    tools = tools.filter(t =>
      t.name.toLowerCase().includes(searchQuery) ||
      t.nameEn.toLowerCase().includes(searchQuery) ||
      t.desc.toLowerCase().includes(searchQuery) ||
      t.features.some(f => f.toLowerCase().includes(searchQuery))
    );
  }

  // 排序
  tools = sortTools(tools);
  return tools;
}

function renderTools() {
  const grid = document.getElementById('toolsGrid');
  const empty = document.getElementById('emptyState');
  const countEl = document.getElementById('toolsCount');
  const tools = getFilteredTools();

  countEl.textContent = `共 ${tools.length} 个工具`;

  if (tools.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  empty.style.display = 'none';

  grid.innerHTML = tools.map((tool, i) => {
    const favClass = isFavorite(tool.id) ? 'active' : '';
    const tags = getTags(tool);
    return `
      <div class="tool-card" style="animation-delay: ${i * 0.05}s" onclick="openModal(${tool.id})">
        <div class="card-header">
          <div class="card-icon">${tool.icon}</div>
          <div class="card-info">
            <div class="card-name">${highlightText(tool.name)}</div>
            <div class="card-name-en">${tool.nameEn}</div>
            <div class="card-rating">
              ${'★'.repeat(Math.floor(tool.rating))}${'☆'.repeat(5 - Math.floor(tool.rating))}
              <span>${tool.rating}</span>
            </div>
          </div>
        </div>
        <p class="card-desc">${highlightText(tool.desc)}</p>
        <div class="card-tags">${tags}</div>
        <div class="card-footer">
          <div class="card-price">${tool.price.includes('免费') ? '<strong>免费</strong> 起' : tool.price.split('/')[0].trim()}</div>
          <div class="card-actions">
            <button class="fav-btn ${favClass}" onclick="event.stopPropagation(); toggleFavorite(${tool.id})" title="${isFavorite(tool.id) ? '取消收藏' : '收藏'}">
              ${isFavorite(tool.id) ? '★' : '☆'}
            </button>
            <a class="visit-btn" href="${tool.link}" target="_blank" rel="noopener" onclick="event.stopPropagation();">体验 →</a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getTags(tool) {
  const colors = ['', 'purple', 'pink', 'cyan'];
  return tool.features.slice(0, 3).map((f, i) =>
    `<span class="tag ${colors[i % colors.length]}">${f}</span>`
  ).join('');
}

function highlightText(text) {
  if (!searchQuery) return text;
  const regex = new RegExp(`(${escapeRegex(searchQuery)})`, 'gi');
  return text.replace(regex, '<mark style="background:rgba(74,158,255,0.2);color:var(--accent-blue);border-radius:2px;padding:0 2px;">$1</mark>');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ========== 弹窗 ==========
function openModal(id) {
  const tool = AI_TOOLS.find(t => t.id === id);
  if (!tool) return;

  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
      <div class="modal-icon">${tool.icon}</div>
      <div>
        <h2 class="modal-title">${tool.name}</h2>
        <p class="modal-subtitle">${tool.nameEn} · ${CATEGORIES.find(c => c.key === tool.category)?.name || ''}</p>
      </div>
    </div>
    <p class="modal-desc">${tool.detail}</p>
    <div class="modal-features">
      <h4>核心功能</h4>
      <div class="feature-list">
        ${tool.features.map(f => `<span class="feature-item">${f}</span>`).join('')}
      </div>
    </div>
    <div class="modal-meta">
      <div class="meta-item">
        <div class="meta-value">${tool.rating}</div>
        <div class="meta-label">用户评分</div>
      </div>
      <div class="meta-item">
        <div class="meta-value">${tool.hot.toLocaleString()}</div>
        <div class="meta-label">热度指数</div>
      </div>
      <div class="meta-item">
        <div class="meta-value">${tool.price.split('/')[0].trim()}</div>
        <div class="meta-label">价格</div>
      </div>
    </div>
    <div class="modal-actions">
      <a class="modal-btn-primary" href="${tool.link}" target="_blank" rel="noopener" onclick="event.stopPropagation();">立即体验 →</a>
      <button class="modal-btn-secondary" onclick="toggleFavorite(${tool.id}); closeModal();">
        ${isFavorite(tool.id) ? '★ 已收藏' : '☆ 收藏'}
      </button>
    </div>
  `;

  const overlay = document.getElementById('modalOverlay');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

function hideModal() {
  closeModal();
}

// ========== 统计数据 ==========
function updateStats() {
  animateNumber('statTools', AI_TOOLS.length, 1000);
  animateNumber('statCategories', CATEGORIES.length - 1, 800);
  animateNumber('statUpdated', AI_TOOLS.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    return (now - d) < 3 * 24 * 60 * 60 * 1000;
  }).length, 600);
}

function animateNumber(elId, target, duration) {
  const el = typeof elId === 'string' ? document.getElementById(elId) : elId;
  if (!el) return;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutQuart
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// ========== 重置 ==========
function resetAll() {
  currentCategory = 'all';
  currentView = 'all';
  currentSort = 'hot';
  searchQuery = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClear').classList.remove('visible');
  document.getElementById('sortSelect').value = 'hot';
  document.getElementById('viewToggle').classList.remove('active');
  document.getElementById('toolsTitle').textContent = '全部工具';
  renderCategories();
  renderTools();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
