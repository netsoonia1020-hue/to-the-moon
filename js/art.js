'use strict';
/* =========================================================
   그래픽 — 전부 코드로 그린 픽셀 아트 (외부 이미지 없음)
   ========================================================= */
function txt(s,x,y,size,col,align='left'){ctx.font=`bold ${size}px "Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif`;ctx.textAlign=align;ctx.fillStyle=col;ctx.fillText(s,x,y);}
const LOOK={
  seoyun:{hair:'#3a2a20',skin:'#f0cfae',top:'#c99a3e',bottom:'#2f3446',style:'bob',detail:'zip'},
  jwOld:{hair:'#dcdcdc',skin:'#e2bc98',top:'#2f3e5c',bottom:'#3a3a3a',style:'old',detail:'coat'},
  jwSuit:{hair:'#8a8a8a',skin:'#e2bc98',top:'#2a2a30',bottom:'#222228',style:'short',detail:'tie'},
  jwMid:{hair:'#5e5e5e',skin:'#e2bc98',top:'#3a4a63',bottom:'#2e2e2e',style:'short',detail:'coat'},
  jw30:{hair:'#1c1c1c',skin:'#e6c09c',top:'#6f7f5a',bottom:'#2e3440',style:'short',detail:'collar'},
  jwYoung:{hair:'#1a1a1a',skin:'#e8c4a0',top:'#e6e6e6',bottom:'#22304a',style:'short',cap:'#22304a',detail:'collar'},
  ehYoung:{hair:'#2a1a12',skin:'#f2d2b4',top:'#efe6cf',bottom:'#e6dbc0',style:'long',skirt:true},
  ehMid:{hair:'#2a1a12',skin:'#f2d2b4',top:'#b5646e',bottom:'#e6dbc0',style:'long',skirt:true,detail:'collar'},
  ehBed:{hair:'#3a2a20',skin:'#ead6c6'},
  mrChild:{hair:'#2e1e14',skin:'#f4d6b8',top:'#f0c84a',bottom:'#f0c84a',style:'pig',skirt:true,paint:true},
  mrTeen:{hair:'#2e1e14',skin:'#f0d0b0',top:'#2c3e50',bottom:'#3b4a5c',style:'pony',skirt:true,detail:'collar'},
  mrBride:{hair:'#2e1e14',skin:'#f0d0b0',top:'#fbfbf6',bottom:'#f1f1ea',style:'long',skirt:true,veil:true,gown:true},
  mrAdult:{hair:'#2e1e14',skin:'#f0d0b0',top:'#7e3a3a',bottom:'#2a2a33',style:'long',detail:'coat'},
  nurse:{hair:'#3a2418',skin:'#f2d4b8',top:'#e8eef2',bottom:'#c8d4dc',style:'bob',detail:'collar'},
  taeo:{hair:'#1e1e1e',skin:'#d8a882',top:'#c8a030',bottom:'#2e3a4a',style:'short',detail:'zip'},
  soon:{hair:'#8a8a86',skin:'#e0b896',top:'#4a5a7a',bottom:'#3a3a4a',style:'old',skirt:true,detail:'collar'},
  jwGroom:{hair:'#1a1a1a',skin:'#e8c4a0',top:'#22222a',bottom:'#1c1c22',style:'short',detail:'tie'},
  jwChair:{hair:'#e4e4e4',skin:'#dcb894',top:'#9ab0c8',bottom:'#7a8aa0',style:'old',detail:'collar'},
  kid:{hair:'#2a1a12',skin:'#f0d0b0',top:'#d86a4a',bottom:'#3a4a6a',style:'short'},
  fisher:{hair:'#3a3a3a',skin:'#c89870',top:'#5a7a5a',bottom:'#3a3a30',style:'short',detail:'zip'},
};
for(const k in LOOK)LOOK[k].id=k;
// 키가 큰 RPG식 도트 캐릭터 (머리 9 · 몸 16, 왼쪽 위 광원 음영)
function drawCharRaw(x,y,L,dir,step,sit,blink){
  const sk=L.skin,skD=shade(sk,.84),hr=L.hair,hrD=shade(hr,.66),hrL=shade(hr,1.45),tp=L.top,tpD=shade(tp,.7),tpL=shade(tp,1.16),bt=L.bottom,btD=shade(bt,.7);
  const st=L.style,o=sit?3:0,side=dir==='left'||dir==='right',lf=dir==='left',eye='#20141a';
  const a=step===1?1:0,b=step===2?1:0;
  // 다리·신발
  if(L.gown){R(x+3,y+7+o,10,8.5-o,bt);R(x+3,y+7+o,2,8.5-o,shade(bt,1.04));R(x+10.5,y+7+o,2.5,8.5-o,shade(bt,.86));R(x+2.5,y+14.5,11,1,shade(bt,.8));}
  else if(sit){R(x+4.5,y+12,7,2,L.skirt?sk:bt);R(x+4.5,y+13.5,7,.5,L.skirt?skD:btD);}
  else{const lc=L.skirt?sk:bt,ld=L.skirt?skD:btD;
    R(x+5,y+9,2.5,5-a,lc);R(x+8.5,y+9,2.5,5-b,lc);R(x+6.5,y+9,1,5-a,ld);R(x+10,y+9,1,5-b,ld);
    R(x+4.5,y+14-a,3.5,1.5,'#1e1a1c');R(x+8.5,y+14-b,3.5,1.5,'#1e1a1c');R(x+4.5,y+14-a,3.5,.5,'#3a3236');R(x+8.5,y+14-b,3.5,.5,'#3a3236');}
  // 몸통
  R(x+4,y+2+o,8,7,tp);R(x+4,y+2+o,2,7,tpL);R(x+10.5,y+2+o,1.5,7,tpD);R(x+4,y+8.5+o,8,.5,tpD);
  if(L.skirt&&!L.gown){R(x+3.5,y+8+o,9,4.5-o*.3,bt);R(x+3.5,y+8+o,2,4.5-o*.3,shade(bt,1.1));R(x+10.5,y+8+o,2,4.5-o*.3,btD);R(x+3.5,y+12+o*.7,9,.5,btD);}
  else if(!L.gown){R(x+4,y+8+o,8,1.5,bt);R(x+4,y+8+o,8,.5,shade(tp,.5));}
  if(dir!=='up'&&!side){
    if(L.detail==='zip'){R(x+7.75,y+2+o,.5,6.5,tpD);R(x+5,y+5.5+o,2,1.5,tpD);R(x+6,y+2+o,4,1,shade(tp,.85));}
    if(L.detail==='tie'){R(x+6.5,y+2+o,3,1.5,'#f2f2ee');R(x+7.5,y+2.5+o,1,4.5,'#7a2f3a');R(x+5,y+2+o,1.5,4,tpD);R(x+9.5,y+2+o,1.5,4,tpD);}
    if(L.detail==='collar'){R(x+5.5,y+2+o,2,1.5,'#fbfbf8');R(x+8.5,y+2+o,2,1.5,'#fbfbf8');}
    if(L.detail==='coat'){R(x+7.75,y+2+o,.5,6.5,tpD);R(x+6.5,y+4+o,.5,.5,'#d8b450');R(x+6.5,y+6+o,.5,.5,'#d8b450');R(x+5.5,y+2+o,2,2,tpD);R(x+8.5,y+2+o,2,2,tpD);}
    if(L.gown){R(x+5,y+2+o,6,1,sk);R(x+4,y+3+o,8,.5,'#e0dccf');}
  }
  // 팔
  if(side){const sw=step===1?1:step===2?-1:0;R(x+7,y+3+o+Math.max(0,sw),2.5,5.5,tpD);R(x+7,y+3+o,1,5,tp);R(x+7,y+8.5+o+Math.max(0,sw),2.5,1.2,sk);}
  else{const sw=step===1?.5:step===2?-.5:0;R(x+2.5,y+2.5+o+sw,1.6,6,tpL);R(x+11.9,y+2.5+o-sw,1.6,6,tpD);R(x+2.5,y+8.5+o+sw,1.6,1.2,sk);R(x+11.9,y+8.5+o-sw,1.6,1.2,skD);}
  // 목·머리
  R(x+7,y+1+o,2,1.5,skD);
  const hy=y-8+o;
  // 뒷머리(긴 머리)
  if(st==='long'&&dir!=='up'){R(x+3,hy+3,10,11,hrD);}
  if(st==='long'&&dir==='up'){R(x+3,hy+3,10,12,hr);R(x+4,hy+5,1,9,hrL);}
  R(x+4,hy+2,8,7,sk);R(x+3.5,hy+3,9,5,sk);R(x+10.5,hy+3,1.5,6,skD);R(x+5,hy+8.5,6,.5,skD);
  if(dir==='up'){R(x+3,hy,10,9,hr);R(x+3.5,hy-.5,9,1,hr);R(x+4.5,hy+.5,3,1,hrL);R(x+10,hy+2,2,7,hrD);
    if(st==='pony'){R(x+7,hy+7,2,6,hr);R(x+7,hy+7,2,.8,'#c03848');}if(st==='pig'){R(x+1.5,hy+3,2,6,hr);R(x+12.5,hy+3,2,6,hr);}
    if(st==='old'){R(x+4.5,hy+.5,7,2,shade(hr,.9));}}
  else{
    // 정수리
    R(x+3,hy,10,3,hr);R(x+3.5,hy-.5,9,1,hr);R(x+5,hy+.5,3.5,.8,hrL);R(x+10,hy+.5,2.5,2,hrD);
    if(!side){
      if(st==='old'){R(x+3,hy+2,1.5,4,hr);R(x+11.5,hy+2,1.5,4,hr);R(x+4.5,hy+2,7,.6,shade(hr,.85));}
      else{R(x+4,hy+2.5,8,1.5,hr);R(x+4,hy+4,2,1,hr);R(x+7,hy+4,1.5,.8,hr);R(x+10,hy+4,2,1,hr);
        const sh=st==='short'?3:st==='bob'?7:st==='long'?9:5;R(x+3,hy+2,1.5,sh,hr);R(x+11.5,hy+2,1.5,sh,hrD);
        if(st==='bob'){R(x+3,hy+8.5,2,.5,hrD);R(x+11,hy+8.5,2,.5,hrD);}
        if(st==='pony'){R(x+12.5,hy+1,2,4,hr);R(x+12.5,hy+1,1,1,'#c03848');}
        if(st==='pig'){R(x+1.5,hy+3,2,6,hr);R(x+12.5,hy+3,2,6,hr);R(x+1.5,hy+3,2,1,'#e05a6a');R(x+12.5,hy+3,2,1,'#e05a6a');}}
      if(blink){R(x+5.5,hy+5.5,1.5,.5,eye);R(x+9,hy+5.5,1.5,.5,eye);}
      else{R(x+5.5,hy+4.5,1.5,2,eye);R(x+9,hy+4.5,1.5,2,eye);R(x+5.5,hy+4.5,.5,.5,'#fff');R(x+9,hy+4.5,.5,.5,'#fff');}
      R(x+4.5,hy+6.5,1,.5,'rgba(230,110,100,.5)');R(x+10.5,hy+6.5,1,.5,'rgba(230,110,100,.5)');R(x+7.5,hy+7.3,1,.4,'#a86860');
      if(st==='old'){R(x+5,hy+3.8,2,.4,'#aaa');R(x+8.8,hy+3.8,2,.4,'#aaa');R(x+5,hy+4.5,6,.3,'rgba(120,100,80,.6)');}
      if(L.paint)R(x+9.5,hy+5.8,1.5,1,'#4a8ad0');
    }else{
      const fx=lf?x+3.5:x+11,bx=lf?x+7.5:x+3;
      R(bx,hy+2,5.5,st==='old'?3:st==='short'?4:6,hr);
      if(st==='long')R(lf?x+8:x+3,hy+2,5,12,hr);if(st==='bob')R(lf?x+8:x+3,hy+2,5,7,hr);
      if(st==='pony')R(lf?x+12:x+2,hy+3,2,7,hr);if(st==='pig')R(lf?x+12:x+2,hy+3,2,5,hr);
      R(lf?x+4:x+8,hy+2.5,4,1.5,hr);
      R(fx,hy+5,1,1,sk);
      if(blink)R(lf?x+5:x+9.5,hy+5.5,1.5,.5,eye);else{R(lf?x+5:x+10,hy+4.5,1,2,eye);R(lf?x+5:x+10,hy+4.5,.5,.5,'#fff');}
      R(lf?x+5:x+10,hy+6.5,1,.5,'rgba(230,110,100,.5)');
    }
  }
  if(L.veil){R(x+3,hy-1,10,2,'rgba(255,255,255,.95)');R(x+5,hy-1.5,6,1,'#f6d86a');if(dir==='up')R(x+2.5,hy+1,11,13,'rgba(255,255,255,.55)');else{R(x+2,hy+1,1.5,12,'rgba(255,255,255,.6)');R(x+12.5,hy+1,1.5,12,'rgba(255,255,255,.6)');}}
  if(L.cap){R(x+3,hy-1,10,3.5,L.cap);R(x+3,hy-1,10,.8,shade(L.cap,1.4));if(dir!=='up')R(x+2.5,hy+2.5,11,1,'#111');R(x+7,hy,2,1,'#d4b04a');}
}
const SPR={};
function charSprite(L,dir,step,sit,blink){
  const key=L.id+dir+step+(sit?1:0)+(blink?1:0);if(SPR[key])return SPR[key];
  const c=mk(48,60),save=ctx;ctx=c.getContext('2d');ctx.setTransform(2,0,0,2,0,0);drawCharRaw(4,8,L,dir,step,sit,blink);ctx=save;
  const o=mk(48,60),g=o.getContext('2d');
  for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2]])g.drawImage(c,dx,dy);
  g.globalCompositeOperation='source-in';g.fillStyle='rgba(26,16,24,.9)';g.fillRect(0,0,48,60);
  g.globalCompositeOperation='source-over';g.drawImage(c,0,0);
  return SPR[key]=o;
}
function drawChar(x,y,L,dir='down',step=0,sit=false,o={}){
  const s=o.scale||1,ph=o.ph||0,blink=((T+ph*3)%4.3)<.13;
  const hy=o.hop?-Math.abs(Math.sin(o.hop*Math.PI/.3))*5:0,br=(!step&&Math.sin(T*2.2+ph)>.5)?.5:0;
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x+8,y+15.5,5.5*s,1.8*s,0,0,7);ctx.fill();
  ctx.drawImage(charSprite(L,dir,step,sit,blink),x+8-12*s,y+16-24*s+hy+br,24*s,30*s);
  if(o.umb){R(x-2,y-8+hy,20,2,'#23232e');R(x,y-10+hy,16,2,'#2c2c3a');R(x+3,y-11.5+hy,10,1.5,'#34344a');R(x+12.5,y-8+hy,.5,14,'#888');}
}
function drawCat(x,y,col,sleep,ph=0){
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(x+3,y+14,10,1.5);const dk=shade(col,.75);
  if(sleep){R(x+3,y+10,10,4,col);R(x+4,y+9,8,1,col);R(x+2.5,y+11,3.5,3,col);R(x+2.5,y+10,1,1,col);R(x+5,y+10,1,1,col);R(x+3,y+12.5,2,.5,'#222');R(x+11,y+12,2.5,1.5,dk);
    if(Math.sin(T*1.5+ph)>0)txt('z',x+12,y+8,4,'rgba(255,255,255,.75)');}
  else{const tw=Math.sin(T*3+ph);R(x+5,y+9,7,5,col);R(x+9,y+9,3,5,dk);R(x+3,y+6,5,5,col);R(x+3,y+5,1.5,1.5,col);R(x+6.5,y+5,1.5,1.5,col);
    R(x+4,y+8,1,1,'#2a2a1a');R(x+6,y+8,1,1,'#2a2a1a');R(x+5,y+9.5,1,.5,'#d88');R(x+12,y+7+tw*.5,1,4,col);R(x+12.5,y+5.5+tw,1,2,col);R(x+5.5,y+14,1.5,1,dk);R(x+10,y+14,1.5,1,dk);}
}

