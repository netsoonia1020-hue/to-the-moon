'use strict';
/* =========================================================
   등대지기의 오르골 — 엔진 (설정 · 오디오 · 음성 · 대화 · 연출 · 입력 · 루프)
   ========================================================= */
const W=320,H=192,TS=16,COLS=20,ROWS=12,PX=2;
const $=id=>document.getElementById(id);
const cv=$('c');cv.width=W*PX;cv.height=H*PX;
let ctx=cv.getContext('2d');const mainCtx=ctx;
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
const lc=mk(W,H),lx=lc.getContext('2d');
let T=0;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function R(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x*2)/2,Math.round(y*2)/2,w,h);}
function hsh(x,y){let n=(x*374761393+y*668265263)|0;n=Math.imul(n^(n>>>13),1274126177);return (n^(n>>>16))>>>0;}
const shadeCache={};
function shade(c,k=.78){const key=c+k;if(shadeCache[key])return shadeCache[key];const n=parseInt(c.slice(1),16);
  const f=v=>Math.max(0,Math.min(255,v*k|0));return shadeCache[key]=`rgb(${f(n>>16)},${f((n>>8)&255)},${f(n&255)})`;}
const isTouch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}},del(k){try{localStorage.removeItem(k);}catch(e){}}};
const META=Object.assign({ends:[],eggs:[],opt:{snd:true,voice:true},cleared:false},store.get('lhmb_meta',{}));
function saveMeta(){store.set('lhmb_meta',META);}

function layout(){
  const vw=innerWidth,vh=innerHeight,portrait=vh>vw*1.1;let s,l,t;
  if(portrait){s=vw/W;l=0;t=44;}
  else{s=Math.min(vw/W,vh/H);l=(vw-W*s)/2;t=(vh-H*s)/2;}
  Object.assign(cv.style,{width:W*s+'px',height:H*s+'px',left:l+'px',top:t+'px'});
  document.documentElement.style.setProperty('--s',s);
  const dlg=$('dialog'),ch=$('choices');let bottom=18;
  if(isTouch){bottom=portrait?132:10;dlg.style.width=portrait?'94vw':'min(68vw,780px)';}
  dlg.style.bottom=bottom+'px';ch.style.bottom=(bottom+dlg.offsetHeight+10)+'px';
  document.body.classList.toggle('portrait',portrait);
  const bu=$('bust');if(bu){const bh=portrait?Math.min(vh*.26,260):Math.min(Math.max(170,vh*.42),400);bu.style.height=bh+'px';
    const dr=dlg.getBoundingClientRect();bu.style.left=(dr.left+14)+'px';bu.style.bottom=(bottom+dlg.offsetHeight-10)+'px';}
  const go=$('goal');if(go){go.style.left=(portrait?0:Math.max(0,l))+'px';go.style.top=(portrait?t+H*s+6:t+H*s-34)+'px';}
  const top=Math.max(t+8,52);
  $('hud').style.top=$('toast').style.top=top+'px';
  $('hud').style.right=(portrait?12:Math.max(12,l+10))+'px';$('toast').style.left=(portrait?12:Math.max(12,l+12))+'px';
}
addEventListener('resize',layout);

/* =========================================================
   오디오 — 전부 WebAudio 합성 (외부 음원 없음)
   ========================================================= */
