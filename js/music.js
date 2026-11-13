'use strict';
/* =========================================================
   음악 — 합성 악기 오케스트라와 장별 테마곡 (전부 자작, WebAudio 실시간 합성)
   ========================================================= */
function vib(o,t,f,rate,depth,delay=.25){
  const C=A.C,l=C.createOscillator(),g=C.createGain();l.frequency.value=rate;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(f*depth,t+delay+.3);
  l.connect(g);g.connect(o.frequency);l.start(t);return l;
}
function bowed(m,t,d,v,dest,{cut=1800,att=.12,rel=.35,rate=5.2,depth=.006,det=4,q=.7}={}){
  const C=A.C;if(!C)return;const f=mf(m),end=t+d+rel;
  const fl=C.createBiquadFilter();fl.type='lowpass';fl.frequency.value=cut;fl.Q.value=q;
  const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.setValueAtTime(v,t+Math.max(att,d*.8));g.gain.linearRampToValueAtTime(0,end);
  fl.connect(g);g.connect(dest);
  [-det,det].forEach(c=>{const o=C.createOscillator();o.type='sawtooth';o.frequency.value=f;o.detune.value=c;o.connect(fl);const l=vib(o,t,f,rate,depth);o.start(t);o.stop(end+.05);l.stop(end+.05);});
}
const INST={
  piano:(m,t,d,v,dest)=>piano(m,t,Math.max(d,.6)*1.4,v,dest),
  epiano:(m,t,d,v,dest)=>{const C=A.C;if(!C)return;[[1,1,'sine'],[2,.3,'sine'],[3.01,.08,'sine']].forEach(([k,a,ty])=>{const o=C.createOscillator(),g=C.createGain();o.type=ty;o.frequency.value=mf(m)*k;env(g,t,v*a,.01,Math.max(d,.8)*1.6);o.connect(g);g.connect(dest);o.start(t);o.stop(t+d*2+1);});},
  cello:(m,t,d,v,dest)=>bowed(m,t,d,v,dest,{cut:1100,att:.16,rel:.4,rate:5,depth:.007}),
  violin:(m,t,d,v,dest)=>bowed(m,t,d,v,dest,{cut:3600,att:.1,rel:.3,rate:5.6,depth:.009,det:6,q:1.2}),
  strings:(m,t,d,v,dest)=>bowed(m,t,d,v,dest,{cut:1500,att:Math.min(.8,d*.4),rel:1,rate:4.6,depth:.004,det:9}),
  flute:(m,t,d,v,dest)=>{const C=A.C;if(!C)return;const f=mf(m),end=t+d+.15;const o=C.createOscillator();o.type='sine';o.frequency.value=f;
    const o2=C.createOscillator();o2.type='triangle';o2.frequency.value=f*2;const g2=C.createGain();g2.gain.value=.08;o2.connect(g2);
    const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.07);g.gain.setValueAtTime(v*.85,t+d*.8);g.gain.linearRampToValueAtTime(0,end);
    o.connect(g);g2.connect(g);g.connect(dest);const l=vib(o,t,f,4.8,.006,.2);
    const n=C.createBufferSource();n.buffer=A.noise;const nf=C.createBiquadFilter();nf.type='bandpass';nf.frequency.value=f*2;nf.Q.value=2;const ng=C.createGain();env(ng,t,v*.25,.02,.12);n.connect(nf);nf.connect(ng);ng.connect(dest);
    [o,o2].forEach(x=>{x.start(t);x.stop(end+.05);});l.stop(end);n.start(t,Math.random());n.stop(t+.2);},
  harp:(m,t,d,v,dest)=>{const C=A.C;if(!C)return;const f=mf(m);const fl=C.createBiquadFilter();fl.type='lowpass';fl.frequency.value=3200;fl.connect(dest);
    [[1,'triangle',1,1.8],[2,'sine',.25,.6]].forEach(([k,ty,a,dd])=>{const o=C.createOscillator(),g=C.createGain();o.type=ty;o.frequency.value=f*k;env(g,t,v*a,.003,dd);o.connect(g);g.connect(fl);o.start(t);o.stop(t+dd+.1);});},
  guitar:(m,t,d,v,dest)=>{const C=A.C;if(!C)return;const fl=C.createBiquadFilter();fl.type='lowpass';fl.Q.value=2;fl.frequency.setValueAtTime(3500,t);fl.frequency.exponentialRampToValueAtTime(500,t+.4);fl.connect(dest);
    const o=C.createOscillator(),g=C.createGain();o.type='sawtooth';o.frequency.value=mf(m);env(g,t,v*.6,.003,1.3);o.connect(g);g.connect(fl);o.start(t);o.stop(t+1.5);},
  celesta:(m,t,d,v,dest)=>mbox(m-12,t,v*1.6,dest),
  pizz:(m,t,d,v,dest)=>{const C=A.C;if(!C)return;const o=C.createOscillator(),g=C.createGain(),fl=C.createBiquadFilter();fl.type='lowpass';fl.frequency.value=900;o.type='triangle';o.frequency.value=mf(m);env(g,t,v,.005,.5);o.connect(fl);fl.connect(g);g.connect(dest);o.start(t);o.stop(t+.7);},
  timp:(m,t,d,v,dest)=>{const C=A.C;if(!C)return;const o=C.createOscillator(),g=C.createGain();o.type='sine';o.frequency.setValueAtTime(mf(m)*1.5,t);o.frequency.exponentialRampToValueAtTime(mf(m),t+.15);env(g,t,v,.005,1.2);o.connect(g);g.connect(dest);o.start(t);o.stop(t+1.4);
    const n=C.createBufferSource();n.buffer=A.noise;const nf=C.createBiquadFilter();nf.type='lowpass';nf.frequency.value=220;const ng=C.createGain();env(ng,t,v*.8,.003,.5);n.connect(nf);nf.connect(ng);ng.connect(dest);n.start(t,Math.random());n.stop(t+.6);},
};
/* 악보 표기: "E5:1 G5:1 A5:2 | -:4" — 마디는 |, 쉼표는 -, 숫자는 박 */
const NOTE_IDX={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function nm(s){const r=/^([A-G])([#b]?)(-?\d)$/.exec(s);if(!r)return 0;return 12*(+r[3]+1)+NOTE_IDX[r[1]]+(r[2]==='#'?1:r[2]==='b'?-1:0);}
function score(str){return str.split('|').map(bar=>bar.trim().split(/\s+/).filter(Boolean).map(tok=>{const [n,b]=tok.split(':');return [n==='-'?0:nm(n),b?+b:1];}));}
function chords(str){return str.split(/\s+/).filter(Boolean).map(c=>{ // "Am" "F" "G7" "C/E" "Gm" "D" "Eb" "G#dim"
  const r=/^([A-G][#b]?)(m|dim|7|maj7|m7|sus4)?$/.exec(c);let root=nm(r[1]+'3');if(root>52)root-=12;const q=r[2]||'';
  const iv=q==='m'?[0,3,7]:q==='dim'?[0,3,6]:q==='7'?[0,4,10]:q==='m7'?[0,3,10]:q==='maj7'?[0,4,11]:q==='sus4'?[0,5,7]:[0,4,7];
  const up=iv.map(i=>root+12+i);while(up[0]<57)for(let k=0;k<3;k++)up[k]+=12; up.sort((a,b)=>a-b);
  return [root,...up.map(x=>x>72?x-12:x).sort((a,b)=>a-b)];});}
const ARP8=[1,2,3,2,1,2,3,2],ARP_SOFT=[1,-1,3,-1,2,-1,3,-1],ARP_WALTZ=[0,-1,'c',-1,'c',-1],ARP_UP=[1,2,3,4,3,2,1,2];
const BGM={
  title:{bpm:60,ch:chords('C Am F G C Am Dm G'),mel:score('E5:1 G5:1 A5:2 | G5:1 E5:1 D5:2 | C5:1 D5:1 E5:1 G5:1 | A5:2 G5:2 | E5:1 G5:1 A5:2 | C6:1 B5:1 A5:2 | G5:1 E5:1 D5:1 E5:1 | C5:4'),
    p:{arp:['piano',.075],bass:['cello',.06],pad:['strings',.025],mel:['violin',.05]},arp:ARP_SOFT,melFrom:8},
  present:{bpm:58,ch:chords('Am F C G Am F Dm E'),mel:score('-:2 E5:1 D5:1 | C5:3 -:1 | -:2 G4:1 A4:1 | B4:2 G4:2 | -:2 E5:1 F5:1 | E5:2 D5:1 C5:1 | B4:1 C5:1 D5:2 | G#4:4'),
    p:{arp:['piano',.07],bass:['piano',.06],mel:['epiano',.07]},arp:ARP8},
  m25:{bpm:52,ch:chords('F Dm Bb C F Dm Gm C'),mel:score('A5:2 C6:2 | D6:1 C6:1 A5:2 | G5:2 A5:1 F5:1 | E5:4 | A5:2 C6:2 | F6:1 E6:1 D6:2 | C6:1 A5:1 G5:1 A5:1 | F5:4'),
    p:{pad:['strings',.035],bass:['cello',.045],mel:['celesta',.07],arp:['harp',.04]},arp:ARP_SOFT},
  m19:{bpm:56,ch:chords('Dm Bb F C Dm Bb Gm A'),mel:score('D4:2 F4:1 A4:1 | Bb4:2 A4:2 | A4:1 G4:1 F4:1 E4:1 | F4:2 E4:2 | D4:2 F4:1 A4:1 | C5:2 Bb4:1 A4:1 | G4:1 F4:1 E4:1 C4:1 | C#4:4'),
    p:{arp:['piano',.065],mel:['cello',.075],pad:['strings',.02]},arp:ARP8},
  m08:{bpm:120,bpb:3,ch:chords('Gm Eb Bb D Gm Cm D D'),mel:score('D5:2 G5:1 | F#5:2 D5:1 | Eb5:2 C5:1 | D5:3 | Bb4:1 C5:1 D5:1 | G5:2 F5:1 | Eb5:1 D5:1 C5:1 | D5:3'),
    p:{arp:['piano',.06],bass:['pizz',.08],mel:['violin',.055]},arp:ARP_WALTZ},
  m98:{bpm:48,ch:chords('Am Em F E Am Dm F E'),mel:score('E4:3 C4:1 | B3:2 E4:2 | A4:3 G4:1 | G#4:4 | A4:2 C5:2 | B4:2 G4:2 | F4:1 E4:1 D4:1 C4:1 | B3:4'),
    p:{pad:['strings',.04],mel:['cello',.08],arp:['piano',.04]},arp:ARP_SOFT},
  storm:{bpm:96,ch:chords('Dm Dm Bb A Dm Dm Gm A'),mel:score('A5:1 A5:1 F5:1 D5:1 | E5:2 C#5:2 | D5:1 F5:1 A5:1 D6:1 | C#6:4 | Bb5:1 A5:1 G5:1 F5:1 | E5:2 D5:2 | F5:1 E5:1 D5:1 C#5:1 | D5:4'),
    p:{arp:['cello',.05],mel:['violin',.05],pad:['strings',.025],drum:['timp',.12]},arp:[0,0,0,0,0,0,0,0],drum:[1,0,0,0,1,0,1,0]},
  reveal:{bpm:60,ch:chords('Ab Eb Fm Db Ab Eb Db Eb'),mel:score('C5:2 Eb5:1 F5:1 | G5:3 Eb5:1 | F5:2 Ab5:1 G5:1 | F5:4 | Eb5:2 F5:1 G5:1 | Ab5:2 Bb5:2 | C6:1 Bb5:1 Ab5:1 G5:1 | Ab5:4'),
    p:{arp:['piano',.06],mel:['violin',.065],bass:['cello',.04]},arp:ARP_SOFT},
  m85:{bpm:80,ch:chords('F C Dm Bb F C Bb C'),mel:score('C5:1 F5:1 A5:1 G5:1 | E5:2 C5:2 | D5:1 F5:1 A5:1 C6:1 | Bb5:2 A5:2 | G5:1 A5:1 Bb5:1 A5:1 | G5:1 F5:1 E5:1 D5:1 | C5:1 D5:1 E5:1 G5:1 | F5:4'),
    p:{arp:['guitar',.06],bass:['pizz',.07],mel:['flute',.06]},arp:ARP_UP},
  m78:{bpm:132,bpb:3,ch:chords('G D Em C G Am D G'),mel:score('B5:2 D6:1 | A5:2 F#5:1 | G5:1 A5:1 B5:1 | E5:3 | C6:2 B5:1 | A5:1 G5:1 F#5:1 | G5:1 A5:1 B5:1 | G5:3'),
    p:{arp:['harp',.06],bass:['pizz',.07],mel:['violin',.045],mel2:['flute',.035]},arp:ARP_WALTZ},
  m76:{bpm:70,ch:chords('C G Am F C G F G'),mel:score('E5:1 G5:1 A5:2 | G5:1 E5:1 D5:2 | -:4 | -:4 | E5:1 G5:1 A5:2 | G5:1 E5:1 D5:2 | -:2 C5:1 D5:1 | E5:4'),
    p:{arp:['harp',.065],mel:['flute',.06],pad:['strings',.02]},arp:ARP8},
  end:{bpm:64,ch:chords('C Am F G C Am Dm G F G Em Am F G C C'),
    mel:score('E5:1 G5:1 A5:2 | G5:1 E5:1 D5:2 | C5:1 D5:1 E5:1 G5:1 | A5:2 G5:2 | E5:1 D5:1 C5:2 | -:4 | E5:1 G5:1 A5:2 | C6:1 B5:1 A5:2 | A5:1 G5:1 E5:1 G5:1 | A5:2 B5:2 | C6:2 B5:1 G5:1 | A5:4 | F5:1 E5:1 D5:1 C5:1 | D5:2 G5:2 | C5:4 | -:4'),
    p:{arp:['piano',.06],bass:['cello',.055],pad:['strings',.03],mel:['violin',.055],mel2:['flute',.03]},arp:ARP8},
  bad:{bpm:44,ch:chords('Am G#dim F E'),mel:score('-:4 | E4:2 D4:1 C4:1 | -:4 | B3:4'),p:{bass:['cello',.06],arp:['piano',.05],mel:['cello',.06]},arp:[1,-1,-1,2,-1,-1,3,-1]},
};
BGM.credits=BGM.end;
function playBgm(name){
  if(!A.C){A.pendingBgm=name;return;}
  if(A.bgm&&A.bgm.name===name)return;
  const C=A.C,t=C.currentTime;
  if(A.bgm){const o=A.bgm;o.g.gain.cancelScheduledValues(t);o.g.gain.setValueAtTime(o.g.gain.value,t);o.g.gain.linearRampToValueAtTime(0,t+2);setTimeout(()=>o.g.disconnect(),2600);A.bgm=null;}
  if(!name||!BGM[name])return;
  const g=C.createGain();g.gain.value=0;g.gain.linearRampToValueAtTime(1.3,t+2.5);g.connect(A.music);
  A.bgm={name,g,step:0,next:t+.2,def:BGM[name]};
}
function bgmTick(){
  const b=A.bgm;if(!b||A.C.state!=='running')return;const C=A.C,d=b.def,sd=60/d.bpm/2,bpb=d.bpb||4,spb=bpb*2,P_=d.p;
  if(b.next<C.currentTime-.5)b.next=C.currentTime+.05;
  while(b.next<C.currentTime+.4){
    const bar=Math.floor(b.step/spb),i=b.step%spb,ch=d.ch[bar%d.ch.length],t=b.next,play=(part,m,dur,vk=1)=>{const p=P_[part];if(p)INST[p[0]](m,t,dur,p[1]*vk,b.g);};
    if(i===0){
      play('bass',ch[0],sd*spb*.95);if(P_.bass&&P_.bass[0]!=='pizz')play('bass',ch[0]-12,sd*spb*.95,.5);
      if(P_.pad)for(let k=1;k<4;k++)play('pad',ch[k]-12,sd*spb);
      if(d.mel&&bar>=(d.melFrom||0)){const mel=d.mel[(bar-(d.melFrom||0))%d.mel.length];let off=0;
        for(const [m,bt] of mel){const dur=bt*sd*2;if(m){INST[P_.mel[0]](m,t+off,dur*.95,P_.mel[1],b.g);if(P_.mel2)INST[P_.mel2[0]](m+12,t+off,dur*.9,P_.mel2[1],b.g);}off+=dur;}}
    }
    const pat=d.arp||ARP8,p=pat[i%pat.length];
    if(p==='c'){for(let k=1;k<4;k++)play('arp',ch[k],sd*2,.7);}
    else if(p===0&&P_.arp&&P_.arp[0]==='cello')play('arp',ch[0]+12,sd*.9,i%2?.6:1);
    else if(p===0)play('arp',ch[0]+12,sd*3);
    else if(p>0)play('arp',p===4?ch[1]+12:ch[p],sd*4,.8+Math.random()*.25);
    if(d.drum&&d.drum[i%d.drum.length])play('drum',ch[0]-12,sd*2,i===0?1:.6);
    b.step++;b.next+=sd;
  }
}
// 연주용: 원하는 악기로 멜로디 재생 (컷신에서 사용)
const solo=(notes,bpm,inst,vol=.12,opt)=>playSeq(notes,bpm,(m,t,d)=>INST[inst](m,t,d*.95,vol,A.sfx),opt);
