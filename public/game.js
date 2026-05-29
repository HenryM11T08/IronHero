// ============================================================
//  IRON HERO — game.js  v2.0
//  Shared engine: data, state, streak, achievements, templates
// ============================================================

const SAVE_KEY     = 'ironhero_v4';
const MAX_LEVEL    = 10;
const XP_PER_LEVEL = [0,100,250,450,700,1000,1400,1900,2500,3200,4000];

const CLASS_NAMES = [
  'NOVICE LIFTER','IRON APPRENTICE','STEEL WARRIOR','POWER ATHLETE',
  'ELITE CHAMPION','LEGENDARY TITAN','MYTHIC COLOSSUS',
  'DIVINE IRON GOD','IMMORTAL LEGEND','OMEGA HERO'
];

// ─── EXERCISE DATA ───────────────────────
const EXERCISE_STATS = {
  'bench press':{str:3,end:1,agi:0,pow:2},'squat':{str:4,end:2,agi:1,pow:3},
  'deadlift':{str:5,end:2,agi:0,pow:4},'overhead press':{str:3,end:1,agi:1,pow:2},
  'barbell row':{str:3,end:2,agi:0,pow:2},'pull up':{str:2,end:3,agi:2,pow:1},
  'chin up':{str:2,end:3,agi:2,pow:1},'dumbbell curl':{str:2,end:1,agi:1,pow:1},
  'tricep dip':{str:2,end:2,agi:1,pow:1},'leg press':{str:3,end:2,agi:0,pow:2},
  'lunge':{str:2,end:2,agi:3,pow:1},'hip thrust':{str:4,end:2,agi:1,pow:2},
  'lat pulldown':{str:2,end:3,agi:1,pow:1},'cable fly':{str:2,end:1,agi:1,pow:2},
  'romanian deadlift':{str:4,end:2,agi:1,pow:3},'incline press':{str:3,end:1,agi:0,pow:2},
  'face pull':{str:1,end:2,agi:2,pow:1},'dumbbell row':{str:3,end:2,agi:1,pow:1},
  'run':{str:0,end:4,agi:4,pow:1},'sprint':{str:1,end:3,agi:5,pow:2},
  'burpee':{str:1,end:4,agi:3,pow:2},'push up':{str:2,end:3,agi:1,pow:1},
  'plank':{str:1,end:4,agi:1,pow:1},'box jump':{str:2,end:3,agi:4,pow:2},
  'jump rope':{str:0,end:4,agi:5,pow:1},'dip':{str:2,end:2,agi:1,pow:2},
};

// ─── BUILT-IN TEMPLATES ──────────────────
const BUILT_IN_TEMPLATES = [
  { id:'push', name:'PUSH DAY', icon:'💪', exercises:[
    {exercise:'Bench Press',weight:135,sets:4,reps:8},
    {exercise:'Overhead Press',weight:95,sets:3,reps:8},
    {exercise:'Incline Press',weight:95,sets:3,reps:10},
    {exercise:'Tricep Dip',weight:0,sets:3,reps:12},
    {exercise:'Cable Fly',weight:40,sets:3,reps:12},
  ]},
  { id:'pull', name:'PULL DAY', icon:'🔙', exercises:[
    {exercise:'Deadlift',weight:185,sets:4,reps:5},
    {exercise:'Barbell Row',weight:135,sets:4,reps:8},
    {exercise:'Pull Up',weight:0,sets:3,reps:8},
    {exercise:'Lat Pulldown',weight:100,sets:3,reps:10},
    {exercise:'Dumbbell Curl',weight:35,sets:3,reps:12},
    {exercise:'Face Pull',weight:40,sets:3,reps:15},
  ]},
  { id:'legs', name:'LEG DAY', icon:'🦵', exercises:[
    {exercise:'Squat',weight:185,sets:4,reps:6},
    {exercise:'Romanian Deadlift',weight:135,sets:3,reps:10},
    {exercise:'Leg Press',weight:270,sets:3,reps:12},
    {exercise:'Lunge',weight:50,sets:3,reps:10},
    {exercise:'Hip Thrust',weight:135,sets:3,reps:12},
  ]},
  { id:'cardio', name:'CARDIO BLAST', icon:'🏃', exercises:[
    {exercise:'Run',weight:0,sets:1,reps:20},
    {exercise:'Burpee',weight:0,sets:4,reps:15},
    {exercise:'Jump Rope',weight:0,sets:3,reps:30},
    {exercise:'Box Jump',weight:0,sets:3,reps:10},
    {exercise:'Sprint',weight:0,sets:6,reps:1},
  ]},
  { id:'fullbody', name:'FULL BODY', icon:'⚡', exercises:[
    {exercise:'Squat',weight:135,sets:3,reps:8},
    {exercise:'Bench Press',weight:115,sets:3,reps:8},
    {exercise:'Barbell Row',weight:115,sets:3,reps:8},
    {exercise:'Overhead Press',weight:75,sets:3,reps:8},
    {exercise:'Deadlift',weight:155,sets:2,reps:5},
  ]},
];

