import './style.css';

const categories = ['全部作品', '3D', '全案设计', '海报', 'Logo', '形象设计', 'UI', '字体设计'];
const categoryEnglish = ['ALL WORKS', '3D EXPLORATION', 'BRAND DESIGN', 'POSTER DESIGN', 'LOGO DESIGN', 'CHARACTER DESIGN', 'UI DESIGN', 'TYPE DESIGN'];
const categoryId = category => `category-${categories.indexOf(category)}`;
const icons = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 19 19 5M5 5h14v14"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>',
  star: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m60 4 10 35 28-22-17 33 35 10-35 10 17 33-28-22-10 35-10-35-28 22 17-33L4 60l35-10-17-33 28 22Z"/></svg>',
};
const defaults = [
  { id: 'soft', title: 'Soft Objects', subtitle: '探索柔软与想象的边界', category: '3D', year: '2026', image: '/works/soft-objects.png', color: '#f2c5d2', description: '一次关于材质、形态与感知的视觉实验。用充气般的曲线打破几何的秩序，让柔软的形态与冷静的金属在同一个空间里对话。', tags: ['3D 视觉', '材质探索', '概念设计'] },
  { id: 'mori', title: 'MORI · 森日', subtitle: '把自然放进每一天', category: '全案设计', year: '2026', image: '/works/mori.svg', color: '#b2ba94', description: '以「把自然放进每一天」为概念的生活方式品牌设计示例。从品牌标识、字体与色彩系统，到包装和日常触点，建立清晰而温柔的视觉语言。', tags: ['品牌策略', '视觉识别', '包装设计'] },
  { id: 'type', title: 'Type in Motion', subtitle: '文字，也有自己的节奏', category: '海报', year: '2026', image: '/works/type.svg', color: '#beccf6', description: '以字体为主角，探索静态画面里的运动感。通过尺度对比、字形叠加和大胆的编排，把节奏转化成可以被看见的形状。', tags: ['字体实验', '平面设计', '视觉编排'] },
  { id: 'orbit', title: 'ORBIT', subtitle: '一个关于连接的符号', category: 'Logo', year: '2025', image: '/works/orbit.svg', color: '#efeee6', description: '以轨道和交汇为灵感构建品牌符号。简洁的几何线条建立具有辨识度的标识，并保留在不同尺寸和媒介中延展的可能。', tags: ['标志设计', '几何语言', '品牌识别'] },
  { id: 'pomu', title: 'POMU · 小泡', subtitle: '让日常多一点可爱', category: '形象设计', year: '2025', image: '/works/pomu.svg', color: '#f3d379', description: '一个像小小泡泡一样轻盈的角色形象。以圆润的轮廓、友善的表情和鲜明的色彩构建角色个性，延展到表情与品牌周边。', tags: ['IP 形象', '角色设定', '插画'] },
  { id: 'daylight', title: 'Daylight', subtitle: '给每一天，留一点空间', category: 'UI', year: '2025', image: '/works/daylight.svg', color: '#c9d9ec', description: '一款围绕日常规划与自我关照的界面设计示例。以轻盈的卡片、清晰的信息层级与舒适的色彩，让每一次交互都更加从容。', tags: ['界面设计', '交互体验', '设计系统'] },
  { id: 'space', title: 'Between Spaces', subtitle: '在留白之间，看见可能', category: '海报', year: '2025', image: '/works/spaces.svg', color: '#ee5d3d', description: '围绕空间与留白的海报设计实验。利用鲜明的色彩和建筑般的字形关系，把二维画面变成一处想象中的空间。', tags: ['海报设计', '视觉实验'] },
  { id: 'form', title: 'FORM / 形式', subtitle: '由一个简单的形状开始', category: 'Logo', year: '2025', image: '/works/form.svg', color: '#d1e4c6', description: '从最基础的几何单元出发，探索符号的秩序与组合。一套能够在数字与印刷媒介中自由延伸的视觉识别概念。', tags: ['Logo', '视觉系统'] },
  { id: 'glyph', title: '字有引力 · Glyph Studies', subtitle: '在笔画之间，寻找新的表达', category: '字体设计', year: '2026', image: '/works/glyph.svg', color: '#e4e2da', description: '从汉字的结构与笔画出发，探索方与圆、重量与留白的平衡。一组围绕「字」的字体设计概念，让文字在传达信息之外，也成为独立的视觉语言。', tags: ['字体设计', '汉字结构', '字形实验'] },
];
let state = { profile: { name: 'Yuky', intro: '独立设计师，以好奇心为起点，\n在不同媒介之间探索设计的可能。', email: '', wechat: '' }, works: defaults, hidden: [] };
let query = '';
let db;
let modelViewer;
let modelRequest = 0;
const modelTypeFor = work => work.id === 'soft' ? 'sculpture' : work.id === 'mori' ? 'brand' : null;
function disposeModel() { modelRequest++; modelViewer?.dispose(); modelViewer = null; }
const escape = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const imageUrl = image => image.startsWith('/works/') ? `${import.meta.env.BASE_URL}${image.slice(1)}` : image;
const arrow = icons.arrow;
const toast = (message) => { const el = document.getElementById('toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove('visible'), 3500); };
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('yuky-portfolio', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('settings');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function save() {
  if (!db) throw new Error('当前浏览器无法保存作品，请检查隐私设置。');
  await new Promise((resolve, reject) => {
    const tx = db.transaction('settings', 'readwrite');
    tx.objectStore('settings').put(state, 'portfolio');
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('保存失败'));
  });
}
function appShell() {
  document.getElementById('app').innerHTML = `
    <a class="skip-link" href="#work">跳转到作品</a>
    <header class="header"><a class="wordmark" href="#" aria-label="Yuky 首页">yuky<span>®</span></a><nav aria-label="主导航"><a class="nav-link active" href="#work">作品 <span class="nav-dot"></span></a><a class="nav-link" href="#about">关于我</a><button class="contact-nav" data-contact>聊聊合作 ${arrow}</button><button class="search-button" aria-label="搜索作品" id="search-toggle">${icons.search}</button></nav></header>
    <main>
      <section class="hero" aria-labelledby="hero-heading"><div class="hero-topline"><span><span class="status-dot"></span> OPEN TO NEW POSSIBILITIES</span><span class="hero-note">独立设计 · 自由探索</span></div><div class="hero-main"><div><h1 id="hero-heading">Hi, I'm <span id="hero-name">Yuky</span><span class="hero-period">.</span></h1><h2>让想法<span class="highlight">拥有形状<svg viewBox="0 0 350 14" preserveAspectRatio="none"><path d="M4 10Q155 0 345 7" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg></span>。</h2></div><div class="hero-side"><div class="hero-star">${icons.star}</div><p id="hero-intro"></p><a href="#work" class="explore">探索我的作品 <span>↓</span></a></div></div><div class="hero-bottom"><span>DESIGN IS A WAY OF SEEING.</span><span>SCROLL TO EXPLORE <span class="down-arrow">↓</span></span></div></section>
      <section class="work-section" id="work" aria-labelledby="work-heading"><div class="section-heading"><div class="title-group"><h2 id="work-heading">精选作品<span class="section-dot">.</span></h2><span class="section-en">SELECTED WORKS</span></div><span class="work-years">2025 — 2026 <span>↙</span></span></div><div class="work-layout"><aside class="work-sidebar"><nav class="filters" aria-label="作品分类">${categories.map((c, i) => `<button class="filter ${i === 0 ? 'selected' : ''}" data-filter="${c}" ${i === 0 ? 'aria-current="true"' : ''} aria-controls="${i === 0 ? 'project-groups' : categoryId(c)}"><span>${c}</span><span class="filter-count" data-category-count="${c}"></span></button>`).join('')}</nav><div class="sidebar-note">让每一种想法<br>找到自己的形状。<span>KEEP EXPLORING ↓</span></div></aside><div class="work-content"><div class="browse-topline"><span class="view-caption">按类别，向下探索 <span>↓</span></span><button class="inline-search" id="inline-search" aria-label="展开作品搜索">${icons.search} 搜索作品</button></div><div class="search-wrap" hidden><label for="work-search">搜索作品</label><input id="work-search" type="search" placeholder="输入项目名称、分类或关键词…" autocomplete="off"><button id="search-close" aria-label="关闭搜索">×</button></div><div id="project-groups"></div><p class="demo-note" id="demo-note">当前展示为概念作品，真实作品即将到来。</p></div></div></section>
      <section class="about-section" id="about"><div class="about-label"><span class="section-en">A LITTLE ABOUT ME</span><h2>保持好奇，<br>持续创造<span class="section-dot">.</span></h2></div><div class="about-copy"><p>我是 <span class="about-name">Yuky</span>，一名在不同设计领域之间探索的独立设计师。我相信好的设计，始于对生活的观察，也来自不断追问的好奇心。</p><p>从一个品牌的完整表达，到一个微小的界面细节，我希望让每个想法找到适合自己的形状。</p><div class="skill-tags"><span>3D & 视觉探索</span><span>品牌 & 形象</span><span>数字 & 交互</span></div></div></section>
      <section class="contact-section"><div><span class="section-en">HAVE SOMETHING IN MIND?</span><h2>下一个好想法，<br>一起完成<span>。</span></h2></div><button class="contact-circle" data-contact aria-label="联系 Yuky">${arrow}<span>LET'S TALK</span></button></section>
    </main><footer><a href="#" class="footer-logo">yuky<span>®</span></a><span>© ${new Date().getFullYear()} <span class="footer-name">Yuky</span>. Made with curiosity.</span><button id="manage-open">管理作品 <span>↗</span></button><a href="#" class="back-top" aria-label="回到顶部">↑</a></footer>
    <dialog id="project-dialog" class="project-dialog" aria-labelledby="detail-title"><div id="project-content"></div><button class="dialog-close" aria-label="关闭作品详情">×</button></dialog>
    <dialog id="contact-dialog" class="contact-dialog" aria-labelledby="contact-title"><button class="dialog-close" aria-label="关闭联系方式">×</button><span class="section-en">LET'S MAKE SOMETHING GOOD</span><h2 id="contact-title">你好，<br>下一个可能。</h2><p>品牌合作、设计项目，或者一个有趣的想法。<br>期待与你一起让它发生。</p><div id="contact-info"></div></dialog>
    <dialog id="manage-dialog" class="manage-dialog" aria-labelledby="manage-title"><button class="dialog-close" aria-label="关闭作品管理">×</button><span class="section-en">YOUR CREATIVE SPACE</span><h2 id="manage-title">作品管理<span class="section-dot">.</span></h2><p class="manager-note">在此添加作品或修改联系资料。更改保存在当前浏览器；分享或上线时，请导出备份交给网站维护者。</p><div class="manager-tabs"><button class="selected" data-manager-tab="works">作品</button><button data-manager-tab="profile">个人资料</button><button data-manager-tab="backup">备份</button></div><div id="manager-content"></div></dialog>
    <div id="toast" class="toast" role="status" aria-live="polite"></div>`;
  updateProfile();
  renderWorks();
  bindEvents();
}
function updateProfile() {
  document.getElementById('hero-name').textContent = state.profile.name;
  document.getElementById('hero-intro').textContent = state.profile.intro;
  document.querySelectorAll('.about-name, .footer-name').forEach(el => el.textContent = state.profile.name);
  document.title = `${state.profile.name} — 让想法拥有形状`;
}
function visibleWorks() { return state.works.filter(w => !state.hidden.includes(w.id)); }
function filteredWorks() {
  return visibleWorks().filter(w => !query || `${w.title} ${w.subtitle} ${w.category} ${w.description} ${(w.tags || []).join(' ')}`.toLowerCase().includes(query.toLowerCase()));
}
function projectCard(w) {
  return `<button class="project-card" data-project="${escape(w.id)}" aria-label="查看 ${escape(w.title)} 作品详情"><div class="project-image" style="background:${/^#[0-9a-f]{3,8}$/i.test(w.color) ? w.color : '#eee'}"><img src="${escape(imageUrl(w.image))}" alt="${escape(w.title)} 设计作品" loading="lazy"><span class="card-open">${arrow}</span><span class="image-category">${escape(w.category)}</span>${modelTypeFor(w) ? `<span class="model-preview-badge">${w.id === 'mori' ? '立体品牌样机' : '可旋转模型'} ↗</span>` : ''}</div><div class="project-meta"><div><h3>${escape(w.title)}</h3><p>${escape(w.subtitle)}</p></div><span class="project-year">${escape(w.year)} ${arrow}</span></div></button>`;
}
function selectCategory(category) {
  document.querySelectorAll('[data-filter]').forEach(button => {
    const selected = button.dataset.filter === category;
    button.classList.toggle('selected', selected);
    if (selected) button.setAttribute('aria-current', 'true'); else button.removeAttribute('aria-current');
  });
}
function renderWorks() {
  const works = filteredWorks();
  document.querySelectorAll('[data-category-count]').forEach(el => {
    const category = el.dataset.categoryCount;
    el.textContent = String(category === '全部作品' ? works.length : works.filter(w => w.category === category).length).padStart(2, '0');
  });
  document.getElementById('project-groups').innerHTML = works.length || !query ? categories.slice(1).map((category, i) => {
    const group = works.filter(w => w.category === category);
    if (query && !group.length) return '';
    return `<section class="category-section" id="${categoryId(category)}" aria-labelledby="heading-${i}"><div class="category-heading"><div><span class="category-number">${String(i + 1).padStart(2, '0')}</span><h3 id="heading-${i}">${category}</h3><span class="section-en">${categoryEnglish[i + 1]}</span></div><span class="category-total">${String(group.length).padStart(2, '0')} 件作品</span></div><div class="project-grid ${group.length === 1 ? 'single-work' : ''}">${group.length ? group.map(projectCard).join('') : '<div class="category-empty">新的作品，正在酝酿中。</div>'}</div></section>`;
  }).join('') : '<div class="empty-state"><span>↗</span><h3>这里还有新的可能</h3><p>没有找到匹配作品，试试其他关键词。</p><button id="clear-filters">查看全部作品</button></div>';
  document.getElementById('demo-note').hidden = !visibleWorks().some(w => defaults.some(d => d.id === w.id));
  selectCategory('全部作品');
}
function scrollToCategory(category) {
  const section = document.getElementById(category === '全部作品' ? 'work' : categoryId(category));
  if (!section) { toast('当前搜索没有这类作品，请清空关键词后浏览。'); return; }
  selectCategory(category);
  section.scrollIntoView({ behavior: 'instant', block: 'start' });
}

async function openProject(id) {
  const w = state.works.find(w => w.id === id);
  if (!w) return;
  disposeModel();
  const type = modelTypeFor(w), request = modelRequest;
  const media = type ? `<div class="media-tabs" role="group" aria-label="作品预览方式"><button class="selected" data-media="model" aria-pressed="true">${type === 'brand' ? '立体品牌样机' : '立体模型'}</button><button data-media="image" aria-pressed="false">平面预览</button></div><div id="model-host" class="model-host"><div class="model-loading">正在准备立体预览…</div></div>` : '';
  document.getElementById('project-content').innerHTML = `${media}<img class="detail-image" id="project-flat-image" src="${escape(imageUrl(w.image))}" alt="${escape(w.title)}" ${type ? 'hidden' : ''}><div class="detail-body"><span class="section-en">${escape(w.category)} / ${escape(w.year)}${defaults.some(d => d.id === w.id) ? ' · 概念作品' : ''}</span><h2 id="detail-title">${escape(w.title)}</h2><p class="detail-subtitle">${escape(w.subtitle)}</p><p class="detail-description">${escape(w.description)}</p><div class="skill-tags">${(w.tags || [w.category]).map(t => `<span>${escape(t)}</span>`).join('')}</div><button class="detail-contact" data-contact>让我们一起创造 ${arrow}</button></div>`;
  const dialog = document.getElementById('project-dialog');
  dialog.showModal();
  if (type) {
    try {
      const { createModelViewer } = await import('./model-viewer.js');
      if (request !== modelRequest || !dialog.open) return;
      modelViewer = createModelViewer(document.getElementById('model-host'), type);
    } catch (error) {
      if (request !== modelRequest || !dialog.open) return;
      document.getElementById('model-host').innerHTML = '<div class="model-unavailable"><p>立体预览暂时未能加载。</p><span>请切换到「平面预览」查看作品，或重新打开。</span></div>';
      console.warn('Model preview unavailable:', error);
    }
  }
}
function openContact() {
  const { email, wechat } = state.profile;
  document.getElementById('contact-info').innerHTML = `${email ? `<a class="email-link" href="mailto:${escape(email)}">${escape(email)} ${arrow}</a>` : ''}${wechat ? `<div class="wechat-row"><span>微信 ${escape(wechat)}</span><button id="copy-wechat">复制</button></div>` : ''}${!email && !wechat ? '<div class="contact-pending">联系方式待补充 <span>Yuky 可以在「管理作品 → 个人资料」中设置邮箱或微信。</span></div>' : ''}`;
  document.getElementById('project-dialog').close();
  document.getElementById('contact-dialog').showModal();
}
function renderManager(tab = 'works') {
  document.querySelectorAll('[data-manager-tab]').forEach(b => b.classList.toggle('selected', b.dataset.managerTab === tab));
  const el = document.getElementById('manager-content');
  if (tab === 'works') el.innerHTML = `<form id="add-work-form" class="editor-form"><label>作品名称<input name="title" placeholder="为这次创造取一个名字" maxlength="80" required></label><div class="form-row"><label>作品分类<select name="category">${categories.slice(1).map(c => `<option>${c}</option>`).join('')}</select></label><label>年份<input name="year" type="number" min="2000" max="2100" value="${new Date().getFullYear()}" required></label></div><label>一句话介绍<input name="subtitle" placeholder="作品的灵感或核心概念" maxlength="160"></label><label>作品介绍<textarea name="description" rows="3" placeholder="介绍背景、想法与设计过程" maxlength="5000"></textarea></label><label class="file-label">上传封面<input name="image" type="file" accept="image/png,image/jpeg,image/webp" required><span>JPG、PNG 或 WebP，最大 8 MB</span><img id="upload-preview" alt="封面预览" hidden></label><button type="submit" class="primary-button">添加作品 ${arrow}</button></form><h3 class="manage-list-title">已展示作品</h3><div class="manage-list">${state.works.map(w => `<div><img src="${escape(imageUrl(w.image))}" alt=""><span>${escape(w.title)}<small>${escape(w.category)}${defaults.some(d => d.id === w.id) ? ' · 示例' : ''}</small></span><button data-hide="${escape(w.id)}">${state.hidden.includes(w.id) ? '显示' : '隐藏'}</button>${!defaults.some(d => d.id === w.id) ? `<button data-delete="${escape(w.id)}" aria-label="删除 ${escape(w.title)}">删除</button>` : ''}</div>`).join('')}</div>`;
  if (tab === 'profile') el.innerHTML = `<form id="profile-form" class="editor-form"><label>名字<input name="name" value="${escape(state.profile.name)}" maxlength="40" required></label><label>首页介绍<textarea name="intro" rows="3" maxlength="200">${escape(state.profile.intro)}</textarea></label><label>合作邮箱<input name="email" type="email" value="${escape(state.profile.email)}" placeholder="你的真实邮箱"></label><label>微信号<input name="wechat" value="${escape(state.profile.wechat)}" placeholder="可选" maxlength="80"></label><button type="submit" class="primary-button">保存资料 ${arrow}</button></form>`;
  if (tab === 'backup') el.innerHTML = '<div class="backup-panel"><h3>把作品好好收藏</h3><p>导出完整的作品和个人资料，包括上传的封面。在其他浏览器导入备份即可继续使用。</p><button id="export-data" class="primary-button">导出作品备份 ↗</button><label class="import-label">导入备份<input type="file" id="import-data" accept="application/json,.json"></label><p class="manager-note">导入会替换当前浏览器的作品与资料。上线版本仍需更新站点文件。</p></div>';
}
function bindEvents() {
  document.addEventListener('click', async (e) => {
    const filterButton = e.target.closest('[data-filter]');
    if (filterButton) scrollToCategory(filterButton.dataset.filter);
    const media = e.target.closest('[data-media]');
    if (media) {
      const showModel = media.dataset.media === 'model';
      document.getElementById('model-host').hidden = !showModel;
      document.getElementById('project-flat-image').hidden = showModel;
      document.querySelectorAll('[data-media]').forEach(button => { const selected = button === media; button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected)); });
      if (showModel) modelViewer?.refresh();
    }
    const project = e.target.closest('[data-project]'); if (project) openProject(project.dataset.project);
    if (e.target.closest('[data-contact]')) openContact();
    if (e.target.closest('.dialog-close')) e.target.closest('dialog').close();
    if (e.target.closest('[data-manager-tab]')) renderManager(e.target.closest('[data-manager-tab]').dataset.managerTab);
    const hide = e.target.closest('[data-hide]');
    if (hide) { const old = [...state.hidden]; const id = hide.dataset.hide; state.hidden = state.hidden.includes(id) ? state.hidden.filter(x => x !== id) : [...state.hidden, id]; try { await save(); renderManager(); renderWorks(); } catch (err) { state.hidden = old; toast(err.message); } }
    const del = e.target.closest('[data-delete]');
    if (del && confirm('删除这件作品？此操作无法撤销，建议先导出备份。')) { const old = [...state.works]; const oldHidden = [...state.hidden]; state.works = state.works.filter(w => w.id !== del.dataset.delete); state.hidden = state.hidden.filter(id => id !== del.dataset.delete); try { await save(); renderManager(); renderWorks(); toast('作品已删除'); } catch (err) { state.works = old; state.hidden = oldHidden; toast(err.message); } }
    if (e.target.closest('#copy-wechat')) { try { await navigator.clipboard.writeText(state.profile.wechat); toast('微信号已复制'); } catch { toast('未能自动复制，请手动选择微信号。'); } }
    if (e.target.closest('#clear-filters')) { query = ''; document.getElementById('work-search').value = ''; renderWorks(); scrollToCategory('全部作品'); }
    if (e.target.closest('#export-data')) {
      const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, ...state }, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = 'yuky-portfolio-backup.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('作品备份已导出');
    }
  });
  const openSearch = () => { document.querySelector('.search-wrap').hidden = false; scrollToCategory('全部作品'); document.getElementById('work-search').focus({ preventScroll: true }); };
  document.getElementById('search-toggle').addEventListener('click', openSearch);
  document.getElementById('inline-search').addEventListener('click', openSearch);
  document.getElementById('search-close').addEventListener('click', () => { document.querySelector('.search-wrap').hidden = true; query = ''; document.getElementById('work-search').value = ''; renderWorks(); document.getElementById('inline-search').focus(); });
  document.getElementById('work-search').addEventListener('input', e => { query = e.target.value.trim(); renderWorks(); });
  let scrollFrame;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      const sections = [...document.querySelectorAll('.category-section')];
      const section = sections.filter(el => el.getBoundingClientRect().top <= Math.min(innerHeight * .3, 220)).at(-1);
      selectCategory(section ? categories[Number(section.id.split('-')[1])] : '全部作品');
    });
  }, { passive: true });
  document.getElementById('manage-open').addEventListener('click', () => { renderManager(); document.getElementById('manage-dialog').showModal(); });
  document.getElementById('project-dialog').addEventListener('close', disposeModel);
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', e => { if (e.target === dialog) { const rect = dialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close(); } }));
  document.addEventListener('change', async e => {
    if (e.target.name === 'image') { const file = e.target.files[0]; if (file) { const preview = document.getElementById('upload-preview'); if (preview.dataset.url) URL.revokeObjectURL(preview.dataset.url); preview.src = URL.createObjectURL(file); preview.dataset.url = preview.src; preview.hidden = false; } }
    if (e.target.id === 'import-data') {
      const file = e.target.files[0]; if (!file) return;
      try {
        if (file.size > 80 * 1024 * 1024) throw new Error('备份文件过大，请选择小于 80 MB 的文件。');
        const imported = JSON.parse(await file.text()); validateBackup(imported);
        if (!confirm('导入将替换当前浏览器的全部作品与资料，是否继续？')) return;
        const old = state; state = { profile: imported.profile, works: imported.works, hidden: imported.hidden || [], schemaVersion: 2 };
        try { await save(); } catch (err) { state = old; throw err; }
        updateProfile(); renderWorks(); renderManager('backup'); toast('备份已导入');
      } catch (err) { toast(err.message || '备份导入失败，请检查文件。'); }
    }
  });
  document.addEventListener('submit', async e => {
    if (!['add-work-form', 'profile-form'].includes(e.target.id)) return;
    e.preventDefault(); const form = e.target; const data = new FormData(form); const button = form.querySelector('[type="submit"]'); button.disabled = true;
    try {
      if (form.id === 'profile-form') { const old = state.profile; state.profile = Object.fromEntries(['name', 'intro', 'email', 'wechat'].map(k => [k, String(data.get(k)).trim()])); if (!state.profile.name) { state.profile = old; throw new Error('请填写名字。'); } try { await save(); } catch (err) { state.profile = old; throw err; } updateProfile(); toast('个人资料已保存'); }
      else {
        const file = data.get('image');
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('请上传 JPG、PNG 或 WebP 图片。');
        if (file.size > 8 * 1024 * 1024) throw new Error('图片超过 8 MB，请压缩后再上传。');
        const image = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
        await new Promise((resolve, reject) => { const img = new Image(); img.onload = resolve; img.onerror = () => reject(new Error('图片无法读取，请选择有效的图片文件。')); img.src = image; });
        const title = String(data.get('title')).trim(); if (!title) throw new Error('请填写作品名称。');
        const work = { id: crypto.randomUUID(), title, subtitle: String(data.get('subtitle')).trim(), category: data.get('category'), year: data.get('year'), description: String(data.get('description')).trim(), image, color: '#eee', tags: [data.get('category')] };
        state.works.unshift(work); try { await save(); } catch (err) { state.works.shift(); throw err; }
        query = ''; document.getElementById('work-search').value = ''; renderWorks(); renderManager(); toast('作品已添加，刷新后仍会保留');
      }
    } catch (err) { toast(err.message || '保存失败，请重试。'); } finally { button.disabled = false; }
  });
}
function validateBackup(data) {
  const fail = () => { throw new Error('这不是有效的 Yuky 作品备份。'); };
  if (data.version !== 1 || !data.profile || !Array.isArray(data.works) || data.works.length > 100 || !Array.isArray(data.hidden || [])) fail();
  for (const k of ['name', 'intro', 'email', 'wechat']) if (typeof data.profile[k] !== 'string' || data.profile[k].length > 5000) fail();
  if (!data.profile.name.trim() || (data.profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.profile.email))) fail();
  const ids = new Set();
  for (const w of data.works) {
    if (['id', 'title', 'subtitle', 'category', 'year', 'image', 'description'].some(k => typeof w[k] !== 'string') || !categories.slice(1).includes(w.category) || ids.has(w.id)) fail();
    if (!(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(w.image) || defaults.some(d => d.image === w.image))) fail();
    if (w.tags && (!Array.isArray(w.tags) || w.tags.some(t => typeof t !== 'string'))) fail();
    ids.add(w.id);
  }
  if ((data.hidden || []).some(id => typeof id !== 'string' || !ids.has(id))) fail();
}
try {
  db = await openDB();
  const saved = await new Promise((resolve, reject) => { const request = db.transaction('settings').objectStore('settings').get('portfolio'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
  if (saved) {
    state = saved;
    if (!state.works.some(w => w.id === 'glyph') && !state.schemaVersion) state.works.push(defaults.find(w => w.id === 'glyph'));
  }
  state.schemaVersion = 2;
} catch (err) { console.warn('Local persistence unavailable:', err); }
appShell();
