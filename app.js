/* ═══════════════════════════════════════════════════════════
   PVmusic — App Engine (app.js)
   ═══════════════════════════════════════════════════════════ */

// ── Song Data ──
const SONGS = [
  {
    id: 1,
    title: "Oorum Blood (Unplugged)",
    artist: "PVmusic",
    src: "https://res.cloudinary.com/dofcnmza8/video/upload/q_auto/f_auto/v1781088281/Oorum_Blood_Unplugged_x53nhg.mp3",
    cover: "https://res.cloudinary.com/dofcnmza8/image/upload/q_auto/f_auto/v1781117329/Oorum_Blood_Unplugged_riirfl.jpg"
  },
  {
    id: 2,
    title: "Mutta Kalakki",
    artist: "PVmusic",
    src: "https://res.cloudinary.com/dofcnmza8/video/upload/q_auto/f_auto/v1781088289/Mutta_Kalakki_sk57p9.mp3",
    cover: "https://res.cloudinary.com/dofcnmza8/image/upload/q_auto/f_auto/v1781117328/muttakalakki_hr7p39.jpg"
  },
  {
    id: 3,
    title: "Aura 10-10",
    artist: "PVmusic",
    src: "https://res.cloudinary.com/dofcnmza8/video/upload/q_auto/f_auto/v1781088282/Aura_10-10_nyh2r1.mp3",
    cover: "https://res.cloudinary.com/dofcnmza8/image/upload/q_auto/f_auto/v1781117328/aura1010_ck6bs9.jpg"
  },
  {
    id: 4,
    title: "Kalyani",
    artist: "PVmusic",
    src: "https://res.cloudinary.com/dofcnmza8/video/upload/q_auto/f_auto/v1781088291/KALYANI_320_KoshalWorld.Com_sscbcc.mp3",
    cover: "https://res.cloudinary.com/dofcnmza8/image/upload/q_auto/f_auto/v1781117328/kalyani_vc1si6.jpg"
  },
  {
    id: 5,
    title: "God Mode",
    artist: "PVmusic",
    src: "https://res.cloudinary.com/dofcnmza8/video/upload/q_auto/f_auto/v1781088291/God_Mode_vy9uoc.mp3",
    cover: "https://res.cloudinary.com/dofcnmza8/image/upload/q_auto/f_auto/v1781117328/GodMode_ghmn9e.jpg"
  },
  {
    id: 6,
    title: "Loveah Sollitalea",
    artist: "PVmusic",
    src: "https://res.cloudinary.com/dofcnmza8/video/upload/q_auto/f_auto/v1781088297/Loveah_Sollitalea_mvkc2c.mp3",
    cover: "https://res.cloudinary.com/dofcnmza8/image/upload/q_auto/f_auto/v1781117328/Loveahsollitalea_yfuzcv.jpg"
  },
  {
    id: 7,
    title: "Dheema",
    artist: "PVmusic",
    src: "https://res.cloudinary.com/dofcnmza8/video/upload/q_auto/f_auto/v1781088295/Dheema_vt2a0u.mp3",
    cover: "https://res.cloudinary.com/dofcnmza8/image/upload/q_auto/f_auto/v1781117328/Dheemaa_aywyfo.jpg"
  },
  {
    id: 8,
    title: "Pattuma",
    artist: "PVmusic",
    src: "https://res.cloudinary.com/dofcnmza8/video/upload/q_auto/f_auto/v1781088298/Pattuma_xcs4ih.mp3",
    cover: "https://res.cloudinary.com/dofcnmza8/image/upload/q_auto/f_auto/v1781117329/pattumaa_u1otl1.jpg"
  },
  {
    id: 9,
    title: "Oorum Blood",
    artist: "PVmusic",
    src: "https://res.cloudinary.com/dofcnmza8/video/upload/q_auto/f_auto/v1781088303/Oorum_Blood_n1acqx.mp3",
    cover: "https://res.cloudinary.com/dofcnmza8/image/upload/q_auto/f_auto/v1781117329/oorum_blood_ctmph8.jpg"
  },
  {
    id: 10,
    title: "Nallaru Po",
    artist: "PVmusic",
    src: "https://res.cloudinary.com/dofcnmza8/video/upload/q_auto/f_auto/v1781088304/Nallaru_Po_gbknla.mp3",
    cover: "https://res.cloudinary.com/dofcnmza8/image/upload/q_auto/f_auto/v1781117329/Nallarupo_q9zcmk.jpg"
  },
  {
    id: 11,
    title: "Naanga Naalu Peru",
    artist: "PVmusic",
    src: "https://res.cloudinary.com/dofcnmza8/video/upload/q_auto/f_auto/v1781088304/Naanga_Naalu_Peru_j1t0j1.mp3",
    cover: "https://res.cloudinary.com/dofcnmza8/image/upload/q_auto/f_auto/v1781117328/nalluparu_zjbu2e.jpg"
  }
];

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
const state = {
  currentView: 'home',
  viewHistory: ['home'],
  historyIndex: 0,
  currentSong: null,
  isPlaying: false,
  shuffle: false,
  repeat: 'off', // off | all | one
  volume: 0.8,
  isMuted: false,
  previousVolume: 0.8,
  likedSongs: JSON.parse(localStorage.getItem('pvmusic_liked') || '[]'),
  playlists: JSON.parse(localStorage.getItem('pvmusic_playlists') || '[]'),
  queue: [],
  currentPlaylist: [], // the full list being played
  currentIndex: 0,
  activePlaylistId: null, // for playlist detail view
  contextSongId: null
};