// ─── ACHIEVEMENT DEFINITIONS ─────────────
const ACHIEVEMENT_DEFS = [
  {id:'first_session', icon:'🏋', name:'FIRST REP',      desc:'Complete your first training session.',  check:s=>s.workouts.length>=1},
  {id:'sessions_10',   icon:'💪', name:'IRON HABIT',     desc:'Complete 10 training sessions.',         check:s=>s.workouts.length>=10},
  {id:'sessions_50',   icon:'🔥', name:'DEDICATED',      desc:'Complete 50 training sessions.',         check:s=>s.workouts.length>=50},
  {id:'sessions_100',  icon:'👑', name:'CENTURION',      desc:'Complete 100 training sessions.',        check:s=>s.workouts.length>=100},
  {id:'streak_3',      icon:'🔥', name:'ON FIRE',        desc:'Train 3 days in a row.',                 check:s=>(s.streak||0)>=3},
  {id:'streak_7',      icon:'⚡', name:'WEEKLY WARRIOR', desc:'Train 7 days in a row.',                 check:s=>(s.streak||0)>=7},
  {id:'streak_30',     icon:'🌟', name:'UNSTOPPABLE',    desc:'Train 30 days in a row.',                check:s=>(s.streak||0)>=30},
  {id:'level_5',       icon:'⭐', name:'RISING STAR',    desc:'Reach Level 5.',                         check:s=>s.hero.level>=5},
  {id:'level_10',      icon:'🏆', name:'OMEGA HERO',     desc:'Reach maximum level 10.',                check:s=>s.hero.level>=10},
  {id:'first_pr',      icon:'🥇', name:'PERSONAL BEST',  desc:'Set your first personal record.',        check:s=>Object.keys(s.prs).length>=1},
  {id:'prs_10',        icon:'🎯', name:'RECORD BREAKER', desc:'Set 10 personal records.',               check:s=>Object.keys(s.prs).length>=10},
  {id:'bench_225',     icon:'🏅', name:'PLATE CLUB',     desc:'Bench press 225 lbs.',                   check:s=>{const p=s.prs['bench press']||s.prs['Bench Press'];return p&&p.weight>=225;}},
  {id:'squat_315',     icon:'🦵', name:'SQUAT BEAST',    desc:'Squat 315 lbs.',                         check:s=>{const p=s.prs['squat']||s.prs['Squat'];return p&&p.weight>=315;}},
  {id:'deadlift_405',  icon:'💀', name:'DEADLIFT GOD',   desc:'Deadlift 405 lbs.',                      check:s=>{const p=s.prs['deadlift']||s.prs['Deadlift'];return p&&p.weight>=405;}},
  {id:'first_boss',    icon:'⚔', name:'BOSS SLAYER',    desc:'Defeat your first boss.',                check:s=>s.defeatedBosses.length>=1},
  {id:'all_bosses',    icon:'💀', name:'GAUNTLET CLEAR', desc:'Defeat all 5 bosses.',                   check:s=>s.defeatedBosses.length>=5},
  {id:'first_skill',   icon:'✨', name:'AWAKENED',       desc:'Unlock your first skill.',               check:s=>s.unlockedSkills.length>=1},
  {id:'all_skills',    icon:'🌟', name:'MASTER OF ALL',  desc:'Unlock all 16 skills.',                  check:s=>s.unlockedSkills.length>=16},
  {id:'xp_1000',       icon:'⚡', name:'POWER SURGE',    desc:'Earn 1,000 total XP.',                   check:s=>(s.hero.totalXP||0)>=1000},
  {id:'xp_10000',      icon:'🌩', name:'LIGHTNING ROD',  desc:'Earn 10,000 total XP.',                  check:s=>(s.hero.totalXP||0)>=10000},
  {id:'named_hero',    icon:'✏️', name:'MY HERO',        desc:'Give your hero a custom name.',          check:s=>s.hero.name!=='HERO'&&s.hero.name.trim()!==''},
  {id:'logged_weight', icon:'⚖️', name:'WEIGH IN',       desc:'Log your body weight for the first time.',check:s=>(s.bodyWeightLog||[]).length>=1},
];

