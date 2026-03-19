/* ═══════════════════════════════════════════════
   ON FIELD — EUROPEAN FOOTBALL DASHBOARD
   script.js
═══════════════════════════════════════════════

   SPORTS API CONFIGURATION
   ─────────────────────────────────────────────
   API: SportAPI7 (SofaScore mirror) on RapidAPI
   Endpoint: GET /api/v1/sport/football/scheduled-events/{date}
   Format: YYYY-MM-DD (auto-generated from today's date)

   ▼ PASTE YOUR API KEY ON THE LINE BELOW ▼
═══════════════════════════════════════════════ */

const API_KEY  = "932baf2fabmsh2046c615055d603p15e4f7jsnd28012d3c38b"; // ← YOUR RAPIDAPI KEY HERE
const API_HOST = "sportapi7.p.rapidapi.com";

/* ══════════════════════════════════════════════
   DATA — LIVE TICKER
══════════════════════════════════════════════ */
const TICKER_MATCHES = [
  { home:'Liverpool',      away:'Nottm Forest',   score:'2–0', time:"61'", league:'Premier League', live:true  },
  { home:'Barcelona',      away:'Real Madrid',    score:'1–2', time:"78'", league:'La Liga',         live:true  },
  { home:'Bayern München', away:'Leverkusen',     score:'1–0', time:"45'", league:'Bundesliga',      live:true  },
  { home:'PSG',            away:'Monaco',         score:'3–1', time:'FT',  league:'Ligue 1',         live:false },
  { home:'Inter',          away:'Napoli',         score:'0–1', time:"88'", league:'Serie A',         live:true  },
  { home:'Arsenal',        away:'Man City',       score:'2–1', time:'FT',  league:'Premier League',  live:false },
  { home:'Atletico',       away:'Athletic',       score:'0–0', time:"34'", league:'La Liga',         live:true  },
];

/* ══════════════════════════════════════════════
   DATA — SCORES (3 days)
══════════════════════════════════════════════ */
const MATCH_DATES = {
  '-1': {
    label: 'Yesterday',
    matches: [
      { league:'Premier League', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', cssClass:'pl-header', games:[
        { home:'Arsenal',        homeBadge:'#EF0107', homeAbbr:'ARS', away:'Chelsea',       awayBadge:'#034694', awayAbbr:'CHE', score:'2–1', status:'finished' },
        { home:'Liverpool',      homeBadge:'#C8102E', homeAbbr:'LIV', away:'Man United',    awayBadge:'#DA291C', awayAbbr:'MUN', score:'3–0', status:'finished' },
        { home:'Nottm Forest',   homeBadge:'#E53233', homeAbbr:'NFO', away:'Brighton',      awayBadge:'#0057B8', awayAbbr:'BHA', score:'1–1', status:'finished' },
      ]},
      { league:'La Liga', flag:'🇪🇸', cssClass:'laliga-header', games:[
        { home:'Barcelona',      homeBadge:'#A50044', homeAbbr:'BAR', away:'Atletico',      awayBadge:'#CB3524', awayAbbr:'ATM', score:'2–0', status:'finished' },
        { home:'Real Madrid',    homeBadge:'#FEBE10', homeAbbr:'RMA', away:'Villarreal',    awayBadge:'#F8D400', awayAbbr:'VIL', score:'1–0', status:'finished' },
      ]},
      { league:'Serie A', flag:'🇮🇹', cssClass:'seriea-header', games:[
        { home:'Napoli',         homeBadge:'#009DD9', homeAbbr:'NAP', away:'AC Milan',      awayBadge:'#E30613', awayAbbr:'MIL', score:'2–1', status:'finished' },
        { home:'Inter',          homeBadge:'#003DA5', homeAbbr:'INT', away:'Juventus',      awayBadge:'#1F1F1F', awayAbbr:'JUV', score:'1–1', status:'finished' },
      ]},
      { league:'Bundesliga', flag:'🇩🇪', cssClass:'bund-header', games:[
        { home:'Bayern',         homeBadge:'#DC052D', homeAbbr:'BAY', away:'Frankfurt',     awayBadge:'#E1000F', awayAbbr:'SGE', score:'2–0', status:'finished' },
      ]},
      { league:'Ligue 1', flag:'🇫🇷', cssClass:'ligue1-header', games:[
        { home:'PSG',            homeBadge:'#004170', homeAbbr:'PSG', away:'Marseille',     awayBadge:'#009AC7', awayAbbr:'OM',  score:'2–0', status:'finished' },
      ]},
    ]
  },
  '0': {
    label: 'Today',
    matches: [
      { league:'Premier League', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', cssClass:'pl-header', games:[
        { home:'Liverpool',      homeBadge:'#C8102E', homeAbbr:'LIV', away:'Nottm Forest',  awayBadge:'#E53233', awayAbbr:'NFO', score:'2–0', status:'live', time:"61'" },
        { home:'Arsenal',        homeBadge:'#EF0107', homeAbbr:'ARS', away:'Man City',      awayBadge:'#6CABDD', awayAbbr:'MCI', score:'1–0', status:'live', time:"34'" },
        { home:'Newcastle',      homeBadge:'#241F20', homeAbbr:'NEW', away:'Chelsea',       awayBadge:'#034694', awayAbbr:'CHE', score:'18:00', status:'upcoming' },
      ]},
      { league:'La Liga', flag:'🇪🇸', cssClass:'laliga-header', games:[
        { home:'Barcelona',      homeBadge:'#A50044', homeAbbr:'BAR', away:'Real Madrid',   awayBadge:'#FEBE10', awayAbbr:'RMA', score:'1–2', status:'live', time:"78'" },
        { home:'Atletico',       homeBadge:'#CB3524', homeAbbr:'ATM', away:'Athletic',      awayBadge:'#EE2523', awayAbbr:'ATH', score:'0–0', status:'live', time:"34'" },
      ]},
      { league:'Serie A', flag:'🇮🇹', cssClass:'seriea-header', games:[
        { home:'Inter',          homeBadge:'#003DA5', homeAbbr:'INT', away:'Napoli',        awayBadge:'#009DD9', awayAbbr:'NAP', score:'0–1', status:'live', time:"88'" },
        { home:'Lazio',          homeBadge:'#1D97CB', homeAbbr:'LAZ', away:'Roma',          awayBadge:'#8B0000', awayAbbr:'ROM', score:'20:45', status:'upcoming' },
      ]},
      { league:'Bundesliga', flag:'🇩🇪', cssClass:'bund-header', games:[
        { home:'Bayern',         homeBadge:'#DC052D', homeAbbr:'BAY', away:'Leverkusen',    awayBadge:'#E32221', awayAbbr:'B04', score:'1–0', status:'live', time:"45'" },
      ]},
      { league:'Ligue 1', flag:'🇫🇷', cssClass:'ligue1-header', games:[
        { home:'PSG',            homeBadge:'#004170', homeAbbr:'PSG', away:'Monaco',        awayBadge:'#D4192C', awayAbbr:'MON', score:'3–1', status:'finished' },
        { home:'Nice',           homeBadge:'#C8102E', homeAbbr:'NIC', away:'Marseille',     awayBadge:'#009AC7', awayAbbr:'OM',  score:'21:00', status:'upcoming' },
      ]},
    ]
  },
  '1': {
    label: 'Tomorrow',
    matches: [
      { league:'Premier League', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', cssClass:'pl-header', games:[
        { home:'Man United',     homeBadge:'#DA291C', homeAbbr:'MUN', away:'Liverpool',     awayBadge:'#C8102E', awayAbbr:'LIV', score:'13:30', status:'upcoming' },
        { home:'Chelsea',        homeBadge:'#034694', homeAbbr:'CHE', away:'Arsenal',       awayBadge:'#EF0107', awayAbbr:'ARS', score:'16:00', status:'upcoming' },
        { home:'Man City',       homeBadge:'#6CABDD', homeAbbr:'MCI', away:'Tottenham',     awayBadge:'#132257', awayAbbr:'TOT', score:'16:00', status:'upcoming' },
      ]},
      { league:'La Liga', flag:'🇪🇸', cssClass:'laliga-header', games:[
        { home:'Real Madrid',    homeBadge:'#FEBE10', homeAbbr:'RMA', away:'Sevilla',       awayBadge:'#D02030', awayAbbr:'SEV', score:'21:00', status:'upcoming' },
        { home:'Villarreal',     homeBadge:'#F8D400', homeAbbr:'VIL', away:'Valencia',      awayBadge:'#F77F00', awayAbbr:'VAL', score:'19:00', status:'upcoming' },
      ]},
      { league:'Serie A', flag:'🇮🇹', cssClass:'seriea-header', games:[
        { home:'Juventus',       homeBadge:'#1F1F1F', homeAbbr:'JUV', away:'Fiorentina',    awayBadge:'#4B0082', awayAbbr:'FIO', score:'20:45', status:'upcoming' },
        { home:'Atalanta',       homeBadge:'#1D6EC6', homeAbbr:'ATA', away:'Bologna',       awayBadge:'#0D2B5E', awayAbbr:'BOL', score:'18:00', status:'upcoming' },
      ]},
      { league:'Bundesliga', flag:'🇩🇪', cssClass:'bund-header', games:[
        { home:'Dortmund',       homeBadge:'#FDE100', homeAbbr:'BVB', away:'RB Leipzig',    awayBadge:'#DD0741', awayAbbr:'RBL', score:'15:30', status:'upcoming' },
      ]},
      { league:'Ligue 1', flag:'🇫🇷', cssClass:'ligue1-header', games:[
        { home:'Monaco',         homeBadge:'#D4192C', homeAbbr:'MON', away:'Lille',         awayBadge:'#E31B21', awayAbbr:'LIL', score:'21:00', status:'upcoming' },
      ]},
    ]
  }
};