// ═══════════════════════════════════════════
// AUDIO
// ═══════════════════════════════════════════
const audio = new Audio();
audio.volume = state.volume;
audio.preload = 'metadata';

// ═══════════════════════════════════════════
// DOM REFS
// ═══════════════════════════════════════════
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  // Views
  views: {
    home: $('#view-home'),
    search: $('#view-search'),
    liked: $('#view-liked'),
    playlist: $('#view-playlist'),
    library: $('#view-library')
  },
  // Nav
  navItems: $$('.nav-item'),
  mobileNavItems: $$('.mobile-nav-item'),
  // Search
  searchInput: $('#search-input'),
  searchGridResult: $('#song-grid-search'),
  searchResultsInfo: $('#search-results-info'),
  noResults: $('#no-results'),
  // Home
  quickPlayGrid: $('#quick-play-grid'),
  songGridHome: $('#song-grid-home'),
  greetingText: $('#greeting-text'),
  heroParticles: $('#hero-particles'),
  // Liked
  likedSongList: $('#liked-song-list'),
  likedCountSidebar: $('#liked-count-sidebar'),
  likedCountHeader: $('#liked-count-header'),
  likedEmpty: $('#liked-empty'),
  // Playlist detail
  playlistSongList: $('#playlist-song-list'),
  playlistDetailName: $('#playlist-detail-name'),
  playlistDetailCount: $('#playlist-detail-count'),
  playlistEmpty: $('#playlist-empty'),
  sidebarPlaylistList: $('#sidebar-playlist-list'),
  // Library
  libraryGrid: $('#library-grid'),
  // Player
  playerArtImg: $('#player-art-img'),
  playerAlbumArt: $('#player-album-art'),
  playerSongTitle: $('#player-song-title'),
  playerSongArtist: $('#player-song-artist'),
  playerLikeBtn: $('#player-like-btn'),
  btnPlayPause: $('#btn-play-pause'),
  btnPrev: $('#btn-prev'),
  btnNext: $('#btn-next'),
  btnShuffle: $('#btn-shuffle'),
  btnRepeat: $('#btn-repeat'),
  progressBar: $('#progress-bar'),
  progressFill: $('#progress-fill'),
  currentTime: $('#player-current-time'),
  totalTime: $('#player-total-time'),
  volumeSlider: $('#volume-slider'),
  volumeFill: $('#volume-fill'),
  btnVolume: $('#btn-volume'),
  btnQueueToggle: $('#btn-queue-toggle'),
  // Queue
  queuePanel: $('#queue-panel'),
  queueNowPlaying: $('#queue-now-playing'),
  queueList: $('#queue-list'),
  btnCloseQueue: $('#btn-close-queue'),
  // Modal
  modalCreate: $('#modal-create-playlist'),
  inputPlaylistName: $('#input-playlist-name'),
  btnModalCancel: $('#btn-modal-cancel'),
  btnModalConfirm: $('#btn-modal-confirm'),
  btnCreatePlaylist: $('#btn-create-playlist'),
  // Context menu
  contextMenu: $('#context-menu'),
  ctxAddQueue: $('#ctx-add-queue'),
  ctxLikeToggle: $('#ctx-like-toggle'),
  ctxLikeText: $('#ctx-like-text'),
  ctxPlaylistSubmenu: $('#ctx-playlist-submenu'),
  // Toast
  toastContainer: $('#toast-container'),
  // Navigation
  btnBack: $('#btn-back'),
  btnForward: $('#btn-forward')
};

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function saveLiked() {
  localStorage.setItem('pvmusic_liked', JSON.stringify(state.likedSongs));
}

function savePlaylists() {
  localStorage.setItem('pvmusic_playlists', JSON.stringify(state.playlists));
}

function isLiked(songId) {
  return state.likedSongs.includes(songId);
}

function toggleLike(songId) {
  const idx = state.likedSongs.indexOf(songId);
  if (idx > -1) {
    state.likedSongs.splice(idx, 1);
    showToast('Removed from Liked Songs');
  } else {
    state.likedSongs.push(songId);
    showToast('Added to Liked Songs');
  }
  saveLiked();
  updateLikeUI();
}

function getSong(id) {
  return SONGS.find(s => s.id === id);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ═══════════════════════════════════════════
// GREETING
// ═══════════════════════════════════════════
function setGreeting() {
  const h = new Date().getHours();
  let greeting = 'Good Evening';
  if (h >= 5 && h < 12) greeting = 'Good Morning';
  else if (h >= 12 && h < 17) greeting = 'Good Afternoon';
  dom.greetingText.textContent = greeting;
}

// ═══════════════════════════════════════════
// HERO PARTICLES
// ═══════════════════════════════════════════
function createParticles() {
  dom.heroParticles.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const span = document.createElement('span');
    span.style.left = Math.random() * 100 + '%';
    span.style.top = Math.random() * 100 + '%';
    span.style.animationDelay = (Math.random() * 6) + 's';
    span.style.animationDuration = (4 + Math.random() * 4) + 's';
    span.style.width = (2 + Math.random() * 4) + 'px';
    span.style.height = span.style.width;
    dom.heroParticles.appendChild(span);
  }
}

