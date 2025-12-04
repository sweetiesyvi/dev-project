// scripts/app.js
const PROJECTS_JSON = 'projects.json';
const ACHIEVEMENTS_JSON = 'achievements.json';

const selectors = {
  cards: document.getElementById('cards'),
  search: document.getElementById('searchInput'),
  filter: document.getElementById('filterSelect'),
  feedback: document.getElementById('feedback'),
  achievementsList: document.getElementById('achievementsList'),
  resetBtn: document.getElementById('resetBtn')
};

let projects = [];
let achievements = [];

function safeFetch(url){
  return fetch(url).then(r => {
    if(!r.ok) throw new Error(`Fetch ${url} failed: ${r.status}`);
    return r.json();
  });
}

function renderProjects(list){
  selectors.cards.innerHTML = '';
  if(!list.length){
    selectors.cards.innerHTML = `<div class="col-12"><p class="text-muted">No results.</p></div>`;
    selectors.feedback.textContent = `Showing 0 results`;
    return;
  }
  selectors.feedback.textContent = `Showing ${list.length} result${list.length > 1 ? 's' : ''}`;
  list.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';

    const card = document.createElement('div');
    card.className = 'card h-100';
    card.innerHTML = `
      <img src="${p.image}" class="card-img-top" alt="${p.title}">
      <div class="card-body d-flex flex-column">
        <h3 class="card-title">${p.title}</h3>
        <div class="meta">${p.technologies.join(', ')}</div>
        <p class="card-text">${p.description}</p>
        <div class="mt-auto d-flex gap-2">
          <a class="btn btn-sm btn-primary" href="${p.live}" target="_blank" rel="noopener noreferrer">Live</a>
          <a class="btn btn-sm btn-outline-secondary" href="${p.repo}" target="_blank" rel="noopener noreferrer">Source</a>
        </div>
      </div>
    `;
    col.appendChild(card);
    selectors.cards.appendChild(col);
  });
}

function renderAchievements(list){
  selectors.achievementsList.innerHTML = '';
  list.forEach(a => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6';
    col.innerHTML = `
      <div class="card p-3">
        <div><strong>${a.title}</strong></div>
        <div class="text-muted">${a.issuer} • ${a.date}</div>
      </div>
    `;
    selectors.achievementsList.appendChild(col);
  });
}

function populateFilter(projectsList){
  // gather techs
  const techSet = new Set();
  projectsList.forEach(p => (p.technologies || []).forEach(t => techSet.add(t)));
  // clear and add options
  selectors.filter.innerHTML = '<option value="">All technologies</option>';
  Array.from(techSet).sort().forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    selectors.filter.appendChild(opt);
  });
}

function applyFilters(){
  const search = selectors.search.value.trim().toLowerCase();
  const tech = selectors.filter.value;
  const filtered = projects.filter(p => {
    const inSearch = p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search);
    const inTech = tech ? (p.technologies || []).includes(tech) : true;
    return inSearch && inTech;
  });
  renderProjects(filtered);
}

function wireEvents(){
  selectors.search.addEventListener('input', () => {
    console.log('search:', selectors.search.value);
    applyFilters();
  });

  selectors.filter.addEventListener('change', () => {
    console.log('filter:', selectors.filter.value);
    applyFilters();
  });

  selectors.resetBtn.addEventListener('click', () => {
    selectors.search.value = '';
    selectors.filter.value = '';
    renderProjects(projects);
  });
}

// doc-ready bootstrap style
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [projData, achData] = await Promise.all([
      safeFetch(PROJECTS_JSON),
      safeFetch(ACHIEVEMENTS_JSON)
    ]);
    projects = projData.projects || [];
    achievements = achData.achievements || [];
    renderProjects(projects);
    renderAchievements(achievements);
    populateFilter(projects);
    wireEvents();
    console.log('Profile app loaded', { projectsCount: projects.length, achievementsCount: achievements.length });
  } catch(err){
    console.error('App load error', err);
    selectors.cards.innerHTML = `<div class="col-12"><p class="text-danger">Failed to load data — check console</p></div>`;
  }
});
fetch("reflection.md")
  .then(response => 
response.text())
  .then(markdown => {
document.getElementById("markdown").
innerHTML = marked.parse(markdown);
  });