/* ---------- 타일 ---------- */
const PAL={
  house:{floor:['#5f4932','#584330','#63492f'],seam:'#42301f',wallF:'#3e4a5a',wallF2:'#4b586a',wain:'#2e2724',wallT:'#12151c'},
  light:{floor:['#6e685e','#666057','#726b60'],seam:'#514b44',wallF:'#8a7d6a',wallF2:'#978a76',wain:'#4a4036',wallT:'#1f1b17'},
  lamp:{floor:['#5a626a','#535b63','#5e666e'],seam:'#3f464d',wallF:'#6c7780',wallF2:'#7c8790',wain:'#3a4248',wallT:'#181c20'},
  care:{floor:['#a88a64','#a08460','#ae9068'],seam:'#806848',wallF:'#c8d4b8',wallF2:'#b8c4a8',wain:'#8a7a5a',wallT:'#3a4034'},
  hosp:{floor:['#aeb9bb','#a2adb0','#b4bfc1'],seam:'#8f9a9d',wallF:'#d5d8c8',wallF2:'#c8cbbb',wain:'#8f9a90',wallT:'#3d4448'},
  beach:{sand:'#d6b47c',sand2:'#c4a06a',sand3:'#e2c490',grass:'#6d8a48',grass2:'#5a763a',grass3:'#86a35a',water:'#3b6a8a',water2:'#6c9cba',rock:'#6a6057',rock2:'#4e463f'},
  deck:{water:'#14233a',water2:'#3a5a7a',deck:['#6a5238','#62492f','#705638'],seam:'#3a2a1a',rail:'#d8d2c4',hull:'#7a2a2a'},
  street:{pave:'#55585f',pave2:'#4a4d54',curb:'#7a7d84',road:'#22242a',brick:'#5a3a34',brick2:'#472c28',mortar:'#33201d'},
};
let tileCv=null;
function buildTiles(){
  tileCv=mk(W*PX,H*PX);const save=ctx;ctx=tileCv.getContext('2d');ctx.setTransform(PX,0,0,PX,0,0);
  const p=PAL[S.pal];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const c=S.map[y][x],px=x*TS,py=y*TS,hv=hsh(x,y);
    if(c==='#'){
      const below=tileAt(x,y+1);
      if(below!=='#'&&below!=='x'){
        R(px,py,16,11,p.wallF);R(px,py,16,1,'rgba(0,0,0,.35)');R(px,py+1,16,2,'rgba(0,0,0,.12)');
        if(S.pal==='house'){R(px+3,py+4,1,1,p.wallF2);R(px+11,py+7,1,1,p.wallF2);R(px+2.5,py+4.5,2,.5,p.wallF2);R(px+10.5,py+7.5,2,.5,p.wallF2);}
        else if(S.pal==='hosp'){R(px,py+6,16,.5,p.wallF2);}
        else{R(px+(hv%2?0:8),py+3,.5,4,p.wallF2);R(px,py+3,16,.5,p.wallF2);R(px,py+7,16,.5,p.wallF2);R(px+(hv%2?8:0),py+7,.5,4,p.wallF2);}
        R(px,py+11,16,5,p.wain);R(px,py+10.5,16,.5,'rgba(255,255,255,.16)');R(px+7.5,py+12,.5,3,'rgba(0,0,0,.25)');R(px,py+15,16,1,'rgba(0,0,0,.35)');
      }else{R(px,py,16,16,p.wallT);if(tileAt(x,y-1)!=='#'&&tileAt(x,y-1)!=='x')R(px,py,16,1,'rgba(255,255,255,.07)');}
    }else if(c==='.'){
      if(S.pal==='hosp'){R(px,py,16,16,p.floor[(x+y)%2]);R(px,py,16,.5,'rgba(255,255,255,.3)');R(px,py,.5,16,'rgba(255,255,255,.2)');R(px+10,py+4,3,.5,'rgba(255,255,255,.18)');}
      else if(S.pal==='house'){
        for(let r=0;r<2;r++){const off=((x*7+(y*2+r)*5)%16),v=hsh(x+r*31,y);R(px,py+r*8,16,8,p.floor[v%3]);R(px,py+r*8+7.5,16,.5,p.seam);R(px+off,py+r*8,.5,7.5,p.seam);
          if(v%5===0)R(px+(v>>4)%12+1,py+r*8+3,2,1,p.seam);R(px,py+r*8,16,.5,'rgba(255,255,255,.05)');}
      }else{R(px,py,16,16,p.floor[hv%3]);R(px,py+15.5,16,.5,p.seam);R(px+(y%2?7.5:15.5),py,.5,16,p.seam);R(px+hv%13,py+(hv>>4)%13,2,.5,p.seam);R(px,py,16,.5,'rgba(255,255,255,.06)');}
      if(tileAt(x,y-1)==='#'){R(px,py,16,2,'rgba(0,0,0,.28)');R(px,py+2,16,2,'rgba(0,0,0,.12)');}
      if(tileAt(x-1,y)==='#')R(px,py,1.5,16,'rgba(0,0,0,.15)');
    }else if(c==='s'||c==='g'){
      const sand=c==='s';R(px,py,16,16,sand?p.sand:p.grass);
      for(let i=0;i<5;i++){const v=hsh(x*3+i,y*7);if(sand)R(px+v%15,py+(v>>5)%15,i%2?1.5:.5,.5,i%2?p.sand2:p.sand3);else R(px+v%15,py+(v>>5)%13,.5,2+i%2,i%2?p.grass2:p.grass3);}
      if(sand&&hv%4===0)R(px+2,py+(hv>>6)%12+2,10,.5,'rgba(255,255,255,.08)');
      if(!sand&&hv%6===0){const fc=['#e9d36a','#f0f0f0','#e79ab0'][hv%3];R(px+6,py+6,2,2,fc);R(px+6.5,py+6.5,1,1,'#b5852a');R(px+6.5,py+8,.5,3,p.grass2);}
      if(sand&&tileAt(x,y-1)==='g'){R(px,py,16,1.5,p.grass2);for(let i=0;i<4;i++)R(px+i*4+hv%3,py+1,1.5,2,p.grass);}
      if(sand&&tileAt(x,y+1)==='w')R(px,py+11,16,5,'#b89c72');
    }else if(c==='w'){
      R(px,py,16,16,p.water);R(px,py,16,16,`rgba(10,30,60,${(y-9)*.12})`);
    }else if(c==='r'){
      R(px,py,16,16,p.rock2);R(px+1,py+2,14,12,p.rock);R(px+3,py+1,9,2,p.rock);R(px+3,py+3,6,1.5,'rgba(255,255,255,.14)');R(px+1,py+12.5,14,1.5,'rgba(0,0,0,.25)');
      if(hv%3===0)R(px+8,py+7,4,.5,'rgba(0,0,0,.25)');if(hv%5===0)R(px+3,py+9,2,1,'#7d8a5a');
    }else if(c==='B'){
      R(px,py,16,16,p.brick);for(let r=0;r<4;r++){R(px,py+r*4+3.5,16,.5,p.mortar);const o=(r%2)*4;R(px+o,py+r*4,.5,3.5,p.mortar);R(px+o+8,py+r*4,.5,3.5,p.mortar);if(hsh(x+r,y*5)%4===0)R(px+o+1,py+r*4,7,3.5,p.brick2);}
      if(y===0)R(px,py,16,5,'#15161c');if(tileAt(x,y+1)==='p')R(px,py+13,16,3,'#2a2c33');
    }else if(c==='p'){
      R(px,py,16,16,(x+y)%2?p.pave:p.pave2);R(px,py,16,.5,'rgba(255,255,255,.08)');R(px,py,.5,16,'rgba(0,0,0,.2)');R(px+hv%12,py+(hv>>4)%12,3,.5,'rgba(0,0,0,.18)');
      if(tileAt(x,y-1)==='B')R(px,py,16,3,'rgba(0,0,0,.3)');
    }else if(c==='d'){for(let r=0;r<4;r++){const v=hsh(x+r*17,y);R(px,py+r*4,16,4,p.deck[v%3]);R(px,py+r*4+3.5,16,.5,p.seam);R(px+(v%14),py+r*4,.5,3.5,p.seam);}if(hv%9===0)R(px+5,py+6,2,2,'rgba(0,0,0,.3)');
    }else if(c==='R'){R(px,py,16,16,p.hull);R(px,py,16,1,shade(p.hull,1.4));R(px,py+14,16,2,'rgba(0,0,0,.4)');R(px,py+4,16,1.5,p.rail);R(px+3,py+4,1,6,p.rail);R(px+11,py+4,1,6,p.rail);R(px,py+10,16,.5,shade(p.hull,.7));
    }else if(c==='c'){R(px,py,16,16,p.road);R(px,py,16,6,p.curb);R(px,py,16,1,'rgba(255,255,255,.2)');R(px,py+5,16,1,'rgba(0,0,0,.4)');R(px+15.5,py,.5,6,'rgba(0,0,0,.3)');}
    else if(c==='a'){R(px,py,16,16,p.road);R(px+hv%14,py+(hv>>4)%14,1.5,.5,'rgba(255,255,255,.06)');if(y===10&&x%3===0)R(px+2,py+14,10,1.5,'rgba(230,220,160,.5)');}
    else R(px,py,16,16,'#000');
  }
  // 과거 장면이면 배경을 한 번만 흑백·세피아 처리해 둔다 (매 프레임 계산하지 않음)
  const [sat,sep]=typeof toneFor==='function'?toneFor(sceneName):[1,0];
  if(sat<1){const tc=tileCv.getContext('2d'),id=tc.getImageData(0,0,tileCv.width,tileCv.height),d=id.data;
    for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2],l=.3*r+.59*g+.11*b;
      let nr=l+(r-l)*sat,ng=l+(g-l)*sat,nb=l+(b-l)*sat;
      d[i]=nr+(Math.min(255,l*1.07+12)-nr)*sep;d[i+1]=ng+(l*.95+4-ng)*sep;d[i+2]=nb+(l*.78-nb)*sep;}
    tc.putImageData(id,0,0);}
  ctx=save;
}
function drawAnimTiles(){
  if(S.pal==='beach'||S.pal==='deck'){
    const p=PAL[S.pal];
    for(let y=S.pal==='deck'?0:8;y<ROWS;y++)for(let x=0;x<COLS;x++){
      const c=S.map[y][x],px=x*TS,py=y*TS,hv=hsh(x,y);
      if(c==='w'){for(let i=0;i<3;i++){const wx=((hv>>(i*3))%16+T*(4+i*2))%16;R(px+wx,py+3+i*5,4,.5,p.water2);R(px+(wx+7)%16,py+5+i*5,2,.5,'rgba(255,255,255,.25)');}
        if(S.sparkle&&hsh(x*5+Math.floor(T*3),y)%9===0)R(px+hv%14,py+(hv>>5)%14,1,1,'rgba(255,230,170,.8)');}
      else if(c==='s'&&tileAt(x,y+1)==='w'){const fo=Math.sin(T*1.1+x*.5)*2.5;R(px,py+11.5+fo,16,4.5-fo,'rgba(255,255,255,.4)');R(px,py+11+fo,16,.5,'rgba(255,255,255,.75)');}
    }
  }
  for(const f of FP){const a=.28*(1-(T-f.t)/7),px=f.x*TS,py=f.y*TS,v=f.d==='left'||f.d==='right';ctx.fillStyle=`rgba(90,60,30,${a})`;
    if(v){ctx.fillRect(px+5,py+12,3,1.5);ctx.fillRect(px+9,py+14,3,1.5);}else{ctx.fillRect(px+5,py+11,1.5,3);ctx.fillRect(px+9,py+13,1.5,3);}}
}

