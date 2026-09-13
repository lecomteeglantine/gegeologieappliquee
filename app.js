const AUDIO = {
  GG01:["assets/audio/gerard/gg01.mp3","Bonsoir à toutes et à toutes"],
  GG02:["assets/audio/gerard/gg02.mp3","Bon ben…"],
  GG03:["assets/audio/gerard/gg03.mp3","Bon ben c’est bien"],
  GG04:["assets/audio/gerard/gg04.mp3","C’est ça, t’as raison"],
  GG05:["assets/audio/gerard/gg05.mp3","Euh, euh"],
  GG06:["assets/audio/gerard/gg06.mp3","Euuuuuh…"],
  GG07:["assets/audio/gerard/gg07.mp3","Nan nan nan, attends attends"],
  GG08:["assets/audio/gerard/gg08.mp3","C’est impossib’"],
  GG09:["assets/audio/gerard/gg09.mp3","C’est moi qui commande"],
  GG10:["assets/audio/gerard/gg10.mp3","Vous commencez à m’énerver"],
  GG11:["assets/audio/gerard/gg11.mp3","C’est quoi c’te bordel que tu m’fais"],
  GG12:["assets/audio/gerard/gg12.mp3","Je vous préviens le standard"],
  GG13:["assets/audio/gerard/gg13.mp3","Manuuuuu"],
  GG14:["assets/audio/gerard/gg14.mp3","Au revoir !"],
  GG15:["assets/audio/gerard/gg15.mp3","… tu dégages"],
  GG16:["assets/audio/gerard/gg16.mp3","Allez hop, moi j’arrête"],
  GG17:["assets/audio/gerard/gg17.mp3","C’est simple, c’est clair et net, ça va aller vite"],
  GG18:["assets/audio/gerard/gg18.mp3","OK, point final à la ligne"],
  GG19:["assets/audio/gerard/gg19.mp3","J’ai mal entendu"],
  GG20:["assets/audio/gerard/gg20.mp3","Oh là là"],
  GG21:["assets/audio/gerard/gg21.mp3","Par moments je me demande…"],
  GG22:["assets/audio/gerard/gg22.mp3","Si j’serais pas intelligent…"],
  GG23:["assets/audio/gerard/gg23.mp3","Phildaaaaar !"],
  GG24:["assets/audio/gerard/gg24.mp3","Putain le larsen…"],
  TEAM01:["assets/audio/team/team01.mp3","Manu — OK"],
  TEAM02:["assets/audio/team/team02.mp3","Manu — c’est pas possible"],
  TEAM03:["assets/audio/team/team03.mp3","Phildar — faire gueuler le moustachu"],
  TEAM04:["assets/audio/team/team04.mp3","Manu — Oui, vous êtes sur Fun. Bonsoir Trevor."],
  TEAM06:["assets/audio/team/team06.mp3","Manu — Oui, vous êtes sur Fun."],
  TEAM07:["assets/audio/team/team07.mp3","Manu — Variante 2 du standard"],
  TEAM05:["assets/audio/team/team05.mp3","Manu — On accueille, tu le reprends…"],
  EURO01:["assets/audio/euro/euro01_faux_serieux.mp3","Extrait authentique · débat sur l’euro · faux sérieux"],
  EURO02:["assets/audio/euro/euro02_montee_tension.mp3","Extrait authentique · débat sur l’euro · montée de tension"],
};

// v1.6: embedded audio first, local MP3 paths remain as a backup.
if(window.EMBEDDED_AUDIO){
  Object.entries(AUDIO).forEach(([id,meta])=>{
    if(window.EMBEDDED_AUDIO[id]) meta[0]=window.EMBEDDED_AUDIO[id];
  });
}

const SAVE_KEY = "devenirHabituel_euro_v20";
const META_KEY = "devenirHabituel_euro_meta_v20";
const DEFAULT = {
  scene:"intro",
  checkpoint:"intro",
  standard:30,
  fun:0,
  reputation:0,
  grille:0,
  gege:65,
  gerbes:0,
  pseudo:"",
  city:"",
  age:"",
  first:"",
  second:"",
  technique:false,
  tipStandard:false,
  tonyFile:false,
  muted:false,
  chapterComplete:false,
  soundReady:false,
  reactions:{},
  clock:"23:56"
};

let state = loadState();
let audioToken = 0;

const el = {
  screen:document.getElementById("screen"),
  visualLayer:document.getElementById("visualLayer"),
  clock:document.getElementById("clock"),
  standardStatus:document.getElementById("standardStatus"),
  gegeStatus:document.getElementById("gegeStatus"),
  reputationStatus:document.getElementById("reputationStatus"),
  gerbesCount:document.getElementById("gerbesCount"),
  onairBox:document.getElementById("onairBox"),
  onairText:document.getElementById("onairText"),
  wave:document.getElementById("wave"),
  soundToggle:document.getElementById("soundToggle"),
  restartBtn:document.getElementById("restartBtn"),
  modal:document.getElementById("modal"),
  modalKicker:document.getElementById("modalKicker"),
  modalTitle:document.getElementById("modalTitle"),
  modalText:document.getElementById("modalText"),
  modalActions:document.getElementById("modalActions"),
  toast:document.getElementById("toast")
};

