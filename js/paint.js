'use strict';
/* =========================================================
   도트 초상화 — 48×60 픽셀로 그린 상반신을 크게 확대해 쓴다
   paintPortrait(lookId, ex) → 300×380 캔버스
   ex: '' smile sad cry surp closed angry
   ========================================================= */
const PAINT={};
const EYEC={taeo:'#3a2618',jwOld:'#4a3a30',jwChair:'#4a3a30',soon:'#4a3a30',cap2:'#3a2a20'};
function portBg(id){
  if(id.startsWith('jw'))return '143,184,232';if(id.startsWith('eh'))return '240,168,184';if(id.startsWith('mr'))return '199,168,240';
  if(id==='seoyun')return '242,196,109';if(id.startsWith('taeo'))return '224,184,96';if(id==='nurse')return '168,216,224';return '200,190,170';
}
function pixBust(id,ex){
  const L=LOOK[id]||LOOK.seoyun,X=(typeof PORT_EXTRA!=='undefined'&&PORT_EXTRA[id])||{};
  const c=mk(48,60),g=c.getContext('2d');
  const p=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  const age=X.age||0,child=!!X.child,male=/^(jw|taeo|fisher|kid|cap)/.test(id),st=L.style,old=st==='old';
  const sk=L.skin,skD=shade(sk,.84),skDD=shade(sk,.7),skL=shade(sk,1.05);
  const hr=L.hair,hrD=shade(hr,.66),hrL=shade(hr,1.5),tp=L.top,tpD=shade(tp,.72),tpL=shade(tp,1.15);
  const eyeC=EYEC[id]||'#6a3e2a',ink='#2a1a1e';
  const cx=24,fTop=child?17:16,chin=child?40:41;
  const faceHW=r=>r<fTop+2?10:r<chin-6?12:Math.max(2,12-(r-(chin-6))*1.6);
  // 뒷머리
  if(st==='long'){for(let r=18;r<54;r++){const w=r<44?15:15-(r-44)*.6;p(cx-w,r,w*2,1,r>40?hrD:hr);}}
  if(st==='bob'){for(let r=18;r<40;r++)p(cx-15,r,30,1,hr);p(cx-15,39,30,1,hrD);}
  if(st==='pony'){for(let r=14;r<36;r++){const x=36+Math.sin(r*.25)*1.5;p(x,r,5-(r>30?2:0),1,r>28?hrD:hr);}}
  if(st==='pig'){for(let r=22;r<36;r++){p(5+(r>30?1:0),r,4,1,hr);p(39-(r>30?1:0),r,4,1,hr);}p(5,22,4,2,'#e05a6a');p(39,22,4,2,'#e05a6a');}
  // 몸
  const sh=child?.8:1;
  for(let r=46;r<60;r++){const w=Math.min(22*sh,(9+(r-46)*1.5)*sh);p(cx-w,r,w*2,1,tp);p(cx-w,r,2,1,tpL);p(cx+w-3,r,3,1,tpD);}
  if(L.gown){for(let r=46;r<60;r++){const w=Math.min(22*sh,(9+(r-46)*1.5)*sh);p(cx-w,r,w*2,1,'#fbfaf4');p(cx+w-3,r,3,1,'#dcd8cc');}
    p(17,46,14,2,sk);p(18,48,12,1,sk);for(let i=0;i<8;i++)p(10+i*4,53+(i%2),1,1,'#d8d0bc');}
  else if(L.detail==='tie'){p(19,46,10,4,'#f4f4f0');p(21,50,6,1,'#f4f4f0');p(23,46,2,13,'#7a2f3a');p(22,47,4,2,'#8a3a46');p(17,47,3,6,tpD);p(28,47,3,6,tpD);}
  else if(L.detail==='collar'){p(18,46,5,3,'#fbfbf8');p(25,46,5,3,'#fbfbf8');p(19,49,3,1,'#fbfbf8');p(26,49,3,1,'#fbfbf8');if(id==='mrTeen'){p(23,48,2,4,'#b03848');}}
  else if(L.detail==='coat'){p(23,47,2,13,tpD);p(19,46,4,4,tpD);p(25,46,4,4,tpD);p(21,52,2,2,'#d8b450');p(21,56,2,2,'#d8b450');}
  else if(L.detail==='zip'){p(23,47,1,13,tpD);p(18,46,5,3,tpD);p(25,46,5,3,tpD);p(12,53,6,1,tpD);if(id==='seoyun'){p(27,49,1,1,'#c8c8c8');p(28,50,1,2,'#c8c8c8');p(28,52,2,2,'#e8e0b0');}}
  // 목
  p(21,38,6,9,skD);p(21,44,6,2,skDD);
  // 귀
  p(cx-13,27,2,4,skD);p(cx+11,27,2,4,skD);
  // 얼굴
  for(let r=fTop;r<=chin;r++){const w=faceHW(r);p(cx-w,r,w*2,1,sk);p(cx+w-2,r,2,1,skD);}
  p(cx-8,fTop+1,4,1,skL);
  // 볼
  const blush=ex==='cry'||ex==='smile'?'rgba(235,100,100,.65)':'rgba(235,110,110,.4)';
  p(14,32,3,2,blush);p(31,32,3,2,blush);
  // 주름
  if(age>=2){p(13,26,1,1,skDD);p(34,26,1,1,skDD);p(18,35,1,2,skDD);p(29,35,1,2,skDD);}
  if(age>=3){p(18,19,12,1,skD);p(19,21,10,1,skD);p(16,30,4,1,skD);p(28,30,4,1,skD);}
  // 눈
  const eye=(x,s)=>{
    const y=26;
    if(ex==='smile'){p(x,y+1,1,1,ink);p(x+1,y,3,1,ink);p(x+4,y+1,1,1,ink);return;}
    if(ex==='closed'){p(x,y+1,1,1,ink);p(x+1,y+2,3,1,ink);p(x+4,y+1,1,1,ink);return;}
    const sad=ex==='sad'||ex==='cry',sur=ex==='surp',ang=ex==='angry';
    const h=sur?5:sad||ang||male?3:4,top=y+(sad?1:0)-(sur?1:0);
    p(x,top,5,h,'#fbf8f4');
    p(x+1,top,3,h,eyeC);p(x+1,top,3,1,'#1c1010');if(!sur)p(x+2,top+1,1,h-1,'#1c1010');else p(x+2,top+2,1,1,'#1c1010');
    p(x+1,top+(h>3?1:0),1,1,'#fff');
    p(x-1+(s>0?1:0),top-1,6,1,ink);
    if(s<0)p(x-1,top,1,1,ink);else p(x+5,top,1,1,ink);
    if(ang){if(s<0)p(x+3,top,2,1,sk);else p(x,top,2,1,sk);}
    if(ex==='cry'){p(x+1,top+h,3,1,'rgba(150,205,255,.9)');p(x+(s<0?1:3),top+h+1,1,7,'rgba(150,205,255,.85)');p(x+(s<0?1:3),top+h+8,1,1,'rgba(150,205,255,.6)');}
  };
  eye(15,-1);eye(28,1);
  // 눈썹
  const bc=old?'#9a9a9a':hrD,bw=male?2:1;
  const brow=(x,s)=>{let lo=22,li=22;if(ex==='sad'||ex==='cry'){lo=23;li=21;}else if(ex==='angry'){lo=21;li=23;}else if(ex==='surp'){lo=li=20;}
    const inX=s<0?x+3:x,outX=s<0?x:x+3;p(outX,lo,2,bw,bc);p(inX,li,2,bw,bc);p(x+2,Math.min(lo,li),1,bw,bc);};
  brow(15,-1);brow(28,1);
  if(id==='jwOld'||id==='jwChair'){const gl='#8a7a6a';[14,27].forEach(x=>{p(x,24,7,1,gl);p(x,31,7,1,gl);p(x,24,1,8,gl);p(x+6,24,1,8,gl);});p(21,26,6,1,gl);p(15,25,2,1,'rgba(255,255,255,.6)');p(28,25,2,1,'rgba(255,255,255,.6)');}
  // 코·입
  p(24,31,1,2,skDD);
  const my=35;
  if(ex==='smile'){p(21,my,6,1,'#7a2c2c');p(22,my+1,4,1,'#c85a5a');p(20,my-1,1,1,'#7a2c2c');p(27,my-1,1,1,'#7a2c2c');}
  else if(ex==='sad'){p(22,my,4,1,'#7a3434');p(21,my+1,1,1,'#7a3434');p(26,my+1,1,1,'#7a3434');}
  else if(ex==='cry'){p(21,my,6,2,'#6a2424');p(20,my+1,1,1,'#6a2424');p(27,my+1,1,1,'#6a2424');}
  else if(ex==='surp'){p(23,my-1,3,3,'#5a2020');}
  else if(ex==='angry'){p(21,my,6,1,'#7a3434');}
  else{p(22,my,4,1,'#9a4a4a');}
  // 앞머리
  if(L.cap){for(let r=8;r<17;r++){const w=r<10?7:r<12?11:13;p(cx-w,r,w*2,1,L.cap);}p(cx-13,8,26,1,shade(L.cap,1.4));p(cx-15,16,30,2,'#141418');p(23,10,3,3,'#d8b450');p(cx-13,18,3,8,hr);p(cx+10,18,3,8,hr);}
  else if(old){for(let r=10;r<16;r++){const w=r<11?8:r<12?11:13;p(cx-w,r,w*2,1,r<12?'#f2f2f0':'#dadad6');}p(cx-13,15,3,13,'#dadad6');p(cx+10,15,3,13,'#c8c8c4');p(cx-6,11,5,1,'#fff');}
  else{
    for(let r=9;r<18;r++){const w=r<10?7:r<11?10:r<12?12:13;p(cx-w,r,w*2,1,hr);}
    p(cx-7,10,6,1,hrL);p(cx+6,11,5,2,hrD);
    if(st==='short'){p(cx-13,18,13,2,hr);p(cx,18,13,1,hr);p(cx-11,20,3,1,hr);p(cx-3,20,4,1,hr);p(cx+6,19,4,2,hr);p(cx-13,18,3,8,hr);p(cx+10,18,3,8,hrD);}
    else if(st==='bob'){p(cx-13,18,26,3,hr);p(cx-13,21,26,1,hrD);p(cx-14,18,4,20,hr);p(cx+10,18,4,20,hrD);p(cx-14,37,4,1,hrD);}
    else{p(cx-13,18,26,2,hr);p(cx-13,20,9,2,hr);p(cx-13,22,5,1,hr);p(cx+2,20,11,1,hr);p(cx+6,21,7,1,hrD);
      const len=st==='long'?24:st==='pony'?10:st==='pig'?8:12;p(cx-14,18,3,len,hr);p(cx+11,18,3,len,hrD);
      if(st==='pony')p(cx+11,12,3,3,'#c03848');}
    p(cx-12,21,24,1,'rgba(90,40,30,.18)');
  }
  if(L.veil){g.fillStyle='rgba(255,255,255,.55)';for(let r=8;r<50;r++){const w=r<12?10:r<18?15:16;g.fillRect(cx-w,r,3,1);g.fillRect(cx+w-3,r,3,1);}g.fillRect(cx-12,8,24,3);
    ['#f6d86a','#f0a8b8','#ffffff','#bfe0a0'].forEach((col,i)=>{p(14+i*6,9,3,3,col);});}
  if(id==='nurse'){p(17,6,14,4,'#ffffff');p(23,7,2,2,'#d84848');}
  return c;
}
/* 수채화 초상화: img/port/<id>.jpg (표정별은 <id>_<ex>.jpg). 파일이 없는 인물은 도트 초상화로 대신한다. */
const PIMG={},PORT_FILES=['seoyun','mrAdult','mrTeen','mrChild','mrBride','jwOld','jwChair','jwSuit','jwMid','jw30','jwYoung','ehMid','ehYoung','taeo'];
// 아직 전용 그림이 없는 시기는 가장 가까운 시기의 그림을 빌려 쓴다
const PORT_ALIAS={jwGroom:'jwYoung',ehBride:'ehYoung',ehBed:'ehMid'};
function hasPaint(id){return !!(PIMG[id]||PIMG[PORT_ALIAS[id]]);}
PORT_FILES.forEach(n=>{const im=new Image();im.onload=()=>{PIMG[n]=im;const base=n.split('_')[0];for(const k in PAINT)delete PAINT[k];if(typeof bustKey!=='undefined')bustKey='';};im.src='img/port/'+n+'.jpg';});
function paintPortrait(id,ex=''){
  const key=id+'|'+ex;if(PAINT[key])return PAINT[key];
  const im=PIMG[id+'_'+ex]||PIMG[id]||PIMG[PORT_ALIAS[id]];
  if(im){ // 수채화 카드
    const c=mk(300,380),g=c.getContext('2d'),r=16,x=6,y=6,w=288,h=368;
    g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();
    g.save();g.clip();const sc=Math.max(w/im.width,h/im.height),dw=im.width*sc,dh=im.height*sc;g.imageSmoothingQuality='high';g.drawImage(im,x+(w-dw)/2,y+(h-dh)*.3,dw,dh);
    const vg=g.createRadialGradient(150,170,120,150,190,260);vg.addColorStop(0,'rgba(90,60,30,0)');vg.addColorStop(1,'rgba(90,60,30,.22)');g.fillStyle=vg;g.fillRect(0,0,300,380);g.restore();
    g.strokeStyle='rgba(255,248,230,.9)';g.lineWidth=3;g.stroke();g.strokeStyle='rgba(90,60,40,.5)';g.lineWidth=1;g.stroke();
    return PAINT[key]=c;
  }
  const raw=pixBust(id,ex);
  const o=mk(48,60),og=o.getContext('2d');
  for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])og.drawImage(raw,dx,dy);
  og.globalCompositeOperation='source-in';og.fillStyle='#1c1218';og.fillRect(0,0,48,60);og.globalCompositeOperation='source-over';og.drawImage(raw,0,0);
  const c=mk(300,380),g=c.getContext('2d'),bc=portBg(id);
  const rg=g.createRadialGradient(150,170,10,150,170,170);rg.addColorStop(0,`rgba(${bc},.42)`);rg.addColorStop(.55,`rgba(${bc},.14)`);rg.addColorStop(1,`rgba(${bc},0)`);g.fillStyle=rg;g.fillRect(0,0,300,380);
  for(let i=0;i<26;i++){const h=hsh(i,id.length*13),x=(h%50)*6,y=((h>>>8)%40)*6;g.fillStyle=`rgba(255,250,230,${.25+((h>>>4)%5)/10})`;g.fillRect(x,y,(h>>>12)%4?6:12,6);}
  g.imageSmoothingEnabled=false;g.drawImage(o,6,20,288,360);
  return PAINT[key]=c;
}