const A={};
const mf=m=>440*Math.pow(2,(m-69)/12);
function audioInit(){
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  if(!A.C){
    const C=A.C=new AC();
    A.master=C.createGain();A.master.gain.value=META.opt.snd?1:0;
    const comp=C.createDynamicsCompressor();A.master.connect(comp);comp.connect(C.destination);
    const len=C.sampleRate*2.8,ib=C.createBuffer(2,len,C.sampleRate);
    for(let c=0;c<2;c++){const d=ib.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);}
    A.rev=C.createConvolver();A.rev.buffer=ib;const rg=C.createGain();rg.gain.value=.4;A.rev.connect(rg);rg.connect(A.master);
    A.music=C.createGain();A.music.gain.value=.85;A.music.connect(A.master);A.music.connect(A.rev);
    A.sfx=C.createGain();A.sfx.gain.value=.9;A.sfx.connect(A.master);A.sfx.connect(A.rev);
    A.amb=C.createGain();A.amb.gain.value=1;A.amb.connect(A.master);
    const nb=C.createBuffer(1,C.sampleRate*3,C.sampleRate),nd=nb.getChannelData(0);
    for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;A.noise=nb;
    setInterval(bgmTick,90);
    if(A.pendingBgm)playBgm(A.pendingBgm);if(A.pendingAmb)setAmb(A.pendingAmb);
  }
  // 브라우저 자동재생 정책: 사용자 제스처마다 깨운다
  if(A.C.state!=='running'){const p=A.C.resume();p&&p.catch&&p.catch(()=>{});}
  if(!A.unlocked){
    A.unlocked=true;
    try{const s=A.C.createBufferSource();s.buffer=A.C.createBuffer(1,1,22050);s.connect(A.C.destination);s.start(0);}catch(e){}
    // iOS 무음 스위치 우회: 무음 <audio> 루프를 틀어 오디오 세션을 '재생'으로 전환
    try{const n=4000,b=new ArrayBuffer(44+n),v=new DataView(b),w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};
      w(0,'RIFF');v.setUint32(4,36+n,true);w(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);
      v.setUint32(24,8000,true);v.setUint32(28,8000,true);v.setUint16(32,1,true);v.setUint16(34,8,true);w(36,'data');v.setUint32(40,n,true);
      for(let i=0;i<n;i++)v.setUint8(44+i,128);
      const el=new Audio(URL.createObjectURL(new Blob([b],{type:'audio/wav'})));el.loop=true;el.setAttribute('playsinline','');
      const p=el.play();p&&p.catch&&p.catch(()=>{A.unlocked=false;});A.el=el;}catch(e){}
  }
}
['pointerdown','pointerup','touchend','click','keydown'].forEach(ev=>addEventListener(ev,audioInit,{capture:true,passive:true}));
function env(g,t,v,a,d){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d);}
function piano(m,t,dur,vol,dest){
  const C=A.C;if(!C)return;dest=dest||A.music;
  const f=C.createBiquadFilter();f.type='lowpass';f.frequency.value=2400;f.connect(dest);
  const g=C.createGain();env(g,t,vol,.006,dur);g.connect(f);
  const o=C.createOscillator();o.type='triangle';o.frequency.value=mf(m);o.connect(g);
  const o2=C.createOscillator();o2.type='sine';o2.frequency.value=mf(m)*2;const g2=C.createGain();env(g2,t,vol*.25,.004,dur*.4);o2.connect(g2);g2.connect(f);
  o.start(t);o2.start(t);o.stop(t+dur+.1);o2.stop(t+dur+.1);
}
function pad(m,t,dur,vol,dest){
  const C=A.C;if(!C)return;const o=C.createOscillator();o.type='sine';o.frequency.value=mf(m);
  const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.35);g.gain.linearRampToValueAtTime(0,t+dur*1.15);
  o.connect(g);g.connect(dest||A.music);o.start(t);o.stop(t+dur*1.2);
}
function mbox(m,t,vol=.2,dest){
  const C=A.C;if(!C)return;dest=dest||A.sfx;
  [[1,1,2.2],[4.02,.22,.35],[2,.18,.9]].forEach(([k,v,d])=>{
    const o=C.createOscillator();o.type='sine';o.frequency.value=mf(m+12)*k;
    const g=C.createGain();env(g,t,vol*v,.003,d);o.connect(g);g.connect(dest);o.start(t);o.stop(t+d+.1);});
}
function voice(m,t,dur,vol=.16,dest){
  const C=A.C;if(!C)return;dest=dest||A.sfx;
  const o=C.createOscillator();o.type='sine';o.frequency.value=mf(m);
  const lfo=C.createOscillator();lfo.frequency.value=5.2;const lg=C.createGain();lg.gain.value=mf(m)*.012;lfo.connect(lg);lg.connect(o.frequency);
  const o2=C.createOscillator();o2.type='triangle';o2.frequency.value=mf(m);const g2=C.createGain();g2.gain.value=.25;o2.connect(g2);
  const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.09);
  g.gain.setValueAtTime(vol,t+dur*.7);g.gain.exponentialRampToValueAtTime(.0001,t+dur+.25);
  o.connect(g);g2.connect(g);g.connect(dest);[o,o2,lfo].forEach(x=>{x.start(t);x.stop(t+dur+.3);});
}
function noiseBurst(t,dur,freq,type,vol,q=1){
  const C=A.C;if(!C)return;const s=C.createBufferSource();s.buffer=A.noise;
  const f=C.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;
  const g=C.createGain();env(g,t,vol,.005,dur);s.connect(f);f.connect(g);g.connect(A.sfx);s.start(t,Math.random()*2);s.stop(t+dur+.1);
  return f;
}
function beep(freq,t,dur,vol,type='sine',dest){const C=A.C;if(!C)return;const o=C.createOscillator(),g=C.createGain();o.type=type;o.frequency.value=freq;env(g,t,vol,.004,dur);o.connect(g);g.connect(dest||A.sfx);o.start(t);o.stop(t+dur+.1);return o;}
const BLIPF={'서윤':560,'정우':300,'은하':640,'미래':700};
const SFX={
  blip(name){if(!A.C)return;beep((BLIPF[name]||480)*(S&&S.blipMul&&S.blipMul[name]||1)+Math.random()*40,A.C.currentTime,.05,.03,'sine',A.master);},
  chime(){if(!A.C)return;const t=A.C.currentTime;[76,79,84,88].forEach((m,i)=>mbox(m,t+i*.09,.14));},
  keep(){if(!A.C)return;const t=A.C.currentTime;[72,79,84].forEach((m,i)=>mbox(m,t+i*.12,.13));},
  whoosh(){if(!A.C)return;const t=A.C.currentTime,f=noiseBurst(t,2,300,'bandpass',.6,.8);
    if(f){f.frequency.setValueAtTime(200,t);f.frequency.exponentialRampToValueAtTime(5000,t+1.6);}
    [72,76,79,83,86,91].forEach((m,i)=>mbox(m,t+.15+i*.12,.1));},
  ring(){if(!A.C)return;const t0=A.C.currentTime;for(let k=0;k<2;k++)for(let i=0;i<10;i++){const t=t0+k*1.4+i*.06;beep(440,t,.05,.05);beep(480,t,.05,.05);}},
  dial(){if(!A.C)return;const t0=A.C.currentTime;for(let k=0;k<3;k++){beep(440,t0+k*1.6,.9,.04);beep(350,t0+k*1.6,.9,.04);}},
  knock(){if(!A.C)return;const t=A.C.currentTime;for(let i=0;i<3;i++){noiseBurst(t+i*.32,.12,180,'lowpass',1);noiseBurst(t+i*.32,.05,900,'bandpass',.3);}},
  door(){if(!A.C)return;const t=A.C.currentTime;const f=noiseBurst(t,.6,500,'bandpass',.3,6);if(f){f.frequency.setValueAtTime(400,t);f.frequency.linearRampToValueAtTime(900,t+.5);}
    noiseBurst(t+.55,.15,150,'lowpass',.7);},
  drawer(){if(!A.C)return;const t=A.C.currentTime;noiseBurst(t,.35,700,'bandpass',.35,2);noiseBurst(t+.3,.08,200,'lowpass',.6);},
  page(){if(!A.C)return;noiseBurst(A.C.currentTime,.25,3500,'highpass',.12);},
  key(){if(!A.C)return;const t=A.C.currentTime;[2400,3100,2700].forEach((f,i)=>beep(f,t+i*.07,.12,.04));},
  crank(){if(!A.C)return;const t=A.C.currentTime;for(let i=0;i<7;i++)noiseBurst(t+i*.09,.03,2500,'bandpass',.3,3);noiseBurst(t+.75,.2,300,'lowpass',.6);},
  crack(){if(!A.C)return;const t=A.C.currentTime;noiseBurst(t,.08,3000,'highpass',.9);noiseBurst(t+.02,.4,500,'bandpass',.6,2);beep(180,t,.5,.2,'sawtooth');},
  thunder(){if(!A.C)return;const t=A.C.currentTime;noiseBurst(t,2.6,120,'lowpass',1);noiseBurst(t+.1,1.4,400,'lowpass',.35);},
  step(sand){if(!A.C)return;noiseBurst(A.C.currentTime,.05,sand?1800:260,sand?'bandpass':'lowpass',sand?.06:.16,1);},
  meow(){if(!A.C)return;const C=A.C,t=C.currentTime,o=C.createOscillator(),g=C.createGain();o.type='sawtooth';
    o.frequency.setValueAtTime(620,t);o.frequency.linearRampToValueAtTime(880,t+.12);o.frequency.linearRampToValueAtTime(540,t+.45);
    const f=C.createBiquadFilter();f.type='bandpass';f.frequency.value=1400;f.Q.value=3;env(g,t,.12,.04,.45);o.connect(f);f.connect(g);g.connect(A.sfx);o.start(t);o.stop(t+.6);},
  car(){if(!A.C)return;const t=A.C.currentTime,f=noiseBurst(t,2.4,300,'lowpass',.5);if(f){f.frequency.setValueAtTime(200,t);f.frequency.linearRampToValueAtTime(900,t+1);f.frequency.linearRampToValueAtTime(200,t+2.2);}},
  bell(){if(!A.C)return;const t=A.C.currentTime;[84,88,91].forEach((m,i)=>{mbox(m-12,t+i*.5,.12);});},
  pin(m){if(!A.C)return;mbox(m,A.C.currentTime,.14);},
  key1(m){if(!A.C)return;piano(m,A.C.currentTime,1.4,.2,A.sfx);},
};
function setAmb(name){
  if(!A.C){A.pendingAmb=name;return;}
  if(A.ambName===name)return;
  const C=A.C,t=C.currentTime;
  if(A.ambNode){const old=A.ambNode;old.g.gain.cancelScheduledValues(t);old.g.gain.setValueAtTime(old.g.gain.value,t);old.g.gain.linearRampToValueAtTime(0,t+1.5);setTimeout(()=>{try{old.src.stop();old.lfo&&old.lfo.stop();}catch(e){}},1700);A.ambNode=null;}
  A.ambName=name;if(!name)return;
  const src=C.createBufferSource();src.buffer=A.noise;src.loop=true;
  const g=C.createGain();g.gain.value=0;const node={src,g};
  let chain=src,vol=.05;
  const filt=(type,f,q=.7)=>{const b=C.createBiquadFilter();b.type=type;b.frequency.value=f;b.Q.value=q;chain.connect(b);chain=b;return b;};
  if(name==='rain'){filt('highpass',900);filt('lowpass',5500);vol=.09;}
  if(name==='rainout'){filt('highpass',600);filt('lowpass',7000);vol=.14;}
  if(name==='storm'){filt('highpass',500);filt('lowpass',4500);vol=.13;}
  if(name==='wind'){filt('bandpass',380,.6);vol=.09;}
  if(name==='waves'){filt('lowpass',650);vol=.16;}
  if(name==='waves'||name==='wind'){
    const lfo=C.createOscillator();lfo.frequency.value=name==='waves'?.13:.07;const lg=C.createGain();lg.gain.value=vol*.8;
    lfo.connect(lg);lg.connect(g.gain);lfo.start();node.lfo=lfo;}
  chain.connect(g);g.connect(A.amb);src.start();
  g.gain.linearRampToValueAtTime(vol,t+2);A.ambNode=node;
}
// 배경음악 엔진은 js/music.js 로 옮겼다
function duck(on){if(!A.C)return;const t=A.C.currentTime;A.music.gain.cancelScheduledValues(t);A.music.gain.setValueAtTime(A.music.gain.value,t);A.music.gain.linearRampToValueAtTime(on?.18:.85,t+.6);}
async function playSeq(seq,bpm,fn,{duckIt=true,onNote}={}){
  const b=60/bpm;let acc=0;const t=A.C?A.C.currentTime+.15:0;
  if(duckIt)duck(true);
  seq.forEach(([m,bt],i)=>{if(m&&A.C)fn(m,t+acc,bt*b);if(onNote&&m)setTimeout(()=>onNote(i,m),(acc+.15)*1000);acc+=bt*b;});
  await wait(acc*1000+500);
  if(duckIt)duck(false);
}
const MOTIF=[[76,1],[79,1],[81,2],[79,1],[76,1],[74,2]];             // 미 솔 라 솔 미 레
const CONT=[[72,1],[74,1],[76,1],[79,1],[81,2],[79,2],[76,1],[74,1],[72,4]];  // 은하가 나중에 붙인 끝
const NOTE_NAME={72:'도',74:'레',76:'미',77:'파',79:'솔',81:'라',83:'시'};
const hum=(notes,bpm=66,who,low=12)=>playSeq(notes,bpm,(m,t,d)=>voice(m-low,t,d*.95,.18),{onNote:()=>who&&noteFx(who)});
const boxPlay=(notes,bpm=84,opt={})=>playSeq(notes,bpm,(m,t)=>mbox(m,t,.22),Object.assign({onNote:()=>opt.who&&noteFx(opt.who)},opt));