function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    return {...DEFAULT,...saved,reactions:{...DEFAULT.reactions,...(saved?.reactions||{})}};
  }catch(e){return {...DEFAULT};}
}
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(state));}
function loadMeta(){
  try{
    const saved = JSON.parse(localStorage.getItem(META_KEY));
    if(saved && Number.isFinite(saved.runCount) && saved.runCount>=1) return saved;
  }catch(e){}
  const fresh={runCount:1};
  localStorage.setItem(META_KEY,JSON.stringify(fresh));
  return fresh;
}
function saveMeta(meta){localStorage.setItem(META_KEY,JSON.stringify(meta));}
function incrementRunCount(){
  const meta=loadMeta();
  meta.runCount=(meta.runCount||1)+1;
  saveMeta(meta);
  return meta.runCount;
}
function currentRunCount(){return loadMeta().runCount||1;}
function currentManuIntroAudio(){return currentRunCount()%2===1?"TEAM06":"TEAM07";}
function currentManuIntroLine(){return currentRunCount()%2===1?"Oui, vous êtes sur Fun.":"Bonsoir, tu veux parler de quoi ?";}
function currentManuIntroLabel(){return currentRunCount()%2===1?"▶ ÉCOUTER MANU : « OUI, VOUS ÊTES SUR FUN »":"▶ ÉCOUTER MANU : « BONSOIR, TU VEUX PARLER DE QUOI ? »";}
function resetState(){
  ["devenirHabituel_euro_v1","devenirHabituel_euro_v12","devenirHabituel_euro_v13","devenirHabituel_euro_v14","devenirHabituel_euro_v15","devenirHabituel_euro_v16","devenirHabituel_euro_v17","devenirHabituel_euro_v18","devenirHabituel_euro_v19"].forEach(k=>localStorage.removeItem(k));
  incrementRunCount();
  state={...DEFAULT,reactions:{}};save();stopAudio();el.modal.classList.add("hidden");render();toast(`Progression remise à zéro. Piste Manu n°${currentRunCount()%2===1?1:2} pour cette partie.`);
}
function setScene(scene, checkpoint){state.scene=scene;if(checkpoint)state.checkpoint=checkpoint;save();render();}
function clamp(){state.standard=Math.max(0,Math.min(100,state.standard));state.fun=Math.max(0,Math.min(100,state.fun));state.reputation=Math.max(0,Math.min(100,state.reputation));state.gege=Math.max(0,Math.min(100,state.gege));state.grille=Math.max(0,Math.min(100,state.grille));}
function apply(delta={}){for(const [k,v] of Object.entries(delta)){if(typeof state[k]==="number")state[k]+=v;}clamp();save();updateHUD();}
function bumpReaction(id){state.reactions[id]=(state.reactions[id]||0)+1;save();}
function standardLabel(){if(state.standard>=70)return"PRIORITAIRE";if(state.standard>=45)return"À GARDER";if(state.standard>=38)return"À TESTER";return"INCONNU";}
function gegeLabel(){if(!["onair","debate"].includes(modeForScene(state.scene)))return"—";if(state.gege>=55)return"CALME";if(state.gege>=35)return"AGACÉ";if(state.gege>=16)return"CHAUD";return"ÇA VA PARTIR";}
function reputationLabel(){if(state.reputation>=45)return"ON JOUE AVEC TOI";if(state.reputation>=18)return"ON TE REMARQUE";if(state.reputation>0)return"UN PEU CONNU";return"—";}
function modeForScene(scene){
  const onair=["onair_intro","frequency","first_intervention","micro_archive","understood","tony_heat","risk","return_air","last_test","end_debate"];
  const waiting=["wait","offair"];
  if(onair.includes(scene))return"onair";
  if(waiting.includes(scene))return"waiting";
  return"offline";
}
function updateHUD(){
  el.clock.textContent=state.clock;
  el.standardStatus.textContent=standardLabel();
  el.gegeStatus.textContent=gegeLabel();
  el.reputationStatus.textContent=reputationLabel();
  el.gerbesCount.textContent=state.gerbes;
  const mode=modeForScene(state.scene);
  el.onairBox.classList.remove("live","waiting");
  if(mode==="onair"){el.onairBox.classList.add("live");el.onairText.textContent="ON AIR";}
  else if(mode==="waiting"){el.onairBox.classList.add("waiting");el.onairText.textContent=state.scene==="offair"?"OFF AIR":"EN ATTENTE";}
  else el.onairText.textContent="HORS LIGNE";
  el.soundToggle.textContent=state.muted?"SON : OFF":"SON : ON";
  el.soundToggle.setAttribute("aria-pressed",String(state.muted));
}
function esc(s=""){return s.replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));}
function choice(letter,text,small=""){
  return `<button class="choice" type="button" data-choice="${letter}"><span class="choice-key">${letter}</span><span>${text}${small?`<small>${small}</small>`:""}</span></button>`;
}
function bindChoices(map){Object.entries(map).forEach(([key,fn])=>{const b=el.screen.querySelector(`[data-choice="${key}"]`);if(b)b.addEventListener("click",fn);});}
let buttonSeq=0;
function btn(text,fn,cls="primary"){
  const id="b"+(++buttonSeq);
  setTimeout(()=>{document.getElementById(id)?.addEventListener("click",fn)},0);
  return `<button id="${id}" class="btn ${cls}" type="button">${text}</button>`;
}
function dialogue(speaker,text,kind=""){
  return `<div class="dialogue ${kind}"><div class="speaker">${speaker}</div><div>${text}</div></div>`;
}
function audioChip(id,tag="ARCHIVE AUTHENTIQUE"){const a=AUDIO[id];return `<button class="audio-chip audio-play" type="button" data-audio="${id}" title="Réécouter"><span class="dot"></span><strong>${esc(tag)}</strong><span>${id} · ${esc(a?.[1]||"")}</span><em>▶</em></button>`;}
function toast(text){el.toast.textContent=text;el.toast.classList.add("show");setTimeout(()=>el.toast.classList.remove("show"),2200);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
let activeAudio=null;
let sfxContext=null;
function getSfxContext(){
  if(!sfxContext) sfxContext=new (window.AudioContext||window.webkitAudioContext)();
  return sfxContext;
}
function stopAudio(){
  audioToken++;
  if(activeAudio){try{activeAudio.pause();activeAudio.currentTime=0;}catch(e){} activeAudio=null;}
  el.wave.classList.remove("playing");
}
async function playSound(id,{wait=true,button=null}={}){
  if(!AUDIO[id])return false;
  if(state.muted){toast("Le son est coupé : appuie sur SON : OFF pour le réactiver.");return false;}
  stopAudio();
  const token=audioToken;
  const [src]=AUDIO[id];
  const a=new Audio(src);
  a.preload="auto";
  a.playsInline=true;
  activeAudio=a;
  bumpReaction(id);
  el.wave.classList.add("playing");
  if(button){button.classList.add("is-playing");button.setAttribute("aria-busy","true");}
  try{
    await a.play();
  }catch(err){
    el.wave.classList.remove("playing");
    if(button){button.classList.remove("is-playing");button.removeAttribute("aria-busy");}
    showAudioFallback(id,button);
    toast("Le navigateur refuse la lecture automatique : utilise le lecteur audio affiché juste dessous.");
    return false;
  }
  if(!wait)return true;
  await new Promise(resolve=>{
    const done=()=>resolve();
    a.addEventListener("ended",done,{once:true});
    a.addEventListener("error",done,{once:true});
  });
  if(token===audioToken)el.wave.classList.remove("playing");
  if(button){button.classList.remove("is-playing");button.removeAttribute("aria-busy");}
  return true;
}
function showAudioFallback(id,button){
  if(!AUDIO[id])return;
  const host=button?.closest('.audio-gate,.audio-chip-wrap')||button?.parentElement||el.screen;
  if(host?.querySelector('.native-audio-fallback'))return;
  const audio=document.createElement('audio');
  audio.className='native-audio-fallback';
  audio.controls=true;
  audio.preload='auto';
  audio.src=AUDIO[id][0];
  host?.appendChild(audio);
}
function beep(freq=440,duration=.12,volume=.035,startDelay=0){
  if(state.muted)return Promise.resolve();
  try{
    const ctx=getSfxContext();
    if(ctx.state==="suspended") ctx.resume().catch(()=>{});
    return new Promise(resolve=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type="sine";o.frequency.value=freq;g.gain.value=0;
      o.connect(g);g.connect(ctx.destination);
      const t=ctx.currentTime+startDelay;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.01);g.gain.setValueAtTime(volume,t+Math.max(.02,duration-.03));g.gain.linearRampToValueAtTime(0,t+duration);
      o.start(t);o.stop(t+duration+.02);o.onended=resolve;
    });
  }catch(e){return Promise.resolve();}
}
async function playSfx(kind){
  if(state.muted)return;
  if(kind==="click"){await beep(160,.045,.025);return;}
  if(kind==="busy"){for(let i=0;i<3;i++){await beep(425,.24,.025);await sleep(180);}return;}
  if(kind==="ring"){await Promise.all([beep(440,.75,.022),beep(480,.75,.018)]);await sleep(240);await Promise.all([beep(440,.75,.022),beep(480,.75,.018)]);return;}
  if(kind==="line"){await beep(425,.18,.012);return;}
}
function audioGate(id,label,next){
  const a=AUDIO[id];
  const gate=document.createElement('div');
  gate.className='audio-gate';
  gate.innerHTML=`<button type="button" class="audio-gate-btn"><span class="audio-gate-icon">▶</span><span><strong>${esc(label)}</strong><small>${esc(a?.[1]||'Archive authentique')}</small></span></button><div class="audio-gate-fallback"></div>`;
  const b=gate.querySelector('button');
  b.addEventListener('click',async()=>{
    const ok=await playSound(id,{button:b});
    if(ok){
      if(typeof next==='function') next();
      return;
    }
    // Never block the game because of browser audio policy.
    const fb=gate.querySelector('.audio-gate-fallback');
    if(fb && !fb.querySelector('audio')){
      fb.innerHTML=`<p class="audio-help">Si le bouton vert reste muet, utilise ce lecteur natif :</p><audio class="native-audio-fallback" controls preload="metadata" playsinline src="${AUDIO[id][0]}"></audio>`;
      const native=fb.querySelector('audio');
      native.addEventListener('play',()=>{if(typeof next==='function') next();},{once:true});
    }
    if(typeof next==='function') next();
  });
  return gate;
}
function visualMode(scene){
  if(["intro","busy1","busy2","callback"].includes(scene))return"bedroom";
  if(["manu_intro","audition","wait"].includes(scene))return"standard";
  if(scene==="pseudo")return"pseudo";
  if(scene==="offair")return"offair";
  if(scene==="summary")return"summary";
  return "onair";
}
function updateVisual(){
  const mode=visualMode(state.scene);
  el.visualLayer.className=`visual-layer visual-${mode}`;
  const wave=`<div class="wave-strip"><img src="assets/images/euro-waveform.png" alt=""></div>`;
  if(mode==="bedroom") el.visualLayer.innerHTML=`<div class="art-stage"><img class="artwork" src="assets/images/bedroom.svg" alt=""><div class="visual-caption">CHAMBRE · 1999</div><div class="info-pill">APPEL À LA MAISON</div></div>`;
  else if(mode==="standard") el.visualLayer.innerHTML=`<div class="art-stage"><img class="artwork" src="assets/images/standard.svg" alt=""><div class="visual-caption green">STANDARD · LIGNES AUDITEURS</div><div class="info-pill">MANU FILTRE LES APPELS</div></div>`;
  else if(mode==="pseudo") el.visualLayer.innerHTML=`<div class="art-stage"><img class="artwork" src="assets/images/standard.svg" alt="">${wave}<div class="visual-caption">CAHIER DU STANDARD</div><div class="info-pill">TROUVE TON PSEUDO</div></div>`;
  else if(mode==="offair") el.visualLayer.innerHTML=`<div class="art-stage"><img class="artwork" src="assets/images/offair.svg" alt="">${wave}<div class="visual-caption">PAUSE DISQUE</div><div class="info-pill">LE MICRO EST COUPÉ</div></div>`;
  else if(mode==="summary") el.visualLayer.innerHTML=`<div class="art-stage"><img class="artwork" src="assets/images/summary.svg" alt="">${wave}<div class="visual-caption green">BILAN DE LA NUIT</div><div class="info-pill">${esc(state.pseudo||"PSEUDO À CONFIRMER")}</div></div>`;
  else el.visualLayer.innerHTML=`<div class="art-stage"><img class="artwork" src="assets/images/onair.svg" alt="">${wave}<div class="visual-caption red">STUDIO · DIRECT</div><div class="info-pill red">MASTER EURO · ARCHIVES AUTHENTIQUES</div></div>`;
}

