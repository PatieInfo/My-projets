// ---- ADD YOUR KEY LOCALLY — NEVER SHARE IT ----
const API_KEY = "932baf2fabmsh2046c615055d603p15e4f7jsnd28012d3c38b";
const API_HOST = "sportapi7.p.rapidapi.com";
const BASE_URL = "https://sportapi7.p.rapidapi.com/api/v1";

// ---- APP STATE ----
let currentDate      = new Date();
let allGames         = [];
let allLiveGames     = [];
let selectedTournament = null;

// ---- COUNTRY FLAG EMOJIS ----
function getFlag(alpha2) {
  if (!alpha2) return "🏳️";
  return alpha2.toUpperCase().replace(/./g,
    c => String.fromCodePoint(127397 + c.charCodeAt()));
}

// ---- FORMAT DATE ----
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ---- UPDATE DATE DISPLAY ----
function updateDateDisplay() {
  const today   = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  const label   = formatDate(currentDate) === formatDate(today)
    ? "Today — " + currentDate.toLocaleDateString("en-CA",
        { month: "long", day: "numeric" })
    : currentDate.toLocaleDateString("en-CA", options);
  document.getElementById("currentDate").textContent = label;
}

// ---- CHANGE DATE ----
function changeDate(direction) {
  currentDate.setDate(currentDate.getDate() + direction);
  updateDateDisplay();
  loadScores();
}

// ---- SWITCH TABS ----
function switchTab(tab, btn) {
  document.querySelectorAll(".tab")
    .forEach(t => t.classList.remove("active"));
  btn.classList.add("active");

  document.querySelectorAll(".tab-content")
    .forEach(c => c.classList.add("hidden"));
  document.getElementById(tab + "Tab").classList.remove("hidden");

  if (tab === "live")        loadLiveGames();
  if (tab === "tournaments") renderTournaments();
}

// ---- API FETCH HELPER ----
async function apiFetch(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "X-RapidAPI-Key":  API_KEY,
      "X-RapidAPI-Host": API_HOST
    }
  });
  return response.json();
}

// ---- TEAM LOGO URL ----
// Uses the SportAPI/Sofascore CDN with correct format
function getTeamLogo(teamId) {
  return `https://api.sofascore.app/api/v1/team/${teamId}/image`;
}

// ---- LOAD SCORES ----
async function loadScores() {
  showLoading();
  selectedTournament = null;
  try {
    const date = formatDate(currentDate);
    const data = await apiFetch(
      `/sport/football/scheduled-events/${date}`
    );
    allGames = data.events || [];
    hideLoading();
    renderGames(allGames);
  } catch (error) {
    hideLoading();
    showError("Could not load scores. Check your connection.");
  }
}

// ---- FILTER GAMES BY SEARCH ----
function filterGames() {
  const query = document.getElementById("teamSearch")
    .value.toLowerCase();
  const filtered = allGames.filter(game =>
    game.homeTeam.name.toLowerCase().includes(query) ||
    game.awayTeam.name.toLowerCase().includes(query) ||
    game.tournament.name.toLowerCase().includes(query)
  );
  renderGames(filtered);
}

// ---- RENDER GAMES ----
function renderGames(games) {
  const list = document.getElementById("gamesList");

  if (games.length === 0) {
    list.innerHTML = `
      <div class="no-games">
        <p style="font-size:2em; margin-bottom:10px">⚽</p>
        <p>No matches found for this date.</p>
        <p style="margin-top:8px; font-size:0.85em; color:#444">
          Try a different date
        </p>
      </div>`;
    return;
  }

  // Group games by tournament
  const grouped = {};
  games.forEach(game => {
    const key = game.tournament.name;
    if (!grouped[key]) grouped[key] = {
      tournament: game.tournament,
      games: []
    };
    grouped[key].games.push(game);
  });

  list.innerHTML = Object.values(grouped).map(group => `
    <div class="tournament-group">
      <div class="tournament-header">
        <span class="tournament-flag">
          ${getFlag(group.tournament.category?.alpha2)}
        </span>
        <span>${group.tournament.category?.name || ""} —
          <strong>${group.tournament.name}</strong>
        </span>
      </div>
      ${group.games.map(game => renderGameCard(game)).join("")}
    </div>
  `).join("");
}