// ─── SKILL TREES ─────────────────────────
const SKILL_TREES = [
  {id:'strength',name:'IRON WILL',icon:'💪',color:'#ff5722',desc:'Raw power & heavy lifting mastery',skills:[
    {id:'s1',name:'IRON GRIP',  icon:'🤜',cost:1,req:null,desc:'Lifting heavy becomes effortless.',  effect:'+15% STR gains.',           apply:sb=>{sb.strMult=(sb.strMult||1)*1.15;}},
    {id:'s2',name:'POWER SURGE',icon:'⚡', cost:2,req:'s1',desc:'Your muscles remember every rep.',  effect:'+25% XP from strength.',    apply:sb=>{sb.strXpMult=(sb.strXpMult||1)*1.25;}},
    {id:'s3',name:'BERSERKER',  icon:'🔥',cost:3,req:'s2',desc:'Fury amplifies every strike.',        effect:'+30% boss damage.',         apply:sb=>{sb.bossDmgMult=(sb.bossDmgMult||1)*1.3;}},
    {id:'s4',name:'TITAN FORM', icon:'🗻',cost:4,req:'s3',desc:'You have become immovable.',          effect:'+60 Max HP, +40% STR.',     apply:sb=>{sb.maxHpBonus=(sb.maxHpBonus||0)+60;sb.strMult=(sb.strMult||1)*1.4;}},
  ]},
  {id:'endurance',name:'IRON LUNG',icon:'🛡',color:'#00bcd4',desc:'Stamina & defense mastery',skills:[
    {id:'e1',name:'SECOND WIND', icon:'🌬',cost:1,req:null,desc:'You recover faster than anyone.',    effect:'+8 HP per set logged.',     apply:sb=>{sb.hpPerSet=(sb.hpPerSet||5)+8;}},
    {id:'e2',name:'STEEL SKIN',  icon:'🛡',cost:2,req:'e1',desc:'You shrug off punishment.',          effect:'-20% boss damage taken.',   apply:sb=>{sb.dmgReduction=(sb.dmgReduction||0)+0.2;}},
    {id:'e3',name:'MARATHON MAN',icon:'🏃',cost:3,req:'e2',desc:'Distance is nothing to you.',        effect:'+30% END & AGI from cardio.',apply:sb=>{sb.cardioMult=(sb.cardioMult||1)*1.3;}},
    {id:'e4',name:'UNDYING',     icon:'💚',cost:4,req:'e3',desc:'You refuse to fall.',                effect:'Survive fatal hit at 1 HP.',apply:sb=>{sb.undying=true;}},
  ]},
  {id:'agility',name:'PHANTOM STEP',icon:'⚡',color:'#cddc39',desc:'Speed & evasion mastery',skills:[
    {id:'a1',name:'QUICK FEET', icon:'👟',cost:1,req:null,desc:'Always first to act.',               effect:'Attack before boss.',       apply:sb=>{sb.goFirst=true;}},
    {id:'a2',name:'DODGE ROLL', icon:'🌀',cost:2,req:'a1',desc:'You slip past any attack.',          effect:'15% dodge chance.',         apply:sb=>{sb.dodgeChance=(sb.dodgeChance||0)+0.15;}},
    {id:'a3',name:'FLURRY',     icon:'💨',cost:3,req:'a2',desc:'Strike before they blink.',          effect:'25% double-strike.',        apply:sb=>{sb.doubleStrike=(sb.doubleStrike||0)+0.25;}},
    {id:'a4',name:'SHADOW FORM',icon:'🌑',cost:4,req:'a3',desc:'You become the darkness.',           effect:'+30% dodge, +50% AGI.',     apply:sb=>{sb.dodgeChance=(sb.dodgeChance||0)+0.3;sb.agiMult=(sb.agiMult||1)*1.5;}},
  ]},
  {id:'power',name:'ARCANE IRON',icon:'🔥',color:'#e040fb',desc:'Mystical power & special attacks',skills:[
    {id:'p1',name:'ENERGY BLAST',icon:'💥',cost:1,req:null,desc:'Unleash raw arcane energy.',        effect:'Unlocks BLAST (3x dmg).',   apply:sb=>{sb.hasBlast=true;}},
    {id:'p2',name:'IRON AURA',   icon:'✨',cost:2,req:'p1',desc:'Power radiates from your core.',    effect:'+20% ALL stat gains.',      apply:sb=>{sb.strMult=(sb.strMult||1)*1.2;sb.endMult=(sb.endMult||1)*1.2;sb.agiMult=(sb.agiMult||1)*1.2;sb.powMult=(sb.powMult||1)*1.2;}},
    {id:'p3',name:'MEGA STRIKE', icon:'🌩',cost:3,req:'p2',desc:'A strike felt across realms.',      effect:'Unlocks MEGA (5x dmg).',    apply:sb=>{sb.hasMega=true;}},
    {id:'p4',name:'OMEGA FORCE', icon:'🌀',cost:4,req:'p3',desc:'You have transcended all limits.',  effect:'All bonuses x1.5, +100 HP.',apply:sb=>{sb.maxHpBonus=(sb.maxHpBonus||0)+100;Object.keys(sb).forEach(k=>{if(k.endsWith('Mult')&&sb[k]>1)sb[k]=1+(sb[k]-1)*1.5;});sb.dodgeChance=Math.min((sb.dodgeChance||0)*1.5,0.65);}},
  ]},
];