/* ---------- 음성 낭독 (기기 내장 TTS — 음원 파일·저작권 없음) ---------- */
const TTS={ok:'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window,voice:null};
function pickVoice(){
  if(!TTS.ok)return;let vs=[];try{vs=speechSynthesis.getVoices()||[];}catch(e){}
  const ko=vs.filter(v=>/^ko/i.test(v.lang));
  TTS.voice=ko.find(v=>/natural|neural|online|premium|enhanced|siri|google/i.test(v.name))||ko[0]||null;
}
if(TTS.ok){pickVoice();try{speechSynthesis.onvoiceschanged=pickVoice;}catch(e){}}
const VOICE={'':{p:.9,r:.9},'서윤':{p:1.15,r:1},'정우':{p:.55,r:.88},'은하':{p:1.35,r:.95},'미래':{p:1.25,r:1.02}};
function speak(name,text){
  if(!TTS.ok||!META.opt.voice||!META.opt.snd)return;
  try{
    speechSynthesis.cancel();if(!TTS.voice)pickVoice();if(!TTS.voice)return;
    const t=text.replace(/<[^>]+>/g,' ').replace(/[()「」—…♪♡*·]/g,' ').replace(/\s+/g,' ').trim();
    if(!/[가-힣0-9]/.test(t))return;
    const u=new SpeechSynthesisUtterance(t);u.lang='ko-KR';u.voice=TTS.voice;
    const v=(S&&S.voice&&S.voice[name])||VOICE[name]||VOICE[''];u.pitch=v.p;u.rate=v.r;u.volume=.95;
    speechSynthesis.speak(u);
  }catch(e){}
}
function shutUp(){try{TTS.ok&&speechSynthesis.cancel();}catch(e){}}
function syncOpts(){
  $('oSnd').classList.toggle('off',!META.opt.snd);$('oVoice').classList.toggle('off',!META.opt.voice);
  if(A.master)A.master.gain.value=META.opt.snd?1:0;if(!META.opt.voice||!META.opt.snd)shutUp();
}
// 설정 버튼(우측 상단): 누르면 소리·음성·저장·일지 메뉴가 펼쳐진다
function gearOpen(on){$('opts').classList.toggle('hidden',!on);$('gear').classList.toggle('open',on);}
$('gear').onclick=e=>{e.stopPropagation();audioInit();gearOpen($('opts').classList.contains('hidden'));};
addEventListener('pointerdown',e=>{if(!e.target.closest('#opts,#gear'))gearOpen(false);},true);
$('oSnd').onclick=e=>{e.stopPropagation();META.opt.snd=!META.opt.snd;saveMeta();audioInit();syncOpts();if(META.opt.snd){SFX.chime();toast('소리 켜짐 — 안 들리면 기기 음량·무음 스위치를 확인하세요');}};
$('oVoice').onclick=e=>{e.stopPropagation();META.opt.voice=!META.opt.voice;saveMeta();syncOpts();
  if(META.opt.voice){pickVoice();if(!TTS.ok||!TTS.voice)toast('이 기기·브라우저에는 한국어 낭독 음성이 없어요');else speak('','음성 낭독을 켰습니다.');}};

/* =========================================================
   게임 상태
   ========================================================= */
let S=null,ents=[],locked=true,started=false,flash=0,nextFlash=6,curDark=0,sceneName='';
const F={notes:[],keeps:[],cats:[]};
function resetF(o){for(const k in F)delete F[k];Object.assign(F,{notes:[],keeps:[],cats:[]},o||{});}
const P={x:0,y:0,fx:0,fy:0,dir:'down',moving:false,tx:0,ty:0,hidden:false,w:1,h:1};
const motes=[];for(let i=0;i<40;i++)motes.push({x:Math.random()*W,y:Math.random()*H,s:.1+Math.random()*.3,a:Math.random()*6});
const DX={up:0,down:0,left:-1,right:1},DY={up:-1,down:1,left:0,right:0};
function E(o){return Object.assign({w:1,h:1,solid:true,hidden:false,glow:false,layer:1,ph:Math.random()*5},o,{fx:o.x,fy:o.y});}
function ent(id){return ents.find(e=>e.id===id);}
function covers(e,x,y){return x>=e.x&&x<e.x+e.w&&y>=e.y&&y<e.y+e.h;}
const SOLID_T='#wrxBcaR';
function tileAt(x,y){if(!S||!S.map||x<0||y<0||x>=COLS||y>=ROWS)return 'x';return S.map[y][x];}
function solidAt(x,y){if(SOLID_T.includes(tileAt(x,y)))return true;return ents.some(e=>!e.hidden&&e.solid&&covers(e,x,y));}

/* =========================================================
   연출: 카메라 · 레터박스 · 흔들림 · 말풍선 · 파티클 · 전경(비스타)
   ========================================================= */
const CAM={x:W/2,y:H/2,z:1,a:null};
function cam(x,y,z=1,ms=900){
  return new Promise(r=>{if(x==null){x=W/2;y=H/2;z=1;}CAM.a={sx:CAM.x,sy:CAM.y,sz:CAM.z,tx:x,ty:y,tz:z,t:0,d:ms/1000,r};});
}
const camOn=(e,z=1.6,ms=900)=>cam(e.fx*TS+8,e.fy*TS+4,z,ms);
const LB={v:0,t:0};function letterbox(on){LB.t=on?1:0;}
const SH={t:0,amp:0};function shake(ms=400,amp=3){SH.t=ms/1000;SH.amp=amp;}
const EM=[];function emote(e,sym,ms=1400){EM.push({e,sym,t:0,d:ms/1000});return wait(Math.min(ms,700));}
const PT=[];
function noteFx(e){PT.push({x:e.fx*TS+8+(Math.random()*6-3),y:e.fy*TS-12,vx:(Math.random()-.5)*8,vy:-14,life:0,max:1.8,kind:'note',ch:Math.random()<.5?'♪':'♫',col:'255,236,170'});}
function sparkFx(x,y,n=10,col='255,236,170'){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=10+Math.random()*26;PT.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-10,g:30,life:0,max:.6+Math.random()*.6,kind:'spark',col});}}
const FP=[];
const VIS={o:null,a:0,ta:0,sp:1};
function vista(o,ms=1500){if(o){VIS.o=o;VIS.ta=1;}else VIS.ta=0;VIS.sp=1000/ms;return wait(ms);}
function tweenDark(to,ms){const from=curDark,t0=performance.now();return new Promise(r=>{(function f(){const k=Math.min(1,(performance.now()-t0)/ms);curDark=from+(to-from)*k;k<1?requestAnimationFrame(f):r();})();});}