// ---- RENDER SINGLE GAME CARD ----
function renderGameCard(game) {
  const homeTeam  = game.homeTeam;
  const awayTeam  = game.awayTeam;
  const status    = game.status?.description || "Scheduled";
  const homeScore = game.homeScore?.current;
  const awayScore = game.awayScore?.current;

  const isLive  = game.status?.type === "inprogress";
  const isFinal = game.status?.type === "finished";

  const startTime = new Date(game.startTimestamp * 1000);
  const timeStr   = startTime.toLocaleTimeString("en-CA", {
    hour:   "2-digit",
    minute: "2-digit"
  });

  let statusClass = "upcoming";
  let statusLabel = timeStr;

  if (isLive) {
    statusClass = "live";
    statusLabel = `🔴 LIVE — ${status}`;
  } else if (isFinal) {
    statusClass = "final";
    statusLabel = "Full Time";
  }

  const homeWon = isFinal && homeScore > awayScore;
  const awayWon = isFinal && awayScore > homeScore;

  const scoreSection = (isLive || isFinal)
    ? `<div class="score-box">
        <span class="score ${awayWon ? "winner" : ""}">
          ${awayScore ?? 0}
        </span>
        <span class="score-divider">:</span>
        <span class="score ${homeWon ? "winner" : ""}">
          ${homeScore ?? 0}
        </span>
       </div>`
    : `<div class="game-time ${isLive ? "live-time" : ""}">
        ${timeStr}
       </div>`;

  return `
    <div class="game-card">
      <div class="game-status ${statusClass}">${statusLabel}</div>
      <div class="game-teams">

        <div class="team">
          <img class="team-logo-img"
            src="${getTeamLogo(awayTeam.id)}"
            alt="${awayTeam.name}"
            onerror="this.style.display='none';
              this.nextSibling.style.display='flex'">
          <div class="team-logo-fallback" style="display:none">
            ${awayTeam.shortName?.[0] || awayTeam.name[0]}
          </div>
          <div class="team-name">${awayTeam.name}</div>
        </div>

        ${scoreSection}

        <div class="team">
          <img class="team-logo-img"
            src="${getTeamLogo(homeTeam.id)}"
            alt="${homeTeam.name}"
            onerror="this.style.display='none';
              this.nextSibling.style.display='flex'">
          <div class="team-logo-fallback" style="display:none">
            ${homeTeam.shortName?.[0] || homeTeam.name[0]}
          </div>
          <div class="team-name">${homeTeam.name}</div>
        </div>

      </div>
    </div>`;
}

// ---- LOAD LIVE GAMES ----
async function loadLiveGames() {
  showLoading();
  try {
    const data   = await apiFetch(`/sport/football/events/live`);
    allLiveGames = data.events || [];
    hideLoading();

    const list = document.getElementById("liveList");
    if (allLiveGames.length === 0) {
      list.innerHTML = `
        <div class="no-games">
          <p style="font-size:2em; margin-bottom:10px">😴</p>
          <p>No live matches right now.</p>
          <p style="margin-top:8px; font-size:0.85em; color:#444">
            Check back during match times
          </p>
        </div>`;
    } else {
      list.innerHTML = allLiveGames
        .map(game => renderGameCard(game)).join("");
    }
  } catch (error) {
    hideLoading();
    showError("Could not load live games.");
  }
}

// ---- RENDER TOURNAMENTS ----
// Shows list of all tournaments — click one to see its games
function renderTournaments() {
  const list = document.getElementById("tournamentsList");

  // If a tournament is selected show its games
  if (selectedTournament !== null) {
    const filtered = allGames.filter(game =>
      game.tournament.name === selectedTournament
    );

    list.innerHTML = `
      <button class="back-btn" onclick="clearTournament()">
        ← Back to all competitions
      </button>
      <div class="tournament-title">${selectedTournament}</div>
      <div class="games-list">
        ${filtered.length > 0
          ? filtered.map(game => renderGameCard(game)).join("")
          : `<div class="no-games">
               <p>No matches for this competition today.</p>
             </div>`
        }
      </div>`;
    return;
  }

  // Otherwise show tournament list
  if (allGames.length === 0) {
    list.innerHTML = `
      <div class="no-games">
        <p>No tournaments found. Load scores first.</p>
      </div>`;
    return;
  }

  // Extract unique tournaments with game count
  const seen = new Set();
  const tournaments = [];
  allGames.forEach(e => {
    if (!seen.has(e.tournament.name)) {
      seen.add(e.tournament.name);
      const count = allGames.filter(
        g => g.tournament.name === e.tournament.name
      ).length;
      tournaments.push({ ...e.tournament, count });
    }
  });

  // Sort alphabetically
  tournaments.sort((a, b) => a.name.localeCompare(b.name));

  list.innerHTML = tournaments.map(t => `
    <div class="tournament-card" onclick="selectTournament('${
      t.name.replace(/'/g, "\\'")}')">
      <div class="tournament-card-flag">
        ${getFlag(t.category?.alpha2)}
      </div>
      <div class="tournament-card-info">
        <div class="tournament-card-name">${t.name}</div>
        <div class="tournament-card-country">
          ${t.category?.name || "International"}
        </div>
        <div class="tournament-card-sport">
          ⚽ ${t.count} match${t.count !== 1 ? "es" : ""} today
        </div>
      </div>
      <div class="tournament-arrow">→</div>
    </div>
  `).join("");
}

// ---- SELECT A TOURNAMENT ----
function selectTournament(name) {
  selectedTournament = name;
  renderTournaments();
}

// ---- CLEAR TOURNAMENT SELECTION ----
function clearTournament() {
  selectedTournament = null;
  renderTournaments();
}

// ---- LOADING HELPERS ----
function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("errorMsg").classList.add("hidden");
}

function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
}

function showError(msg) {
  hideLoading();
  const err = document.getElementById("errorMsg");
  err.textContent = msg;
  err.classList.remove("hidden");
}

// ---- INITIALIZE ----
updateDateDisplay();
loadScores();