/* ══════════════════════════════════════════════
   DATA — STANDINGS (2024-25 Season, ~GW28)
══════════════════════════════════════════════ */
const STANDINGS = {

  /* ── Premier League ─────────────────────── */
  pl: {
    name: 'Premier League',
    clSpots: 4, elSpots: 2, relSpots: 3,
    teams: [
      { pos:1,  name:'Liverpool',          abbr:'LIV', color:'#C8102E', p:28, w:20, d:6,  l:2,  gd:47,  pts:66 },
      { pos:2,  name:'Arsenal',            abbr:'ARS', color:'#EF0107', p:28, w:17, d:6,  l:5,  gd:27,  pts:57 },
      { pos:3,  name:'Nottm Forest',       abbr:'NFO', color:'#E53233', p:28, w:16, d:7,  l:5,  gd:14,  pts:55 },
      { pos:4,  name:'Chelsea',            abbr:'CHE', color:'#034694', p:28, w:15, d:8,  l:5,  gd:18,  pts:53 },
      { pos:5,  name:'Manchester City',    abbr:'MCI', color:'#6CABDD', p:28, w:14, d:7,  l:7,  gd:15,  pts:49 },
      { pos:6,  name:'Newcastle Utd',      abbr:'NEW', color:'#241F20', p:28, w:14, d:4,  l:10, gd:14,  pts:46 },
      { pos:7,  name:'Aston Villa',        abbr:'AVL', color:'#670E36', p:28, w:12, d:9,  l:7,  gd:9,   pts:45 },
      { pos:8,  name:'Bournemouth',        abbr:'BOU', color:'#DA291C', p:28, w:13, d:5,  l:10, gd:7,   pts:44 },
      { pos:9,  name:'Fulham',             abbr:'FUL', color:'#CC0000', p:28, w:12, d:7,  l:9,  gd:5,   pts:43 },
      { pos:10, name:'Brighton',           abbr:'BHA', color:'#0057B8', p:28, w:11, d:8,  l:9,  gd:3,   pts:41 },
      { pos:11, name:'Brentford',          abbr:'BRE', color:'#E30613', p:28, w:11, d:7,  l:10, gd:3,   pts:40 },
      { pos:12, name:'Manchester Utd',     abbr:'MUN', color:'#DA291C', p:28, w:9,  d:7,  l:12, gd:-17, pts:34 },
      { pos:13, name:'West Ham',           abbr:'WHU', color:'#7A263A', p:28, w:9,  d:7,  l:12, gd:-8,  pts:34 },
      { pos:14, name:'Tottenham',          abbr:'TOT', color:'#132257', p:28, w:9,  d:6,  l:13, gd:-9,  pts:33 },
      { pos:15, name:'Everton',            abbr:'EVE', color:'#003399', p:28, w:8,  d:8,  l:12, gd:-14, pts:32 },
      { pos:16, name:'Crystal Palace',     abbr:'CRY', color:'#1B458F', p:28, w:7,  d:8,  l:13, gd:-15, pts:29 },
      { pos:17, name:'Wolverhampton',      abbr:'WOL', color:'#FDB913', p:28, w:5,  d:4,  l:19, gd:-26, pts:19 },
      { pos:18, name:'Ipswich Town',       abbr:'IPS', color:'#003087', p:28, w:5,  d:5,  l:18, gd:-25, pts:20 },
      { pos:19, name:'Leicester City',     abbr:'LEI', color:'#003090', p:28, w:4,  d:8,  l:16, gd:-27, pts:20 },
      { pos:20, name:'Southampton',        abbr:'SOU', color:'#D71920', p:28, w:3,  d:5,  l:20, gd:-36, pts:14 },
    ]
  },

  /* ── La Liga ────────────────────────────── */
  laliga: {
    name: 'La Liga',
    clSpots: 4, elSpots: 2, relSpots: 3,
    teams: [
      { pos:1,  name:'Barcelona',          abbr:'BAR', color:'#A50044', p:27, w:19, d:6,  l:2,  gd:45,  pts:63 },
      { pos:2,  name:'Real Madrid',        abbr:'RMA', color:'#000000', p:27, w:18, d:5,  l:4,  gd:34,  pts:59 },
      { pos:3,  name:'Atletico Madrid',    abbr:'ATM', color:'#CB3524', p:27, w:17, d:5,  l:5,  gd:29,  pts:56 },
      { pos:4,  name:'Athletic Bilbao',    abbr:'ATH', color:'#EE2523', p:27, w:14, d:7,  l:6,  gd:17,  pts:49 },
      { pos:5,  name:'Villarreal',         abbr:'VIL', color:'#F8D400', p:27, w:12, d:7,  l:8,  gd:12,  pts:43 },
      { pos:6,  name:'Real Sociedad',      abbr:'RSO', color:'#0077C0', p:27, w:11, d:9,  l:7,  gd:8,   pts:42 },
      { pos:7,  name:'Osasuna',            abbr:'OSA', color:'#C8102E', p:27, w:11, d:7,  l:9,  gd:4,   pts:40 },
      { pos:8,  name:'Rayo Vallecano',     abbr:'RAY', color:'#C8102E', p:27, w:11, d:6,  l:10, gd:3,   pts:39 },
      { pos:9,  name:'Real Betis',         abbr:'BET', color:'#00A650', p:27, w:10, d:8,  l:9,  gd:2,   pts:38 },
      { pos:10, name:'Mallorca',           abbr:'MAL', color:'#E42013', p:27, w:10, d:6,  l:11, gd:-2,  pts:36 },
      { pos:11, name:'Sevilla',            abbr:'SEV', color:'#D02030', p:27, w:9,  d:8,  l:10, gd:1,   pts:35 },
      { pos:12, name:'Celta Vigo',         abbr:'CEL', color:'#8EC6E6', p:27, w:9,  d:6,  l:12, gd:-5,  pts:33 },
      { pos:13, name:'Getafe',             abbr:'GET', color:'#0066B3', p:27, w:9,  d:5,  l:13, gd:-8,  pts:32 },
      { pos:14, name:'Leganes',            abbr:'LEG', color:'#003087', p:27, w:8,  d:7,  l:12, gd:-10, pts:31 },
      { pos:15, name:'Girona',             abbr:'GIR', color:'#C8102E', p:27, w:7,  d:7,  l:13, gd:-12, pts:28 },
      { pos:16, name:'Las Palmas',         abbr:'LPA', color:'#F7D100', p:27, w:7,  d:7,  l:13, gd:-14, pts:28 },
      { pos:17, name:'Alaves',             abbr:'ALA', color:'#003087', p:27, w:6,  d:6,  l:15, gd:-18, pts:24 },
      { pos:18, name:'Espanyol',           abbr:'ESP', color:'#0057B8', p:27, w:5,  d:8,  l:14, gd:-16, pts:23 },
      { pos:19, name:'Valencia',           abbr:'VAL', color:'#F77F00', p:27, w:4,  d:8,  l:15, gd:-20, pts:20 },
      { pos:20, name:'Valladolid',         abbr:'VLL', color:'#6B1E99', p:27, w:3,  d:5,  l:19, gd:-30, pts:14 },
    ]
  },

  /* ── Serie A ────────────────────────────── */
  seriea: {
    name: 'Serie A',
    clSpots: 4, elSpots: 2, relSpots: 3,
    teams: [
      { pos:1,  name:'Napoli',             abbr:'NAP', color:'#009DD9', p:27, w:18, d:5,  l:4,  gd:30,  pts:59 },
      { pos:2,  name:'Inter',              abbr:'INT', color:'#003DA5', p:27, w:17, d:6,  l:4,  gd:35,  pts:57 },
      { pos:3,  name:'Atalanta',           abbr:'ATA', color:'#1D6EC6', p:27, w:16, d:5,  l:6,  gd:27,  pts:53 },
      { pos:4,  name:'Lazio',              abbr:'LAZ', color:'#1D97CB', p:27, w:14, d:7,  l:6,  gd:18,  pts:49 },
      { pos:5,  name:'Juventus',           abbr:'JUV', color:'#1F1F1F', p:27, w:13, d:8,  l:6,  gd:14,  pts:47 },
      { pos:6,  name:'Fiorentina',         abbr:'FIO', color:'#4B0082', p:27, w:13, d:7,  l:7,  gd:12,  pts:46 },
      { pos:7,  name:'Bologna',            abbr:'BOL', color:'#0D2B5E', p:27, w:11, d:9,  l:7,  gd:7,   pts:42 },
      { pos:8,  name:'AC Milan',           abbr:'MIL', color:'#E30613', p:27, w:12, d:5,  l:10, gd:4,   pts:41 },
      { pos:9,  name:'Roma',               abbr:'ROM', color:'#8B0000', p:27, w:10, d:7,  l:10, gd:2,   pts:37 },
      { pos:10, name:'Torino',             abbr:'TOR', color:'#8B1C15', p:27, w:10, d:6,  l:11, gd:-2,  pts:36 },
      { pos:11, name:'Udinese',            abbr:'UDI', color:'#1F1F1F', p:27, w:9,  d:7,  l:11, gd:-4,  pts:34 },
      { pos:12, name:'Genoa',              abbr:'GEN', color:'#C8102E', p:27, w:8,  d:7,  l:12, gd:-8,  pts:31 },
      { pos:13, name:'Empoli',             abbr:'EMP', color:'#0066CC', p:27, w:8,  d:6,  l:13, gd:-10, pts:30 },
      { pos:14, name:'Como',               abbr:'COM', color:'#003DA5', p:27, w:7,  d:8,  l:12, gd:-9,  pts:29 },
      { pos:15, name:'Cagliari',           abbr:'CAG', color:'#C8102E', p:27, w:8,  d:5,  l:14, gd:-12, pts:29 },
      { pos:16, name:'Parma',              abbr:'PAR', color:'#F5E000', p:27, w:7,  d:7,  l:13, gd:-13, pts:28 },
      { pos:17, name:'Lecce',              abbr:'LEC', color:'#F5A623', p:27, w:6,  d:8,  l:13, gd:-14, pts:26 },
      { pos:18, name:'Hellas Verona',      abbr:'HVE', color:'#1A1A1A', p:27, w:6,  d:6,  l:15, gd:-16, pts:24 },
      { pos:19, name:'Monza',              abbr:'MON', color:'#C8102E', p:27, w:4,  d:8,  l:15, gd:-20, pts:20 },
      { pos:20, name:'Venezia',            abbr:'VEN', color:'#FF6600', p:27, w:3,  d:6,  l:18, gd:-28, pts:15 },
    ]
  },

  /* ── Bundesliga ─────────────────────────── */
  bundesliga: {
    name: 'Bundesliga',
    clSpots: 4, elSpots: 2, relSpots: 2,
    teams: [
      { pos:1,  name:'Bayern München',     abbr:'BAY', color:'#DC052D', p:24, w:18, d:3,  l:3,  gd:42,  pts:57 },
      { pos:2,  name:'Bayer Leverkusen',   abbr:'B04', color:'#E32221', p:24, w:16, d:4,  l:4,  gd:30,  pts:52 },
      { pos:3,  name:'Eintracht Frankfurt',abbr:'SGE', color:'#E1000F', p:24, w:14, d:5,  l:5,  gd:18,  pts:47 },
      { pos:4,  name:'RB Leipzig',         abbr:'RBL', color:'#DD0741', p:24, w:12, d:6,  l:6,  gd:14,  pts:42 },
      { pos:5,  name:'Borussia Dortmund',  abbr:'BVB', color:'#FDE100', p:24, w:11, d:7,  l:6,  gd:12,  pts:40 },
      { pos:6,  name:'VfB Stuttgart',      abbr:'VFB', color:'#E30613', p:24, w:11, d:5,  l:8,  gd:6,   pts:38 },
      { pos:7,  name:'Werder Bremen',      abbr:'SVW', color:'#1D8348', p:24, w:10, d:6,  l:8,  gd:4,   pts:36 },
      { pos:8,  name:'SC Freiburg',        abbr:'SCF', color:'#CC0000', p:24, w:10, d:5,  l:9,  gd:2,   pts:35 },
      { pos:9,  name:'Hoffenheim',         abbr:'TSG', color:'#1461AC', p:24, w:9,  d:6,  l:9,  gd:-2,  pts:33 },
      { pos:10, name:'Mainz 05',           abbr:'M05', color:'#C8102E', p:24, w:9,  d:5,  l:10, gd:-4,  pts:32 },
      { pos:11, name:'Borussia M\'gladbach',abbr:'BMG',color:'#00522A', p:24, w:8,  d:7,  l:9,  gd:-3,  pts:31 },
      { pos:12, name:'Wolfsburg',          abbr:'WOB', color:'#1E4692', p:24, w:8,  d:6,  l:10, gd:-6,  pts:30 },
      { pos:13, name:'Augsburg',           abbr:'FCA', color:'#BA3733', p:24, w:8,  d:5,  l:11, gd:-8,  pts:29 },
      { pos:14, name:'Union Berlin',       abbr:'FCU', color:'#EB1923', p:24, w:6,  d:7,  l:11, gd:-12, pts:25 },
      { pos:15, name:'FC St. Pauli',       abbr:'STP', color:'#6B2E23', p:24, w:6,  d:6,  l:12, gd:-14, pts:24 },
      { pos:16, name:'Holstein Kiel',      abbr:'KIE', color:'#0059A0', p:24, w:5,  d:5,  l:14, gd:-22, pts:20 },
      { pos:17, name:'Heidenheim',         abbr:'FCH', color:'#C8102E', p:24, w:4,  d:7,  l:13, gd:-18, pts:19 },
      { pos:18, name:'VfL Bochum',         abbr:'BOC', color:'#005CA9', p:24, w:3,  d:4,  l:17, gd:-30, pts:13 },
    ]
  },

  /* ── Ligue 1 ────────────────────────────── */
  ligue1: {
    name: 'Ligue 1',
    clSpots: 3, elSpots: 2, relSpots: 3,
    teams: [
      { pos:1,  name:'Paris Saint-Germain',abbr:'PSG', color:'#004170', p:26, w:20, d:4,  l:2,  gd:52,  pts:64 },
      { pos:2,  name:'Monaco',             abbr:'MON', color:'#D4192C', p:26, w:16, d:5,  l:5,  gd:28,  pts:53 },
      { pos:3,  name:'Marseille',          abbr:'OM',  color:'#009AC7', p:26, w:15, d:5,  l:6,  gd:22,  pts:50 },
      { pos:4,  name:'Nice',               abbr:'NIC', color:'#C8102E', p:26, w:14, d:6,  l:6,  gd:14,  pts:48 },
      { pos:5,  name:'Lille',              abbr:'LIL', color:'#E31B21', p:26, w:13, d:6,  l:7,  gd:12,  pts:45 },
      { pos:6,  name:'Lyon',               abbr:'OL',  color:'#0032A0', p:26, w:12, d:7,  l:7,  gd:8,   pts:43 },
      { pos:7,  name:'RC Lens',            abbr:'RCL', color:'#F7A800', p:26, w:11, d:6,  l:9,  gd:4,   pts:39 },
      { pos:8,  name:'Stade Rennais',      abbr:'REN', color:'#C8102E', p:26, w:10, d:8,  l:8,  gd:2,   pts:38 },
      { pos:9,  name:'Toulouse',           abbr:'TLS', color:'#6B2E76', p:26, w:10, d:6,  l:10, gd:-2,  pts:36 },
      { pos:10, name:'Reims',              abbr:'SDR', color:'#DA291C', p:26, w:9,  d:8,  l:9,  gd:-2,  pts:35 },
      { pos:11, name:'Strasbourg',         abbr:'RCS', color:'#0072CE', p:26, w:9,  d:7,  l:10, gd:-4,  pts:34 },
      { pos:12, name:'Brest',              abbr:'SB29',color:'#C8102E', p:26, w:9,  d:5,  l:12, gd:-6,  pts:32 },
      { pos:13, name:'Nantes',             abbr:'FCN', color:'#F5D300', p:26, w:8,  d:7,  l:11, gd:-8,  pts:31 },
      { pos:14, name:'Montpellier',        abbr:'MTL', color:'#002855', p:26, w:7,  d:7,  l:12, gd:-10, pts:28 },
      { pos:15, name:'Auxerre',            abbr:'AUX', color:'#003087', p:26, w:7,  d:6,  l:13, gd:-12, pts:27 },
      { pos:16, name:'Le Havre',           abbr:'HAC', color:'#009AC7', p:26, w:5,  d:8,  l:13, gd:-18, pts:23 },
      { pos:17, name:'Angers',             abbr:'ANG', color:'#1F1F1F', p:26, w:4,  d:7,  l:15, gd:-22, pts:19 },
      { pos:18, name:'Saint-Etienne',      abbr:'ASSE',color:'#007B40', p:26, w:2,  d:5,  l:19, gd:-30, pts:11 },
    ]
  }
};