/* =========================================================
   대화 · 선택지 · 카드
   ========================================================= */
const NAMECOL={'서윤':'#f2c46d','정우':'#8fb8e8','은하':'#f0a8b8','미래':'#c7a8f0','하늘':'#a8e0c0','태오':'#e0b860','간호사':'#a8d8e0','순례':'#c8b0d8','김 선장':'#b8c890'};
let typeSkip=null,waiters=[],choice=null;
function waitAction(){return new Promise(r=>waiters.push(r));}
const DEFAULT_PORT={'서윤':'seoyun','정우':'jwOld','은하':'ehMid','미래':'mrAdult','간호사':'nurse','태오':'taeo','순례':'soon'};
function portOf(name){return (S&&S.port&&S.port[name])||DEFAULT_PORT[name];}
// ex(표정)를 주면 대사창에 초상화가 함께 뜬다: '', smile, sad, cry, surp, closed, angry
async function say(name,text,ex){
  const d=$('dialog'),nm=$('dname'),tx=$('dtext'),nx=$('dnext'),pc=$('dport');
  d.classList.remove('hidden');nx.classList.add('hidden');document.body.classList.add('talking');
  nm.textContent=name||'';nm.style.color=NAMECOL[name]||'#ddd';nm.style.display=name?'':'none';
  const pid=ex!==undefined&&name?portOf(name):null;showBust(pid,ex);
  const inner=name&&text.startsWith('(');
  tx.className=!name?'narr':inner?'inner':'';tx.textContent='';layout();
  if(!inner)speak(name,text);else shutUp();
  await new Promise(res=>{
    let i=0,done=false;
    const fin=()=>{if(done)return;done=true;clearInterval(iv);tx.textContent=text;typeSkip=null;res();};
    const iv=setInterval(()=>{i++;tx.textContent=text.slice(0,i);if(i%3===1&&text[i-1]!==' ')SFX.blip(name);if(i>=text.length)fin();},32);
    typeSkip=fin;
  });
  nx.classList.remove('hidden');
  await waitAction();
  nx.classList.add('hidden');
}
// 반전 컷인: 화면을 가로지르는 큰 초상화와 한 줄
async function cutin(lookId,ex,line,ms=3200){
  hideDialog();const el=$('cutin'),c=$('ciPort');c.width=300;c.height=380;c.getContext('2d').clearRect(0,0,300,380);c.getContext('2d').drawImage(paintPortrait(lookId,ex),0,0);
  $('ciText').textContent=line||'';el.classList.remove('hidden','go');void el.offsetWidth;el.classList.add('go');
  if(A.C){const t=A.C.currentTime;noiseBurst(t,.6,1800,'bandpass',.35,1.5);beep(98,t,1.6,.18,'sine');}
  shake(250,2);speak('',line||'');
  await wait(ms);el.classList.remove('go');await wait(500);el.classList.add('hidden');
}
// 장 타이틀 카드: 연대표에서 지금 어디로 가는지 보여 주고, 이 장의 질문을 던진다
const TL=[2026,2019,2008,1998,1989,1978,1976];
function chap(n,title,date,place,q){
  const y=+(date.match(/\d{4}/)||[0])[0],idx=TL.indexOf(y);
  const tl=TL.map((v,i)=>`<span class="${i===idx?'on':i<idx?'past':''}">${v}</span>`).join('');
  return `<div class="chap"><div class="cn">${n}</div><h1>${title}</h1><div class="cl"></div><p>${date}</p><p class="pl">${place}</p>${q?`<p class="q">${q}</p>`:''}${idx>=0?`<div class="tl"><span class="ar">◀ 과거로</span>${tl}</div>`:''}</div>`;}