// ═══════════════════════════════════════════
// VIEW SWITCHING
// ═══════════════════════════════════════════
function switchView(viewName, pushHistory = true) {
  // Hide all views
  Object.values(dom.views).forEach(v => v.classList.remove('active'));

  // Show target view
  const target = dom.views[viewName];
  if (target) target.classList.add('active');

  // Update nav active state
  dom.navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });
  dom.mobileNavItems.forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  state.currentView = viewName;

  // Focus search on search view
  if (viewName === 'search') {
    setTimeout(() => dom.searchInput.focus(), 100);
  }

  // Push to history
  if (pushHistory) {
    state.viewHistory = state.viewHistory.slice(0, state.historyIndex + 1);
    state.viewHistory.push(viewName);
    state.historyIndex = state.viewHistory.length - 1;
  }

  // Refresh views
  if (viewName === 'liked') renderLikedSongs();
  if (viewName === 'library') renderLibrary();
  if (viewName === 'playlist') renderPlaylistDetail();
}

// ═══════════════════════════════════════════
// RENDER: HOME — SONG CARDS
// ═══════════════════════════════════════════
function renderSongCard(song) {
  const card = document.createElement('div');
  card.className = `song-card${state.currentSong?.id === song.id ? ' playing' : ''}`;
  card.dataset.songId = song.id;
  card.innerHTML = `
    <div class="song-card-image">
      <img src="${song.cover}" alt="${song.title}" loading="lazy">
      <button class="song-card-play" title="Play">▶</button>
      <button class="song-card-like ${isLiked(song.id) ? 'liked' : ''}" title="Like" data-song-id="${song.id}">
        ${isLiked(song.id) ? '❤️' : '♡'}
      </button>
    </div>
    <div class="song-card-title">${song.title}</div>
    <div class="song-card-artist">${song.artist}</div>
  `;

  // Play on card click
  card.addEventListener('click', (e) => {
    if (e.target.closest('.song-card-like') || e.target.closest('.song-card-play')) return;
    playSong(song.id);
  });

  // Play button
  card.querySelector('.song-card-play').addEventListener('click', (e) => {
    e.stopPropagation();
    playSong(song.id);
  });

  // Like button
  card.querySelector('.song-card-like').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLike(song.id);
  });

  // Right-click context menu
  card.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, song.id);
  });

  return card;
}

function renderHomeSongGrid() {
  dom.songGridHome.innerHTML = '';
  SONGS.forEach(song => {
    dom.songGridHome.appendChild(renderSongCard(song));
  });
}

function renderQuickPlay() {
  dom.quickPlayGrid.innerHTML = '';
  // Show first 6 songs as quick play
  SONGS.slice(0, 6).forEach(song => {
    const card = document.createElement('div');
    card.className = `quick-play-card${state.currentSong?.id === song.id ? ' playing' : ''}`;
    card.innerHTML = `
      <img src="${song.cover}" alt="${song.title}" loading="lazy">
      <span class="quick-play-title">${song.title}</span>
    `;
    card.addEventListener('click', () => playSong(song.id));
    card.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showContextMenu(e.clientX, e.clientY, song.id);
    });
    dom.quickPlayGrid.appendChild(card);
  });
}

// ═══════════════════════════════════════════
// RENDER: SEARCH
// ═══════════════════════════════════════════
function renderSearchResults(query) {
  const q = query.toLowerCase().trim();
  dom.searchGridResult.innerHTML = '';

  if (!q) {
    dom.searchResultsInfo.innerHTML = '';
    dom.noResults.classList.add('hidden');
    // Show all when empty
    SONGS.forEach(song => dom.searchGridResult.appendChild(renderSongCard(song)));
    return;
  }

  const results = SONGS.filter(s =>
    s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
  );

  if (results.length === 0) {
    dom.searchResultsInfo.innerHTML = '';
    dom.noResults.classList.remove('hidden');
    return;
  }

  dom.noResults.classList.add('hidden');
  dom.searchResultsInfo.innerHTML = `Found <span>${results.length}</span> song${results.length > 1 ? 's' : ''} for "${query}"`;
  results.forEach(song => dom.searchGridResult.appendChild(renderSongCard(song)));
}

// ═══════════════════════════════════════════
// RENDER: LIKED SONGS
// ═══════════════════════════════════════════
function renderLikedSongs() {
  const liked = state.likedSongs.map(id => getSong(id)).filter(Boolean);

  // Update counts
  dom.likedCountSidebar.textContent = `${liked.length} song${liked.length !== 1 ? 's' : ''}`;
  dom.likedCountHeader.textContent = `${liked.length} song${liked.length !== 1 ? 's' : ''}`;

  // Clear and rebuild list (keep header)
  const header = dom.likedSongList.querySelector('.song-list-header');
  dom.likedSongList.innerHTML = '';
  dom.likedSongList.appendChild(header);

  if (liked.length === 0) {
    dom.likedEmpty.classList.remove('hidden');
    return;
  }
  dom.likedEmpty.classList.add('hidden');

  liked.forEach((song, idx) => {
    dom.likedSongList.appendChild(createSongListItem(song, idx + 1, true));
  });
}