/* ══════════════════════════════════════════════
   DATA — TOP SCORERS
══════════════════════════════════════════════ */
const TOP_SCORERS = [
  { rank:1,  name:'Erling Haaland',      club:'Man City',    clubEmoji:'🔵', flag:'🇳🇴', goals:22, assists:5,  color:'#6CABDD', initials:'EH' },
  { rank:2,  name:'Kylian Mbappé',       club:'Real Madrid', clubEmoji:'⚽', flag:'🇫🇷', goals:20, assists:8,  color:'#FEBE10', initials:'KM' },
  { rank:3,  name:'Viktor Gyökeres',     club:'Sporting CP', clubEmoji:'🟢', flag:'🇸🇪', goals:19, assists:6,  color:'#006400', initials:'VG' },
  { rank:4,  name:'Bukayo Saka',         club:'Arsenal',     clubEmoji:'🔴', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals:17, assists:11, color:'#EF0107', initials:'BS' },
  { rank:5,  name:'Marcus Thuram',       club:'Inter',       clubEmoji:'🔵', flag:'🇫🇷', goals:16, assists:8,  color:'#003DA5', initials:'MT' },
  { rank:6,  name:'Dušan Vlahović',      club:'Juventus',    clubEmoji:'⚫', flag:'🇷🇸', goals:16, assists:3,  color:'#1F1F1F', initials:'DV' },
  { rank:7,  name:'Lamine Yamal',        club:'Barcelona',   clubEmoji:'🔴', flag:'🇪🇸', goals:15, assists:13, color:'#A50044', initials:'LY' },
  { rank:8,  name:'Harry Kane',          club:'Bayern',      clubEmoji:'🔴', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals:15, assists:7,  color:'#DC052D', initials:'HK' },
  { rank:9,  name:'Vinícius Jr.',        club:'Real Madrid', clubEmoji:'⚽', flag:'🇧🇷', goals:14, assists:11, color:'#000000', initials:'VJ' },
  { rank:10, name:'Mohamed Salah',       club:'Liverpool',   clubEmoji:'🔴', flag:'🇪🇬', goals:14, assists:12, color:'#C8102E', initials:'MS' },
];

