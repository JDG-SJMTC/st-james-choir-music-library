const PDF_PATH = 'assets/kk-staff-notation.pdf';
const searchInput = document.querySelector('#search');
const clearBtn = document.querySelector('#clearBtn');
const resultsEl = document.querySelector('#results');
const resultCountEl = document.querySelector('#resultCount');
const resultsTitleEl = document.querySelector('#results-title');
const emptyEl = document.querySelector('#empty');
let songs = [];
let currentResults = [];

function normalize(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function scoreSong(song, query) {
  if (!query) return 1;
  const q = normalize(query);
  const num = String(song.number);
  if (q === num || q === normalize(song.id)) return 1000;

  const en = normalize(song.english);
  const ml = normalize(song.malayalam);
  const aliases = normalize(song.aliases.join(' '));
  let score = 0;
  if (en === q || ml === q) score += 700;
  if (en.startsWith(q) || ml.startsWith(q)) score += 500;
  if (en.includes(q) || ml.includes(q)) score += 350;
  if (aliases.includes(q)) score += 250;

  const tokens = q.split(' ').filter(Boolean);
  if (tokens.length > 1) {
    const haystack = `${en} ${ml} ${aliases} ${num}`;
    const matched = tokens.filter(t => haystack.includes(t)).length;
    score += matched * 60;
    if (matched !== tokens.length) score -= 200;
  }
  return score;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[ch]));
}

function notationHref(song) {
  return `${PDF_PATH}#page=${song.pdfPage}`;
}

function songCard(song) {
  const href = notationHref(song);
  return `
    <a class="song-card" href="${href}" target="_blank" rel="noopener"
       aria-label="Song ${song.number}: ${escapeHtml(song.english)}. Open notation.">
      <div class="song-no">${song.number}</div>
      <div class="song-title">
        <p class="malayalam" lang="ml">${escapeHtml(song.malayalam)}</p>
        <p class="english">${escapeHtml(song.english)}</p>
      </div>
      <span class="open-btn" aria-hidden="true">
        <span>Open notation</span>
        <svg viewBox="0 0 24 24"><path d="M14 5h5v5M19 5l-8 8M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>
      </span>
    </a>`;
}

function render(query = '') {
  const q = query.trim();
  currentResults = songs
    .map(song => ({ song, score: scoreSong(song, q) }))
    .filter(x => x.score > 0)
    .sort((a,b) => q
      ? (b.score - a.score || a.song.number - b.song.number)
      : a.song.number - b.song.number)
    .map(x => x.song);

  resultsEl.innerHTML = currentResults.map(songCard).join('');
  emptyEl.hidden = currentResults.length !== 0;
  clearBtn.hidden = !q;

  if (q) {
    resultsTitleEl.textContent = 'Search results';
    resultCountEl.textContent = `${currentResults.length} ${currentResults.length === 1 ? 'match' : 'matches'}`;
  } else {
    resultsTitleEl.textContent = 'All songs';
    resultCountEl.textContent = `${songs.length} songs`;
  }
}

searchInput.addEventListener('input', e => render(e.target.value));

searchInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || currentResults.length === 0) return;
  e.preventDefault();
  window.open(notationHref(currentResults[0]), '_blank', 'noopener');
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchInput.focus();
  render('');
});

document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
});

fetch('data/songs.json')
  .then(r => {
    if (!r.ok) throw new Error(`Could not load catalogue (${r.status})`);
    return r.json();
  })
  .then(data => {
    songs = data;
    render('');
  })
  .catch(err => {
    resultCountEl.textContent = 'Catalogue could not be loaded';
    emptyEl.hidden = false;
    emptyEl.querySelector('h3').textContent = 'Unable to load the catalogue';
    emptyEl.querySelector('p').textContent =
      'Run this site through a web server rather than opening index.html directly from a local folder.';
    console.error(err);
  });