/* ---------- 사물 ---------- */
const DRAW={
  char(e,x,y){drawChar(x,y-2,e.look,e.dir,e.walking?(Math.floor(T*8)%2?1:2):0,e.sit,{scale:e.scale,ph:e.ph,hop:e.hop,umb:e.umb});},
  cat(e,x,y){drawCat(x,y,e.col||'#8a8a86',e.sleep&&!e.walking,e.ph);},
  piano(e,x,y){R(x,y-10,32,24,'#2a1810');R(x,y-10,32,2,'#4a2c1a');R(x,y-8,32,.5,'#5a3a24');R(x+10,y-7,12,7,'#e8dfc8');for(let i=0;i<3;i++)R(x+11,y-5.5+i*1.5,10,.5,'#999');
    R(x+2,y+3,28,6,'#f4f0e6');for(let i=0;i<14;i++)R(x+2+i*2,y+3,.5,6,'#bbb');for(let i=0;i<7;i++)if(i!==2&&i!==6)R(x+4.5+i*4,y+3,2,3.5,'#111');
    R(x+2,y+13,3,3,'#1c0f08');R(x+27,y+13,3,3,'#1c0f08');R(x,y+9,32,4,'#24140c');R(x+1,y-9,1,20,'rgba(255,255,255,.06)');},
  table(e,x,y){R(x+2,y+4,12,8,'#6e4a2b');R(x+2,y+4,12,2,'#8d6038');R(x+2,y+4,12,.5,'#a5754a');R(x+4,y+12,2,4,'#4a3020');R(x+10,y+12,2,4,'#4a3020');if(e.item)ITEM[e.item](x+4,y-3);},
  cabinet(e,x,y){R(x+1,y-3,14,18,'#5a3d26');R(x+1,y-4,14,2,'#7a5434');R(x+1,y-4,14,.5,'#946a44');R(x+2,y+3,12,.5,'#3e2a1a');R(x+2,y+9,12,.5,'#3e2a1a');R(x+7,y+5,2,1,'#c9a050');R(x+7,y+11,2,1,'#c9a050');R(x+13.5,y-3,1.5,18,'rgba(0,0,0,.18)');if(e.item)ITEM[e.item](x+4,y-10);},
  sofa(e,x,y){R(x,y-4,48,9,'#6e3b3b');R(x,y-4,48,1,'#8a5050');R(x,y+4,48,9,'#874848');R(x,y-2,5,15,'#5e3232');R(x+43,y-2,5,15,'#5e3232');R(x+8,y+5,14,3,'#784040');R(x+24,y+4,.5,8,'#6e3b3b');R(x,y+13,48,2,'rgba(0,0,0,.3)');R(x+30,y+2,8,6,'#c9a86a');R(x+31,y+3,6,4,'#d8ba80');},
  rug(e,x,y){R(x+2,y+2,60,44,'#5e2f3a');R(x+5,y+5,54,38,'#7a4050');R(x+9,y+9,46,30,'#5e2f3a');for(let i=0;i<5;i++){R(x+14+i*9,y+22,4,4,'#a8706a');R(x+15+i*9,y+23,2,2,'#d8b08a');}for(let i=0;i<15;i++){R(x+3+i*4,y+.5,1,1.5,'#c9a86a');R(x+3+i*4,y+46,1,1.5,'#c9a86a');}},
  box(e,x,y){R(x+2,y+4,12,11,'#a98450');R(x+2,y+4,12,2,'#c49c62');R(x+7,y+4,2,11,'#d8c08a');R(x+11.5,y+6,2.5,9,'rgba(0,0,0,.15)');R(x+3,y+10,3,2,'#e8e2d0');},
  shelf(e,x,y){R(x,y-14,32,30,'#4a3020');R(x,y-14,32,1,'#6a4830');const cols=['#8a3b3b','#3b5b8a','#6a8a3b','#c9a04a','#5a3b7a','#2f6060','#9a6a3a'];
    for(let r=0;r<3;r++){R(x+2,y-12+r*9,28,8,'#2a1a10');for(let i=0;i<9;i++){const v=hsh(i+e.x,r);R(x+3+i*3,y-11+r*9+(v%3),2,7-(v%3),cols[v%7]);R(x+3+i*3,y-10+r*9+(v%3),2,.5,'rgba(255,255,255,.3)');}}},
  desk(e,x,y){R(x,y+1,32,4,'#7d5531');R(x,y+1,32,.5,'#9a6e44');R(x,y+5,32,8,'#6a4628');R(x+2,y+13,3,3,'#4a3020');R(x+27,y+13,3,3,'#4a3020');R(x+12,y+7,8,.5,'#4a3020');R(x+15,y+8.5,2,1,'#c9a050');
    R(x+6,y,10,4,'#e8e2d0');R(x+7,y+1,7,.5,'#999');R(x+7,y+2,5,.5,'#999');R(x+25,y-6,2,7,'#333');R(x+22,y-8,8,4,'#c8a040');R(x+22,y-8,8,1,'#e8c860');if(e.item)ITEM[e.item](x+16,y-5);},
  window(e,x,y){const w=e.w*16;R(x+1,y+1,w-2,12,'#2b2620');const gx=x+2,gy=y+2,gw=w-4,gh=9;
    if(e.view==='rain'||e.view==='storm'){R(gx,gy,gw,gh,e.view==='storm'?'#1a2230':'#121a28');R(gx,gy+6,gw,3,'rgba(30,50,80,.5)');
      if(e.view==='storm'&&flash>0)R(gx,gy,gw,gh,`rgba(220,230,255,${flash})`);
      if(e.dot){const b=Math.pow(Math.max(0,Math.sin(T*1.1)),8);R(gx+gw-6,gy+4,1,1,`rgba(255,233,160,${.3+b*.7})`);if(b>.5)R(gx+gw-9,gy+4,7,.5,'rgba(255,233,160,.4)');}
      for(let i=0;i<gw/2.5;i++){const v=hsh(i,e.x);const yy=(v%9+T*(14+v%7))%(gh+3);R(gx+(i*2.5+v%3)%gw,gy+yy-2,.5,2,'rgba(170,190,220,.6)');}}
    else if(e.view==='sea'){const b=Math.pow(Math.max(0,Math.cos(T*.8)),10);R(gx,gy,gw,gh,'#0f1a2a');R(gx,gy+5,gw,4,'#14263a');R(gx,gy+5,gw,4,`rgba(255,240,180,${b*.6})`);R(gx,gy,gw,gh,`rgba(255,240,190,${b*.25})`);for(let i=0;i<4;i++)R(gx+(hsh(i,3)%gw),gy+1+i,.5,.5,'#cde');}
    else if(e.view==='sunset'){const k=e.night?S.nightK||0:0;const cs=['#f6b45a','#e8786a','#8a4a7a'];for(let i=0;i<3;i++)R(gx,gy+i*3,gw,3,cs[2-i]);R(gx+gw/2-2,gy+5,4,2,'#ffe2a0');R(gx,gy+7,gw,2,'#5a4a7a');R(gx+gw/2-3,gy+7.5,6,.5,'#ffd080');if(S.nightK)R(gx,gy,gw,gh,`rgba(10,14,40,${S.nightK*.8})`);}
    R(x+w/2-.5,y+2,1,9,'#2b2620');R(gx,gy+4,gw,.5,'#2b2620');R(gx,gy,gw,.5,'rgba(255,255,255,.15)');R(x+1,y+12,w-2,2,'#5a4a3a');R(x+1,y+12,w-2,.5,'#7a6a56');
    if(e.curt){R(x,y,3,13,e.curt);R(x+w-3,y,3,13,e.curt);R(x,y,w,1.5,shade(e.curt,.7));R(x+1,y+2,.5,10,'rgba(0,0,0,.2)');R(x+w-2,y+2,.5,10,'rgba(0,0,0,.2)');}},
  photo(e,x,y){R(x+3.5,y+1.5,9,9,'#8a6e3a');R(x+4,y+2,8,8,'#b89858');R(x+5,y+3,6,6,'#d8c8a0');R(x+6,y+5,1.5,3.5,'#335');R(x+8.5,y+5,2,3.5,'#eee');R(x+6,y+4,1.5,1,'#333');R(x+8.5,y+4,1.5,1,'#432');R(x+10,y+3,1,5,'#b33');},
  clock(e,x,y){R(x+4,y+1,8,8,'#3a2a1c');R(x+5,y+2,6,6,'#e8e2d0');R(x+7.5,y+3,.5,2.5,'#222');R(x+8,y+5,2,.5,'#222');R(x+7.5,y+9,1,4,'#6a5030');R(x+6.5,y+12,3,2,'#c9a050');},
  marks(e,x,y){for(let i=0;i<6;i++){R(x+5,y+12-i*2,5-(i%2),.5,'#d8c8a0');}R(x+11,y+2,.5,11,'rgba(216,200,160,.5)');},
  calendar(e,x,y){R(x+4,y+2,8,10,'#eee');R(x+4,y+2,8,2,'#b33');for(let i=0;i<4;i++)R(x+5,y+5+i*2,6,.5,'#bbb');R(x+8,y+8,2,2,'#c00');},
  drawing(e,x,y){R(x+3,y+2,10,8,'#f4f0e0');R(x+7,y+3,2,6,'#c33');R(x+6.5,y+3,3,1,'#fc3');R(x+4,y+6,1.5,3,'#36a');R(x+10.5,y+6,1.5,3,'#e7a');R(x+3,y+9,10,1,'#4a8');R(x+3,y+2,1.5,1,'#dc6');},
  neck(e,x,y){R(x+5,y+3,.5,5,'#a88');R(x+10,y+3,.5,5,'#a88');R(x+5.5,y+7.5,5,.5,'#a88');R(x+7,y+8,2.5,2,'#f0c8c0');R(x+7.5,y+8,1,.5,'#fff');},
  door(e,x,y){R(x+1,y,14,16,'#4a2e1a');R(x+2,y+1,12,15,e.open?'#0b0d14':'#5e3c22');if(!e.open){R(x+3,y+2,10,5,'#6a4628');R(x+3,y+9,10,5,'#6a4628');R(x+3,y+2,10,.5,'#7d5531');R(x+11,y+8,2,2,'#c9a050');}},
  stove(e,x,y){R(x+7,y-14,2,16,'#2a2a2a');R(x+2,y+2,12,12,'#2c2c2c');R(x+2,y+2,12,2,'#444');const f=.6+.4*Math.sin(T*9+Math.sin(T*5));R(x+5,y+7,6,4,`rgb(${200+f*55|0},${90+f*60|0},30)`);R(x+6.5,y+8,3,2,`rgba(255,230,140,${f})`);R(x+3,y+14,2,2,'#222');R(x+11,y+14,2,2,'#222');
    R(x+4,y-1,6,3,'#7a7a80');R(x+10,y,2,1,'#7a7a80');for(let i=0;i<3;i++){const t=(T*.6+i*.33)%1;R(x+6+Math.sin(T*2+i)*2,y-3-t*8,1.5,1.5,`rgba(255,255,255,${.3*(1-t)})`);}},
  stairs(e,x,y){R(x,y-6,16,22,'#3a332c');for(let i=0;i<5;i++){R(x+2,y-4+i*4,12-((i%2)*4),2,'#6a5e50');R(x+2,y-4+i*4,12-((i%2)*4),.5,'#857868');}R(x+13,y-8,2,24,'#2a241e');},
  bed(e,x,y){R(x+1,y,14,31,'#6b4a2e');R(x+2,y+1,12,29,'#e8e8e8');R(x+3,y+2,10,5,'#fff');R(x+3,y+6,10,.5,'#ccc');R(x+2,y+11,12,18,e.blanket||'#7f8fa8');R(x+2,y+11,12,2,'rgba(255,255,255,.35)');R(x+11.5,y+13,2.5,16,'rgba(0,0,0,.12)');
    if(e.who){const L=e.who,br=Math.sin(T*1.3)*.5;R(x+4,y+2,8,7,L.skin);R(x+3,y+1,10,3,L.hair);R(x+3,y+3,1,8,L.hair);R(x+12,y+3,1,8,L.hair);R(x+5.5,y+6,2,.5,'#6a5048');R(x+9,y+6,2,.5,'#6a5048');R(x+7,y+7.5,2,.5,'#b88');R(x+4,y+12+br,8,10,'rgba(255,255,255,.1)');}},
  iv(e,x,y){R(x+7,y-10,1,24,'#aab');R(x+4,y-11,7,1,'#aab');R(x+4,y-10,4,6,'rgba(200,230,255,.8)');R(x+5.5,y-4,.5,10,'rgba(200,230,255,.5)');const t=(T*.8)%1;R(x+5.5,y-4+t*8,.5,1,'#fff');R(x+4,y+13,9,2,'#889');},
  clip(e,x,y){R(x+7,y+6,2,9,'#889');R(x+4,y+1,8,7,'#c9a46a');R(x+5,y+2,6,5,'#fff');R(x+6,y+3,4,.5,'#999');R(x+6,y+4,3,.5,'#999');R(x+6,y+5,4,.5,'#999');R(x+7,y+.5,2,1.5,'#888');},
  chair(e,x,y){R(x+4,y,8,6,'#6a4628');R(x+4,y+6,8,4,'#7d5531');R(x+4,y+10,1,5,'#4a3020');R(x+11,y+10,1,5,'#4a3020');if(e.item==='plush'){R(x+6,y+3,5,4,'#b8b4a8');R(x+6,y+2,1.5,1.5,'#b8b4a8');R(x+9.5,y+2,1.5,1.5,'#b8b4a8');R(x+7,y+4.5,.5,.5,'#222');R(x+9.5,y+4.5,.5,.5,'#222');}else if(e.item)R(x+4,y+5,8,2,'#b88a8a');},
  plant(e,x,y){R(x+5,y+9,6,6,'#8a5a3a');R(x+5,y+9,6,1,'#a87050');R(x+3,y+1,4,8,'#6a6a3a');R(x+8,y-1,4,10,'#7a7a44');R(x+6,y+3,4,6,'#5a5a34');},
  bowl(e,x,y){R(x+4,y+10,8,4,'#4a7ab0');R(x+5,y+10,6,1,'#22344a');R(x+4,y+10,8,.5,'#6a9ad0');},
  rack(e,x,y){R(x+7,y-10,1.5,24,'#4a3020');R(x+3,y-9,10,1,'#4a3020');R(x+3,y-8,5,10,'#2f3e5c');R(x+3,y-8,5,1,'#3f4e6c');R(x+9,y-11,5,3,'#22304a');R(x+10.5,y-10,1.5,.5,'#d4b04a');R(x+4,y+13,8,2,'#3a2416');},
  radio(e,x,y){R(x+1,y+2,14,13,'#3a3d44');R(x+1,y+2,14,1,'#55585f');R(x+3,y+4,6,4,'#1c2a1c');R(x+3.5,y+5,5,.5,Math.sin(T*6)>0?'#6f6':'#3a3');R(x+11,y+4,2,2,'#111');R(x+11,y+8,2,2,'#111');R(x+3,y+10,9,3,'#22242a');for(let i=0;i<4;i++)R(x+4+i*2,y+10.5,.5,2,'#555');R(x+13,y-8,.5,10,'#999');},
  boat(e,x,y){R(x+3,y+3,42,3,'#a07a4a');R(x+2,y+5,44,7,'#7a5a3a');R(x+2,y+5,44,1,'#8c6a46');R(x+5,y+12,38,3,'#5a3e26');R(x+10,y+7,2,1,'#eee');R(x+13,y+7,2,1,'#eee');R(x+16,y+7,2,1,'#eee');
    R(x+28,y+6,6,4,'#2a1c10');R(x+29,y+7,3,3,'#1a120a');R(x+20,y-2,1,6,'#6a4a2a');for(let i=0;i<8;i++)R(x+4+i*5,y+5,.5,7,'rgba(0,0,0,.2)');R(x+12,y+15,26,1,'rgba(0,0,0,.25)');},
  lighthouse(e,x,y){const cx=x+24,by=y+30,hgt=58;
    for(let i=0;i<hgt;i+=.5){const w=20-i*.13,red=Math.floor(i/10)%2;R(cx-w/2,by-i,w,.5,red?'#b53a32':'#ebe6dc');R(cx+w/2-w*.28,by-i,w*.28,.5,red?'#8a2a26':'#c4beb2');R(cx-w/2,by-i,1,.5,red?'#d0504a':'#fff');}
    R(cx-10,by-1,20,2,'#5a5048');const top=by-hgt;R(cx-8,top-1,16,2,'#2a2a2a');R(cx-9,top-2,18,.5,'#555');R(cx-6,top-9,12,8,'#2e2e2e');
    R(cx-4,top-8,8,6,S.lit?'#ffe9a0':'#4a4a48');if(S.lit)R(cx-2,top-7,4,4,'#fff8d8');R(cx-.25,top-8,.5,6,'#2e2e2e');R(cx-7,top-11,14,2,'#2a2a2a');R(cx-4,top-13,8,2,'#2a2a2a');R(cx-1,top-15,2,2,'#2a2a2a');
    R(cx-3,by-14,6,9,'#3a2e24');R(cx-2,by-13,4,8,'#2a2018');R(cx-2,by-30,3,4,'#3a4a5a');R(cx+1,by-46,2.5,3.5,'#3a4a5a');e.lamp=[cx,top-5];},
  sign(e,x,y){R(x+7,y+6,2,9,'#5a4028');R(x+1,y,14,8,'#8a6a40');R(x+2,y+1,12,6,'#a8844f');R(x+3,y+2.5,10,.5,'#5a4028');R(x+3,y+4,7,.5,'#5a4028');},
  shell(e,x,y){R(x+6,y+9,4,3,'#f0c8c0');R(x+7,y+8,2,1,'#f8dcd4');R(x+7,y+10,.5,2,'#c89890');R(x+8.5,y+10,.5,2,'#c89890');},
  rockseat(e,x,y){R(x+1,y+7,14,8,'#6a6057');R(x+3,y+5,10,3,'#6a6057');R(x+3,y+6,6,1.5,'rgba(255,255,255,.15)');R(x+1,y+14,14,1,'rgba(0,0,0,.3)');},
  // 1998 해진호
  cabin(e,x,y){R(x,y-14,48,46,'#d8d4c8');R(x,y-14,48,3,'#f0ece0');R(x-2,y-18,52,5,'#9a3030');R(x+4,y-8,14,10,'#1a2a20');R(x+4,y-8,14,10,`rgba(120,255,140,${.25+.15*Math.sin(T*5)})`);R(x+26,y-8,16,10,'#1a2230');
    R(x+20,y+10,10,22,'#5a4a3a');R(x+28,y+20,1.5,1.5,'#d8b450');R(x+2,y+30,44,2,'rgba(0,0,0,.35)');R(x+40,y-26,2,10,'#888');R(x+38,y-28,6,2,'#c33');},
  mast(e,x,y){R(x+7,y-30,2,46,'#5a4630');R(x+3,y-26,10,1.5,'#5a4630');ctx.strokeStyle='rgba(220,220,200,.5)';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(x+8,y-30);ctx.lineTo(x-16,y+14);ctx.moveTo(x+8,y-30);ctx.lineTo(x+32,y+14);ctx.stroke();
    R(x+6,y-33,4,4,`rgba(255,${120+Math.sin(T*3)*40|0},80,.9)`);},
  net(e,x,y){R(x+1,y+6,14,9,'#4a6a5a');for(let i=0;i<5;i++){R(x+2+i*3,y+6,.5,9,'#2a3a30');R(x+1,y+7+i*2,14,.5,'#2a3a30');}R(x+10,y+3,4,4,'#d86a30');},
  crate(e,x,y){R(x+2,y+3,12,12,'#8a6a40');R(x+2,y+3,12,1.5,'#a88050');R(x+2,y+8.5,12,1,'#5a4428');R(x+7.5,y+3,1,12,'#5a4428');},
  buoy(e,x,y){R(x+4,y+4,8,10,'#f0f0e8');R(x+4,y+7,8,3,'#d84838');R(x+5,y+2,6,2,'#c0c0b8');},
  // 2025 요양원
  wheel(e,x,y){R(x+2,y+4,12,3,'#4a4a52');R(x+1,y+6,2,8,'#666');R(x+13,y+6,2,8,'#666');ctx.strokeStyle='#888';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x+3,y+12,4,0,7);ctx.arc(x+13,y+12,4,0,7);ctx.stroke();R(x+3,y+11.5,10,1,'#555');},
  tv(e,x,y){R(x+1,y+2,14,9,'#1a1a1e');R(x+2,y+3,12,7,`rgb(${60+Math.sin(T*3)*20|0},${80+Math.sin(T*2)*25|0},${110})`);R(x+6,y+11,4,3,'#333');R(x+3,y+14,10,1,'#222');},
  board(e,x,y){R(x+1,y+1,14,12,'#e8e4d8');R(x+1,y+1,14,1,'#a88');for(let i=0;i<4;i++)R(x+3,y+4+i*2,9-(i%2)*3,.5,'#666');R(x+11,y+9,2,2,'#c44');},
  // 1978 결혼식
  arch(e,x,y){const cs=['#f4f4f4','#f0a8b8','#f6d86a','#bfe0a0'];R(x+2,y-14,2,30,'#8a6a40');R(x+44,y-14,2,30,'#8a6a40');
    for(let i=0;i<22;i++){const a=Math.PI+i/21*Math.PI;R(x+24+Math.cos(a)*22-1.5,y-12+Math.sin(a)*12-1.5,3,3,cs[i%4]);}
    for(let i=0;i<6;i++){R(x+1+i%2,y-10+i*4,3,3,cs[(i+1)%4]);R(x+43+i%2,y-10+i*4,3,3,cs[(i+2)%4]);}
    R(x+16,y-4+Math.sin(T*2)*1,16,1,'rgba(255,255,255,.6)');},
  chairs(e,x,y){for(let i=0;i<e.w;i++){const cx=x+i*16;R(cx+3,y+2,10,4,'#f0ece2');R(cx+3,y+6,10,3,'#e0dccf');R(cx+3,y+9,1,5,'#b8b0a0');R(cx+12,y+9,1,5,'#b8b0a0');R(cx+5,y+3,6,.5,'#d8b0b8');}},
  cake(e,x,y){R(x+1,y+6,14,9,'#f0ece2');R(x+1,y+6,14,1,'#fff');R(x+3,y+1,10,6,'#fff8f0');R(x+5,y-3,6,4,'#fff8f0');R(x+3,y+4,10,.5,'#f0a8b8');R(x+5,y,6,.5,'#f0a8b8');R(x+7,y-6,1,3,'#f6d86a');R(x+8,y-6,1,3,'#f6d86a');R(x+7,y-7,2,1,`rgba(255,200,80,${.6+.4*Math.sin(T*9)})`);},
  confetti(e,x,y){const cs=['#f0a8b8','#f6d86a','#bfe0f0','#fff'];for(let i=0;i<14;i++){const h=hsh(i,e.x),k=(T*.2+(h%100)/100)%1;R(x+(h%48)+Math.sin(T*2+i)*3,y-20+k*40,1.5,1.5,cs[i%4]);}},
  // 1998 폭풍 등명실
  weight(e,x,y){R(x+6,y-14,2,24,'#2a2a2a');R(x+3,y+10,8,6,'#3a3d44');R(x+3,y+10,8,1,'#55585f');R(x+10,y-2,5,5,'#55585f');R(x+12,y-4,2,9,'#888');R(x+11,y-5,4,2,'#a87a4a');
    const k=e.turn||0;R(x+12+Math.cos(k)*3,y+.5+Math.sin(k)*3,2,2,'#c9a050');},
  salt(e,x,y){for(let i=0;i<5;i++){const h=hsh(i,e.x);R(x+3+h%10,y+2+(h>>5)%10,2+h%2,1.5,'rgba(240,244,248,.85)');}},

  wreath(e,x,y){R(x+5,y-12,.5,27,'#555');R(x+10.5,y-12,.5,27,'#555');const cs=['#f4f4f4','#f0a8b8','#f6d86a','#fff'];for(let i=0;i<14;i++){const v=hsh(i,e.x),a=i/14*6.28;R(x+8+Math.cos(a)*5-1.5,y-9+Math.sin(a)*5-1.5,3,3,cs[v%4]);}R(x+5,y-12,6,6,'#4a7a3a');R(x+6.5,y-10.5,3,3,'#f4f4f4');R(x+3,y-2,3,14,'#fff');R(x+10,y-2,3,14,'#fff');R(x+3.5,y,2,.5,'#c33');R(x+3.5,y+3,2,.5,'#333');R(x+10.5,y,2,.5,'#333');R(x+10.5,y+3,2,.5,'#333');},
  lamppost(e,x,y){R(x+7,y-26,2,41,'#2a2c33');R(x+6,y+13,4,2,'#1c1e24');R(x+3,y-28,10,3,'#2a2c33');R(x+4,y-25,8,2,'#ffe9a0');R(x+7.5,y-26,.5,41,'rgba(255,255,255,.12)');},
  bench(e,x,y){R(x+1,y+2,30,3,'#6a4a2c');R(x+1,y+2,30,.5,'#8a6640');R(x+1,y+7,30,4,'#7a5632');R(x+1,y+7,30,.5,'#93693e');R(x+3,y+11,2,4,'#333');R(x+27,y+11,2,4,'#333');if(e.item)ITEM[e.item](x+18,y-1);},
  booth(e,x,y){R(x+1,y-18,14,34,'#2e5a8a');R(x+1,y-18,14,3,'#1e4470');R(x+3,y-13,10,18,'rgba(190,220,240,.35)');R(x+5,y-10,5,7,'#333');R(x+6,y-9,3,2,'#8f8');R(x+3,y+6,10,8,'#274e7a');R(x+3,y-13,.5,18,'rgba(255,255,255,.4)');},
  busstop(e,x,y){R(x+7,y-14,1.5,29,'#888');R(x+3,y-18,10,7,'#2e7a5a');R(x+4,y-17,8,2,'#fff');R(x+4,y-14,5,.5,'#cfe');R(x+5,y+13,5,2,'#555');},
  gdoor(e,x,y){const w=32;R(x,y-6,w,22,'#1c1a18');R(x+1,y-5,14.5,21,'#f4d898');R(x+16.5,y-5,14.5,21,'#f4d898');R(x+1,y-5,30,21,'rgba(255,240,200,.25)');
    for(let i=0;i<4;i++){const bx=x+4+i*7+Math.sin(T*.7+i*2)*1.5;R(bx,y+2,3,10,'rgba(90,60,40,.45)');R(bx+.5,y,2,2.5,'rgba(90,60,40,.45)');}
    if(e.bride){R(x+13,y+1,5,12,'rgba(255,255,255,.8)');R(x+14,y-2,3,3,'rgba(240,208,176,.9)');}
    R(x+15,y+4,.5,5,'#c9a050');R(x+16.5,y+4,.5,5,'#c9a050');R(x+1,y-5,2,21,'rgba(255,255,255,.25)');R(x,y-8,w,2,'#3a3028');},
  bwin(e,x,y){R(x+1,y-10,14,20,'#1c1a18');R(x+2,y-9,12,18,'#f0cf88');R(x+2,y-9,12,18,`rgba(255,240,200,${.15+.05*Math.sin(T*2+e.x)})`);R(x+7.5,y-9,.5,18,'#1c1a18');R(x+2,y,12,.5,'#1c1a18');const bx=x+4+Math.sin(T*.5+e.x)*2;R(bx,y+2,3,7,'rgba(90,60,40,.4)');R(bx+.5,y,2,2,'rgba(90,60,40,.4)');R(x+2,y-9,3,18,'rgba(160,60,70,.5)');},
  wsign(e,x,y){R(x,y-2,64,12,'#1a1416');R(x+1,y-1,62,10,'#2a1c22');ctx.save();ctx.shadowColor='#ffd0e0';ctx.shadowBlur=6;txt('은 빛 웨 딩 홀',x+32,y+7,7,`rgba(255,220,235,${.85+.15*Math.sin(T*3)})`,'center');ctx.restore();},
  puddle(e,x,y){ctx.fillStyle='rgba(20,26,40,.55)';ctx.beginPath();ctx.ellipse(x+e.w*8,y+9,e.w*7,4,0,0,7);ctx.fill();ctx.fillStyle='rgba(255,220,150,.18)';ctx.beginPath();ctx.ellipse(x+e.w*8-2,y+8,e.w*3,1.5,0,0,7);ctx.fill();
    const t=(T*1.3+e.ph)%1;ctx.strokeStyle=`rgba(200,220,255,${.5*(1-t)})`;ctx.lineWidth=.5;ctx.beginPath();ctx.ellipse(x+e.w*8+Math.sin(e.ph*9)*5,y+9,t*5,t*2,0,0,7);ctx.stroke();},
  // 1985 등명실
  lens(e,x,y){const cx=x+16,cy=y+14,lit=S.lit;R(x+4,y+24,24,6,'#3a3d44');R(x+2,y+28,28,3,'#2a2c33');R(x+6,y+22,20,3,'#55585f');
    if(lit){const g=ctx.createRadialGradient(cx,cy,0,cx,cy,26);g.addColorStop(0,'rgba(255,245,200,.9)');g.addColorStop(1,'rgba(255,240,180,0)');ctx.fillStyle=g;ctx.fillRect(cx-26,cy-26,52,52);}
    for(let i=0;i<9;i++){const w=12+Math.sin(i/8*3.14)*10;R(cx-w/2,y-6+i*3.2,w,2.6,lit?'rgba(255,250,220,.95)':'rgba(170,200,215,.75)');R(cx-w/2,y-6+i*3.2,w,.5,'rgba(255,255,255,.7)');R(cx-w/2+((T*(lit?14:0)+i*3)%w),y-6+i*3.2,1.5,2.6,'rgba(255,255,255,.8)');}
    R(cx-3,cy-4,6,8,lit?'#fff':'#c9b06a');R(cx-12,y-8,24,2,'#8a6a2a');R(cx-12,y+22,24,1.5,'#8a6a2a');R(cx-12,y-8,1,31,'#8a6a2a');R(cx+11,y-8,1,31,'#8a6a2a');},
  stool(e,x,y){R(x+4,y+8,8,3,'#7d5531');R(x+5,y+11,1,4,'#4a3020');R(x+10,y+11,1,4,'#4a3020');},
  bucket(e,x,y){R(x+4,y+7,8,8,'#9a9aa0');R(x+4,y+7,8,1.5,'#3a7ac8');R(x+3.5,y+6.5,9,.5,'#c4c4ca');R(x+11,y+9,1,6,'rgba(0,0,0,.2)');R(x+12,y+3,1,8,'#a87a4a');R(x+11.5,y+2,2,2,'#3a7ac8');R(x+2,y+13,3,1.5,'#3a7ac8');},
  toolbox(e,x,y){R(x+2,y+7,12,8,'#a83a32');R(x+2,y+7,12,1.5,'#c85048');R(x+6,y+5,4,2,'#333');R(x+7,y+10,2,1.5,'#d4b04a');R(x+13,y+12,5,1,'#999');},
  hatch(e,x,y){R(x,y,16,16,'#2a2e33');R(x+1,y+1,14,14,'#0e1014');for(let i=0;i<4;i++)R(x+2,y+3+i*3.5,12,1,'#6a5e50');R(x+1,y+1,1,14,'#55585f');R(x+14,y+1,1,14,'#55585f');},
  jar(e,x,y){DRAW.cabinet(e,x,y);R(x+5,y-9,6,6,'rgba(190,220,230,.6)');R(x+5,y-9,6,.5,'#fff');R(x+7,y-14,1,8,'#a87a4a');R(x+6.5,y-15.5,2,2.5,'#3a7ac8');R(x+9,y-13,1,7,'#a87a4a');},
};
const ITEM={
  musicbox(x,y){R(x,y+3,8,6,'#6b3a1f');R(x,y+2,8,2,'#8a4c28');R(x,y+2,8,.5,'#a8643a');R(x+3,y+5,2,1,'#e0c060');R(x+7,y+5,2,1,'#b89a50');R(x+6.5,y+3.5,1,5.5,'rgba(0,0,0,.2)');},
  lantern(x,y){R(x+2,y,4,1,'#333');R(x+1,y+1,6,7,'#3a3a32');R(x+2,y+2,4,5,'#f6d88a');R(x+3,y+3,2,3,'#fff4c8');R(x+1,y+8,6,1,'#333');},
  vase(x,y){R(x+2,y+3,4,5,'#7aa0b8');R(x+2,y+3,1,5,'#9ac0d8');R(x+1,y,2,3,'#e07a8a');R(x+4,y-1,2,3,'#f0e070');R(x+5,y+1,2,2,'#e07a8a');R(x+3,y+1,1,3,'#4a7a3a');R(x+6.5,y+5,2.5,3,'#fff');R(x+7,y+6,1,1,'#e07a8a');},
  pkg(x,y){R(x,y+3,8,6,'#b8a070');R(x,y+3,8,1,'#d0b888');R(x+3.5,y+3,1,6,'#b33');R(x,y+5.5,8,1,'#b33');},
};
function drawGlow(e){
  const cx=(e.fx+e.w/2)*TS,cy=(e.fy+e.h/2)*TS-(e.wallDeco?0:e.kind==='char'?10:5),p=.55+.45*Math.sin(T*3+e.x);
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,16);g.addColorStop(0,`rgba(255,236,170,${.5*p})`);g.addColorStop(1,'rgba(255,236,170,0)');
  ctx.fillStyle=g;ctx.fillRect(cx-16,cy-16,32,32);
  for(let i=0;i<4;i++){const a=T*1.6+i*1.57,r=9+Math.sin(T*2+i)*2,sx=cx+Math.cos(a)*r,sy=cy+Math.sin(a)*r*.6;
    R(sx,sy,1,1,'#fff6d0');if((i+Math.floor(T*4))%3===0){R(sx-1,sy+.25,3,.5,'rgba(255,246,208,.7)');R(sx+.25,sy-1,.5,3,'rgba(255,246,208,.7)');}}
}
function drawGlint(e){const cx=(e.fx+e.w/2)*TS,cy=(e.fy+e.h/2)*TS-3,k=(T*.7+e.ph)%1;if(k<.25){const a=Math.sin(k/.25*3.14);R(cx-2*a,cy,4*a,.5,`rgba(255,200,215,${a})`);R(cx-.25,cy-2*a,.5,4*a,`rgba(255,200,215,${a})`);}}