/* ══════════════════════════════════════════════
   DATA — MATCH STATS
══════════════════════════════════════════════ */
const MATCH_STATS_DATA = [
  { label:'Possession',       home:55, away:45, isPercent:true  },
  { label:'Shots',            home:18, away:12, isPercent:false },
  { label:'Shots on Target',  home:7,  away:5,  isPercent:false },
  { label:'Passes',           home:563,away:487,isPercent:false },
  { label:'Pass Accuracy',    home:89, away:82, isPercent:true  },
  { label:'Corners',          home:6,  away:5,  isPercent:false },
  { label:'Fouls',            home:11, away:9,  isPercent:false },
  { label:'Yellow Cards',     home:1,  away:2,  isPercent:false },
];

/* ══════════════════════════════════════════════
   DATA — NEWS (March 2025)
══════════════════════════════════════════════ */
const NEWS_DATA = [
  {
    headline: 'Liverpool Extend Title Lead to 9 Points After Dominant Win Over Forest',
    tag: 'Premier League', tagColor: '#38003c',
    date: 'Mar 19, 2025',
    excerpt: 'Arne Slot\'s Liverpool produced another commanding display at Anfield, with Mohamed Salah netting a brace to push the Reds ever closer to a second successive title.',
    gradient: 'linear-gradient(135deg, #1a0030 0%, #38003c 60%, #5a0060 100%)'
  },
  {
    headline: 'El Clásico Drama: Real Madrid Strike Late to Deny Barcelona Top Spot',
    tag: 'La Liga', tagColor: '#e85000',
    date: 'Mar 18, 2025',
    excerpt: 'Mbappé\'s 89th-minute header completed a stunning comeback at the Bernabéu as Real Madrid overturned a Barcelona lead to inflict a painful blow in the title race.',
    gradient: 'linear-gradient(135deg, #1a0800 0%, #5a1a00 60%, #8b2800 100%)'
  },
  {
    headline: 'Bayern Reclaim Bundesliga Lead as Kane Fires Leverkusen Thriller',
    tag: 'Bundesliga', tagColor: '#c90012',
    date: 'Mar 17, 2025',
    excerpt: 'Harry Kane continued his prolific form with a hat-trick against Bayer Leverkusen in a breathless five-goal encounter at the Allianz Arena, putting Bayern firmly back in the title frame.',
    gradient: 'linear-gradient(135deg, #1a0005 0%, #5a0010 60%, #8b0018 100%)'
  },
  {
    headline: 'Napoli Back on Top: Conte\'s Revolution Puts Partenopei in Scudetto Hunt',
    tag: 'Serie A', tagColor: '#001e6c',
    date: 'Mar 16, 2025',
    excerpt: 'Antonio Conte\'s defensive masterclass earned Napoli a crucial 1-0 win over direct rivals Inter, rekindling memories of their 2022-23 triumph as the Scudetto race reaches boiling point.',
    gradient: 'linear-gradient(135deg, #00091a 0%, #001e6c 60%, #0030aa 100%)'
  },
];