// 인물 소개 카드 (영화 오프닝처럼)
const PEOPLE={
  seoyun:{n:'서윤',r:'주인공 · 유품정리사 · 27세',d:'오래 사랑받은 물건에 손을 대면, 그 물건이 기억하는 장면을 본다.'},
  mrAdult:{n:'한미래',r:'고인의 딸 · 43세',d:'아버지와 연락을 끊고 살았다. 유품은 「전부 처리해 달라」고 했다.'},
  jwChair:{n:'한정우',r:'오르골의 주인 · 등대지기 43년',d:'등불리 등대를 평생 지켰다. 지난달, 요양원에서 세상을 떠났다.'},
  ehMid:{n:'윤은하',r:'정우의 아내',d:'바다에서 아버지를 잃었다. 「기다리는 노래」를 만든 사람.'},
  taeo:{n:'서태오',r:'해진호 통신사 · 25세',d:'만삭의 아내를 두고 폭풍의 바다에 나와 있다.'},
  ehYoung:{n:'윤은하',r:'1976년 · 19세',d:'바위에 앉아, 아직 끝이 없는 노래를 부른다.'},
  jwYoung:{n:'한정우',r:'1976년 · 23세',d:'오늘 부임한 신임 등대지기. 혼자 불을 켜 본 적은 아직 없다.'},
};
async function introCard(id,ms=3600){
  const p=PEOPLE[id];if(!p)return;hideDialog();if(!F.met)F.met=[];if(!F.met.includes(id))F.met.push(id);
  const c=$('inPort'),g=c.getContext('2d');g.clearRect(0,0,300,380);g.drawImage(paintPortrait(id,id==='mrAdult'?'sad':''),0,0);
  $('inRole').textContent=p.r;$('inName').textContent=p.n;$('inDesc').textContent=p.d;
  const el=$('intro');el.classList.remove('hidden');void el.offsetWidth;el.classList.add('on');
  if(A.C){const t=A.C.currentTime;mbox(76,t,.1);mbox(83,t+.18,.08);}speak('',p.n+'. '+p.d);
  await wait(ms);el.classList.remove('on');await wait(600);el.classList.add('hidden');
}
// 기억 일지: 지금까지 만난 사람과 본 기억
function openJournal(){
  if(!started||locked&&!choice)return toast('대화가 끝난 뒤에 열 수 있어요');
  const j=$('jBody');let h='<h3>등장인물</h3>';
  for(const id of (F.met||[])){const p=PEOPLE[id];if(!p)continue;h+=`<div class="jp" data-id="${id}"><canvas width="300" height="380"></canvas><div><div class="n">${p.n} <small style="color:#998">${p.r}</small></div><div class="d">${p.d}</div></div></div>`;}
  h+='<h3>기억 연대표 — 오르골은 가장 최근의 기억부터 보여 준다</h3>';
  for(const c of (typeof CH!=='undefined'?CH:[])){const done=c.done&&F[c.done];h+=`<div class="jt ${done?'':'lock'}"><div class="y">${c.y}</div><div class="tt">${done?c.t:'???'}</div>${done?`<div class="s">${c.s}</div>`:''}</div>`;}
  j.innerHTML=h;j.querySelectorAll('.jp').forEach(e=>e.querySelector('canvas').getContext('2d').drawImage(paintPortrait(e.dataset.id,''),0,0));
  const pn=$('journal');pn.classList.remove('hidden');const close=()=>{pn.classList.add('hidden');panelKeys=null;};$('jClose').onclick=close;panelKeys=k=>{if(k==='esc'||k==='enter')close();};
}
$('oBook').onclick=e=>{e.stopPropagation();gearOpen(false);openJournal();};
// 미니게임 1: 연타 게이지
function mashGame(title,desc,{need=1,gain=.075,decay=.16,btn='힘주기'}={}){
  return new Promise(res=>{
    const pn=$('mini');$('mnT').textContent=title;$('mnH').innerHTML=desc;$('mnBar').style.width='0%';$('mnDial').classList.add('hidden');$('mnBarW').classList.remove('hidden');
    $('mnBtns').innerHTML=`<button id="mnGo">${btn} (Space 연타)</button>`;let v=0,done=false,last=performance.now();
    const finish=()=>{done=true;panelKeys=null;$('mnBar').style.width='100%';SFX.chime();setTimeout(()=>{pn.classList.add('hidden');res();},500);};
    const hit=()=>{if(done)return;v+=gain;SFX.pin(60+Math.round(Math.min(v,need)*24));shake(80,.8);if(v>=need-1e-6)finish();};
    $('mnGo').onpointerdown=e=>{e.preventDefault();e.stopPropagation();hit();};
    panelKeys=k=>{if(k==='act'||k==='enter')hit();};
    (function f(){if(done)return;const now=performance.now(),dt=(now-last)/1000;last=now;v=Math.max(0,v-decay*dt*(v>0?1:0));$('mnBar').style.width=(v/need*100)+'%';
      requestAnimationFrame(f);})();
    pn.classList.remove('hidden');
  });
}
// 미니게임 2: 다이얼 맞추기
function tuneGame(title,desc,onLock){
  return new Promise(res=>{
    const pn=$('mini');$('mnT').textContent=title;$('mnH').innerHTML=desc;$('mnBarW').classList.add('hidden');$('mnDial').classList.remove('hidden');
    $('mnBtns').innerHTML='<button id="mnL">◀ 왼쪽</button><button id="mnR">오른쪽 ▶</button>';
    let v=.1,target=.62+Math.random()*.2,hold=0,done=false,dir=0,last=performance.now(),src=null,ng=null;
    if(A.C){src=A.C.createBufferSource();src.buffer=A.noise;src.loop=true;const f=A.C.createBiquadFilter();f.type='bandpass';f.frequency.value=1500;ng=A.C.createGain();ng.gain.value=.12;src.connect(f);f.connect(ng);ng.connect(A.sfx);src.start();}
    const hold_=(d)=>e=>{e.preventDefault();e.stopPropagation();dir=d;};const rel=e=>{dir=0;};
    ['L','R'].forEach((k,i)=>{const b=$('mn'+k);b.onpointerdown=hold_(i?1:-1);b.onpointerup=rel;b.onpointerleave=rel;});
    panelKeys=k=>{if(k==='left')v-=.025;if(k==='right')v+=.025;};
    (function f(){if(done)return;const now=performance.now(),dt=(now-last)/1000;last=now;v=Math.max(0,Math.min(1,v+dir*dt*.35));
      const dist=Math.abs(v-target),q=Math.max(0,1-dist*9);$('mnNeedle').style.left=(v*100)+'%';$('mnSig').style.width=(q*100)+'%';
      if(ng)ng.gain.value=.14*(1-q)+.01;
      if(dist<.035){hold+=dt;if(hold>.8){done=true;panelKeys=null;if(src)src.stop();SFX.chime();setTimeout(()=>{pn.classList.add('hidden');res();},400);return;}}else hold=0;
      requestAnimationFrame(f);})();
    pn.classList.remove('hidden');
  });
}
// 엔딩 크레딧
async function credits(lines,ms=26000){
  const el=$('credits'),inner=$('crIn');inner.innerHTML=lines.map(l=>l?`<p>${l}</p>`:'<br>').join('');el.classList.remove('hidden');
  inner.style.transition='none';inner.style.transform='translateY(100vh)';void inner.offsetWidth;inner.style.transition=`transform ${ms}ms linear`;inner.style.transform=`translateY(-${inner.offsetHeight+40}px)`;
  await wait(ms);el.classList.add('hidden');
}
const nar=t=>say('',t);
function hideDialog(){$('dialog').classList.add('hidden');document.body.classList.remove('talking');shutUp();showBust(null);}
// 큰 일러스트 초상화: 대사창 위에 선다
let bustKey='';
function showBust(pid,ex){
  const b=$('bust'),d=$('dialog');
  if(!pid||typeof paintPortrait!=='function'||!hasPaint(pid)){b.classList.remove('on');d.classList.remove('withbust');bustKey='';return;}
  const k=pid+ex;if(k!==bustKey){const g=b.getContext('2d');g.clearRect(0,0,300,380);g.drawImage(paintPortrait(pid,ex),0,0);
    if(bustKey){b.classList.remove('swap');void b.offsetWidth;b.classList.add('swap');}bustKey=k;}
  b.classList.add('on');layout();
}
function choose(opts){
  return new Promise(res=>{
    const el=$('choices');el.innerHTML='';
    const fin=i=>{el.classList.add('hidden');choice=null;SFX.blip();res(i);};
    choice={n:opts.length,sel:0,fin,render(){[...el.children].forEach((c,j)=>c.classList.toggle('sel',j===choice.sel));}};
    opts.forEach((o,i)=>{const b=document.createElement('div');b.className='ch';b.textContent=o;
      b.onclick=ev=>{ev.stopPropagation();fin(i);};b.onmouseenter=()=>{if(choice){choice.sel=i;choice.render();}};el.appendChild(b);});
    el.classList.remove('hidden');layout();choice.render();
  });
}
function setOp(el,v,ms){el.style.transition=`opacity ${ms}ms`;void el.offsetWidth;el.style.opacity=v;return wait(ms);}
async function cardShow(html,ms=700,clear=false){const c=$('card');c.classList.toggle('clear',clear);c.innerHTML=html;speak('',html);await setOp(c,1,ms);}
async function cardHide(ms=1000){await setOp($('card'),0,ms);}
async function cardLines(lines,clear=true,hold=3000){for(const l of lines){await cardShow(`<p>${l}</p>`,1100,clear);await wait(hold+l.length*40);await cardHide(900);}}
let toastT=0;
function toast(t,ms=3800){const el=$('toast');el.textContent=t;el.style.opacity=1;clearTimeout(toastT);toastT=setTimeout(()=>el.style.opacity=0,ms);}
function hud(){
  const h=$('hud');let s='';
  if(S&&S.frags){const n=S.frags.filter(f=>F[f]).length;s+=`기억의 조각 ${'◆'.repeat(n)}${'◇'.repeat(S.frags.length-n)}<br>`;}
  if(F.notes.length){const all=[...F.notes];while(all.length<6)all.push(null);s+='♪ '+all.map(m=>m?NOTE_NAME[m]:'·').join(' ')+'<br>';}
  if(F.keeps.length)s+=`♥ 미래의 조각 ${F.keeps.length}/6<br>`;
  if(F.cats.length)s+=`🐱 ${F.cats.length}/5`;
  h.innerHTML=s;
  const g=$('goal');if(g){const t=S?(S.goal?S.goal():(typeof defGoal==='function'&&S.frags?defGoal():'')):'';g.textContent=t?'▸ '+t:'';g.style.opacity=t?1:0;}
}
async function addNotes(ns){F.notes.push(...ns);hud();SFX.chime();sparkFx(P.fx*TS+8,P.fy*TS,14);toast('♪ 음의 조각을 얻었다 — '+ns.map(m=>NOTE_NAME[m]).join(' · '),4500);await wait(900);}
function keep(id,label){if(F.keeps.includes(id))return;F.keeps.push(id);SFX.keep();sparkFx(P.fx*TS+8,P.fy*TS,10,'255,170,190');hud();toast(`♥ 미래의 조각 — ${label} (${F.keeps.length}/6)`,4500);}
function egg(id,label){if(META.eggs.includes(id))return;META.eggs.push(id);saveMeta();SFX.chime();setTimeout(()=>toast(`🥚 이스터에그 발견 — ${label} (${META.eggs.length}/7)`,5000),600);}
function walk(e,path,speed=2.6){return new Promise(r=>{e.path=path.map(p=>p.slice());e.speed=speed;e.onDone=r;});}
function hop(e,n=2){e.hop=n*.3;return wait(n*300);}
async function run(fn){
  if(locked)return;locked=true;
  try{await fn();}catch(err){console.error(err);}
  hideDialog();locked=false;autosave();hud();
}
function frag(id,fn){
  return async e=>{
    await fn(e,!!F[id]);
    if(!F[id]){F[id]=true;e.glow=false;SFX.chime();sparkFx(e.fx*TS+e.w*8,e.fy*TS+4,12);hud();
      const n=S.frags.filter(f=>F[f]).length;toast(`기억의 조각 (${n}/${S.frags.length})`);
      if(n>=S.frags.length&&S.finale){hideDialog();await wait(600);letterbox(true);await S.finale();letterbox(false);cam(null);}}
  };
}

