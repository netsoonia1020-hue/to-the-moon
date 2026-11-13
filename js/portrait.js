'use strict';
/* =========================================================
   초상화 — 64×64 픽셀 초상화를 코드로 그린다 (표정 6종)
   ex: '' 기본 · smile · sad · cry · surp · closed · angry
   ========================================================= */
const PCACHE={};
const PORT_EXTRA={jwOld:{age:3},jwSuit:{age:2},jwMid:{age:1},jw30:{age:0},jwYoung:{age:0},mrChild:{child:1},mrTeen:{teen:1},nurse:{},seoyun:{},ehYoung:{},ehMid:{},mrAdult:{},mrBride:{},taeo:{},soon:{age:2}};
function portrait(lookId,ex=''){
  const key=lookId+ex;if(PCACHE[key])return PCACHE[key];
  const L=LOOK[lookId],X=PORT_EXTRA[lookId]||{},c=mk(64,64),g=c.getContext('2d');
  const r=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  const sk=L.skin,sd=shade(sk,.82),hr=L.hair,hd=shade(hr,.7),hl=shade(hr,1.45),tp=L.top,td=shade(tp,.7);
  const child=X.child,cy=child?4:0,age=X.age||0;
  // 배경 원
  const bg=g.createRadialGradient(32,30,4,32,30,40);bg.addColorStop(0,'rgba(255,240,210,.18)');bg.addColorStop(1,'rgba(255,240,210,0)');g.fillStyle=bg;g.fillRect(0,0,64,64);
  const long=L.style==='long'||L.style==='pony'&&false;
  // 뒷머리
  if(L.style==='long'){r(14,18+cy,36,40,hd);r(15,18+cy,34,38,hr);}
  if(L.style==='bob'){r(15,16+cy,34,26,hr);}
  if(L.style==='pig'){r(8,26+cy,7,14,hr);r(49,26+cy,7,14,hr);r(9,24+cy,5,3,'#e05a6a');r(50,24+cy,5,3,'#e05a6a');}
  if(L.style==='pony'){r(44,14+cy,8,20,hr);r(46,12+cy,5,4,'#2c3e50');}
  // 어깨·옷
  r(10,52,44,12,tp);r(14,49,36,5,tp);r(10,52,4,12,td);r(50,52,4,12,td);r(14,49,36,1,shade(tp,1.15));
  if(L.gown){r(14,49,36,15,'#fbfbf6');r(24,49,16,4,sk);}
  else if(L.detail==='tie'){r(27,49,10,6,'#f4f4f4');r(30,50,4,14,'#7a2f3a');r(29,50,6,3,'#8a3f4a');}
  else if(L.detail==='collar'||lookId==='nurse'){r(24,48,7,5,'#fff');r(33,48,7,5,'#fff');}
  else if(L.detail==='coat'){r(31,50,2,14,td);r(28,55,1,1,'#d4b04a');r(28,59,1,1,'#d4b04a');r(22,48,8,4,td);r(34,48,8,4,td);}
  else if(L.detail==='zip'){r(31,50,1,14,td);r(24,48,16,3,shade(tp,.85));}
  // 목
  r(27,42+cy,10,8,sd);
  // 얼굴
  const fx=18,fy=12+cy,fw=28,fh=child?28:31;
  r(fx+2,fy,fw-4,fh,sk);r(fx,fy+3,fw,fh-9,sk);r(fx+4,fy+fh,fw-8,2,sk);r(fx+1,fy+fh-6,2,4,sk);r(fx+fw-3,fy+fh-6,2,4,sk);
  r(fx+fw-5,fy+4,4,fh-8,sd);r(fx+5,fy+fh+1,fw-10,1,sd);
  r(fx-2,fy+13,3,6,sk);r(fx+fw-1,fy+13,3,6,sd);
  // 주름(나이)
  if(age>=2){r(fx+6,fy+8,5,1,sd);r(fx+17,fy+8,5,1,sd);}
  if(age>=3){r(fx+4,fy+22,1,4,sd);r(fx+23,fy+22,1,4,sd);r(fx+5,fy+5,18,1,sd);}
  // 앞머리
  r(fx-1,fy-3,fw+2,9,hr);r(fx+2,fy-5,fw-4,3,hr);r(fx+5,fy-3,10,2,hl);
  if(L.style==='old'){r(fx-1,fy-3,fw+2,6,hr);r(fx+3,fy-5,fw-6,2,hr);r(fx+9,fy-3,10,4,sk);r(fx-1,fy+3,3,10,hr);r(fx+fw-2,fy+3,3,10,hr);}
  else if(L.style==='short'){r(fx-1,fy+3,3,9,hr);r(fx+fw-2,fy+3,3,9,hr);r(fx+3,fy+5,6,3,hr);r(fx+12,fy+5,5,2,hr);r(fx+20,fy+5,5,3,hr);}
  else{r(fx+1,fy+5,8,4,hr);r(fx+10,fy+5,6,3,hr);r(fx+17,fy+5,9,5,hr);r(fx-2,fy+3,4,L.style==='long'?32:L.style==='bob'?24:14,hr);r(fx+fw-2,fy+3,4,L.style==='long'?32:L.style==='bob'?24:14,hr);}
  if(L.cap){r(fx-2,fy-6,fw+4,9,L.cap);r(fx-4,fy+2,fw+8,2,'#111');r(fx+11,fy-4,6,4,'#d4b04a');}
  if(L.veil){g.fillStyle='rgba(255,255,255,.75)';g.fillRect(fx-4,fy-6,fw+8,4);g.fillStyle='rgba(255,255,255,.45)';g.fillRect(fx-6,fy-2,5,40);g.fillRect(fx+fw+1,fy-2,5,40);r(fx+8,fy-7,12,3,'#f0d878');}
  if(lookId==='nurse'){r(fx+4,fy-8,fw-8,5,'#fff');r(fx+12,fy-7,4,3,'#e66');}
  // 눈썹·눈
  const ey=fy+(child?13:14),lx=fx+6,rx=fx+fw-12,br=shade(hr,.8);
  const brow=(x,tilt)=>{if(tilt>0){r(x,ey-4,3,1,br);r(x+3,ey-5,3,1,br);}else if(tilt<0){r(x,ey-5,3,1,br);r(x+3,ey-4,3,1,br);}else r(x,ey-5,6,1,br);};
  if(ex==='sad'||ex==='cry'){brow(lx,-1);brow(rx,1);}else if(ex==='angry'){brow(lx,1);brow(rx,-1);}else if(ex==='surp'){r(lx,ey-7,6,1,br);r(rx,ey-7,6,1,br);}else{brow(lx,0);brow(rx,0);}
  const eye=(x)=>{
    if(ex==='smile'||ex==='closed'){r(x,ey+1,6,1,'#2a1d1a');if(ex==='smile'){r(x-1,ey+2,1,1,'#2a1d1a');r(x+6,ey+2,1,1,'#2a1d1a');}return;}
    const h=ex==='surp'?6:(ex==='sad'||ex==='cry')?4:5,yy=ey+(5-h);
    r(x,yy,6,h,'#fff');r(x+1,yy,4,h,'#3a2a24');r(x+2,yy+1,2,h-1,'#120c0a');r(x+1,yy,2,2,'#fff');r(x,yy-1,6,1,'#2a1d1a');
    if(child){r(x,yy-1,6,1,'#2a1d1a');r(x+4,yy+h-2,1,1,'#fff');}
    if(age>=3){r(x-1,yy+h+1,7,1,sd);}
  };
  eye(lx);eye(rx);
  // 코·볼·입
  r(fx+13,ey+6,2,3,sd);
  g.fillStyle='rgba(235,120,110,.35)';g.fillRect(fx+3,ey+8,5,2);g.fillRect(fx+fw-8,ey+8,5,2);
  const my=ey+12;
  if(ex==='smile')  {r(fx+10,my,8,1,'#8a4040');r(fx+9,my-1,1,1,'#8a4040');r(fx+18,my-1,1,1,'#8a4040');r(fx+11,my+1,6,1,'#c76a6a');}
  else if(ex==='sad'||ex==='cry'){r(fx+11,my,6,1,'#8a4040');r(fx+10,my+1,1,1,'#8a4040');r(fx+17,my+1,1,1,'#8a4040');}
  else if(ex==='surp'){r(fx+12,my-1,4,4,'#6a3030');r(fx+13,my,2,2,'#a04848');}
  else if(ex==='angry'){r(fx+10,my+1,8,1,'#8a4040');}
  else r(fx+11,my,6,1,'#9a5050');
  if(L.style==='old'){r(fx+9,my-2,10,2,'#c8c8c8');}
  if(ex==='cry'){g.fillStyle='rgba(150,200,255,.85)';g.fillRect(lx+1,ey+5,2,9);g.fillRect(rx+3,ey+5,2,7);g.fillRect(lx+1,ey+15,1,2);g.fillStyle='rgba(255,255,255,.9)';g.fillRect(lx+1,ey+6,1,2);g.fillRect(rx+3,ey+6,1,2);}
  // 외곽 그늘
  g.globalCompositeOperation='source-atop';const sh=g.createLinearGradient(0,0,64,0);sh.addColorStop(0,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(20,10,30,.18)');g.fillStyle=sh;g.fillRect(0,0,64,64);g.globalCompositeOperation='source-over';
  return PCACHE[key]=c;
}