/* ══════════════════════════════════════════════
   API — TEAM COLORS MAP (for real API data)
══════════════════════════════════════════════ */
const TEAM_COLORS_MAP = {
  'Arsenal':'#EF0107', 'Chelsea':'#034694', 'Liverpool':'#C8102E',
  'Manchester City':'#6CABDD', 'Man City':'#6CABDD',
  'Manchester United':'#DA291C', 'Man United':'#DA291C',
  'Tottenham Hotspur':'#132257', 'Tottenham':'#132257',
  'Newcastle United':'#241F20', 'Aston Villa':'#670E36',
  'Brighton':'#0057B8', 'Brighton & Hove Albion':'#0057B8',
  'West Ham':'#7A263A', 'West Ham United':'#7A263A',
  'Everton':'#003399', 'Fulham':'#CC0000',
  'Wolves':'#FDB913', 'Wolverhampton':'#FDB913',
  'Brentford':'#E30613', 'Bournemouth':'#DA291C',
  'Crystal Palace':'#1B458F', 'Nottingham Forest':'#E53233',
  'Leicester City':'#003090', 'Ipswich Town':'#003087',
  'Southampton':'#D71920',
  'Real Madrid':'#000000', 'Barcelona':'#A50044',
  'Atletico Madrid':'#CB3524', 'Athletic Club':'#EE2523',
  'Villarreal':'#F8D400', 'Real Betis':'#00A650',
  'Real Sociedad':'#0077C0', 'Sevilla':'#D02030',
  'Valencia':'#F77F00', 'Osasuna':'#C8102E',
  'Inter':'#003DA5', 'Inter Milan':'#003DA5',
  'AC Milan':'#E30613', 'Juventus':'#1F1F1F',
  'Napoli':'#009DD9', 'Lazio':'#1D97CB',
  'Roma':'#8B0000', 'Fiorentina':'#4B0082',
  'Atalanta':'#1D6EC6', 'Bologna':'#0D2B5E',
  'Bayern Munich':'#DC052D', 'Bayern München':'#DC052D',
  'Borussia Dortmund':'#FDE100', 'RB Leipzig':'#DD0741',
  'Bayer Leverkusen':'#E32221', 'Eintracht Frankfurt':'#E1000F',
  'PSG':'#004170', 'Paris Saint-Germain':'#004170',
  'Monaco':'#D4192C', 'Marseille':'#009AC7',
  'Lyon':'#0032A0', 'Lille':'#E31B21', 'Nice':'#C8102E',
};

