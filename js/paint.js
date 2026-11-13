'use strict';
/* =========================================================
   일러스트 초상화 — 선화 + 음영으로 그린 상반신 (코드로 그림, 외부 이미지 없음)
   paintPortrait(lookId, ex)  ex: '' smile sad cry surp closed angry
   ========================================================= */
const PAINT={};
const EYEC={taeo:'#3a2a20',taeoOld:'#3a2a20',jwOld:'#4a3a30',jwChair:'#4a3a30',soon:'#4a3a30'};
function portBg(id){
  if(id.startsWith('jw'))return '143,184,232';if(id.startsWith('eh'))return '240,168,184';if(id.startsWith('mr'))return '199,168,240';
  if(id==='seoyun'||id==='syChild')return '242,196,109';if(id.startsWith('taeo'))return '224,184,96';if(id==='nurse')return '168,216,224';return '200,190,170';
}
function paintPortrait(id,ex=''){
  const key=id+'|'+ex;if(PAINT[key])return PAINT[key];
  const L=LOOK[id]||LOOK.seoyun,X=(typeof PORT_EXTRA!=='undefined'&&PORT_EXTRA[id])||{};
  const c=mk(300,380),g=c.getContext('2d');
  const age=X.age||0,child=!!X.child,male=/^(jw|taeo|fisher|kid)/.test(id),INK='rgba(42,24,28,.92)';
  const sk=L.skin,skL=shade(sk,1.05),skD=shade(sk,.86),skDD=shade(sk,.72);
  const hr=L.hair,hrD=shade(hr,.6),hrL=shade(hr,1.55),white=L.style==='old';
  const tp=L.top,tpD=shade(tp,.7),tpL=shade(tp,1.12);
  const eyeC=EYEC[id]||'#5a3626';
  const fs=(fill,stroke=INK,lw=2.6)=>{if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.lineJoin='round';g.lineCap='round';g.stroke();}};
  const lin=(x0,y0,x1,y1,st)=>{const r=g.createLinearGradient(x0,y0,x1,y1);st.forEach(([o,cc])=>r.addColorStop(o,cc));return r;};
  const rad=(x,y,r0,r1,st)=>{const r=g.createRadialGradient(x,y,r0,x,y,r1);st.forEach(([o,cc])=>r.addColorStop(o,cc));return r;};
  const bc=portBg(id);
  // 배경
  g.fillStyle=rad(150,170,10,190,[[0,`rgba(${bc},.42)`],[.6,`rgba(${bc},.14)`],[1,`rgba(${bc},0)`]]);g.fillRect(0,0,300,380);
  for(let i=0;i<7;i++){const h=hsh(i,id.length*7),x=20+h%260,y=20+(h>>>8)%200,r=6+(h>>>4)%16;g.fillStyle=rad(x,y,0,r,[[0,`rgba(255,255,255,.18)`],[1,'rgba(255,255,255,0)']]);g.fillRect(x-r,y-r,r*2,r*2);}
  const chinY=child?222:male?234:228,eyeY=child?170:164,eyeDX=child?29:27,sz=child?1.2:male?.92:1,hw=child?57:male?55:52;
  const sh=child?.82:1,shL=150-120*sh,shR=150+120*sh;
  // 뒷머리
  g.beginPath();
  if(L.style==='long'){g.moveTo(96,110);g.bezierCurveTo(70,200,62,300,74,352);g.lineTo(226,352);g.bezierCurveTo(238,300,230,200,204,110);g.closePath();}
  else if(L.style==='bob'){g.moveTo(92,110);g.bezierCurveTo(78,180,80,236,96,254);g.quadraticCurveTo(150,262,204,254);g.bezierCurveTo(220,236,222,180,208,110);g.closePath();}
  else if(L.style==='pony'){g.moveTo(198,96);g.bezierCurveTo(250,120,262,210,236,282);g.bezierCurveTo(228,220,214,160,186,118);g.closePath();}
  else if(L.style==='pig'){g.moveTo(96,150);g.bezierCurveTo(58,170,52,240,70,268);g.bezierCurveTo(80,226,92,196,104,176);g.closePath();g.moveTo(204,150);g.bezierCurveTo(242,170,248,240,230,268);g.bezierCurveTo(220,226,208,196,196,176);g.closePath();}
  if(['long','bob','pony','pig'].includes(L.style)){fs(lin(0,100,0,340,[[0,hr],[1,hrD]]));}
  g.save();g.translate(0,-24);
  // 몸
  g.beginPath();g.moveTo(shL,404);g.bezierCurveTo(shL+4,340,shL+30,302,114,292);g.lineTo(186,292);g.bezierCurveTo(shR-30,302,shR-4,340,shR,404);g.closePath();
  if(L.gown){fs(lin(0,290,0,380,[[0,'#ffffff'],[1,'#e4e0d6']]));}
  else fs(lin(0,290,0,380,[[0,tpL],[1,tpD]]));
  // 목
  const nw=male?22:18;g.beginPath();g.moveTo(150-nw,212);g.lineTo(150-nw,294);g.quadraticCurveTo(150,302,150+nw,294);g.lineTo(150+nw,212);g.closePath();fs(lin(0,212,0,300,[[0,skDD],[.35,skD],[1,sk]]),INK,2);
  // 옷 디테일
  const d=L.detail;
  if(L.gown){g.beginPath();g.moveTo(112,300);g.quadraticCurveTo(130,320,150,308);g.quadraticCurveTo(170,320,188,300);g.lineTo(190,296);g.quadraticCurveTo(150,290,110,296);g.closePath();fs(sk,INK,1.6);
    g.fillStyle='rgba(200,190,170,.6)';for(let i=0;i<22;i++){const x=90+i*5.6,y=330+Math.sin(i)*4;g.beginPath();g.arc(x,y,1.8,0,7);g.fill();}}
  else if(d==='tie'){g.beginPath();g.moveTo(128,292);g.lineTo(150,330);g.lineTo(172,292);g.closePath();fs('#f6f6f2',INK,2);g.beginPath();g.moveTo(144,300);g.lineTo(156,300);g.lineTo(160,360);g.lineTo(150,374);g.lineTo(140,360);g.closePath();fs(lin(0,300,0,374,[[0,'#8a3442'],[1,'#5a1e2a']]),INK,2);
    g.beginPath();g.moveTo(118,292);g.lineTo(146,340);g.lineTo(126,380);g.moveTo(182,292);g.lineTo(154,340);g.lineTo(174,380);fs(null,INK,2.2);}
  else if(d==='coat'){g.beginPath();g.moveTo(122,292);g.lineTo(150,346);g.lineTo(178,292);fs(null,INK,2.2);g.beginPath();g.moveTo(122,292);g.lineTo(108,320);g.lineTo(140,334);g.closePath();fs(tpD,INK,2);g.beginPath();g.moveTo(178,292);g.lineTo(192,320);g.lineTo(160,334);g.closePath();fs(tpD,INK,2);
    g.fillStyle='#d8b450';[350,368].forEach(y=>{g.beginPath();g.arc(150,y,3.4,0,7);g.fill();});}
  else if(d==='collar'){g.beginPath();g.moveTo(126,292);g.quadraticCurveTo(120,318,138,320);g.lineTo(150,302);g.lineTo(162,320);g.quadraticCurveTo(180,318,174,292);g.closePath();fs('#fbfbf8',INK,2);
    if(id==='mrTeen'){g.beginPath();g.moveTo(144,306);g.lineTo(156,306);g.lineTo(150,330);g.closePath();fs('#a03040',INK,1.6);}}
  else if(d==='zip'){g.beginPath();g.moveTo(150,300);g.lineTo(150,380);fs(null,shade(tp,.55),2.4);g.beginPath();g.moveTo(124,292);g.lineTo(136,316);g.lineTo(150,300);g.lineTo(164,316);g.lineTo(176,292);fs(tpD,INK,2);
    g.beginPath();g.moveTo(98,340);g.lineTo(128,340);fs(null,shade(tp,.6),2);if(id==='seoyun'){g.beginPath();g.moveTo(150,300);g.quadraticCurveTo(170,330,176,352);fs(null,'#c0c4c8',1.6);g.beginPath();g.arc(178,358,6,0,7);fs('#e8e0b0',INK,1.6);}}
  g.restore();
  // 귀
  [[150-hw+2,-1],[150+hw-2,1]].forEach(([x,s])=>{g.beginPath();g.ellipse(x,eyeY+6,8,14,s*.15,0,7);fs(sk,INK,2);});
  // 얼굴
  const face=new Path2D(),fl=150-hw,fr=150+hw;face.moveTo(fl,118);face.bezierCurveTo(fl-2,178,fl+(male?10:18),chinY-(male?14:22),male?137:150,chinY);if(male)face.lineTo(163,chinY);
  face.bezierCurveTo(fr-(male?10:18),chinY-(male?14:22),fr+2,178,fr,118);face.bezierCurveTo(fr-2,66,fl+2,66,fl,118);
  g.fillStyle=rad(140,150,8,110,[[0,skL],[.7,sk],[1,skD]]);g.fill(face);
  g.save();g.clip(face);
  g.fillStyle=lin(150,0,210,0,[[0,'rgba(0,0,0,0)'],[1,'rgba(120,60,50,.16)']]);g.fillRect(150,60,60,190);
  g.fillStyle='rgba(120,60,50,.22)';g.beginPath();g.ellipse(150,white?92:(child?124:118),64,22,0,0,7);g.fill(); // 앞머리 그림자
  // 볼
  const bl=ex==='cry'?.5:ex==='smile'?.42:.3;[[118,eyeY+30],[182,eyeY+30]].forEach(([x,y])=>{g.fillStyle=rad(x,y,0,20,[[0,`rgba(240,110,110,${bl})`],[1,'rgba(240,110,110,0)']]);g.fillRect(x-20,y-20,40,40);});
  if(ex==='cry'||ex==='smile'){g.strokeStyle='rgba(220,90,90,.45)';g.lineWidth=1.4;[[110,eyeY+28],[174,eyeY+28]].forEach(([x,y])=>{for(let i=0;i<3;i++){g.beginPath();g.moveTo(x+i*6,y+4);g.lineTo(x+i*6+4,y-1);g.stroke();}});}
  g.restore();
  g.strokeStyle=INK;g.lineWidth=2.6;g.stroke(face);
  // 나이 주름
  if(age>=2){g.strokeStyle=shade(sk,.62);g.lineWidth=1.5;[[-1],[1]].forEach(([s])=>{const x=150+s*eyeDX;g.beginPath();g.moveTo(x+s*20,eyeY-2);g.lineTo(x+s*26,eyeY-6);g.moveTo(x+s*20,eyeY+3);g.lineTo(x+s*27,eyeY+4);g.stroke();
    g.beginPath();g.moveTo(150+s*14,eyeY+30);g.quadraticCurveTo(150+s*22,eyeY+44,150+s*18,eyeY+56);g.stroke();g.beginPath();g.moveTo(x-10,eyeY+12);g.quadraticCurveTo(x,eyeY+17,x+10,eyeY+12);g.stroke();});}
  if(age>=3){g.strokeStyle=shade(sk,.66);g.lineWidth=1.3;for(let i=0;i<3;i++){g.beginPath();g.moveTo(124,104+i*6);g.quadraticCurveTo(150,100+i*6,176,104+i*6);g.stroke();}}
  // 눈
  const eye=(cx,side)=>{
    const w=15*sz,h=12*sz;
    if(ex==='smile'){g.beginPath();g.moveTo(cx-w,eyeY+3);g.quadraticCurveTo(cx,eyeY-h*1.3,cx+w,eyeY+3);fs(null,'#24161a',3.8);return;}
    if(ex==='closed'){g.beginPath();g.moveTo(cx-w,eyeY-1);g.quadraticCurveTo(cx,eyeY+h*.95,cx+w,eyeY-1);fs(null,'#24161a',3.4);
      for(let i=0;i<3;i++){const x=cx+side*(w-2-i*5);g.beginPath();g.moveTo(x,eyeY+3);g.lineTo(x+side*2,eyeY+8);fs(null,'#24161a',1.4);}return;}
    let hk=1,wk=1,dy=0,ir=1;
    if(male){hk=.8;ir=.88;}if(ex==='sad'||ex==='cry'){hk*=.78;dy=3;}if(ex==='surp'){hk*=1.3;wk=1.06;ir*=.72;}if(ex==='angry')hk*=.82;
    const ww=w*wk,hh=h*hk,top=eyeY-hh;
    const sc=new Path2D();sc.moveTo(cx-ww,eyeY+1);sc.bezierCurveTo(cx-ww*.6,top-2,cx+ww*.6,top-3,cx+ww,eyeY-2);sc.bezierCurveTo(cx+ww*.6,eyeY+hh*.95,cx-ww*.6,eyeY+hh*.95,cx-ww,eyeY+1);
    g.fillStyle='#fdfbf8';g.fill(sc);g.save();g.clip(sc);
    const ix=cx+(ex==='sad'||ex==='cry'?side*-1:0),iy=eyeY+dy+1;
    g.fillStyle=lin(0,iy-12*sz,0,iy+12*sz,[[0,'#1a0e0c'],[.55,eyeC],[1,shade(eyeC,1.6)]]);g.beginPath();g.ellipse(ix,iy,8.6*sz*ir,11.5*sz*ir,0,0,7);g.fill();
    g.fillStyle='#120808';g.beginPath();g.ellipse(ix,iy,4.2*sz*ir,5.6*sz*ir,0,0,7);g.fill();
    g.fillStyle='rgba(0,0,0,.22)';g.fillRect(cx-ww,top-4,ww*2,6*sz);
    g.fillStyle='#fff';g.beginPath();g.arc(ix-3*sz,iy-5*sz,3.3*sz,0,7);g.fill();g.beginPath();g.arc(ix+3.4*sz,iy+4*sz,1.6*sz,0,7);g.fill();
    if(ex==='cry'){g.fillStyle='rgba(150,205,255,.45)';g.fillRect(cx-ww,eyeY+hh*.25,ww*2,hh);g.fillStyle='#fff';g.beginPath();g.arc(ix+2,iy-1,1.8,0,7);g.fill();}
    g.restore();
    g.beginPath();g.moveTo(cx-ww-1,eyeY+1);g.bezierCurveTo(cx-ww*.6,top-2,cx+ww*.6,top-3,cx+ww+1,eyeY-2);fs(null,'#24161a',3.8);
    g.beginPath();g.moveTo(cx+side*ww,eyeY-2+(side>0?0:3));g.lineTo(cx+side*(ww+5),eyeY-6);fs(null,'#24161a',2.4);
    g.beginPath();g.moveTo(cx+side*ww*.2,eyeY+hh*.9);g.quadraticCurveTo(cx+side*ww*.7,eyeY+hh*.8,cx+side*ww,eyeY+2);fs(null,'rgba(36,22,26,.7)',1.4);
    if(ex==='angry'){const inX=cx-side*ww;g.beginPath();g.moveTo(inX,top-4);g.lineTo(cx,top-4);g.lineTo(inX,eyeY-1);g.closePath();fs(sk,null);g.beginPath();g.moveTo(inX,eyeY-1);g.lineTo(cx+side*ww*.3,top+1);fs(null,'#24161a',3.4);}
  };
  eye(150-eyeDX,-1);eye(150+eyeDX,1);
  // 눈썹
  const bcol=white?'#8e8e8e':hrD;
  [[-1],[1]].forEach(([s])=>{const cx=150+s*eyeDX,outX=cx+s*15,inX=cx-s*14;let yo=eyeY-24,yi=eyeY-26;
    if(ex==='sad'||ex==='cry'){yo=eyeY-21;yi=eyeY-31;}else if(ex==='angry'){yo=eyeY-29;yi=eyeY-20;}else if(ex==='surp'){yo=eyeY-33;yi=eyeY-34;}else if(ex==='smile'||ex==='closed'){yo=eyeY-25;yi=eyeY-27;}
    g.beginPath();g.moveTo(outX,yo);g.quadraticCurveTo(cx,Math.min(yo,yi)-4,inX,yi);fs(null,bcol,male?6:(age>=2?5:4.4));});
  // 코
  g.beginPath();g.moveTo(153,eyeY+20);g.quadraticCurveTo(157,eyeY+32,150,eyeY+34);fs(null,skDD,1.8);
  g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.arc(148,eyeY+24,1.6,0,7);g.fill();
  // 입
  const my=child?eyeY+44:eyeY+48;g.lineCap='round';
  if(ex==='smile'){g.beginPath();g.moveTo(135,my-3);g.quadraticCurveTo(150,my+17,165,my-3);g.quadraticCurveTo(150,my+3,135,my-3);fs('#a8443e',INK,2);g.beginPath();g.ellipse(150,my+7,6,3,0,0,7);g.fillStyle='#e07c78';g.fill();}
  else if(ex==='sad'){g.beginPath();g.moveTo(140,my+4);g.quadraticCurveTo(150,my-3,160,my+4);fs(null,'#8a3c3c',2.4);}
  else if(ex==='cry'){g.beginPath();g.moveTo(137,my+5);g.quadraticCurveTo(150,my-7,163,my+5);g.quadraticCurveTo(150,my+11,137,my+5);fs('#7a2c2c',INK,2);}
  else if(ex==='surp'){g.beginPath();g.ellipse(150,my+3,6,8,0,0,7);fs('#6a2a2a',INK,2);}
  else if(ex==='angry'){g.beginPath();g.moveTo(139,my+3);g.lineTo(150,my+1);g.lineTo(161,my+3);fs(null,'#8a3c3c',2.6);}
  else if(ex==='closed'){g.beginPath();g.moveTo(141,my);g.quadraticCurveTo(150,my+6,159,my);fs(null,'#8a3c3c',2.2);}
  else{g.beginPath();g.moveTo(141,my+1);g.quadraticCurveTo(150,my+4,159,my+1);fs(null,'#8a3c3c',2.2);}
  // 눈물
  if(ex==='cry'){[[-1],[1]].forEach(([s])=>{const x=150+s*(eyeDX-4);g.beginPath();g.moveTo(x-3,eyeY+10);g.bezierCurveTo(x-6,eyeY+30,x+s*3,eyeY+46,x+s*1,eyeY+62);g.lineTo(x+s*1+5,eyeY+62);g.bezierCurveTo(x+s*6,eyeY+44,x+4,eyeY+28,x+3,eyeY+10);g.closePath();
    fs(lin(0,eyeY+10,0,eyeY+64,[[0,'rgba(170,215,255,.85)'],[1,'rgba(170,215,255,.25)']]),'rgba(90,140,200,.55)',1.2);g.fillStyle='rgba(255,255,255,.85)';g.fillRect(x-1,eyeY+16,1.6,10);});}
  // 앞머리
  const hp=new Path2D();
  if(L.cap){hp.moveTo(fl-4,150);hp.quadraticCurveTo(fl-8,118,fl+4,112);hp.lineTo(fl+12,112);hp.lineTo(fl+8,160);hp.closePath();hp.moveTo(fr+4,150);hp.quadraticCurveTo(fr+8,118,fr-4,112);hp.lineTo(fr-12,112);hp.lineTo(fr-8,160);hp.closePath();}
  else if(white){hp.moveTo(fl-3,172);hp.bezierCurveTo(fl-10,122,fl-2,86,122,70);hp.quadraticCurveTo(150,60,178,70);hp.bezierCurveTo(fr+2,86,fr+10,122,fr+3,172);hp.lineTo(fr-4,168);hp.bezierCurveTo(fr-2,130,192,100,174,86);hp.quadraticCurveTo(150,78,126,86);hp.bezierCurveTo(108,100,fl+2,130,fl+4,168);hp.closePath();}
  else{
    const male=L.style==='short';
    hp.moveTo(fl-6,male?170:200);hp.bezierCurveTo(fl-18,82,118,44,150,44);hp.bezierCurveTo(182,44,fr+18,82,fr+6,male?170:200);
    const tipY=male?(child?128:124):(child?140:134),valY=male?102:108;
    const pts=male?[[204,150],[194,112],[184,tipY],[172,104],[160,tipY+4],[148,valY],[136,tipY],[124,104],[112,tipY-2],[102,112],[96,150]]
      :L.style==='bob'?[[206,170],[200,120],[190,tipY+2],[176,tipY+4],[162,tipY+2],[150,tipY+4],[138,tipY+2],[124,tipY+4],[110,tipY+2],[100,120],[94,170]]
      :[[206,190],[198,118],[188,tipY],[176,104],[166,tipY+4],[152,valY],[140,tipY],[128,104],[116,tipY+3],[104,114],[96,190]];
    for(let i=0;i<pts.length;i++){const [x,y]=pts[i];if(i===0)hp.lineTo(x,y);else{const [px,py]=pts[i-1];hp.quadraticCurveTo((px+x)/2+(i%2?3:-3),(py+y)/2,x,y);}}
    hp.closePath();
  }
  g.fillStyle=lin(0,46,0,200,[[0,white?'#f2f2f0':hr],[1,white?'#c8c8c4':hrD]]);g.fill(hp);
  g.save();g.clip(hp);
  g.strokeStyle=white?'rgba(150,150,150,.45)':'rgba(0,0,0,.22)';g.lineWidth=1.3;for(let i=0;i<6;i++){const x=110+i*16;g.beginPath();g.moveTo(150+(x-150)*.3,56);g.quadraticCurveTo(x+(x-150)*.15,74,x,104);g.stroke();}
  g.strokeStyle=white?'rgba(255,255,255,.6)':'rgba(255,255,255,.2)';g.lineWidth=5;[[1.24,1.4],[1.6,1.76]].forEach(([a,b])=>{g.beginPath();g.arc(150,112,50,Math.PI*a,Math.PI*b);g.stroke();});
  g.restore();
  g.strokeStyle=INK;g.lineWidth=2.6;g.lineJoin='round';g.stroke(hp);
  // 옆머리(긴 머리·단발은 얼굴 앞으로)
  if(['long','bob'].includes(L.style)){[[-1],[1]].forEach(([s])=>{const x=150+s*54;g.beginPath();g.moveTo(x,128);g.quadraticCurveTo(x+s*10,200,x+s*(L.style==='bob'?2:0),L.style==='bob'?250:270);g.quadraticCurveTo(x-s*6,200,x-s*8,140);g.closePath();fs(lin(0,128,0,270,[[0,hr],[1,hrD]]),INK,2.2);});}
  if(L.style==='pony'){g.beginPath();g.ellipse(200,104,6,8,.5,0,7);fs('#c03848',INK,1.6);}
  if(L.style==='pig'){[[96,150],[204,150]].forEach(([x,y])=>{g.beginPath();g.ellipse(x,y,9,6,0,0,7);fs('#e05a6a',INK,1.6);});}
  // 모자 · 베일 · 간호사 캡
  if(L.cap){g.beginPath();g.moveTo(90,116);g.bezierCurveTo(92,52,208,52,210,116);g.closePath();fs(lin(0,52,0,116,[[0,shade(L.cap,1.4)],[1,L.cap]]),INK,2.4);
    g.beginPath();g.moveTo(82,116);g.quadraticCurveTo(150,138,218,116);g.lineTo(214,126);g.quadraticCurveTo(150,148,86,126);g.closePath();fs('#141418',INK,2);
    g.beginPath();g.arc(150,92,8,0,7);fs('#d8b450',INK,1.6);}
  if(L.veil){g.fillStyle='rgba(255,255,255,.38)';g.beginPath();g.moveTo(86,96);g.bezierCurveTo(70,200,60,300,54,370);g.lineTo(246,370);g.bezierCurveTo(240,300,230,200,214,96);g.bezierCurveTo(200,40,100,40,86,96);g.fill();
    const fc=['#f6d86a','#f0a8b8','#ffffff','#bfe0a0'];for(let i=0;i<9;i++){const a=Math.PI*(1.1+i*.1),x=150+Math.cos(a)*58,y=104+Math.sin(a)*48;g.beginPath();g.arc(x,y,6,0,7);fs(fc[i%4],INK,1.4);}}
  if(id==='nurse'){g.beginPath();g.moveTo(118,64);g.lineTo(182,64);g.lineTo(176,46);g.lineTo(124,46);g.closePath();fs('#ffffff',INK,2);g.fillStyle='#d84848';g.fillRect(146,49,8,12);g.fillRect(144,51,12,8);}
  // 안경 (노년의 정우)
  if(id==='jwOld'||id==='jwChair'){g.lineWidth=2.4;g.strokeStyle='#7a6a5a';[[-1],[1]].forEach(([s])=>{g.beginPath();g.arc(150+s*eyeDX,eyeY+2,19,0,7);g.stroke();g.beginPath();g.moveTo(150+s*(eyeDX+19),eyeY);g.lineTo(150+s*50,eyeY-4);g.stroke();
    g.strokeStyle='rgba(255,255,255,.55)';g.beginPath();g.arc(150+s*eyeDX,eyeY+2,14,Math.PI*1.15,Math.PI*1.45);g.stroke();g.strokeStyle='#7a6a5a';});
    g.beginPath();g.moveTo(150-eyeDX+19,eyeY);g.quadraticCurveTo(150,eyeY-6,150+eyeDX-19,eyeY);g.stroke();}
  // 질감과 테두리 빛
  g.globalCompositeOperation='source-atop';
  g.fillStyle=lin(0,0,300,0,[[0,'rgba(255,240,220,.08)'],[.6,'rgba(0,0,0,0)'],[1,`rgba(${bc},.14)`]]);g.fillRect(0,0,300,380);
  for(let i=0;i<900;i++){const h=hsh(i,77);g.fillStyle=h%2?'rgba(255,255,255,.035)':'rgba(0,0,0,.035)';g.fillRect(h%300,(h>>>9)%380,1.5,1.5);}
  g.globalCompositeOperation='source-over';
  return PAINT[key]=c;
}