function imageSrc(path){
  const name=path.split('/').pop();
  return (window.EMBEDDED_IMAGES&&window.EMBEDDED_IMAGES[name])||path;
}

function sceneArtFor(scene){
  const standard="assets/images/standard90s.svg";
  const desk="assets/images/standard-desk-poster.jpg";
  const manu="assets/images/manu.png";
  const manuClose="assets/images/manu-closeup.jpg";
  const manuSheet="assets/images/manu-contactsheet.jpg";
  if(["intro","busy1","busy2","callback"].includes(scene))return [
    {src:"assets/images/bedroom.svg",caption:"CHEZ TOI · TÉLÉPHONE ET ATTENTE",kind:"vector"},
    {src:desk,caption:"STANDARD DE NUIT · AMBIANCE 90/2000",kind:"photo poster standard-room"},
    {src:manuClose,caption:"ARCHIVE MANU · PORTRAIT",kind:"photo portrait"}
  ];
  if(scene==="manu_intro")return [
    {src:standard,caption:"STANDARD RADIO · ANNÉES 90/2000",kind:"standard-room vector"},
    {src:desk,caption:"POSTE STANDARD · TÉLÉPHONE, CRT, NOTES",kind:"photo poster standard-room"},
    {src:manu,caption:"MANU · STANDARD / RÉA",kind:"portrait photo"},
    {src:manuSheet,caption:"ARCHIVES MANU · SÉRIE PHOTO",kind:"photo contactsheet"}
  ];
  if(["audition","wait"].includes(scene))return [
    {src:desk,caption:"STANDARD RADIO · LIGNE EN ATTENTE",kind:"photo poster standard-room"},
    {src:manu,caption:"MANU · STANDARD / RÉA",kind:"portrait photo"},
    {src:manuSheet,caption:"ARCHIVES MANU · CABINE / STANDARD",kind:"photo contactsheet"},
    {src:"assets/images/pseudo.svg",caption:"CAHIER DU STANDARD · PSEUDOS",kind:"vector"}
  ];
  if(scene==="pseudo")return [
    {src:"assets/images/pseudo.svg",caption:"CAHIER DU STANDARD · TROUVE TON BLAZE",kind:"vector"},
    {src:manuSheet,caption:"ARCHIVES MANU · AMBIANCE ÉQUIPE",kind:"photo contactsheet"},
    {src:desk,caption:"STANDARD · FICHES, POST-IT, RÉGIE",kind:"photo poster standard-room"}
  ];
  if(scene==="offair")return [
    {src:manuClose,caption:"MANU · HORS ANTENNE",kind:"photo portrait"},
    {src:"assets/images/offair.svg",caption:"PAUSE DISQUE · MICRO COUPÉ",kind:"vector"},
    {src:desk,caption:"RÉGIE DE NUIT · APRÈS LE STANDARD",kind:"photo poster standard-room"}
  ];
  if(scene==="summary")return [
    {src:"assets/images/summary.svg",caption:"BILAN DE LA NUIT",kind:"vector"},
    {src:desk,caption:"STANDARD · AMBIANCE GÉNÉRALE",kind:"photo poster standard-room"},
    {src:manuSheet,caption:"ARCHIVES MANU · FIN DE PARCOURS",kind:"photo contactsheet"}
  ];
  if(["first_intervention","micro_archive","understood","last_test"].includes(scene))return [
    {src:"assets/images/euro.svg",caption:"DÉBAT SUR L’EURO · 07/01/1999",kind:"vector"},
    {src:"assets/images/onair.svg",caption:"STUDIO · DIRECT",kind:"vector"},
    {src:desk,caption:"COULISSES DU STANDARD · AVANT L’ANTENNE",kind:"photo poster standard-room"},
    {src:manuClose,caption:"MANU · À PROXIMITÉ DU STANDARD",kind:"photo portrait"}
  ];
  return [
    {src:"assets/images/onair.svg",caption:"STUDIO · DIRECT",kind:"vector"},
    {src:desk,caption:"AMBIANCE STUDIO 90/2000",kind:"photo poster standard-room"}
  ];
}
function decorateScene(){
  const sceneEl=el.screen.querySelector(".scene");
  if(!sceneEl||sceneEl.querySelector(".scene-media"))return;
  const items=sceneArtFor(state.scene);
  const wrap=document.createElement('div');
  wrap.className=`scene-media ${items.length>1?'scene-media-grid':''}`;
  items.forEach(item=>{
    const fig=document.createElement('figure');
    fig.className=`scene-visual ${item.kind||'vector'}`;
    fig.innerHTML=`<img src="${imageSrc(item.src)}" alt=""><figcaption>${esc(item.caption)}</figcaption>`;
    wrap.appendChild(fig);
  });
  sceneEl.prepend(wrap);
}