/* =========================================================
   장면 전환 · 저장
   ========================================================= */
function loadScene(name){
  S=SC[name];sceneName=name;S.lit=!!S.litInit;curDark=S.dark||0;ents=S.map?S.ents():[];
  const [x,y,d]=S.start||[0,0,'down'];Object.assign(P,{x,y,fx:x,fy:y,tx:x,ty:y,dir:d,moving:false,hidden:!!S.noPlayer});
  PT.length=0;FP.length=0;EM.length=0;CAM.x=W/2;CAM.y=H/2;CAM.z=1;CAM.a=null;LB.t=0;VIS.ta=0;VIS.a=0;
  if(S.map)buildTiles();
  playBgm(S.bgm);setAmb(S.amb);hud();
  if(SCENE_LABEL[name]&&!F.ended)store.set('lhmb_save',snapshot());
}
/* ---------- 저장 ---------- */
const SCENE_LABEL={present:'현재 · 한정우의 집',m25:'제1장 · 2026 요양원',m19:'제2장 · 2019 등대 관리실',m08:'제3장 · 2008 예식장 앞',m98:'제4장 · 1998 병실',mstorm:'제5장 · 1998 폭풍의 등대',mboat:'제6장 · 서윤의 장',m85:'제7장 · 1989 등명실',m78:'제8장 · 1978 결혼식',m76:'제9장 · 1976 해변'};
function snapshot(){return {v:2,scene:sceneName,F:JSON.parse(JSON.stringify(F)),pos:[P.x,P.y,P.dir],t:Date.now()};}
function canSave(){return started&&S&&S.map&&SCENE_LABEL[sceneName]&&!F.ended;}
function autosave(){if(canSave()&&!locked)store.set('lhmb_save',snapshot());}
function storageOK(){try{localStorage.setItem('lhmb_t','1');localStorage.removeItem('lhmb_t');return true;}catch(e){return false;}}
function saveLabel(sv){
  if(!sv)return '<b>비어 있음</b>';
  const d=new Date(sv.t||0),pad=n=>String(n).padStart(2,'0');
  const f=sv.F||{},bits=[`♪ ${(f.notes||[]).length}/6`];if((f.keeps||[]).length)bits.push(`♥ ${f.keeps.length}/6`);if((f.cats||[]).length)bits.push(`🐱 ${f.cats.length}/5`);
  return `<b>${SCENE_LABEL[sv.scene]||sv.scene}</b><small>${bits.join(' · ')} · ${d.getMonth()+1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}</small>`;
}
// 불러오기: 장면을 다시 만들고 저장된 위치에 서윤을 세운다
async function restore(sv){
  const cm=F.catMode;resetF(sv.F);if(cm)F.catMode=cm;
  locked=true;hideDialog();await setOp($('fader'),0,10);$('fader').style.background='#000';await setOp($('fader'),1,500);
  loadScene(sv.scene);
  if(sv.pos){const [x,y,d]=sv.pos;if(!solidAt(x,y)||!ents.length)Object.assign(P,{x,y,fx:x,fy:y,tx:x,ty:y,dir:d||'down'});}
  await setOp($('fader'),0,700);$('fader').style.background='#fff';
  toast('불러왔습니다 — '+(SCENE_LABEL[sv.scene]||''));locked=false;
}
function openSaves(mode){ // mode: 'game'(저장+불러오기) | 'load'(불러오기만)
  return new Promise(res=>{
    const pn=$('saves'),list=$('svList'),msg=$('svMsg');let cur=0,ask=null;
    $('svTitle').textContent=mode==='load'?'불러오기':'저장 / 불러오기';
    $('svHint').innerHTML=(storageOK()?'':'⚠ 이 화면에서는 브라우저 저장소를 쓸 수 없어 저장이 남지 않을 수 있어요.<br>')+
      (mode==='load'?'불러올 기록을 고르세요.':'저장할 칸을 고르세요. 대화 중이 아닐 때만 저장됩니다.<br>자동 저장은 무언가를 조사할 때마다 따로 기록됩니다.');
    msg.textContent='';
    const slots=()=>[['auto','자동 저장'],['s1','슬롯 1'],['s2','슬롯 2'],['s3','슬롯 3']].map(([k,n])=>({k,n,key:k==='auto'?'lhmb_save':'lhmb_slot_'+k,sv:store.get(k==='auto'?'lhmb_save':'lhmb_slot_'+k,null)}));
    function render(){
      list.innerHTML='';
      slots().forEach((s,i)=>{
        const row=document.createElement('div');row.className='sv'+(i===cur&&!isTouch?' cur':'');
        const ok=s.sv&&SCENE_LABEL[s.sv.scene];
        row.innerHTML=`<div class="info"><small>${s.n}</small>${saveLabel(ok?s.sv:null)}</div>`;
        if(mode==='game'&&s.k!=='auto'){const b=document.createElement('button');b.textContent=ask===s.k?'덮어쓰기?':'저장';b.onclick=ev=>{ev.stopPropagation();doSave(s);};row.appendChild(b);}
        const l=document.createElement('button');l.textContent='불러오기';l.disabled=!ok;l.onclick=ev=>{ev.stopPropagation();if(ok)doLoad(s);};row.appendChild(l);
        list.appendChild(row);});
    }
    function doSave(s){
      if(s.sv&&ask!==s.k){ask=s.k;msg.textContent='이미 기록이 있어요. 한 번 더 누르면 덮어씁니다.';render();return;}
      ask=null;store.set(s.key,snapshot());SFX.keep();msg.textContent=`${s.n}에 저장했습니다.`;render();
    }
    function doLoad(s){close(true);if(mode==='load')res(s.sv);else{restore(s.sv);res(null);}}
    function close(silent){pn.classList.add('hidden');panelKeys=null;if(!silent)res(null);}
    $('svClose').onclick=()=>close();
    panelKeys=k=>{const n=4;if(k==='up')cur=(cur+n-1)%n;else if(k==='down')cur=(cur+1)%n;else if(k==='esc')return close();
      else if(k==='act'||k==='enter'){const s=slots()[cur];if(mode==='game'&&s.k!=='auto'&&k==='act')doSave(s);else if(s.sv&&SCENE_LABEL[s.sv.scene])doLoad(s);return;}render();};
    pn.classList.remove('hidden');render();
  });
}
$('oSave').onclick=e=>{e.stopPropagation();audioInit();gearOpen(false);
  if(!started){if(menu)menu.openLoad&&menu.openLoad();return;}
  if(!canSave()){toast('지금은 저장할 수 없어요');return;}
  if(locked||choice||panelKeys){toast('대화가 끝난 뒤에 저장할 수 있어요');return;}
  openSaves('game');};