// ─── BOSSES ──────────────────────────────
const BOSSES = [
  {id:'b1',name:'THE IRON SLOTH',  icon:'🦥',levelReq:1,hp:120, atk:12,def:4, xpReward:80, spReward:1,specialType:'stun',  special:'Laziness Aura: You lose your next turn.',          specialChance:.20},
  {id:'b2',name:'CARBON CRUSHER',  icon:'🤖',levelReq:2,hp:220, atk:22,def:9, xpReward:160,spReward:1,specialType:'dmgx2', special:'Power Overload: Deals 2x damage.',                 specialChance:.25},
  {id:'b3',name:'BEAST OF BULK',   icon:'🦍',levelReq:4,hp:400, atk:38,def:17,xpReward:280,spReward:2,specialType:'debuff',special:'Primal Roar: Reduces your ATK by 30% for 2 turns.',specialChance:.28},
  {id:'b4',name:'SHADOW TITAN',    icon:'👹',levelReq:6,hp:650, atk:58,def:27,xpReward:450,spReward:2,specialType:'triple',special:'Shadow Crush: Hits 3 times for 40% each.',         specialChance:.30},
  {id:'b5',name:'OMEGA DESTROYER', icon:'💀',levelReq:9,hp:1000,atk:90,def:44,xpReward:800,spReward:3,specialType:'dmgx4', special:'Annihilation: 4x obliteration strike.',            specialChance:.32},
];

// ─── STATE ───────────────────────────────
function defaultState() {
  return {
    hero:{name:'HERO',level:1,xp:0,hp:100,maxHp:100,str:1,end:1,agi:1,pow:1,totalXP:0,skillPoints:0},
    workouts:[],prs:{},unlockedSkills:[],skillBonuses:{},defeatedBosses:[],
    achievements:[],templates:[],bodyWeightLog:[],
    streak:0,lastTrainDate:null,longestStreak:0,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    const s   = raw ? JSON.parse(raw) : defaultState();
    if (!s.hero.skillPoints)     s.hero.skillPoints  = 0;
    if (!s.hero.totalXP)         s.hero.totalXP      = 0;
    if (!s.unlockedSkills)       s.unlockedSkills    = [];
    if (!s.skillBonuses)         s.skillBonuses      = {};
    if (!s.defeatedBosses)       s.defeatedBosses    = [];
    if (!s.achievements)         s.achievements      = [];
    if (!s.templates)            s.templates         = [];
    if (!s.bodyWeightLog)        s.bodyWeightLog     = [];
    if (s.streak===undefined)    s.streak            = 0;
    if (!s.lastTrainDate)        s.lastTrainDate     = null;
    if (!s.longestStreak)        s.longestStreak     = 0;
    return s;
  } catch(e) { return defaultState(); }
}

function saveState(s) { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); }

// ─── STREAK ──────────────────────────────
function updateStreak(s) {
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now()-86400000).toDateString();
  if (s.lastTrainDate===today) return;
  s.streak = s.lastTrainDate===yesterday ? (s.streak||0)+1 : 1;
  s.lastTrainDate = today;
  s.longestStreak = Math.max(s.longestStreak||0, s.streak);
}

// ─── ACHIEVEMENT CHECK ───────────────────
function checkAchievements(s) {
  const unlocked = [];
  ACHIEVEMENT_DEFS.forEach(def => {
    if (!s.achievements.includes(def.id)) {
      try { if (def.check(s)) { s.achievements.push(def.id); unlocked.push(def); } } catch(e){}
    }
  });
  return unlocked;
}

// ─── SKILL BONUSES ───────────────────────
function rebuildSkillBonuses(s) {
  const sb = {};
  s.unlockedSkills.forEach(sid => {
    SKILL_TREES.forEach(tree => { const sk=tree.skills.find(x=>x.id===sid); if(sk) sk.apply(sb); });
  });
  s.skillBonuses = sb;
  s.hero.maxHp   = 100+s.hero.level*20+(sb.maxHpBonus||0);
  s.hero.hp      = Math.min(s.hero.hp, s.hero.maxHp);
  return s;
}

// ─── CALCULATIONS ────────────────────────
function calcXP(weight, sets, reps, exercise, sb) {
  const base  = Math.round(weight*.1+sets*5+reps*2+(weight*sets*reps)*.005);
  const key   = (exercise||'').toLowerCase();
  const isStr = ['bench press','squat','deadlift','overhead press'].some(e=>key.includes(e));
  return Math.round(base*(isStr?(sb.strXpMult||1):1));
}