function getTeamColor(name) {
  if (!name) return '#2d6a4f';
  const direct = TEAM_COLORS_MAP[name];
  if (direct) return direct;
  for (const [key, val] of Object.entries(TEAM_COLORS_MAP)) {
    if (name.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(name.toLowerCase())) return val;
  }
  return '#2d6a4f';
}

function getTeamAbbr(name) {
  if (!name) return '???';
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return name.substring(0, 3).toUpperCase();
  return words.slice(0, 3).map(w => w[0]).join('').toUpperCase().substring(0, 3);
}

/* ══════════════════════════════════════════════
   API — FETCH TODAY'S FIXTURES
══════════════════════════════════════════════ */

// Top European leagues to filter by (case-insensitive)
const TOP_LEAGUES = [
  'premier league','la liga','primera division','primera división',
  'serie a','bundesliga','ligue 1','champions league','europa league',
  'conference league','fa cup','copa del rey','dfb pokal','coupe de france'
];

const LEAGUE_FLAGS = [
  { pattern:/premier league/i,   flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', css:'pl-header'     },
  { pattern:/la liga|primera/i,  flag:'🇪🇸', css:'laliga-header'  },
  { pattern:/serie a/i,          flag:'🇮🇹', css:'seriea-header'  },
  { pattern:/bundesliga/i,       flag:'🇩🇪', css:'bund-header'    },
  { pattern:/ligue 1/i,          flag:'🇫🇷', css:'ligue1-header'  },
  { pattern:/champions league/i, flag:'🌟', css:'ucl-header'     },
  { pattern:/europa league/i,    flag:'⭐', css:'ucl-header'     },
];

function isTopLeague(tournamentName) {
  if (!tournamentName) return false;
  const lower = tournamentName.toLowerCase();
  return TOP_LEAGUES.some(t => lower.includes(t));
}

function getLeagueMeta(name) {
  for (const entry of LEAGUE_FLAGS) {
    if (entry.pattern.test(name)) return { flag: entry.flag, css: entry.css };
  }
  return { flag:'⚽', css:'other-header' };
}

async function fetchTodayFixtures() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // NOTE: If testing locally (file:// protocol) you may need a CORS proxy.
  const url = `https://${API_HOST}/api/v1/sport/football/scheduled-events/${today}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key':  API_KEY,
      'x-rapidapi-host': API_HOST
    }
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.events || [];
}

function processApiEvents(events) {
  if (!events || events.length === 0) return null;

  const groups = new Map();

  events.forEach(ev => {
    const tourName = ev.tournament?.name || 'Other';
    if (!isTopLeague(tourName)) return;

    if (!groups.has(tourName)) {
      const meta = getLeagueMeta(tourName);
      groups.set(tourName, { league: tourName, flag: meta.flag, cssClass: meta.css, games: [] });
    }

    const statusType = (ev.status?.type || 'notstarted').toLowerCase();
    let matchStatus = 'upcoming';
    let time = '';

    if (['finished', 'canceled', 'postponed'].includes(statusType)) {
      matchStatus = 'finished';
    } else if (['inprogress', 'halftime', 'pause', 'extra', 'overtime'].includes(statusType)) {
      matchStatus = 'live';
      const min = ev.time?.played || ev.time?.initial;
      time = statusType === 'halftime' ? 'HT' : (min ? `${min}'` : 'LIVE');
    } else {
      // upcoming
      if (ev.startTimestamp) {
        const d = new Date(ev.startTimestamp * 1000);
        time = d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
      }
    }

    const homeScore = ev.homeScore?.current ?? null;
    const awayScore = ev.awayScore?.current ?? null;
    const hasScore  = homeScore !== null && awayScore !== null && matchStatus !== 'upcoming';

    const homeName = ev.homeTeam?.name || ev.homeTeam?.shortName || 'Home';
    const awayName = ev.awayTeam?.name || ev.awayTeam?.shortName || 'Away';

    // nameCode from API is perfect for abbreviation (e.g. "ARS", "CHE")
    const homeAbbr = (ev.homeTeam?.nameCode || getTeamAbbr(homeName)).substring(0, 3).toUpperCase();
    const awayAbbr = (ev.awayTeam?.nameCode || getTeamAbbr(awayName)).substring(0, 3).toUpperCase();

    groups.get(tourName).games.push({
      home: homeName, away: awayName,
      homeBadge: getTeamColor(homeName), awayBadge: getTeamColor(awayName),
      homeAbbr, awayAbbr,
      score: hasScore ? `${homeScore}–${awayScore}` : time,
      status: matchStatus, time
    });
  });

  // Sort: priority leagues first (PL, LaLiga, etc.)
  const priorityOrder = ['premier league','la liga','primera','champions','serie a','bundesliga','ligue 1'];
  const result = Array.from(groups.values()).filter(g => g.games.length > 0);
  result.sort((a, b) => {
    const ai = priorityOrder.findIndex(p => a.league.toLowerCase().includes(p));
    const bi = priorityOrder.findIndex(p => b.league.toLowerCase().includes(p));
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });

  return result.length > 0 ? result : null;
}