function createSongListItem(song, number, showRemove = false) {
  const item = document.createElement('div');
  item.className = `song-list-item${state.currentSong?.id === song.id && state.isPlaying ? ' playing' : ''}`;
  item.dataset.songId = song.id;

  const numberContent = (state.currentSong?.id === song.id && state.isPlaying)
    ? `<div class="playing-bars"><span></span><span></span><span></span><span></span></div>`
    : number;

  item.innerHTML = `
    <div class="item-number">${numberContent}</div>
    <div class="item-title-group">
      <img class="item-img" src="${song.cover}" alt="${song.title}" loading="lazy">
      <span class="item-title">${song.title}</span>
    </div>
    <span class="item-artist">${song.artist}</span>
    <span class="item-duration">--:--</span>
    <button class="item-like ${isLiked(song.id) ? 'liked' : ''}" data-song-id="${song.id}">
      ${isLiked(song.id) ? '❤️' : '♡'}
    </button>
  `;

  item.addEventListener('click', (e) => {
    if (e.target.closest('.item-like')) return;
    playSong(song.id);
  });

  item.querySelector('.item-like').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLike(song.id);
  });

  item.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, song.id);
  });

  return item;
}

// ═══════════════════════════════════════════
// RENDER: PLAYLISTS
// ═══════════════════════════════════════════
function renderSidebarPlaylists() {
  // Keep liked songs item, remove old custom playlists
  const existing = dom.sidebarPlaylistList.querySelectorAll('.playlist-item:not(#nav-liked)');
  existing.forEach(el => el.remove());

  state.playlists.forEach(pl => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.dataset.playlistId = pl.id;
    item.innerHTML = `
      <div class="playlist-icon custom-playlist-icon">🎶</div>
      <div class="playlist-item-info">
        <div class="name">${pl.name}</div>
        <div class="meta">${pl.songs.length} song${pl.songs.length !== 1 ? 's' : ''}</div>
      </div>
    `;
    item.addEventListener('click', () => {
      state.activePlaylistId = pl.id;
      switchView('playlist');
    });
    dom.sidebarPlaylistList.appendChild(item);
  });
}

function renderPlaylistDetail() {
  const pl = state.playlists.find(p => p.id === state.activePlaylistId);
  if (!pl) return;

  dom.playlistDetailName.textContent = pl.name;
  dom.playlistDetailCount.textContent = `${pl.songs.length} song${pl.songs.length !== 1 ? 's' : ''}`;

  const header = dom.playlistSongList.querySelector('.song-list-header');
  dom.playlistSongList.innerHTML = '';
  dom.playlistSongList.appendChild(header);

  if (pl.songs.length === 0) {
    dom.playlistEmpty.classList.remove('hidden');
    return;
  }
  dom.playlistEmpty.classList.add('hidden');

  pl.songs.forEach((songId, idx) => {
    const song = getSong(songId);
    if (song) {
      dom.playlistSongList.appendChild(createSongListItem(song, idx + 1));
    }
  });
}

// ═══════════════════════════════════════════
// RENDER: LIBRARY
// ═══════════════════════════════════════════
function renderLibrary() {
  dom.libraryGrid.innerHTML = '';

  // Liked songs card
  const likedCard = document.createElement('div');
  likedCard.className = 'song-card';
  likedCard.style.background = 'linear-gradient(135deg, rgba(123,47,247,0.3), rgba(224,64,251,0.2))';
  likedCard.innerHTML = `
    <div class="song-card-image" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--purple-mid),#e040fb);border-radius:8px;">
      <span style="font-size:48px;">❤️</span>
    </div>
    <div class="song-card-title">Liked Songs</div>
    <div class="song-card-artist">${state.likedSongs.length} songs</div>
  `;
  likedCard.addEventListener('click', () => switchView('liked'));
  dom.libraryGrid.appendChild(likedCard);

  // Playlist cards
  state.playlists.forEach(pl => {
    const card = document.createElement('div');
    card.className = 'song-card';
    const coverSong = pl.songs.length > 0 ? getSong(pl.songs[0]) : null;
    const coverImg = coverSong ? `<img src="${coverSong.cover}" alt="${pl.name}" loading="lazy">` :
      `<span style="font-size:48px;">🎶</span>`;
    const imgStyle = coverSong ? '' : 'style="display:flex;align-items:center;justify-content:center;background:rgba(var(--purple-mid-rgb),0.2);border-radius:8px;"';

    card.innerHTML = `
      <div class="song-card-image" ${imgStyle}>
        ${coverImg}
      </div>
      <div class="song-card-title">${pl.name}</div>
      <div class="song-card-artist">${pl.songs.length} songs</div>
    `;
    card.addEventListener('click', () => {
      state.activePlaylistId = pl.id;
      switchView('playlist');
    });
    dom.libraryGrid.appendChild(card);
  });
}