function getStatGains(exercise, weight, sets, reps, sb) {
  const key      = exercise.toLowerCase().trim();
  const base     = EXERCISE_STATS[key]||{str:1,end:1,agi:1,pow:1};
  const volume   = (weight/100)+(sets*.3)+(reps*.1);
  const mult     = Math.max(.5,Math.min(volume,4));
  const isCardio = ['run','sprint','burpee','jump rope','box jump'].some(c=>key.includes(c));
  const cm       = isCardio?(sb.cardioMult||1):1;
  return {
    str:Math.round(base.str*mult*(sb.strMult||1)),
    end:Math.round(base.end*mult*(sb.endMult||1)*cm),
    agi:Math.round(base.agi*mult*(sb.agiMult||1)*cm),
    pow:Math.round(base.pow*mult*(sb.powMult||1)),
  };
}

function applyLevelUps(s) {
  const sb=s.skillBonuses; let up=false;
  while(s.hero.level<MAX_LEVEL){
    const needed=XP_PER_LEVEL[s.hero.level]||99999;
    if(s.hero.xp>=needed){s.hero.xp-=needed;s.hero.level++;s.hero.maxHp=100+s.hero.level*20+(sb.maxHpBonus||0);s.hero.hp=s.hero.maxHp;s.hero.skillPoints++;up=true;}
    else break;
  }
  return up;
}

// ─── CHARACTER SVG ───────────────────────
function buildCharSVG(level, width, height) {
  width=width||120; height=height||160;
  const aw=22+Math.min(level*3,24), ax=Math.max(2,10-Math.min(level*1.5,10));
  const arx=90-Math.min(level*1.5,4), tw=60+Math.min(level*3,24), tx=60-tw/2;
  const aC=['#1a2040','#1a2550','#1a2a58','#1e2f60','#202060','#221868','#241070','#260878','#28007a','#2a007c'];
  const tC=['#1e2a5e','#1e3a6e','#1a3a5a','#1a2a5a','#2a1a5e','#3a1a5e','#4a1a5e','#5a1a4e','#6a1a3e','#7a0a2e'];
  const tc=tC[Math.min(level-1,tC.length-1)], ac=aC[Math.min(level-1,aC.length-1)];
  const auraOp=level>=5?Math.min((level-4)*.15,.8):0;
  const auraColor=level>=8?'#ffd700':'#00e5ff';
  const eyeColor=level>=7?'#00e5ff':'#1a2040';
  const glow=level>=5?`drop-shadow(0 0 ${6+level*2}px ${auraColor}60)`:'drop-shadow(0 0 8px rgba(0,229,255,.3))';
  return `<svg viewBox="0 0 120 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="filter:${glow}">
    <ellipse cx="60" cy="80" rx="54" ry="68" fill="none" stroke="${auraColor}" stroke-width="1.5" stroke-dasharray="4 4" opacity="${auraOp}"/>
    <rect x="38" y="110" width="18" height="36" rx="4" fill="#1a2040"/><rect x="64" y="110" width="18" height="36" rx="4" fill="#1a2040"/>
    <rect x="34" y="136" width="22" height="10" rx="3" fill="#0d1020"/><rect x="64" y="136" width="22" height="10" rx="3" fill="#0d1020"/>
    <rect x="${tx}" y="60" width="${tw}" height="55" rx="8" fill="${tc}"/>
    <rect x="${tx+10}" y="68" width="${tw-20}" height="6" rx="2" fill="rgba(255,255,255,.12)"/>
    <rect x="${ax}" y="62" width="${aw}" height="42" rx="8" fill="${ac}"/>
    <rect x="${arx}" y="62" width="${aw}" height="42" rx="8" fill="${ac}"/>
    <circle cx="${ax+aw/2}" cy="107" r="8" fill="#e0c090"/><circle cx="${arx+aw/2}" cy="107" r="8" fill="#e0c090"/>
    <rect x="48" y="46" width="24" height="18" rx="4" fill="#e0c090"/>
    <ellipse cx="60" cy="36" rx="28" ry="30" fill="#e0c090"/>
    <ellipse cx="50" cy="32" rx="5" ry="6" fill="white"/><ellipse cx="70" cy="32" rx="5" ry="6" fill="white"/>
    <circle cx="51" cy="33" r="3" fill="${eyeColor}"/><circle cx="71" cy="33" r="3" fill="${eyeColor}"/>
    <rect x="44" y="25" width="13" height="3" rx="1.5" fill="#6a4020"/><rect x="63" y="25" width="13" height="3" rx="1.5" fill="#6a4020"/>
    <path d="M 52 44 Q 60 50 68 44" stroke="#8a5030" stroke-width="2" fill="none"/>
    <ellipse cx="60" cy="10" rx="26" ry="12" fill="#2a1a0a"/>
    <text x="60" y="95" text-anchor="middle" font-family="'Press Start 2P',monospace" font-size="7" fill="#ffd700">LVL ${level}</text>
  </svg>`;
}