/* ══════════════════════════════════════════════
   RENDER — TICKER
══════════════════════════════════════════════ */
function renderTicker() {
  const el = document.getElementById('tickerContent');
  if (!el) return;
  const all = [...TICKER_MATCHES, ...TICKER_MATCHES]; // duplicate for seamless loop
  el.innerHTML = all.map(m => `
    <div class="ticker-item">
      <span class="ticker-match-teams">${m.home} vs ${m.away}</span>
      <span class="ticker-score">${m.score}</span>
      ${m.live
        ? `<span class="ticker-time">${m.time}</span>`
        : `<span class="ticker-ft">${m.time}</span>`}
      <span class="ticker-league">${m.league}</span>
    </div>`).join('');
}

/* ══════════════════════════════════════════════
   RENDER — SCORES (with API + fallback)
══════════════════════════════════════════════ */
let currentDayOffset = 0;

function renderScores(offset, apiData) {
  const container = document.getElementById('scoresContainer');
  const dateLabel  = document.getElementById('currentDate');
  if (!container) return;

  // If API data provided and we're on "today", use it
  const useApi = apiData && offset === 0;
  const matchData = useApi ? apiData : MATCH_DATES[String(offset)];
  if (!matchData) return;

  // Update date label
  if (offset === 0 && useApi) {
    const today = new Date();
    dateLabel.textContent = `Today, ${today.toLocaleDateString('en-GB',{day:'numeric',month:'short'})}`;
  } else {
    const d = MATCH_DATES[String(offset)];
    dateLabel.textContent = d ? d.label : 'Unknown';
  }

  const leagueGroups = useApi ? matchData : matchData.matches;

  container.innerHTML = leagueGroups.map((lg, i) => `
    <div class="league-group" style="animation:rowSlideIn 0.35s ease ${i * 0.06}s both">
      <div class="league-group-header ${lg.cssClass || 'other-header'}">
        <span class="league-badge-emoji">${lg.flag}</span>
        <span class="league-group-name">${lg.league}</span>
      </div>
      <div class="matches-list">
        ${lg.games.map(g => buildMatchCard(g)).join('')}
      </div>
    </div>`).join('');
}

function buildMatchCard(g) {
  const isLive     = g.status === 'live';
  const isFinished = g.status === 'finished';

  // Light-colored badge needs dark text
  const lightColors = ['#FEBE10','#F8D400','#FDE100','#FDB913','#F5D300','#F7A800','#F5E000','#8EC6E6','#F7D100'];
  const homeDark = lightColors.includes(g.homeBadge) ? 'dark-text' : '';
  const awayDark = lightColors.includes(g.awayBadge) ? 'dark-text' : '';

  const statusHtml = isLive
    ? `<div class="mc-status live-s"><span class="mc-live-indicator"></span>${g.time}</div>`
    : isFinished
      ? `<div class="mc-status finished-s">FT</div>`
      : `<div class="mc-status upcoming-s"><i class="far fa-clock"></i></div>`;

  const scoreHtml = (isLive || isFinished)
    ? `<div class="mc-score">${g.score}</div>`
    : `<div class="mc-kickoff">${g.score}</div>`;

  return `
    <div class="match-card ${g.status}">
      <div class="mc-team home">
        <div class="team-badge ${homeDark}" style="background:${g.homeBadge}">${g.homeAbbr}</div>
        <span class="mc-team-name">${g.home}</span>
      </div>
      <div class="mc-score-col">
        ${scoreHtml}
        ${statusHtml}
      </div>
      <div class="mc-team away">
        <span class="mc-team-name">${g.away}</span>
        <div class="team-badge ${awayDark}" style="background:${g.awayBadge}">${g.awayAbbr}</div>
      </div>
    </div>`;
}

function setApiStatusBar(state, message) {
  const container = document.getElementById('scoresContainer');
  if (!container) return;
  const existing = document.getElementById('apiStatusBar');
  if (existing) existing.remove();

  const bar = document.createElement('div');
  bar.id = 'apiStatusBar';
  bar.className = `api-status-bar ${state}`;
  bar.innerHTML = `<i class="fas fa-${state === 'live-data' ? 'check-circle' : state === 'fallback' ? 'database' : 'spinner fa-spin'}"></i> ${message}`;
  container.insertAdjacentElement('beforebegin', bar);
}

/* ══════════════════════════════════════════════
   RENDER — STANDINGS
══════════════════════════════════════════════ */
function renderStandings(leagueKey) {
  const tbody = document.getElementById('standingsBody');
  if (!tbody) return;

  const data = STANDINGS[leagueKey];
  if (!data) { console.warn('No standings data for:', leagueKey); return; }

  const totalTeams = data.teams.length;
  const relStart   = totalTeams - data.relSpots + 1;
  const elEnd      = data.clSpots + data.elSpots;

  tbody.innerHTML = data.teams.map(t => {
    let zone = '';
    if (t.pos <= data.clSpots)     zone = 'row-cl';
    else if (t.pos <= elEnd)       zone = 'row-el';
    else if (t.pos >= relStart)    zone = 'row-rel';

    const gdStr   = t.gd > 0 ? `+${t.gd}` : String(t.gd);
    const gdClass = t.gd > 0 ? 'pos' : t.gd < 0 ? 'neg' : '';

    // Ensure dark text on light-colored team badges
    const lightBadgeColors = ['#FEBE10','#F8D400','#FDE100','#FDB913','#F5D300','#F7A800','#F5E000','#8EC6E6','#F7D100'];
    const badgeText = lightBadgeColors.includes(t.color) ? '#111' : '#fff';

    return `
      <tr class="${zone}">
        <td class="td-pos">${t.pos}</td>
        <td>
          <div class="td-team">
            <div class="td-badge" style="background:${t.color};color:${badgeText}">${t.abbr}</div>
            <span class="td-team-name">${t.name}</span>
          </div>
        </td>
        <td>${t.p}</td>
        <td>${t.w}</td>
        <td>${t.d}</td>
        <td>${t.l}</td>
        <td class="td-gd ${gdClass}">${gdStr}</td>
        <td class="td-pts">${t.pts}</td>
      </tr>`;
  }).join('');
}