// ═══════════════════════════════════════════
// PLAYER ENGINE
// ═══════════════════════════════════════════
function playSong(songId, fromQueue = false) {
  const song = getSong(songId);
  if (!song) return;

  state.currentSong = song;

  // If not from queue, build a playlist from all songs starting at this one
  if (!fromQueue) {
    state.currentPlaylist = SONGS.map(s => s.id);
    state.currentIndex = state.currentPlaylist.indexOf(songId);
    if (state.shuffle) {
      // Keep current song first, shuffle rest
      const rest = state.currentPlaylist.filter(id => id !== songId);
      state.currentPlaylist = [songId, ...shuffleArray(rest)];
      state.currentIndex = 0;
    }
  }

  audio.src = song.src;
  audio.play().then(() => {
    state.isPlaying = true;
    updatePlayerUI();
    updateAllSongHighlights();
  }).catch(err => {
    console.error('Playback error:', err);
    showToast('Could not play this song');
  });

  // Update Media Session API
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: 'PVmusic',
      artwork: [{ src: song.cover, sizes: '512x512', type: 'image/jpeg' }]
    });
  }
}

function togglePlayPause() {
  if (!state.currentSong) {
    playSong(SONGS[0].id);
    return;
  }
  if (state.isPlaying) {
    audio.pause();
    state.isPlaying = false;
  } else {
    audio.play();
    state.isPlaying = true;
  }
  updatePlayerUI();
  updateAllSongHighlights();
}

function playNext() {
  if (!state.currentSong) return;

  // Check manual queue first
  if (state.queue.length > 0) {
    const nextId = state.queue.shift();
    playSong(nextId, true);
    renderQueue();
    return;
  }

  if (state.repeat === 'one') {
    audio.currentTime = 0;
    audio.play();
    return;
  }

  let nextIdx = state.currentIndex + 1;
  if (nextIdx >= state.currentPlaylist.length) {
    if (state.repeat === 'all') {
      nextIdx = 0;
    } else {
      state.isPlaying = false;
      updatePlayerUI();
      return;
    }
  }
  state.currentIndex = nextIdx;
  playSong(state.currentPlaylist[nextIdx], true);
}

function playPrev() {
  if (!state.currentSong) return;

  // If more than 3 seconds in, restart current song
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  let prevIdx = state.currentIndex - 1;
  if (prevIdx < 0) {
    prevIdx = state.repeat === 'all' ? state.currentPlaylist.length - 1 : 0;
  }
  state.currentIndex = prevIdx;
  playSong(state.currentPlaylist[prevIdx], true);
}

function toggleShuffle() {
  state.shuffle = !state.shuffle;
  dom.btnShuffle.classList.toggle('active', state.shuffle);

  if (state.shuffle && state.currentSong) {
    const currentId = state.currentSong.id;
    const rest = state.currentPlaylist.filter(id => id !== currentId);
    state.currentPlaylist = [currentId, ...shuffleArray(rest)];
    state.currentIndex = 0;
    showToast('Shuffle on');
  } else if (!state.shuffle) {
    // Restore original order
    if (state.currentSong) {
      state.currentPlaylist = SONGS.map(s => s.id);
      state.currentIndex = state.currentPlaylist.indexOf(state.currentSong.id);
    }
    showToast('Shuffle off');
  }
  renderQueue();
}

function toggleRepeat() {
  const modes = ['off', 'all', 'one'];
  const idx = modes.indexOf(state.repeat);
  state.repeat = modes[(idx + 1) % 3];

  dom.btnRepeat.classList.toggle('active', state.repeat !== 'off');
  dom.btnRepeat.textContent = state.repeat === 'one' ? '🔂' : '🔁';

  const labels = { off: 'Repeat off', all: 'Repeat all', one: 'Repeat one' };
  showToast(labels[state.repeat]);
}

// ═══════════════════════════════════════════
// PLAYER UI UPDATE
// ═══════════════════════════════════════════
function updatePlayerUI() {
  if (!state.currentSong) return;

  const song = state.currentSong;
  dom.playerArtImg.src = song.cover;
  dom.playerArtImg.alt = song.title;
  dom.playerSongTitle.textContent = song.title;
  dom.playerSongArtist.textContent = song.artist;
  dom.playerAlbumArt.classList.toggle('playing', state.isPlaying);

  // Play/pause button
  dom.btnPlayPause.textContent = state.isPlaying ? '⏸' : '▶';
  dom.btnPlayPause.title = state.isPlaying ? 'Pause' : 'Play';

  // Like button in player
  dom.playerLikeBtn.textContent = isLiked(song.id) ? '❤️' : '♡';
  dom.playerLikeBtn.classList.toggle('liked', isLiked(song.id));

  // Title bar
  document.title = state.isPlaying ? `${song.title} — PVmusic` : 'PVmusic — Stream Your Vibe';

  // Queue
  renderQueue();
}