async function goScene(name,cardHtml,{white=true,hold=2600}={}){
  locked=true;hideDialog();
  if(white){SFX.whoosh();shake(900,2);cam(P.fx*TS+8,P.fy*TS+8,2.2,1100);await setOp($('fader'),1,1100);}
  await cardShow(cardHtml,white?500:1200);
  $('fader').style.transition='none';$('fader').style.opacity=0;
  loadScene(name);
  await wait(hold);await cardHide(1300);
  if(S.title)toast(S.title);
  locked=false;
  if(S.enter)await run(S.enter);
}

/* =========================================================
   입력
   ========================================================= */
const held={};let dirOrder=[],panelKeys=null,menu=null;
const KEYMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
const KONAMI=['up','up','down','down','left','right','left','right'];let konami=[];
function pressDir(d,on){
  if(on){if(!held[d]){held[d]=true;dirOrder.push(d);
    konami.push(d);konami=konami.slice(-8);if(konami.join()===KONAMI.join()&&started){konami=[];F.catMode=!F.catMode;SFX.meow();sparkFx(P.fx*TS+8,P.fy*TS+4,16);egg('konami','소금이 모드');}}}
  else{held[d]=false;dirOrder=dirOrder.filter(x=>x!==d);}
}
function curDir(){return dirOrder[dirOrder.length-1];}
addEventListener('keydown',e=>{
  const d=KEYMAP[e.code];
  if(panelKeys){e.preventDefault();if(d)panelKeys(d);else if(e.code==='Space')panelKeys('act');else if(e.code==='Enter'||e.code==='NumpadEnter')panelKeys('enter');else if(e.code==='Escape')panelKeys('esc');else if(/^Digit[1-7]$/.test(e.code))panelKeys('n'+e.code.slice(5));return;}
  if(menu&&d&&(d==='up'||d==='down')){e.preventDefault();menu.move(d==='down'?1:-1);return;}
  if(choice&&d&&(d==='up'||d==='down')){e.preventDefault();choice.sel=(choice.sel+(d==='down'?1:choice.n-1))%choice.n;choice.render();return;}
  if(d){e.preventDefault();pressDir(d,true);return;}
  if(e.code==='Space'||e.code==='Enter'||e.code==='KeyZ'||e.code==='NumpadEnter'){e.preventDefault();if(!e.repeat)onAction();}
});
addEventListener('keyup',e=>{const d=KEYMAP[e.code];if(d)pressDir(d,false);});
addEventListener('blur',()=>{for(const k in held)held[k]=false;dirOrder=[];});
function onAction(){
  audioInit();
  if(menu){menu.pick();return;}
  if(!started)return;
  if(choice){choice.fin(choice.sel);return;}
  if(typeSkip){typeSkip();return;}
  if(waiters.length){shutUp();const w=waiters;waiters=[];w.forEach(f=>f());return;}
  if(!locked&&!P.moving&&!P.hidden)tryInteract();
}
$('dialog').addEventListener('click',e=>{e.preventDefault();onAction();});
// 플로팅 조이스틱: 화면 아무 데나 누르면 그 자리에 휠이 생긴다. 짧게 톡 치면 「조사」.
const JOY={id:null,x:0,y:0,t:0,moved:false,dir:null};
function joySet(d){if(JOY.dir===d)return;if(JOY.dir)pressDir(JOY.dir,false);JOY.dir=d;if(d)pressDir(d,true);}
if(isTouch){
  $('touch').classList.remove('hidden');
  const UI='#gear,#dialog,#choices,.panel,#opts,#tA,#title,#endcard,#credits,#cutin';
  addEventListener('pointerdown',e=>{
    if(JOY.id!==null||e.pointerType==='mouse'||e.target.closest(UI))return;
    if(menu)return;
    JOY.id=e.pointerId;JOY.x=e.clientX;JOY.y=e.clientY;JOY.t=performance.now();JOY.moved=false;
    const j=$('joy');j.style.left=JOY.x+'px';j.style.top=JOY.y+'px';$('joyK').style.transform='translate(-50%,-50%)';j.classList.add('on');
  },{passive:true});
  addEventListener('pointermove',e=>{
    if(e.pointerId!==JOY.id)return;let dx=e.clientX-JOY.x,dy=e.clientY-JOY.y;const d=Math.hypot(dx,dy),R_=46;
    if(d>R_){dx=dx/d*R_;dy=dy/d*R_;}$('joyK').style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
    if(d>12){JOY.moved=true;const dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
      if(choice&&(dir==='up'||dir==='down')){if(JOY.dir!==dir){JOY.dir=dir;choice.sel=(choice.sel+(dir==='down'?1:choice.n-1))%choice.n;choice.render();}return;}
      if(panelKeys){if(JOY.dir!==dir){JOY.dir=dir;panelKeys(dir);}return;}
      joySet(dir);}
    else if(!choice&&!panelKeys)joySet(null);
  },{passive:true});
  const end=e=>{if(e.pointerId!==JOY.id)return;JOY.id=null;$('joy').classList.remove('on');
    if(!JOY.moved&&performance.now()-JOY.t<260)onAction();
    if(choice||panelKeys)JOY.dir=null;else joySet(null);};
  addEventListener('pointerup',end);addEventListener('pointercancel',end);
  $('tA').addEventListener('pointerup',e=>{e.preventDefault();onAction();});
}
function tryInteract(){
  const fx=P.x+DX[P.dir],fy=P.y+DY[P.dir];
  const here=e=>!e.hidden&&e.on&&covers(e,fx,fy);
  const e=ents.find(e=>here(e)&&e.kind==='char')||ents.find(e=>here(e)&&e.layer!==0)||ents.find(here);
  if(e)run(()=>e.on(e));
}