/* ══════════════════════════════════════════════
   RENDER — TOP SCORERS
══════════════════════════════════════════════ */
function renderScorers() {
  const grid = document.getElementById('scorersGrid');
  if (!grid) return;

  const maxGoals = TOP_SCORERS[0].goals;

  grid.innerHTML = TOP_SCORERS.map(p => {
    const barW    = Math.round((p.goals / maxGoals) * 100);
    const rankCls = p.rank <= 3 ? `rank-${p.rank}` : '';
    const rowCls  = p.rank <= 3 ? 'top-3' : '';
    const lightColors = ['#FEBE10','#F8D400','#FDE100','#FDB913','#F5D300'];
    const badgeText = lightColors.includes(p.color) ? '#111' : '#fff';

    return `
      <div class="scorer-row ${rowCls}" style="animation:rowSlideIn 0.35s ease ${(p.rank-1)*0.055}s both">
        <span class="scorer-rank ${rankCls}">${p.rank}</span>
        <div class="scorer-avatar" style="background:${p.color};color:${badgeText}">${p.initials}</div>
        <div class="scorer-info">
          <div class="scorer-name">${p.name}</div>
          <div class="scorer-meta">
            <span>${p.clubEmoji} ${p.club}</span>
            <span>${p.flag}</span>
          </div>
        </div>
        <div class="scorer-stat-block">
          <span class="scorer-stat-value goals">${p.goals}</span>
          <span class="scorer-stat-label">Goals</span>
        </div>
        <div class="scorer-stat-block">
          <span class="scorer-stat-value assists">${p.assists}</span>
          <span class="scorer-stat-label">Assists</span>
        </div>
        <div class="scorer-bar-wrap">
          <div class="scorer-bar">
            <div class="scorer-bar-fill" style="width:0%" data-width="${barW}%"></div>
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════
   RENDER — MATCH STATS
══════════════════════════════════════════════ */
function renderMatchStats() {
  const list = document.getElementById('statsList');
  if (!list) return;

  list.innerHTML = MATCH_STATS_DATA.map(s => {
    const total  = s.home + s.away;
    const homeW  = total > 0 ? Math.round((s.home / total) * 100) : 50;
    const awayW  = 100 - homeW;
    const dispH  = s.isPercent ? `${s.home}%` : s.home;
    const dispA  = s.isPercent ? `${s.away}%` : s.away;

    return `
      <div class="stat-row">
        <span class="stat-val home">${dispH}</span>
        <div class="stat-bar-area">
          <div class="stat-name">${s.label}</div>
          <div class="dual-bar">
            <div class="bar-home" data-width="${homeW}%"></div>
            <div class="bar-away" data-width="${awayW}%"></div>
          </div>
        </div>
        <span class="stat-val away">${dispA}</span>
      </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════
   RENDER — NEWS
══════════════════════════════════════════════ */
function renderNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;

  grid.innerHTML = NEWS_DATA.map((n, i) => `
    <div class="news-card">
      <div class="news-img" style="background:${n.gradient}">
        <span class="news-league-tag"
          style="background:${n.tagColor}33;border:1px solid ${n.tagColor}88;color:#fff">
          ${n.tag}
        </span>
      </div>
      <div class="news-body">
        <div class="news-date"><i class="far fa-clock"></i>${n.date}</div>
        <h3 class="news-headline">${n.headline}</h3>
        <p class="news-excerpt">${n.excerpt}</p>
        <a href="#" class="news-read-btn">Read More <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>`).join('');
}

/* ══════════════════════════════════════════════
   INTERACTIONS
══════════════════════════════════════════════ */

/* ── Navbar scroll effect ─── */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = ['hero','scores','standings','players','stats','news'];

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 130) current = id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href').replace('#','') === current);
    });
  }, { passive: true });
}

/* ── Mobile menu ─── */
function initMobileMenu() {
  const btn   = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    btn.querySelector('i').className = 'fas fa-bars';
  }));
}

/* ── League tabs ─── */
function initLeagueTabs() {
  const container = document.getElementById('leagueTabs');
  if (!container) return;

  container.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn || !btn.dataset.league) return;

    container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    renderStandings(btn.dataset.league);
  });
}

/* ── Date navigation ─── */
function initDateNav(apiData) {
  document.getElementById('prevDay')?.addEventListener('click', () => {
    if (currentDayOffset > -1) { currentDayOffset--; renderScores(currentDayOffset, apiData); }
  });
  document.getElementById('nextDay')?.addEventListener('click', () => {
    if (currentDayOffset < 1)  { currentDayOffset++; renderScores(currentDayOffset, apiData); }
  });
}

/* ── Smooth anchor scrolling ─── */
function initAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth' }); }
    });
  });
}

/* ── Live button ─── */
function initLiveBtn() {
  document.getElementById('liveBtn')?.addEventListener('click', () => {
    document.getElementById('scores')?.scrollIntoView({ behavior:'smooth' });
  });
}

/* ── Scroll-triggered animations ─── */
function initScrollAnimations() {
  // Stats bars
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const row = entry.target;
      row.classList.add('visible');
      row.querySelector('.bar-home')?.style.setProperty('width', row.querySelector('.bar-home').dataset.width);
      row.querySelector('.bar-away')?.style.setProperty('width', row.querySelector('.bar-away').dataset.width);
      statsObserver.unobserve(row);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.stat-row').forEach(r => statsObserver.observe(r));

  // Scorer bars
  const scorerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target.querySelector('.scorer-bar-fill');
      if (fill) setTimeout(() => { fill.style.width = fill.dataset.width; }, 150);
      scorerObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.scorer-row').forEach(r => scorerObserver.observe(r));

  // Section reveals
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin:'0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ── Hero possession bar ─── */
function animateHero() {
  setTimeout(() => {
    const fill = document.querySelector('.poss-fill');
    if (fill) fill.style.width = '55%';
  }, 700);
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {

  // ── 1. Render all static sections immediately ──
  renderTicker();
  renderStandings('pl');   // default tab
  renderScorers();
  renderMatchStats();
  renderNews();

  // ── 2. Show loading state for scores ──
  setApiStatusBar('loading', 'Fetching live fixtures…');
  renderScores(0, null);   // show fallback while loading

  // ── 3. Init all interactions ──
  initNavbar();
  initMobileMenu();
  initLeagueTabs();
  initLiveBtn();
  initAnchorLinks();
  animateHero();

  // ── 4. Scroll animations (after DOM is populated) ──
  initScrollAnimations();

  // ── 5. Fetch live API data ──
  let apiData = null;
  try {
    const events = await fetchTodayFixtures();
    apiData = processApiEvents(events);

    if (apiData && apiData.length > 0) {
      setApiStatusBar('live-data', `Live data — ${events.length} fixtures loaded`);
      renderScores(0, apiData);
    } else {
      setApiStatusBar('fallback', 'Showing sample data (no fixtures returned by API for today)');
      renderScores(0, null);
    }
  } catch (err) {
    console.warn('API fetch failed:', err.message);
    setApiStatusBar('fallback', 'Showing sample data (API unavailable — check key or network)');
    renderScores(0, null);
  }

  // ── 6. Wire date buttons (pass apiData so Today uses live if available) ──
  initDateNav(apiData);

  // ── 7. Re-run scorer bar animations in case they're now in view ──
  setTimeout(initScrollAnimations, 300);
});