function updateAllSongHighlights() {
  // Song cards
  document.querySelectorAll('.song-card').forEach(card => {
    const id = parseInt(card.dataset.songId);
    card.classList.toggle('playing', state.currentSong?.id === id && state.isPlaying);
  });

  // Quick play cards
  document.querySelectorAll('.quick-play-card').forEach((card, idx) => {
    const song = SONGS[idx];
    if (song) card.classList.toggle('playing', state.currentSong?.id === song.id && state.isPlaying);
  });

  // Song list items
  document.querySelectorAll('.song-list-item').forEach(item => {
    const id = parseInt(item.dataset.songId);
    const isActive = state.currentSong?.id === id && state.isPlaying;
    item.classList.toggle('playing', isActive);

    const numEl = item.querySelector('.item-number');
    if (numEl) {
      if (isActive) {
        numEl.innerHTML = `<div class="playing-bars"><span></span><span></span><span></span><span></span></div>`;
      } else {
        // Restore original number
        const allItems = [...item.parentElement.querySelectorAll('.song-list-item')];
        const index = allItems.indexOf(item) + 1;
        numEl.textContent = index;
      }
    }
  });
}

function updateLikeUI() {
  // Player like button
  if (state.currentSong) {
    dom.playerLikeBtn.textContent = isLiked(state.currentSong.id) ? '❤️' : '♡';
    dom.playerLikeBtn.classList.toggle('liked', isLiked(state.currentSong.id));
  }

  // All like buttons on cards
  document.querySelectorAll('.song-card-like').forEach(btn => {
    const id = parseInt(btn.dataset.songId);
    btn.classList.toggle('liked', isLiked(id));
    btn.textContent = isLiked(id) ? '❤️' : '♡';
  });

  // All like buttons in lists
  document.querySelectorAll('.item-like').forEach(btn => {
    const id = parseInt(btn.dataset.songId);
    btn.classList.toggle('liked', isLiked(id));
    btn.textContent = isLiked(id) ? '❤️' : '♡';
  });

  // Update sidebar count
  dom.likedCountSidebar.textContent = `${state.likedSongs.length} song${state.likedSongs.length !== 1 ? 's' : ''}`;

  // Re-render liked view if active
  if (state.currentView === 'liked') renderLikedSongs();
}

// ═══════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  dom.progressFill.style.width = pct + '%';
  dom.currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  dom.totalTime.textContent = formatTime(audio.duration);
  // Update duration in any visible list items
  document.querySelectorAll(`.song-list-item[data-song-id="${state.currentSong?.id}"] .item-duration`).forEach(el => {
    el.textContent = formatTime(audio.duration);
  });
});

audio.addEventListener('ended', () => {
  playNext();
});