/* ---------- 조명 ---------- */
// 조명: 움직이지 않는 조명은 한 번만 그려 두고(캐시), 깜빡이는 불·플레이어 주변 빛만 매 프레임 계산
const LCACHE={key:'',dark:mk(W,H),glow:mk(W,H)};
function punch(g,l,r){const gr=g.createRadialGradient(l.x,l.y,0,l.x,l.y,r);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.5,'rgba(0,0,0,.7)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(l.x,l.y,r,0,7);g.fill();}
function glowL(g,l,r,a=.2){const gr=g.createRadialGradient(l.x,l.y,0,l.x,l.y,r*.8);gr.addColorStop(0,`rgba(${l.c},${a})`);gr.addColorStop(1,`rgba(${l.c},0)`);g.fillStyle=gr;g.fillRect(l.x-r,l.y-r,r*2,r*2);}
function drawLights(){
  if(curDark<=0.01)return;
  const all=(S.lights?S.lights():[]).filter(l=>!(l.lit&&!S.lit));
  const stat=all.filter(l=>!l.fl&&!l.beam),dyn=all.filter(l=>l.fl||l.beam);
  const lh=ent('lh');if(lh&&lh.lamp&&S.lit)stat.push({x:lh.lamp[0],y:lh.lamp[1],r:40,c:'255,230,160'});
  const key=sceneName+'|'+S.lit+'|'+curDark.toFixed(3)+'|'+(S.darkC||'')+'|'+stat.map(l=>l.x+','+l.y+','+l.r).join(';');
  if(LCACHE.key!==key){LCACHE.key=key;
    const d=LCACHE.dark.getContext('2d');d.globalCompositeOperation='source-over';d.clearRect(0,0,W,H);d.fillStyle=`rgba(${S.darkC||'0,0,10'},${curDark})`;d.fillRect(0,0,W,H);
    d.globalCompositeOperation='destination-out';for(const l of stat)punch(d,l,l.r);d.globalCompositeOperation='source-over';
    const g=LCACHE.glow.getContext('2d');g.clearRect(0,0,W,H);g.globalCompositeOperation='lighter';for(const l of stat)if(l.c)glowL(g,l,l.r);g.globalCompositeOperation='source-over';}
  lx.globalCompositeOperation='source-over';lx.clearRect(0,0,W,H);lx.drawImage(LCACHE.dark,0,0);
  lx.globalCompositeOperation='destination-out';
  if(!P.hidden)punch(lx,{x:P.fx*16+8,y:P.fy*16+6},46);
  for(const l of dyn){let r=l.r;if(l.fl)r*=.92+.08*Math.sin(T*11+Math.sin(T*7));if(l.beam)r*=.4+.9*Math.pow(Math.max(0,Math.cos(T*.8)),6);l._r=r;punch(lx,l,r);}
  lx.globalCompositeOperation='source-over';
  ctx.drawImage(lc,0,0);
  ctx.globalCompositeOperation='lighter';ctx.drawImage(LCACHE.glow,0,0);
  if(!LOWFX)for(const l of dyn)if(l.c)glowL(ctx,l,l._r);
  ctx.globalCompositeOperation='source-over';
}
function drawBeam(){
  ctx.globalCompositeOperation='lighter';
  const lh=ent('lh');
  if(lh&&lh.lamp&&S.lit){const [cx,cy]=lh.lamp;
    for(const off of [0,Math.PI]){const a=T*.7+off,sp=.11,len=260;if(Math.sin(a)<-.2)continue;
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,len);g.addColorStop(0,'rgba(255,240,180,.4)');g.addColorStop(1,'rgba(255,240,180,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a-sp)*len,cy+Math.sin(a-sp)*len*.45);ctx.lineTo(cx+Math.cos(a+sp)*len,cy+Math.sin(a+sp)*len*.45);ctx.closePath();ctx.fill();}}
  const ln=ent('lens');
  if(ln&&S.lit){const cx=ln.fx*16+16,cy=ln.fy*16+14;
    for(const off of [0,Math.PI]){const a=T*.9+off,sp=.16,len=240;const g=ctx.createRadialGradient(cx,cy,0,cx,cy,len);g.addColorStop(0,'rgba(255,240,180,.45)');g.addColorStop(1,'rgba(255,240,180,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a-sp)*len,cy+Math.sin(a-sp)*len);ctx.lineTo(cx+Math.cos(a+sp)*len,cy+Math.sin(a+sp)*len);ctx.closePath();ctx.fill();}}
  // 창으로 드는 빛줄기
  for(const e of ents)if(e.shaft&&!e.hidden){const x=e.fx*16,w=e.w*16,y=e.fy*16+14;const g=ctx.createLinearGradient(0,y,0,y+46);g.addColorStop(0,`rgba(${e.shaft},.22)`);g.addColorStop(1,`rgba(${e.shaft},0)`);
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+2,y);ctx.lineTo(x+w-2,y);ctx.lineTo(x+w+8,y+46);ctx.lineTo(x-8,y+46);ctx.closePath();ctx.fill();}
  ctx.globalCompositeOperation='source-over';
}
function drawRain(){
  for(let i=0;i<(LOWFX?50:110);i++){const h=hsh(i,3),x=((h%360)-T*50*(1+(h%3)*.2))%360,y=(((h>>9)%H)+T*(250+(h>>4)%140))%H;R((x+360)%360-20,y,.5,5+(h%3),'rgba(190,210,240,.38)');}
  for(let i=0;i<16;i++){const k=T*1.8+i*.37,ph=k%1,h=hsh(i,Math.floor(k)+11),x=h%W,y=70+(h>>9)%90;if(SOLID_T.includes(tileAt(x>>4,y>>4))&&tileAt(x>>4,y>>4)!=='a')continue;
    ctx.strokeStyle=`rgba(200,220,255,${.45*(1-ph)})`;ctx.lineWidth=.5;ctx.beginPath();ctx.ellipse(x,y,1+ph*4,.5+ph*1.5,0,0,7);ctx.stroke();}
}

/* ---------- 비스타: 옆에서 본 등불리 전경 (타이틀 · 막간 · 엔딩) ---------- */
const VMODE={night:['#040714','#0b1736','#1c3160','#0a1428'],dusk:['#2a1c4a','#b4506a','#f4a45a','#3a2a4a'],dawn:['#1c2a55','#8a6f9a','#f6c08e','#2a3350'],storm:['#05060a','#10151e','#222b36','#0a0d12'],rain:['#05070e','#0e1626','#1a2740','#0a0f18']};
function drawVista(v,al=1){
  const g=ctx,t=T;g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=al;const M=VMODE[v.mode],hz=236,night=v.mode==='night';
  let sk=g.createLinearGradient(0,0,0,hz);sk.addColorStop(0,M[0]);sk.addColorStop(.6,M[1]);sk.addColorStop(1,M[2]);g.fillStyle=sk;g.fillRect(0,0,640,hz);
  if(night||v.mode==='dawn'||v.mode==='dusk'){const n=night?130:40;for(let i=0;i<n;i++){const h=hsh(i,77),x=h%640,y=(h>>10)%(hz-50),tw=.35+.65*Math.abs(Math.sin(t*(.4+(h%7)*.2)+i));
    g.fillStyle=`rgba(255,250,230,${tw*(night?.95:.4)})`;const s=(h>>20)%4?1:2;g.fillRect(x,y,s,s);if(night&&(h>>22)%13===0){g.fillRect(x-2,y,5,1);g.fillRect(x,y-2,1,5);}}
    if(v.shoot){const k=(t*.25)%1;if(k<.12){const x=120+k*900,y=40+k*300;const sg=g.createLinearGradient(x-50,y-17,x,y);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(1,'rgba(255,255,255,.9)');g.strokeStyle=sg;g.lineWidth=2;g.beginPath();g.moveTo(x-50,y-17);g.lineTo(x,y);g.stroke();}}}
  let rx=0;
  if(v.moon){const mx=150,my=74;rx=mx;const h=g.createRadialGradient(mx,my,10,mx,my,90);h.addColorStop(0,'rgba(220,230,255,.35)');h.addColorStop(1,'rgba(220,230,255,0)');g.fillStyle=h;g.fillRect(mx-90,my-90,180,180);
    g.fillStyle='#f4f0dc';g.beginPath();g.arc(mx,my,22,0,7);g.fill();g.fillStyle='rgba(200,196,170,.6)';g.beginPath();g.arc(mx-7,my-5,5,0,7);g.arc(mx+8,my+6,3.5,0,7);g.arc(mx+3,my-11,2.5,0,7);g.fill();}
  if(v.sun){const sx=v.sunX||220;rx=sx;const h=g.createRadialGradient(sx,hz,10,sx,hz,230);h.addColorStop(0,'rgba(255,225,160,.85)');h.addColorStop(.4,'rgba(255,170,110,.35)');h.addColorStop(1,'rgba(255,170,110,0)');g.fillStyle=h;g.fillRect(0,0,640,hz);
    g.save();g.beginPath();g.rect(0,0,640,hz);g.clip();g.fillStyle='#fff0c0';g.beginPath();g.arc(sx,hz+6,30,0,7);g.fill();g.restore();}
  const cc=v.mode==='storm'||v.mode==='rain'?'rgba(40,48,60,.8)':night?'rgba(60,80,130,.35)':'rgba(255,200,180,.35)';
  for(let i=0;i<7;i++){const h=hsh(i,5),x=((h%900)+t*(4+i))%900-120,y=26+(h>>8)%130,w=70+(h>>4)%90;g.fillStyle=cc;for(let k=0;k<4;k++){g.beginPath();g.ellipse(x+k*w*.22,y+(k%2)*6,w*.3,10+(k%2)*5,0,0,7);g.fill();}}
  if(v.mode==='storm'&&flash>0){g.fillStyle=`rgba(200,215,255,${flash*.55})`;g.fillRect(0,0,640,hz);g.strokeStyle=`rgba(255,255,255,${flash})`;g.lineWidth=2;g.beginPath();g.moveTo(300,0);g.lineTo(285,60);g.lineTo(310,90);g.lineTo(290,160);g.stroke();}
  if(v.gulls)for(let i=0;i<4;i++){const x=(t*(18+i*4)+i*190)%760-60,y=70+i*22+Math.sin(t*1.2+i)*8,f=Math.sin(t*7+i)*4;g.strokeStyle='rgba(20,20,30,.7)';g.lineWidth=2;g.beginPath();g.moveTo(x-7,y-f);g.lineTo(x,y);g.lineTo(x+7,y-f);g.stroke();}
  // 먼 언덕과 집
  g.fillStyle=M[3];g.beginPath();g.moveTo(0,hz);g.lineTo(0,186);g.lineTo(50,172);g.lineTo(120,180);g.lineTo(200,206);g.lineTo(300,hz+2);g.closePath();g.fill();
  if(v.house){g.fillStyle='#05070c';g.fillRect(62,160,40,22);g.beginPath();g.moveTo(56,162);g.lineTo(82,144);g.lineTo(108,162);g.closePath();g.fill();g.fillRect(92,146,5,10);
    if(v.house!=='dark'){const wg=g.createRadialGradient(76,171,1,76,171,26);wg.addColorStop(0,'rgba(255,215,130,.7)');wg.addColorStop(1,'rgba(255,215,130,0)');g.fillStyle=wg;g.fillRect(50,145,52,52);g.fillStyle='#ffd98a';g.fillRect(72,167,8,8);g.fillStyle='#05070c';g.fillRect(75.5,167,1,8);}}
  // 바다
  let se=g.createLinearGradient(0,hz,0,384);se.addColorStop(0,M[2]);se.addColorStop(.12,M[1]);se.addColorStop(1,M[0]);g.fillStyle=se;g.fillRect(0,hz,640,148);
  g.fillStyle='rgba(255,255,255,.18)';g.fillRect(0,hz,640,1);
  if(rx)for(let i=0;i<28;i++){const y=hz+3+i*5,w=(10+i*2.6)*(.55+.45*Math.sin(t*2+i*1.7));g.fillStyle=`rgba(255,238,195,${.55-i*.017})`;g.fillRect(rx-w/2+Math.sin(t+i)*3,y,w,2);}
  for(let i=0;i<46;i++){const h=hsh(i,9),y=hz+6+(h%140),x=((h>>8)%720+t*(6+(h%5)))%720-40;g.fillStyle='rgba(255,255,255,.07)';g.fillRect(x,y,14+(h%22),1.5);}
  if(v.boat){const bx=240+Math.sin(t*.3)*26,by=hz+46+Math.sin(t*1.7)*5,rt=Math.sin(t*1.7+1)*.12;g.save();g.translate(bx,by);g.rotate(rt);g.fillStyle='#07090e';g.beginPath();g.moveTo(-26,0);g.lineTo(26,0);g.lineTo(20,9);g.lineTo(-20,9);g.closePath();g.fill();g.fillRect(-6,-11,14,11);g.fillRect(2,-22,2,12);
    const bg=g.createRadialGradient(3,-24,0,3,-24,22);bg.addColorStop(0,'rgba(255,210,120,.9)');bg.addColorStop(1,'rgba(255,210,120,0)');g.fillStyle=bg;g.fillRect(-20,-46,46,46);g.fillStyle='#ffd070';g.fillRect(-3,-8,4,4);g.restore();
    g.fillStyle='rgba(255,255,255,.25)';g.fillRect(bx-34,by+9,68,2);}
  // 절벽과 등대
  const lit=v.beam!==false;
  g.fillStyle='#07090d';g.beginPath();g.moveTo(640,384);g.lineTo(340,384);g.lineTo(385,336);g.lineTo(420,300);g.lineTo(455,268);g.lineTo(505,250);g.lineTo(570,244);g.lineTo(640,240);g.closePath();g.fill();
  g.strokeStyle=night?'rgba(120,150,200,.25)':'rgba(255,200,150,.3)';g.lineWidth=1.5;g.beginPath();g.moveTo(385,336);g.lineTo(420,300);g.lineTo(455,268);g.lineTo(505,250);g.lineTo(570,244);g.lineTo(640,240);g.stroke();
  const lxp=548,base=246,hg=150;
  for(let i=0;i<hg;i+=2){const w=36-i*.085,red=Math.floor(i/25)%2;const dk=v.mode==='dawn'||v.mode==='dusk'?1:.55;g.fillStyle=red?`rgb(${150*dk|0},${46*dk|0},${42*dk|0})`:`rgb(${210*dk|0},${205*dk|0},${196*dk|0})`;g.fillRect(lxp-w/2,base-i-2,w,2);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(lxp+w*.15,base-i-2,w*.35,2);}
  const top=base-hg;g.fillStyle='#0c0d12';g.fillRect(lxp-18,top-4,36,5);g.fillRect(lxp-12,top-24,24,20);g.beginPath();g.moveTo(lxp-16,top-24);g.lineTo(lxp,top-40);g.lineTo(lxp+16,top-24);g.closePath();g.fill();g.fillRect(lxp-1,top-46,2,8);
  g.fillStyle='#0c0d12';g.fillRect(lxp-5,base-22,10,22);
  const lyp=top-14;
  if(lit){g.fillStyle='#ffe9a0';g.fillRect(lxp-9,top-22,18,15);
    g.globalCompositeOperation='lighter';const a=t*.6,c=Math.cos(a),sn=Math.sin(a);
    for(const d of [1,-1]){const dir=c*d,len=60+560*Math.abs(dir),sp=.07*len+6;const bg=g.createLinearGradient(lxp,0,lxp+dir*len,0);bg.addColorStop(0,'rgba(255,240,180,.55)');bg.addColorStop(1,'rgba(255,240,180,0)');
      g.fillStyle=bg;g.beginPath();g.moveTo(lxp,lyp);g.lineTo(lxp+dir*len,lyp-sp+12);g.lineTo(lxp+dir*len,lyp+sp+12);g.closePath();g.fill();}
    const fl=Math.pow(Math.abs(sn),6),hr=30+fl*70,hgl=g.createRadialGradient(lxp,lyp,0,lxp,lyp,hr);hgl.addColorStop(0,`rgba(255,245,200,${.7+fl*.3})`);hgl.addColorStop(1,'rgba(255,245,200,0)');g.fillStyle=hgl;g.fillRect(lxp-hr,lyp-hr,hr*2,hr*2);
    g.globalCompositeOperation='source-over';}
  else{g.fillStyle='#1a1c22';g.fillRect(lxp-9,top-22,18,15);}
  // 벤치와 사람들
  if(v.bench){g.fillStyle='#030406';g.fillRect(440,258,44,3);g.fillRect(440,250,44,3);g.fillRect(443,261,3,9);g.fillRect(478,261,3,9);}
  if(v.figs)for(const f of v.figs){const x=f.x,h=f.h||30,by=f.y||(v.bench&&f.sit?262:270),bob=Math.sin(t*1.5+x)*.6;g.fillStyle=f.c||'#030406';
    g.fillRect(x-4,by-h+8+bob,8,h-8-(f.sit?6:0));g.beginPath();g.arc(x,by-h+4+bob,4.5,0,7);g.fill();if(f.hair)g.fillRect(x-5,by-h+2+bob,10,f.hair);if(f.sit)g.fillRect(x-4,by-8,10,3);
    if(f.cat){g.fillRect(x+10,by-6,9,6);g.fillRect(x+16,by-10,5,5);g.fillRect(x+9,by-11+Math.sin(t*3)*1.5,2,6);}}
  if(v.rain)for(let i=0;i<190;i++){const h=hsh(i,3),x=(((h%760)-t*90)%760+760)%760-60,y=((h>>8)%384+t*(560+(h%220)))%384;g.fillStyle='rgba(180,200,235,.3)';g.fillRect(x,y,1,11);}
  const vgn=g.createRadialGradient(320,192,150,320,192,400);vgn.addColorStop(0,'rgba(0,0,0,0)');vgn.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=vgn;g.fillRect(0,0,640,384);
  g.restore();
}

/* ---------- 메인 렌더 ---------- */
const vg=mk(W,H);{const g=vg.getContext('2d'),r=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.62);r.addColorStop(0,'rgba(0,0,0,0)');r.addColorStop(1,'rgba(0,0,0,.6)');g.fillStyle=r;g.fillRect(0,0,W,H);}
function draw(){
  ctx=mainCtx;ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(0,0,W*PX,H*PX);
  if(!S)return;
  if(S.map)drawWorld();
  if(S.vista)drawVista(S.vista,1);
  if(VIS.o&&VIS.a>0)drawVista(VIS.o,VIS.a);
  ctx.setTransform(PX,0,0,PX,0,0);
  if(LB.v>.01){R(0,0,W,20*LB.v,'#000');R(0,H-20*LB.v,W,20*LB.v,'#000');}
}
function drawWorld(){
  const z=CAM.z,cx=Math.max(W/2/z,Math.min(W-W/2/z,CAM.x)),cy=Math.max(H/2/z,Math.min(H-H/2/z,CAM.y));
  let sx=0,sy=0;if(SH.t>0){sx=(Math.random()-.5)*SH.amp*2;sy=(Math.random()-.5)*SH.amp*2;}
  ctx.setTransform(PX*z,0,0,PX*z,(W/2-cx*z)*PX+sx,(H/2-cy*z)*PX+sy);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(tileCv,0,0,W,H);drawAnimTiles();
  for(const e of ents)if(e.layer===0&&!e.hidden)DRAW[e.kind](e,e.fx*TS,e.fy*TS);
  for(const e of ents)if(e.layer===1&&!e.hidden&&e.solid&&e.kind!=='char'&&!e.noShadow){ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(e.fx*TS+1,(e.fy+e.h)*TS-1.5,e.w*TS-2,3);}
  const list=ents.filter(e=>e.layer!==0&&!e.hidden).map(e=>({k:e.fy+e.h+(e.kind==='char'?.01:0)+(e.kind==='char'&&e.sit?.1:0)+(e.zb||0),e}));
  if(!P.hidden)list.push({k:P.fy+1.02,p:1});
  list.sort((a,b)=>a.k-b.k);
  for(const it of list){
    if(it.p){
      // 기억 속의 서윤은 그 시간에 속하지 않은 관찰자: 반투명하게, 은은히 일렁이며
      const ghost=S.memory;if(ghost){const px=P.fx*TS+8,py=P.fy*TS+2,gl=ctx.createRadialGradient(px,py,0,px,py,14);gl.addColorStop(0,'rgba(200,225,255,.22)');gl.addColorStop(1,'rgba(200,225,255,0)');ctx.fillStyle=gl;ctx.fillRect(px-14,py-14,28,28);
        ctx.globalAlpha=.5+.08*Math.sin(T*2.4);}
      if(F.catMode)drawCat(P.fx*TS,P.fy*TS,'#e8a050',false,0);else drawChar(P.fx*TS,P.fy*TS-2,LOOK.seoyun,P.dir,P.moving?(Math.floor(T*8)%2?1:2):0,false,{ph:1.7});
      if(ghost){ctx.globalAlpha=1;for(let i=0;i<2;i++){const k=(T*.6+i*.5)%1;R(P.fx*TS+4+((i*7+Math.floor(T*3))%8),P.fy*TS+10-k*16,1,1,`rgba(220,235,255,${.6*(1-k)})`);}}
    }
    else DRAW[it.e.kind](it.e,it.e.fx*TS,it.e.fy*TS);
  }
  if(S.over)S.over();
  if(S.tint){ctx.globalCompositeOperation='soft-light';ctx.fillStyle=S.tint.replace(/[\d.]+\)$/,'.55)');ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';ctx.fillStyle=S.tint;ctx.fillRect(0,0,W,H);}
  drawLights();drawBeam();
  if(S.weather==='rain')drawRain();
  if(S.memory&&!LOWFX)for(const m of motes){ctx.fillStyle=`rgba(255,240,210,${.25+.25*Math.sin(T*2+m.a)})`;ctx.fillRect(m.x,m.y,1,1);}
  for(const e of ents)if(!e.hidden){if(e.glow)drawGlow(e);else if(e.glint)drawGlint(e);}
  for(const p of PT){const a=1-p.life/p.max;if(p.kind==='note')txt(p.ch,p.x,p.y,7,`rgba(${p.col},${a})`,'center');else R(p.x,p.y,1,1,`rgba(${p.col},${a})`);}
  for(const m of EM){const e=m.e,k=Math.min(1,m.t*9),x=e.fx*TS+8,y=e.fy*TS-9-(e.scale?-4:0)-k*2,al=Math.min(1,(m.d-m.t)*5);ctx.globalAlpha=al;
    R(x-5.5,y-8,11,8,'#fff');R(x-4.5,y-9,9,10,'#fff');R(x-1,y+1,2,1.5,'#fff');R(x-.5,y+2.5,1,1,'#fff');txt(m.sym,x,y-1.5,6.5,m.sym==='♥'?'#d0506a':'#333','center');ctx.globalAlpha=1;}
  if(flash>0&&S.storm){ctx.fillStyle=`rgba(210,225,255,${flash*.35})`;ctx.fillRect(0,0,W,H);}
  ctx.setTransform(PX,0,0,PX,0,0);
  drawTone();ctx.setTransform(PX,0,0,PX,0,0);
  ctx.drawImage(vg,0,0);
  if(S.memory&&!LOWFX){for(let i=0;i<60;i++){const h=hsh(i,Math.floor(T*12));ctx.fillStyle='rgba(255,255,255,.035)';ctx.fillRect(h%W,(h>>9)%H,1,1);}}
}