/* =========================================================
   업데이트 & 렌더
   ========================================================= */
function update(dt){
  T+=dt;
  if(P.moving){
    const sp=4.6*dt,dx=P.tx-P.fx,dy=P.ty-P.fy,d=Math.abs(dx)+Math.abs(dy);
    if(d<=sp){P.fx=P.tx;P.fy=P.ty;const ox=P.x,oy=P.y;P.x=P.tx;P.y=P.ty;P.moving=false;
      const sand=tileAt(P.x,P.y)==='s';SFX.step(sand);if(sand)FP.push({x:P.x,y:P.y,d:P.dir,t:T});
      const f=ent('follow');if(f&&!f.hidden)walk(f,[[ox,oy]],4.2);}
    else{P.fx+=Math.sign(dx)*sp;P.fy+=Math.sign(dy)*sp;}
  }
  if(!P.moving&&!locked&&!P.hidden&&!choice&&!panelKeys&&!menu){
    const d=curDir();
    if(d){P.dir=d;const nx=P.x+DX[d],ny=P.y+DY[d];if(!solidAt(nx,ny)){P.tx=nx;P.ty=ny;P.moving=true;}}
  }
  for(const e of ents){
    if(e.hop>0)e.hop=Math.max(0,e.hop-dt);
    if(e.path&&e.path.length){
      const [tx,ty]=e.path[0],dx=tx-e.fx,dy=ty-e.fy,d=Math.hypot(dx,dy),st=e.speed*dt;
      if(Math.abs(dx)>.01||Math.abs(dy)>.01)e.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
      if(d<=st){e.fx=e.x=tx;e.fy=e.y=ty;e.path.shift();if(!e.path.length){e.walking=false;const f=e.onDone;e.onDone=null;f&&f();}}
      else{e.fx+=dx/d*st;e.fy+=dy/d*st;e.walking=true;}
    }
  }
  if(S&&S.storm){nextFlash-=dt;if(nextFlash<=0){flash=1;nextFlash=7+Math.random()*8;shake(300,1.5);setTimeout(()=>SFX.thunder(),600+Math.random()*900);}}
  flash=Math.max(0,flash-dt*2.2);
  for(const m of motes){m.y-=m.s*dt*14;m.x+=Math.sin(T+m.a)*dt*3;if(m.y<-2){m.y=H+2;m.x=Math.random()*W;}}
  if(CAM.a){const a=CAM.a;a.t+=dt;let k=Math.min(1,a.t/a.d);k=k*k*(3-2*k);CAM.x=a.sx+(a.tx-a.sx)*k;CAM.y=a.sy+(a.ty-a.sy)*k;CAM.z=a.sz+(a.tz-a.sz)*k;if(a.t>=a.d){CAM.a=null;a.r();}}
  LB.v+=(LB.t-LB.v)*Math.min(1,dt*4);
  if(SH.t>0)SH.t-=dt;
  VIS.a+=Math.sign(VIS.ta-VIS.a)*Math.min(Math.abs(VIS.ta-VIS.a),dt*VIS.sp);if(VIS.a<=0&&VIS.ta===0)VIS.o=null;
  for(let i=EM.length-1;i>=0;i--){EM[i].t+=dt;if(EM[i].t>EM[i].d)EM.splice(i,1);}
  for(let i=PT.length-1;i>=0;i--){const p=PT[i];p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.g)p.vy+=p.g*dt;if(p.kind==='note')p.x+=Math.sin(p.life*5)*dt*8;if(p.life>p.max)PT.splice(i,1);}
  while(FP.length&&T-FP[0].t>7)FP.shift();
  if(S&&S.tick)S.tick(dt);
}
let last=performance.now();
function frame(ts){const dt=Math.min(.05,(ts-last)/1000);last=ts;update(dt);draw();requestAnimationFrame(frame);}