dom.progressBar.addEventListener('click', (e) => {
  if (!audio.duration) return;
  const rect = dom.progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

// Dragging progress
let isDraggingProgress = false;
dom.progressBar.addEventListener('mousedown', (e) => {
  isDraggingProgress = true;
  updateProgress(e);
});
document.addEventListener('mousemove', (e) => {
  if (isDraggingProgress) updateProgress(e);
});
document.addEventListener('mouseup', () => { isDraggingProgress = false; });

function updateProgress(e) {
  if (!audio.duration) return;
  const rect = dom.progressBar.getBoundingClientRect();
  let pct = (e.clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  audio.currentTime = pct * audio.duration;
  dom.progressFill.style.width = (pct * 100) + '%';
}

// ═══════════════════════════════════════════
// VOLUME
// ═══════════════════════════════════════════
function setVolume(vol) {
  state.volume = Math.max(0, Math.min(1, vol));
  audio.volume = state.volume;
  dom.volumeFill.style.width = (state.volume * 100) + '%';
  state.isMuted = state.volume === 0;
  updateVolumeIcon();
}

function updateVolumeIcon() {
  if (state.isMuted || state.volume === 0) {
    dom.btnVolume.textContent = '🔇';
  } else if (state.volume < 0.5) {
    dom.btnVolume.textContent = '🔉';
  } else {
    dom.btnVolume.textContent = '🔊';
  }
}

dom.volumeSlider.addEventListener('click', (e) => {
  const rect = dom.volumeSlider.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  setVolume(pct);
});

let isDraggingVolume = false;
dom.volumeSlider.addEventListener('mousedown', (e) => {
  isDraggingVolume = true;
  const rect = dom.volumeSlider.getBoundingClientRect();
  setVolume((e.clientX - rect.left) / rect.width);
});
document.addEventListener('mousemove', (e) => {
  if (isDraggingVolume) {
    const rect = dom.volumeSlider.getBoundingClientRect();
    setVolume((e.clientX - rect.left) / rect.width);
  }
});
document.addEventListener('mouseup', () => { isDraggingVolume = false; });

dom.btnVolume.addEventListener('click', () => {
  if (state.isMuted) {
    setVolume(state.previousVolume || 0.8);
    state.isMuted = false;
  } else {
    state.previousVolume = state.volume;
    setVolume(0);
    state.isMuted = true;
  }
});

// ═══════════════════════════════════════════
// QUEUE
// ═══════════════════════════════════════════
function addToQueue(songId) {
  state.queue.push(songId);
  const song = getSong(songId);
  showToast(`Added "${song.title}" to queue`);
  renderQueue();
}

function renderQueue() {
  // Now playing
  const npContainer = dom.queueNowPlaying;
  const npLabel = npContainer.querySelector('.queue-section-label');
  npContainer.innerHTML = '';
  npContainer.appendChild(npLabel);

  if (state.currentSong) {
    const item = document.createElement('div');
    item.className = 'queue-item';
    item.innerHTML = `
      <img src="${state.currentSong.cover}" alt="${state.currentSong.title}">
      <div class="queue-item-info">
        <div class="title">${state.currentSong.title}</div>
        <div class="artist">${state.currentSong.artist}</div>
      </div>
    `;
    npContainer.appendChild(item);
  }

  // Next up
  const listContainer = dom.queueList;
  const listLabel = listContainer.querySelector('.queue-section-label');
  listContainer.innerHTML = '';
  listContainer.appendChild(listLabel);

  // Manual queue first
  state.queue.forEach((songId, idx) => {
    const song = getSong(songId);
    if (!song) return;
    const item = document.createElement('div');
    item.className = 'queue-item';
    item.innerHTML = `
      <img src="${song.cover}" alt="${song.title}">
      <div class="queue-item-info">
        <div class="title">${song.title}</div>
        <div class="artist">${song.artist}</div>
      </div>
      <button class="queue-remove" title="Remove">✕</button>
    `;
    item.querySelector('.queue-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      state.queue.splice(idx, 1);
      renderQueue();
      showToast('Removed from queue');
    });
    item.addEventListener('click', () => {
      state.queue.splice(idx, 1);
      playSong(song.id, true);
    });
    listContainer.appendChild(item);
  });

  // Then upcoming from playlist
  const upcoming = state.currentPlaylist.slice(state.currentIndex + 1, state.currentIndex + 10);
  upcoming.forEach(songId => {
    const song = getSong(songId);
    if (!song) return;
    const item = document.createElement('div');
    item.className = 'queue-item';
    item.style.opacity = '0.6';
    item.innerHTML = `
      <img src="${song.cover}" alt="${song.title}">
      <div class="queue-item-info">
        <div class="title">${song.title}</div>
        <div class="artist">${song.artist}</div>
      </div>
    `;
    item.addEventListener('click', () => playSong(song.id));
    listContainer.appendChild(item);
  });
}

// ═══════════════════════════════════════════
// CONTEXT MENU
// ═══════════════════════════════════════════
function showContextMenu(x, y, songId) {
  state.contextSongId = songId;

  // Update like text
  dom.ctxLikeText.textContent = isLiked(songId) ? 'Unlike' : 'Like';

  // Build playlist submenu
  dom.ctxPlaylistSubmenu.innerHTML = '';
  state.playlists.forEach(pl => {
    const item = document.createElement('div');
    item.className = 'context-menu-item';
    const alreadyIn = pl.songs.includes(songId);
    item.innerHTML = `
      <span class="ctx-icon">${alreadyIn ? '✓' : '+'}</span>
      <span>${alreadyIn ? 'Remove from' : 'Add to'} ${pl.name}</span>
    `;
    item.addEventListener('click', () => {
      if (alreadyIn) {
        pl.songs = pl.songs.filter(id => id !== songId);
        showToast(`Removed from "${pl.name}"`);
      } else {
        pl.songs.push(songId);
        showToast(`Added to "${pl.name}"`);
      }
      savePlaylists();
      renderSidebarPlaylists();
      if (state.currentView === 'playlist') renderPlaylistDetail();
      hideContextMenu();
    });
    dom.ctxPlaylistSubmenu.appendChild(item);
  });

  // Position
  const menuWidth = 220;
  const menuHeight = 200;
  let left = x;
  let top = y;
  if (x + menuWidth > window.innerWidth) left = x - menuWidth;
  if (y + menuHeight > window.innerHeight) top = y - menuHeight;

  dom.contextMenu.style.left = left + 'px';
  dom.contextMenu.style.top = top + 'px';
  dom.contextMenu.classList.add('active');
}

function hideContextMenu() {
  dom.contextMenu.classList.remove('active');
}

document.addEventListener('click', () => hideContextMenu());

dom.ctxAddQueue.addEventListener('click', () => {
  if (state.contextSongId) addToQueue(state.contextSongId);
  hideContextMenu();
});

dom.ctxLikeToggle.addEventListener('click', () => {
  if (state.contextSongId) toggleLike(state.contextSongId);
  hideContextMenu();
});

// ═══════════════════════════════════════════
// PLAYLIST CREATION MODAL
// ═══════════════════════════════════════════
function openCreateModal() {
  dom.inputPlaylistName.value = '';
  dom.modalCreate.classList.add('active');
  setTimeout(() => dom.inputPlaylistName.focus(), 100);
}

function closeCreateModal() {
  dom.modalCreate.classList.remove('active');
}

function createPlaylist() {
  const name = dom.inputPlaylistName.value.trim();
  if (!name) {
    showToast('Please enter a playlist name');
    return;
  }

  const pl = {
    id: 'pl_' + Date.now(),
    name: name,
    songs: [],
    createdAt: new Date().toISOString()
  };
  state.playlists.push(pl);
  savePlaylists();
  renderSidebarPlaylists();
  closeCreateModal();
  showToast(`Created "${name}"`);
}

dom.btnCreatePlaylist.addEventListener('click', openCreateModal);
dom.btnModalCancel.addEventListener('click', closeCreateModal);
dom.btnModalConfirm.addEventListener('click', createPlaylist);
dom.inputPlaylistName.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') createPlaylist();
  if (e.key === 'Escape') closeCreateModal();
});
dom.modalCreate.addEventListener('click', (e) => {
  if (e.target === dom.modalCreate) closeCreateModal();
});