function modal({kicker="",title,text,actions=[]}){
  el.modalKicker.textContent=kicker;el.modalTitle.textContent=title;el.modalText.textContent=text;el.modalActions.innerHTML="";
  actions.forEach(a=>{const b=document.createElement("button");b.className=`btn ${a.className||"primary"}`;b.textContent=a.label;b.onclick=()=>{el.modal.classList.add("hidden");a.onClick();};el.modalActions.appendChild(b);});
  el.modal.classList.remove("hidden");
}
function gerbe({reason="Le standard a coupé ta ligne.",resume="intro",hard=false}={}){
  stopAudio();state.gerbes++;state.scene=resume;state.checkpoint=resume;save();updateHUD();
  modal({kicker:"STANDARD",title:"TU GERBES AU STANDARD",text:reason,actions:[{label:hard?"REPRENDRE AU DÉBUT DU DÉBAT":"RAPPELER",onClick:()=>setScene(resume,resume)}]});
}
function render(){stopAudio();updateHUD();updateVisual();const fn=scenes[state.scene]||scenes.intro;fn();decorateScene();}

const scenes={
  intro(){state.clock="23:56";save();updateHUD();updateVisual();el.screen.innerHTML=`<div class="scene"><div class="scene-kicker">JEUDI · 1999</div><h1>23:56</h1><p class="big">Tu les écoutes depuis des mois.</p><p>Ce soir, tu vas appeler.</p><div class="sound-badge">AUDIO · LES ARCHIVES SE LANCENT AVEC ▶</div>${btn("☎ APPELER LE STANDARD",async()=>{await playSfx("click");setScene("busy1","intro");})}</div>`;},
  busy1(){el.screen.innerHTML=`<div class="scene"><div class="scene-kicker amber">APPEL 01</div><h2>Occupé.</h2><p class="muted">La ligne est déjà prise.</p>${btn("RAPPELER",async()=>{await playSfx("click");setScene("busy2");})}</div>`;setTimeout(()=>playSfx("busy"),80);},
  busy2(){el.screen.innerHTML=`<div class="scene"><div class="scene-kicker amber">APPEL 02</div><h2>Toujours occupé.</h2><p class="muted">Tu raccroches. Tu recomposes.</p>${btn("RAPPELER",async()=>{await playSfx("ring");await playSfx("click");setScene("manu_intro");})}</div>`;setTimeout(()=>playSfx("busy"),80);},
  manu_intro(){state.clock="23:58";save();updateHUD();const manuIntroAudio=currentManuIntroAudio();const manuIntroLine=currentManuIntroLine();const manuIntroLabel=currentManuIntroLabel();const manuVariant=currentRunCount()%2===1?1:2;el.screen.innerHTML=`<div class="scene"><div class="scene-kicker">LE STANDARD DÉCROCHE</div><div class="sound-badge">MANU · ARCHIVE AUTHENTIQUE · PISTE ${manuVariant}/2</div><h2>Manu te prend au standard.</h2><p>Le jeu alterne maintenant entre deux accroches de standard selon le nombre de fois où l’on relance la partie.</p><p><strong>Accroche utilisée pour cette partie :</strong> « ${manuIntroLine} »</p><p class="muted">Et visuellement, tu arrives maintenant dans un vrai standard radio de nuit : téléphone fixe, casque, CRT, cahier d’appels.</p><div id="manuGate"></div><div class="native-player-card"><span>OU LECTEUR DIRECT</span><audio id="manuNative" controls preload="metadata" playsinline src="${AUDIO[manuIntroAudio][0]}"></audio></div>${dialogue("LE STANDARD","Il faut maintenant lui donner une raison de te passer à l’antenne.","manu")}<div class="choices">${choice("A","Passe-moi Gérard. Je veux lui dire que c’est un con.")}${choice("B","Je voudrais participer au débat sur l’euro.")}${choice("C","Je voulais demander si un euro français vaudra autant qu’un euro étranger.")}${choice("D","J’ai une vanne de malade.")}</div></div>`;
    const host=document.getElementById("manuGate");
    host.appendChild(audioGate(manuIntroAudio,manuIntroLabel));
    bindChoices({A:async()=>{apply({standard:-5});await playSound("TEAM02");gerbe({reason:"Tu n’as même pas atteint l’antenne.",resume:"manu_intro"});},B:()=>{apply({standard:2});setScene("audition");},C:async()=>{apply({standard:10,fun:4});await playSound("TEAM01");toast("Le standard accroche à ton idée.");setScene("pseudo","pseudo");},D:async()=>{apply({standard:-4});await playSound("TEAM02");setScene("audition");}});
  },
  audition(){el.screen.innerHTML=`<div class="scene"><div class="scene-kicker">AUDITION DU STANDARD</div>${dialogue("MANU","Pourquoi je te passe ?","manu")}<div class="choices">${choice("A","Parce que Gérard est nul.")}${choice("B","J’ai vraiment un avis sur l’euro.")}${choice("C","Je voulais savoir si les billets de Monopoly allaient aussi passer à l’euro.")}${choice("D","Passe-moi et tu verras.")}</div></div>`;
    bindChoices({A:async()=>{apply({standard:-7});await playSound("TEAM02");gerbe({reason:"Le standard cherchait quelqu’un capable de jouer, pas seulement d’insulter.",resume:"manu_intro"});},B:()=>{apply({standard:3,fun:-1});setScene("pseudo","pseudo");},C:async()=>{apply({standard:10,fun:7});await playSound(currentManuIntroAudio());toast("Manu a relancé la ligne.");setScene("pseudo","pseudo");},D:async()=>{apply({standard:-3});if(state.standard<25){await playSound("TEAM02");gerbe({reason:"Tu as joué au mystérieux un peu trop tôt.",resume:"manu_intro"});}else setScene("pseudo","pseudo");}});
  },
  pseudo(){
    const firsts=["Alex","Jean","Guy","Aude","Marc","Paul"], seconds=["Térieur","Bon","Don","Iteur","Assin","Émique"];
    el.screen.innerHTML=`<div class="scene"><div class="scene-kicker">LE STANDARD</div>${dialogue("MANU","Ton pseudo ?","manu")}<p class="muted">Assemble un prénom et une fin. Gérard doit pouvoir l’annoncer.</p><div class="pseudo-grid"><div class="pseudo-column"><h3>PREMIÈRE PARTIE</h3>${firsts.map(x=>`<button class="pseudo-token ${state.first===x?"selected":""}" data-first="${x}">${x}</button>`).join("")}</div><div class="pseudo-column"><h3>DEUXIÈME PARTIE</h3>${seconds.map(x=>`<button class="pseudo-token ${state.second===x?"selected":""}" data-second="${x}">${x}</button>`).join("")}</div></div><div class="pseudo-result">${state.first&&state.second?esc(state.first+" "+state.second):"—"}</div><div id="pseudoActions"></div></div>`;
    el.screen.querySelectorAll("[data-first]").forEach(b=>b.onclick=()=>{state.first=b.dataset.first;save();render();});
    el.screen.querySelectorAll("[data-second]").forEach(b=>b.onclick=()=>{state.second=b.dataset.second;save();render();});
    const area=document.getElementById("pseudoActions");if(state.first&&state.second){const b=document.createElement("button");b.className="btn primary";b.textContent="GARDER CE PSEUDO";b.onclick=()=>evaluatePseudo();area.appendChild(b);}
  },
  wait(){el.screen.innerHTML=`<div class="scene"><div class="scene-kicker amber">EN ATTENTE</div><h2>${esc(state.pseudo)}</h2>${dialogue("MANU","Bouge pas.","manu")}<div class="sound-badge">STANDARD · PRODUCTION RÉELLE</div>${audioChip("TEAM01","MANU · INSERT AUTHENTIQUE")}<p class="muted">Tu entends le standard et tu restes en attente avant le passage antenne.</p><div class="choices">${choice("A","Oui.")}${choice("B","Évidemment.")}${choice("C","J’allais raccrocher.")}${choice("D","Je t’écoute.")}</div></div>`;playSfx("line");
    bindChoices({A:async()=>{await playSfx("click");setScene("onair_intro","onair_intro");},B:async()=>{apply({standard:-1});await playSfx("click");setScene("onair_intro","onair_intro");},C:async()=>{apply({standard:-3});await playSound("TEAM02");await playSfx("click");setScene("onair_intro","onair_intro");},D:async()=>{apply({standard:2});await playSfx("click");setScene("onair_intro","onair_intro");}});
  },
  onair_intro(){state.clock="00:07";save();updateHUD();el.screen.innerHTML=`<div class="scene"><div class="scene-kicker red">🔴 ON AIR</div><h2>Tu es à l’antenne.</h2>${audioChip("GG01","GÉRARD · DÉMARRAGE AUTHENTIQUE")}<p class="muted">Appuie sur ▶ pour entendre le vrai bonsoir de Gérard. Les navigateurs mobiles exigent une action de ta part pour lancer le son.</p><div class="field-row"><label>TON ÂGE</label><input id="age" inputmode="numeric" maxlength="2" value="${esc(state.age)}" placeholder="ex. 23"></div><div class="field-row"><label>TA VILLE</label><input id="city" maxlength="40" value="${esc(state.city)}" placeholder="ex. Lyon"></div>${btn("RÉPONDRE",()=>{state.age=document.getElementById("age").value.trim()||"23";state.city=document.getElementById("city").value.trim()||"Lyon";save();setScene("frequency","frequency");})}</div>`;},
  frequency(){el.screen.innerHTML=`<div class="scene"><div class="scene-kicker red">PRÉSENTATION</div><h2>${esc(state.pseudo)} · ${esc(state.city)}</h2><p>Gérard te demande la fréquence de Fun Radio chez toi.</p><div class="choices">${choice("A","101.9")}${choice("B","72.3")}${choice("C","J’en sais rien.")}${choice("D","Ça dépend si on écoute en francs ou en euros.")}</div></div>`;
    bindChoices({A:async()=>{apply({gege:5});await playSound("GG03");setScene("first_intervention","first_intervention");},B:async()=>{apply({fun:6,reputation:1});await playSound("GG02");toast("Petit rire au studio.");setScene("first_intervention","first_intervention");},C:async()=>{apply({gege:-5});await playSound("GG20");setScene("first_intervention","first_intervention");},D:async()=>{apply({fun:8,reputation:2,gege:-3});await playSound("GG07");toast("Ça rigole derrière.");setScene("first_intervention","first_intervention");}});
  },
  first_intervention(){el.screen.innerHTML=`<div class="scene"><div class="scene-kicker red">DÉBAT · L’EURO</div><h2>Premier tour de table.</h2><p>Tony vient d’intervenir. Gérard se tourne vers toi.</p><div class="choices">${choice("A","L’euro devrait surtout faciliter les échanges économiques entre les pays européens.")}${choice("B","Mais un euro français vaudra forcément pareil qu’un euro étranger ?")}${choice("C","Et les francs suisses, ils deviennent quoi ?")}${choice("D","Mais tu comprends vraiment rien à l’euro.")}</div></div>`;
    bindChoices({A:async()=>{apply({gege:6,fun:-2});await playSound("GG03");setScene("micro_archive","micro_archive");},B:async()=>{apply({fun:9,reputation:3,gege:-1});await playSound("GG05");setScene("micro_archive","micro_archive");},C:async()=>{apply({fun:8,reputation:2,gege:-3});await playSound("GG08");setScene("micro_archive","micro_archive");},D:async()=>{apply({gege:-18,standard:-6});await playSound("GG07");if(state.gege<35)await playSound("GG10");setScene("micro_archive","micro_archive");}});
  },
  micro_archive(){el.screen.innerHTML=`<div class="scene"><div class="scene-kicker red">GÉRARD CONTINUE…</div><h2>Archive réelle du débat sur l’euro.</h2><p>Cette fois, tu entends un véritable extrait du master du 07/01/1999 avant de reprendre la parole.</p>${audioChip("EURO01","EXTRAIT AUTHENTIQUE · DÉBAT SUR L’EURO")}${btn("ÉCOUTER L’EXTRAIT",async()=>{await playSound("EURO01");setScene("understood","understood");})}</div>`;},
  understood(){el.screen.innerHTML=`<div class="scene"><div class="scene-kicker red">TON MICRO EST OUVERT</div><h2>Tu réponds comment ?</h2><div class="choices">${choice("A","Non mais là tu racontes n’importe quoi.")}${choice("B","Attends Gérard, je crois que je vois ce que tu veux dire. En fait un euro français reste français, même quand il est à l’étranger ?")}${choice("C","Donc en fait personne ne sait vraiment comment ça va marcher.")}${choice("D","Tony, toi t’as compris ?")}</div></div>`;
    bindChoices({A:async()=>{apply({gege:-14,fun:1});await playSound("GG11");if(state.gege<35)await playSound("GG10");setScene("tony_heat","tony_heat");},B:async()=>{apply({fun:12,reputation:6,gege:3});state.technique=true;save();await playSound("GG04");toast("TECHNIQUE COMPRISE · LE FAUX SOUTIEN");setScene("tony_heat","tony_heat");},C:async()=>{apply({fun:5,gege:-4});await playSound("GG07");await playSound("GG09");setScene("tony_heat","tony_heat");},D:()=>{apply({reputation:4,gege:2});setScene("tony_heat","tony_heat");}});
  },
  tony_heat(){el.screen.innerHTML=`<div class="scene"><div class="scene-kicker red">TONY LE CHAUFFE</div><p>Tony vient de contredire Gérard. Ton pseudo s’allume sur la console.</p><div class="choices">${choice("A","Non Tony, là Gérard a raison.",state.technique?"Tu peux pousser le faux soutien un peu plus loin.":"")}${choice("B","Tony a raison.")}${choice("C","Attendez, vous dites pratiquement la même chose.")}${choice("D","… se taire.")}</div></div>`;
    bindChoices({A:async()=>{apply({gege:12,reputation:2,fun:state.technique?8:0});await playSound("GG04");if(state.technique)toast("Tu reformules sa logique sans la casser.");afterTony();},B:async()=>{apply({fun:5,gege:-9});await playSound("GG10");afterTony();},C:async()=>{apply({fun:11,reputation:7,gege:2});await playSound("GG05");if(!state.technique){state.technique=true;save();toast("TECHNIQUE COMPRISE · LE FAUX SOUTIEN");}afterTony();},D:()=>{apply({fun:1,gege:3});afterTony();}});
  },
  risk(){el.screen.innerHTML=`<div class="scene"><div class="scene-kicker red">ÇA VA PARTIR</div><h2>Gérard appelle le standard.</h2>${audioChip("EURO02","EXTRAIT AUTHENTIQUE · MONTÉE DE TENSION")}${audioChip("GG12")}${audioChip("GG13")}<p class="muted">Ta survie dépend désormais de la confiance que le standard t’accorde.</p>${btn("ÉCOUTER LA MONTÉE DE TENSION",async()=>{await playSound("EURO02");await sleep(180);await playSound("GG12");await sleep(220);await playSound("GG13");if(state.standard>=38){apply({standard:3,reputation:3});await playSound("GG09");toast("Manu garde ta ligne ouverte.");setScene("offair","offair");}else{await playSound("GG15");gerbe({reason:"Gérard a appelé le standard et Manu n’avait aucune raison de te protéger.",resume:"first_intervention",hard:true});}})}</div>`;},
  offair(){state.clock="00:54";save();updateHUD();updateVisual();el.screen.innerHTML=`<div class="scene"><div class="scene-kicker amber">⚫ OFF AIR</div><h2>Pause disque.</h2><p>La voix de Gérard disparaît. D’un coup, tu n’entends plus que la ligne et le standard.</p><div class="sound-badge">MANU EST TOUJOURS LÀ</div>${audioChip("TEAM05","MANU · ARCHIVE DE PRODUCTION")}${dialogue("LE STANDARD","Hors antenne, le standard te recadre : ne fais pas tout exploser trop vite.","manu")}<div class="choices">${choice("A","J’ai compris.")}${choice("B","Moi je veux surtout le faire gueuler.")}${choice("C","Qu’est-ce qui marche le mieux avec lui ?")}${choice("D","Tony, il fait comment ?")}</div></div>`;
    bindChoices({A:async()=>{apply({standard:4});await playSfx("click");setScene("return_air","return_air");},B:async()=>{apply({standard:-8});await playSound("TEAM03");setScene("return_air","return_air");},C:async()=>{apply({standard:6});state.tipStandard=true;save();await playSound("TEAM05");toast("CONSEIL DU STANDARD · NE CASSE PAS LE JEU");setScene("return_air","return_air");},D:()=>{apply({reputation:4});state.tonyFile=true;save();toast("DOSSIER TONY · VERROUILLÉ POUR PLUS TARD");setScene("return_air","return_air");}});
  },
  return_air(){state.clock="01:31";save();updateHUD();el.screen.innerHTML=`<div class="scene"><div class="scene-kicker red">🔴 RETOUR ANTENNE</div>${audioChip("GG02")}<div class="montage"><span>00:57</span><span>01:14</span><span>01:31</span></div><p>Le débat continue. Tu as déjà survécu à ta première heure.</p>${btn("REPRENDRE LA LIGNE",async()=>{await playSound("GG02");setScene("last_test","last_test");})}</div>`;},
  last_test(){el.screen.innerHTML=`<div class="scene"><div class="scene-kicker red">DERNIER TEST</div><h2>Gérard repart sur une nouvelle logique étrange autour de la monnaie.</h2><div class="choices">${choice("A","Répondre sérieusement et corriger le fond.")}${choice("B","Le soutenir puis reformuler son idée encore plus loin.",state.technique?"LE FAUX SOUTIEN est disponible.":"")}${choice("C","Reprendre une idée de Tony et la pousser légèrement.")}${choice("D","Franchement Gérard, t’es vraiment pas fini.")}</div></div>`;
    bindChoices({A:async()=>{apply({gege:6,fun:-2});await playSound("GG03");finishTest();},B:async()=>{apply({fun:10,reputation:6,gege:2});await playSound("GG04");finishTest();},C:()=>{apply({fun:8,reputation:7});toast("Tu viens de faire un vrai rebond.");finishTest();},D:async()=>{apply({gege:-25,standard:-10});await playSound("GG10");if(state.gege<=0){await playSound("GG12");await playSound("GG13");await playSound("GG15");gerbe({reason:"Tu as tout fait exploser à deux minutes de la fin.",resume:"offair",hard:true});}else finishTest();}});
  },
  end_debate(){state.clock="01:59";save();updateHUD();el.screen.innerHTML=`<div class="scene"><div class="scene-kicker red">FIN DU DÉBAT</div>${audioChip(state.gege<16?"GG16":"GG18")}<p>La ligne se vide. L’émission se termine.</p>${btn("QUITTER L’ANTENNE",async()=>{await playSound(state.gege<16?"GG16":"GG18");state.clock="02:01";save();setScene("callback");})}</div>`;},
  callback(){const success=state.standard>=38&&state.fun>=12;const bland=state.standard>=38&&state.fun<12;el.screen.innerHTML=`<div class="scene"><div class="scene-kicker">02:01</div><h2>${success?"Le téléphone sonne.":"Le téléphone reste silencieux."}</h2>${success?`${audioChip("TEAM01","MANU · INSERT AUTHENTIQUE")}<p>Le standard te rappelle. Manu te fait comprendre qu’il veut te revoir au prochain débat.</p><p class="big"><strong>Rappelle jeudi prochain.</strong></p>`:bland?`<p>Tu n’as rien fait de catastrophique. Mais personne ne se souvient vraiment de toi.</p>`:`<p>Le standard n’est pas encore convaincu.</p>`}${success?btn("VOIR LE BILAN",()=>{state.chapterComplete=true;save();setScene("summary");}):btn("RETENTER LE DÉBAT",()=>setScene(bland?"onair_intro":"pseudo",bland?"onair_intro":"pseudo"))}</div>`;},
  summary(){const reactions=Object.entries(state.reactions).sort((a,b)=>b[1]-a[1]).slice(0,4);el.screen.innerHTML=`<div class="scene"><div class="scene-kicker">PREMIÈRE NUIT TERMINÉE</div><h1>JEUDI PROCHAIN</h1><p class="big">Trouve un autre pseudo.</p><div class="summary-grid"><div class="summary-item"><span>STANDARD</span><strong>${standardLabel()}</strong></div><div class="summary-item"><span>RÉPUTATION</span><strong>${reputationLabel()}</strong></div><div class="summary-item"><span>PSEUDO</span><strong>${esc(state.pseudo)}</strong></div><div class="summary-item"><span>TU AS GERBÉ</span><strong>${state.gerbes} fois</strong></div></div>${state.technique?`<div class="technique"><span class="eyebrow">TECHNIQUE ACQUISE</span><strong>LE FAUX SOUTIEN</strong></div>`:""}<h2 style="font-size:20px;margin-top:28px">Réactions authentiques les plus déclenchées</h2><div class="montage">${reactions.length?reactions.map(([id,n])=>`<span>${id} × ${n}</span>`).join(""):"<span>—</span>"}</div><p class="source-note">Archives sonores originales · chapitre L’Euro.</p>${btn("REJOUER CETTE NUIT",resetState)}</div>`;}
};