// ─── SHARED CSS ──────────────────────────
const SHARED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Exo+2:wght@400;600;700;900&display=swap');
:root{--bg:#0a0c18;--panel:#111320;--panel2:#161928;--border:#1c2040;--accent:#00e5ff;--gold:#ffd700;--hp:#00e676;--xp:#aa00ff;--fire:#ff6d00;--red:#ff1744;--white:#e8eaf6;--dim:#3a4070;--str:#ff5722;--end:#00bcd4;--agi:#cddc39;--pow:#e040fb;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--white);font-family:'Exo 2',sans-serif;min-height:100vh;}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:radial-gradient(1px 1px at 12% 22%,rgba(0,229,255,.30) 0%,transparent 100%),radial-gradient(1px 1px at 38% 78%,rgba(170,0,255,.20) 0%,transparent 100%),radial-gradient(1px 1px at 67% 38%,rgba(0,229,255,.18) 0%,transparent 100%),radial-gradient(1px 1px at 88% 62%,rgba(255,215,0,.22) 0%,transparent 100%),radial-gradient(1px 1px at 52% 12%,rgba(0,229,255,.16) 0%,transparent 100%),radial-gradient(1px 1px at 23% 57%,rgba(255,109,0,.14) 0%,transparent 100%);}
.page{max-width:1100px;margin:0 auto;padding:28px 20px 80px;position:relative;z-index:1;}
nav{background:var(--panel);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;padding:0 20px;}
.nav-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;height:54px;gap:0;}
.nav-logo{font-family:'Press Start 2P',monospace;font-size:.85rem;color:var(--accent);text-shadow:0 0 16px rgba(0,229,255,.5);text-decoration:none;margin-right:20px;white-space:nowrap;flex-shrink:0;}
.nav-logo span{color:var(--gold);}
.nav-links{display:flex;flex:1;align-items:center;height:100%;gap:1px;overflow-x:auto;}
.nav-link{display:flex;align-items:center;height:100%;padding:0 11px;font-family:'Press Start 2P',monospace;font-size:.38rem;color:var(--dim);text-decoration:none;letter-spacing:.05em;border-bottom:2px solid transparent;transition:all .15s;gap:5px;white-space:nowrap;}
.nav-link:hover{color:var(--white);border-bottom-color:var(--accent);}
.nav-link.active{color:var(--accent);border-bottom-color:var(--accent);}
.nav-right{display:flex;align-items:center;gap:7px;margin-left:auto;flex-shrink:0;}
.nav-sp{font-family:'Press Start 2P',monospace;font-size:.36rem;color:var(--gold);background:rgba(255,215,0,.07);border:1px solid rgba(255,215,0,.2);padding:5px 9px;}
.nav-streak{font-family:'Press Start 2P',monospace;font-size:.36rem;color:var(--fire);background:rgba(255,109,0,.07);border:1px solid rgba(255,109,0,.2);padding:5px 9px;}
.page-header{margin-bottom:26px;padding-bottom:16px;border-bottom:1px solid var(--border);}
.page-header h1{font-family:'Press Start 2P',monospace;font-size:.9rem;color:var(--white);margin-bottom:7px;}
.page-header p{font-size:.72rem;color:var(--dim);line-height:1.6;}
.card{background:var(--panel);border:1px solid var(--border);padding:20px;}
.card.gold{border-top:2px solid var(--gold);}.card.accent{border-top:2px solid var(--accent);}.card.fire{border-top:2px solid var(--fire);}.card.xp{border-top:2px solid var(--xp);}.card.str{border-top:2px solid var(--str);}.card.end{border-top:2px solid var(--end);}
.card-title{font-family:'Press Start 2P',monospace;font-size:.5rem;color:var(--gold);letter-spacing:.1em;margin-bottom:16px;}
.bar-wrap{margin-bottom:10px;}.bar-label{display:flex;justify-content:space-between;font-size:.55rem;margin-bottom:4px;}
.bar-track{height:8px;background:rgba(255,255,255,.04);border:1px solid var(--border);overflow:hidden;}
.bar-fill{height:100%;transition:width .6s cubic-bezier(.4,0,.2,1);}
.bar-xp .bar-fill{background:linear-gradient(90deg,var(--xp),#e040fb);}.bar-hp .bar-fill{background:linear-gradient(90deg,#00c853,var(--hp));}
.stat-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}.stat-icon{font-size:.9rem;width:22px;text-align:center;}
.stat-name{font-size:.6rem;color:var(--dim);width:55px;text-transform:uppercase;letter-spacing:.05em;}
.stat-bar-track{flex:1;height:6px;background:rgba(255,255,255,.04);border:1px solid var(--border);overflow:hidden;}
.stat-bar-fill{height:100%;transition:width .8s cubic-bezier(.4,0,.2,1);}
.stat-val{font-family:'Press Start 2P',monospace;font-size:.42rem;width:30px;text-align:right;}
.str-fill{background:var(--str);}.end-fill{background:var(--end);}.agi-fill{background:var(--agi);}.pow-fill{background:var(--pow);}
.field{display:flex;flex-direction:column;gap:5px;}
.field label{font-size:.55rem;color:var(--dim);letter-spacing:.12em;text-transform:uppercase;}
.field input,.field select{background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--white);font-family:'Exo 2',sans-serif;font-size:.85rem;padding:9px 12px;outline:none;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none;appearance:none;}
.field input:focus,.field select:focus{border-color:var(--accent);box-shadow:0 0 0 2px rgba(0,229,255,.1);}
.field select option{background:var(--panel);}
.btn{display:inline-block;border:none;font-family:'Press Start 2P',monospace;cursor:pointer;transition:all .15s;text-align:center;letter-spacing:.06em;}
.btn-primary{background:linear-gradient(135deg,var(--accent),#006064);color:#000;font-size:.6rem;padding:13px 20px;box-shadow:0 0 16px rgba(0,229,255,.22);}
.btn-primary:hover{box-shadow:0 0 28px rgba(0,229,255,.45);opacity:.92;}.btn-primary:active{transform:scale(.98);}
.btn-ghost{background:var(--panel2);border:1px solid var(--border);color:var(--white);font-size:.42rem;padding:9px 16px;}
.btn-ghost:hover{border-color:var(--accent);}
.btn-danger{background:none;border:1px solid var(--red);color:var(--red);font-size:.38rem;padding:7px 12px;}
.btn-danger:hover{background:rgba(255,23,68,.08);}
.ach-popup{position:fixed;top:16px;right:16px;background:var(--panel);border:1px solid var(--gold);box-shadow:0 0 28px rgba(255,215,0,.22);padding:13px 16px;max-width:260px;transform:translateX(300px);opacity:0;transition:transform .4s cubic-bezier(.175,.885,.32,1.275),opacity .4s;z-index:1000;}
.ach-popup.show{transform:translateX(0);opacity:1;}
.ach-label{font-family:'Press Start 2P',monospace;font-size:.38rem;color:var(--gold);letter-spacing:.15em;margin-bottom:5px;}
.ach-title{font-family:'Press Start 2P',monospace;font-size:.52rem;color:var(--white);line-height:1.5;}
.ach-desc{font-size:.66rem;color:var(--dim);margin-top:3px;}
table{width:100%;border-collapse:collapse;font-size:.72rem;}
th{text-align:left;padding:8px 12px;font-size:.5rem;color:var(--dim);letter-spacing:.15em;text-transform:uppercase;border-bottom:1px solid var(--border);font-weight:400;}
td{padding:8px 12px;color:var(--white);border-bottom:1px solid rgba(255,255,255,.03);}
tbody tr:hover{background:rgba(255,255,255,.02);}
.empty-state{text-align:center;padding:32px;font-size:.58rem;color:var(--dim);letter-spacing:.15em;text-transform:uppercase;border:1px dashed var(--border);}
.mini-char{display:flex;align-items:center;gap:16px;margin-bottom:22px;padding:14px 18px;}
.mini-char-sprite{width:60px;height:80px;flex-shrink:0;}.mini-char-info{flex:1;min-width:0;}
.mini-char-name{font-family:'Press Start 2P',monospace;font-size:.6rem;color:var(--gold);}
.mini-char-class{font-size:.6rem;color:var(--dim);margin:3px 0 8px;}
.mini-char-badge{font-family:'Press Start 2P',monospace;font-size:.45rem;background:var(--gold);color:#000;padding:2px 7px;display:inline-block;}
.mini-char-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;flex-shrink:0;}
.mini-stat{display:flex;align-items:center;gap:5px;font-size:.6rem;}
.mini-stat-val{font-family:'Press Start 2P',monospace;font-size:.42rem;margin-left:auto;}
@media(max-width:680px){.mini-char{flex-wrap:wrap;}.mini-char-stats{grid-template-columns:repeat(4,1fr);width:100%;}.nav-link .nav-lbl{display:none;}}
`;

// ─── NAV HTML ────────────────────────────
function navHTML(activePage) {
  const pages = [
    {href:'index.html',        icon:'⚔',  label:'TRAIN'},
    {href:'skills.html',       icon:'🌳',  label:'SKILLS'},
    {href:'boss.html',         icon:'💀',  label:'BOSS'},
    {href:'log.html',          icon:'📜',  label:'LOG'},
    {href:'achievements.html', icon:'🏆',  label:'ACHIEVEMENTS'},
  ];
  return `<nav><div class="nav-inner">
    <a class="nav-logo" href="index.html">IRON<span>HERO</span></a>
    <div class="nav-links">
      ${pages.map(p=>`<a href="${p.href}" class="nav-link${p.href===activePage?' active':''}">${p.icon} <span class="nav-lbl">${p.label}</span></a>`).join('')}
    </div>
    <div class="nav-right">
      <div class="nav-streak" id="navStreak">🔥 0</div>
      <div class="nav-sp" id="navSP">✦ 0 SP</div>
    </div>
  </div></nav>`;
}

function updateNavCounters(s) {
  const sp  = document.getElementById('navSP');
  const str = document.getElementById('navStreak');
  if (sp)  sp.textContent  = '✦ ' + s.hero.skillPoints + ' SP';
  if (str) str.textContent = '🔥 ' + (s.streak||0);
}

// ─── MINI CHAR WIDGET ────────────────────
function miniCharHTML() {
  return `<div class="mini-char card accent" id="miniChar">
    <div class="mini-char-sprite" id="miniSprite"></div>
    <div class="mini-char-info">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
        <span class="mini-char-name" id="mcName">HERO</span>
        <span class="mini-char-badge" id="mcBadge">LVL 1</span>
      </div>
      <div class="mini-char-class" id="mcClass">NOVICE LIFTER</div>
      <div class="bar-wrap" style="margin-bottom:6px;">
        <div class="bar-label"><span style="color:var(--hp)">❤ HP</span><span style="color:var(--dim)" id="mcHpTxt">100/100</span></div>
        <div class="bar-track bar-hp"><div class="bar-fill" id="mcHpBar" style="width:100%"></div></div>
      </div>
      <div class="bar-wrap" style="margin-bottom:0">
        <div class="bar-label"><span style="color:var(--xp)">⚡ XP</span><span style="color:var(--dim)" id="mcXpTxt">0/100</span></div>
        <div class="bar-track bar-xp"><div class="bar-fill" id="mcXpBar" style="width:0%"></div></div>
      </div>
    </div>
    <div class="mini-char-stats" id="mcStats"></div>
  </div>`;
}

function renderMiniChar(s) {
  const h=s.hero, l=h.level, xpNeeded=l<MAX_LEVEL?XP_PER_LEVEL[l]:9999;
  const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
  const setp=(id,pct)=>{const el=document.getElementById(id);if(el)el.style.width=Math.min(pct,100)+'%';};
  set('mcName',h.name); set('mcBadge','LVL '+l);
  set('mcClass',CLASS_NAMES[Math.min(l-1,CLASS_NAMES.length-1)]);
  set('mcHpTxt',h.hp+'/'+h.maxHp); set('mcXpTxt',h.xp+'/'+xpNeeded);
  setp('mcHpBar',h.hp/h.maxHp*100); setp('mcXpBar',h.xp/xpNeeded*100);
  const sprite=document.getElementById('miniSprite');
  if(sprite) sprite.innerHTML=buildCharSVG(l,60,80);
  const stats=document.getElementById('mcStats');
  if(stats) stats.innerHTML=[['💪','STR','var(--str)',h.str],['🛡','END','var(--end)',h.end],['⚡','AGI','var(--agi)',h.agi],['🔥','PWR','var(--pow)',h.pow]]
    .map(([ic,nm,cl,v])=>`<div class="mini-stat"><span>${ic}</span><span style="color:var(--dim)">${nm}</span><span class="mini-stat-val" style="color:${cl}">${v}</span></div>`).join('');
  updateNavCounters(s);
}

// ─── ACHIEVEMENT TOAST QUEUE ─────────────
let _achQ=[], _achBusy=false;
function showAch(title, desc, icon) {
  _achQ.push({title,desc,icon:icon||'🏆'});
  if(!_achBusy) _nextAch();
}
function _nextAch() {
  if(!_achQ.length){_achBusy=false;return;}
  _achBusy=true;
  const {title,desc,icon}=_achQ.shift();
  const p=document.getElementById('achPopup'); if(!p){_achBusy=false;return;}
  document.getElementById('achTitle').textContent=title;
  document.getElementById('achDesc').textContent=desc;
  document.querySelector('.ach-label').textContent=icon+' ACHIEVEMENT';
  p.classList.add('show');
  setTimeout(()=>{p.classList.remove('show');setTimeout(_nextAch,400);},3600);
}

// ─── REST TIMER ──────────────────────────
let _restInt=null;
function startRestTimer(seconds, onDone) {
  clearRestTimer();
  let rem=seconds;
  const el=document.getElementById('restTimerDisplay');
  const update=()=>{
    if(el){el.textContent=_fmtTime(rem);el.style.color=rem<=10?'var(--red)':rem<=30?'var(--gold)':'var(--accent)';}
  };
  update();
  _restInt=setInterval(()=>{rem--;update();if(rem<=0){clearRestTimer();if(el){el.textContent='GO!';el.style.color='var(--hp)';}if(onDone)onDone();}},1000);
}
function clearRestTimer(){if(_restInt){clearInterval(_restInt);_restInt=null;}}
function _fmtTime(s){const m=Math.floor(s/60);return(m>0?m+':':'')+String(s%60).padStart(2,'0');}

// ─── COMMON EXERCISES ────────────────────
function commonExercises() {
  return Object.keys(EXERCISE_STATS).map(e=>e.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '));
}