// ═══════════════════════════════════════════
// PLAYLIST ACTIONS
// ═══════════════════════════════════════════
$('#btn-play-liked').addEventListener('click', () => {
  if (state.likedSongs.length === 0) {
    showToast('No liked songs yet');
    return;
  }
  state.currentPlaylist = [...state.likedSongs];
  state.currentIndex = 0;
  playSong(state.currentPlaylist[0], true);
});

$('#btn-shuffle-liked').addEventListener('click', () => {
  if (state.likedSongs.length === 0) {
    showToast('No liked songs yet');
    return;
  }
  state.currentPlaylist = shuffleArray([...state.likedSongs]);
  state.currentIndex = 0;
  playSong(state.currentPlaylist[0], true);
});

$('#btn-play-playlist').addEventListener('click', () => {
  const pl = state.playlists.find(p => p.id === state.activePlaylistId);
  if (!pl || pl.songs.length === 0) {
    showToast('Playlist is empty');
    return;
  }
  state.currentPlaylist = [...pl.songs];
  state.currentIndex = 0;
  playSong(state.currentPlaylist[0], true);
});

$('#btn-shuffle-playlist').addEventListener('click', () => {
  const pl = state.playlists.find(p => p.id === state.activePlaylistId);
  if (!pl || pl.songs.length === 0) {
    showToast('Playlist is empty');
    return;
  }
  state.currentPlaylist = shuffleArray([...pl.songs]);
  state.currentIndex = 0;
  playSong(state.currentPlaylist[0], true);
});

$('#btn-delete-playlist').addEventListener('click', () => {
  const pl = state.playlists.find(p => p.id === state.activePlaylistId);
  if (!pl) return;
  state.playlists = state.playlists.filter(p => p.id !== pl.id);
  savePlaylists();
  renderSidebarPlaylists();
  switchView('home');
  showToast(`Deleted "${pl.name}"`);
});

// ═══════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════

// Navigation
dom.navItems.forEach(item => {
  item.addEventListener('click', () => switchView(item.dataset.view));
});
dom.mobileNavItems.forEach(item => {
  item.addEventListener('click', () => switchView(item.dataset.view));
});
$('#nav-liked').addEventListener('click', () => switchView('liked'));

// Back / Forward
dom.btnBack.addEventListener('click', () => {
  if (state.historyIndex > 0) {
    state.historyIndex--;
    switchView(state.viewHistory[state.historyIndex], false);
  }
});
dom.btnForward.addEventListener('click', () => {
  if (state.historyIndex < state.viewHistory.length - 1) {
    state.historyIndex++;
    switchView(state.viewHistory[state.historyIndex], false);
  }
});

// Player controls
dom.btnPlayPause.addEventListener('click', togglePlayPause);
dom.btnNext.addEventListener('click', playNext);
dom.btnPrev.addEventListener('click', playPrev);
dom.btnShuffle.addEventListener('click', toggleShuffle);
dom.btnRepeat.addEventListener('click', toggleRepeat);
dom.playerLikeBtn.addEventListener('click', () => {
  if (state.currentSong) toggleLike(state.currentSong.id);
});

// Queue panel
dom.btnQueueToggle.addEventListener('click', () => {
  dom.queuePanel.classList.toggle('open');
  dom.btnQueueToggle.classList.toggle('active');
});
dom.btnCloseQueue.addEventListener('click', () => {
  dom.queuePanel.classList.remove('open');
  dom.btnQueueToggle.classList.remove('active');
});

// Search
let searchDebounce;
dom.searchInput.addEventListener('input', (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    const q = e.target.value.trim();
    if (q) {
      switchView('search');
    }
    renderSearchResults(q);
  }, 200);
});

dom.searchInput.addEventListener('focus', () => {
  if (state.currentView !== 'search') {
    switchView('search');
    renderSearchResults(dom.searchInput.value);
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Don't trigger when typing in input
  if (e.target.tagName === 'INPUT') {
    if (e.key === 'Escape') {
      e.target.blur();
      switchView('home');
    }
    return;
  }

  switch (e.key) {
    case ' ':
      e.preventDefault();
      togglePlayPause();
      break;
    case 'ArrowRight':
      if (e.ctrlKey) playNext();
      break;
    case 'ArrowLeft':
      if (e.ctrlKey) playPrev();
      break;
    case 'k':
      if (e.ctrlKey) {
        e.preventDefault();
        switchView('search');
        dom.searchInput.focus();
      }
      break;
  }
});

// Media Session API
if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
  navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
  navigator.mediaSession.setActionHandler('previoustrack', () => playPrev());
  navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
}

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
function init() {
  setGreeting();
  createParticles();
  renderHomeSongGrid();
  renderQuickPlay();
  renderSidebarPlaylists();
  renderSearchResults('');
  updateVolumeIcon();

  // Set initial volume UI
  dom.volumeFill.style.width = (state.volume * 100) + '%';

  console.log('🎵 PVmusic initialized — 11 tracks loaded');
}

init();