function evaluatePseudo(){
  const p=`${state.first} ${state.second}`;
  const table={"Alex Térieur":{standard:7,fun:5,grille:1,msg:"Ça passe."},"Paul Émique":{standard:8,fun:6,msg:"Garde ça."},"Aude Iteur":{standard:4,fun:6,grille:3,msg:"Très discret…"},"Marc Assin":{standard:4,fun:4,msg:"Ça va."},"Jean Bon":{standard:1,fun:1,msg:"Mouais."},"Guy Don":{standard:1,msg:"On fera avec."}};
  if(table[p]){state.pseudo=p;apply(table[p]);toast(`MANU · ${table[p].msg}`);setScene("wait","wait");return;}
  state.badPseudo=(state.badPseudo||0)+1;save();
  if(state.badPseudo>=2){state.pseudo="Alex Térieur";state.first="Alex";state.second="Térieur";apply({standard:-3});toast("MANU · Bon, prends Alex Térieur.");setScene("wait","wait");}
  else{toast("MANU · C’est quoi le jeu de mots ? Essaie encore.");}
}
function afterTony(){if(state.gege<=25)setScene("risk","risk");else setScene("offair","offair");}
function finishTest(){if(state.fun>=28&&state.gege>=30&&!(state.reactions.GG21>0)){setTimeout(async()=>{await playSound("GG21");toast("ARCHIVE CULTE DÉBLOQUÉE");setScene("end_debate","end_debate");},150);}else setScene("end_debate","end_debate");}

el.screen.addEventListener("click",e=>{const b=e.target.closest("[data-audio]");if(b)playSound(b.dataset.audio,{button:b});});

el.soundToggle.addEventListener("click",()=>{if(!state.muted) stopAudio(); state.muted=!state.muted; save();updateHUD();toast(state.muted?"Son coupé":"Son activé — lance les archives avec ▶");});
el.restartBtn.addEventListener("click",()=>modal({kicker:"RECOMMENCER",title:"Repartir de zéro ?",text:"Toute la progression locale de cette partie sera effacée et tu reviendras à 23:56.",actions:[{label:"ANNULER",className:"",onClick:()=>{}},{label:"RECOMMENCER",className:"danger",onClick:resetState}]}));
window.addEventListener("keydown",e=>{if(["A","B","C","D"].includes(e.key.toUpperCase()))el.screen.querySelector(`[data-choice="${e.key.toUpperCase()}"]`)?.click();});

render();
