'use strict';
/* 제1장 2026 요양원 · 제2장 2019 · 제3장 2008 */

/* =========================================================
   제1장 — 2026년 10월, 바다요양원 302호 「노을 시간」
   ========================================================= */
ITEM.frame=(x,y)=>{R(x,y+1,8,8,'#8a6e3a');R(x+1,y+2,6,6,'#cfe0e8');R(x+2.5,y+4,3,4,'#f0c84a');R(x+3,y+3,2,1.5,'#2e1e14');R(x+5,y+5,1.5,1,'#4a8ad0');};
const CARE_MAP=["####################","####################",
"###.............####","###.............####","###.............####","###.............####",
"###.............####","###.............####","###.............####",
"#########.##########","####################","####################"];
SC.m25={pal:'care',memory:true,title:'기억 · 2026년 10월 · 바다요양원',map:CARE_MAP,dark:.22,darkC:'40,20,30',tint:'rgba(255,170,110,.18)',bgm:'m25',amb:'waves',start:[9,8,'up'],
  frags:['m25_cal','m25_log','m25_nurse'],port:{'정우':'jwChair'},voice:{'정우':{p:.5,r:.82}},
  lights(){return [{x:136,y:30,r:90,c:'255,190,120'}];},
  ents(){const done=!!F.m25done;return [
    E({id:'win',kind:'window',x:7,y:1,w:3,view:'sunset',curt:'#b8c8a0',shaft:'255,180,110',layer:0,wallDeco:true,on:async()=>{
      await nar('서쪽 창. 곶 끝의 등대가 정면으로 보인다.');await nar('이 방을 고른 건 보호자가 아니라 본인이었다고 한다. 「등대가 보이는 방이 아니면 안 들어간다」고.');}}),
    E({id:'cal',kind:'calendar',x:12,y:1,layer:0,wallDeco:true,glow:!F.m25_cal,on:frag('m25_cal',async()=>{
      await nar('벽에 걸린 달력. 날짜 칸마다 삐뚤빼뚤한 글씨가 들어차 있다.');
      await nar('「미래」 「미래」 「미래 학교」 「미래 소풍」 「미래」 「미래」 …');
      await nar('10월의 서른한 칸이, 전부 같은 이름이다.');
      await say('서윤','(…다른 건 다 잊어도, 이 이름 하나만은 매일 적었구나.)','sad');})}),
    E({id:'sched',kind:'board',x:14,y:1,layer:0,wallDeco:true,on:async()=>{
      await nar('간호 일지가 붙은 게시판.');await nar('「302호 한정우 님 — 매일 오후 5시, 창가로 모셔다 드릴 것. (본인 요청: 점등 시간)」');
      await nar('「보호자 연락처: 한미래 — 연락 두절」');}}),
    E({id:'bed',kind:'bed',x:4,y:3,h:2,blanket:'#c8b8a0',on:async()=>{await nar('정리된 침대. 머리맡에 「낙상 주의」 스티커.');}}),
    E({id:'stand',kind:'cabinet',x:5,y:2,item:'frame',glint:!F.keeps.includes('photo'),on:async e=>{
      await nar('협탁 위 액자. 노란 원피스를 입은 여섯 살 아이가 파란 페인트를 뒤집어쓰고 웃고 있다.');
      await nar('액자 유리에 지문 자국이 가득하다. 하루에도 몇 번씩 쓰다듬은 모양이다.');
      if(!F.keeps.includes('photo')){e.glint=false;keep('photo','여섯 살 미래의 사진');}}}),
    E({id:'tv',kind:'tv',x:14,y:3,on:async()=>{await nar('켜 놓은 텔레비전에서 일기예보가 흘러나온다. 「…내일 동해안 일대 강한 바람…」');}}),
    E({id:'chair',kind:'wheel',x:8,y:3,solid:true,zb:-.3,noShadow:true}),
    E({id:'jw',kind:'char',look:LOOK.jwChair,dir:'up',sit:true,x:8,y:3,solid:false,on:async e=>{
      if(F.m25done){await nar('정우는 창밖의 불빛을 바라보며 아주 작게 웃고 있다.');return;}
      await nar('휠체어에 앉은 노인이 창밖을 보고 있다. 아흔을 앞둔 한정우 씨.');
      await say('정우','…불 켰나?');
      await nar('대답할 사람이 없는 질문. 그는 같은 말을 몇 번이고 되풀이한다.');
      await say('서윤','(기억이… 많이 흐려지셨구나.)','sad');}}),
    E({id:'nurse',kind:'char',look:LOOK.nurse,dir:'left',x:12,y:5,glow:!F.m25_nurse,on:frag('m25_nurse',async(e,again)=>{
      if(again){await nar('간호사는 창가 쪽을 걱정스럽게 지켜보고 있다.');return;}
      await nar('젊은 간호사가 약 쟁반을 들고 서 있다. 혼잣말처럼 중얼거린다.');
      await say('간호사','할아버지, 오늘도 「미래」 기다리세요?');
      await say('간호사','…열다섯 살이라고 하셨죠. 학교 끝나면 온다고.');
      await say('간호사','따님 연세가 마흔셋이신데. 한 번 오셨을 때도… 끝내 못 알아보셨잖아요.',"sad");
      emote(P,'!');await say('서윤','(…한 번, 왔었다고?)','surp');})}),
    E({id:'log',kind:'clip',x:10,y:8,glow:!F.m25_log,on:frag('m25_log',async()=>{
      await nar('문 옆에 걸린 면회 기록부. 페이지가 거의 비어 있다.');
      await nar('딱 한 줄 — 「2025. 6. 2. 한미래 (딸) · 입실 14:00 · 퇴실 14:12」');
      await say('서윤','(…12분.)','sad');
      await say('서윤','(전화로 「할 얘기가 없었다」던 사람이, 직접 여기까지 왔었다.)');})}),
    E({id:'mb',kind:'table',x:11,y:3,item:'musicbox',glow:done,on:async()=>{
      if(!F.m25done){await nar('창가 탁자 위의 오르골. 금이 간 그대로다. 그래도 매일 누군가 먼지를 닦았다.');return;}
      await nar('오르골이 빛난다. 기억이 흐려지기 전으로 — 그가 아직 편지를 쓸 수 있던 해로.');
      await deeper(0,'더 깊은 기억으로','m19',chap('제 2 장','부치지 않은 편지','2019년 11월 13일','등불리 등대 관리실'));}}),
    E({id:'door',kind:'door',x:9,y:9,on:async()=>{await nar('복도 끝에서 저녁 배식 카트 소리가 들린다.');}}),
  ];},
  async enter(){
    if(F.m25in)return;F.m25in=true;letterbox(true);
    await cam(136,50,1.8,10);await wait(600);await cam(null,0,1,2600);
    await say('서윤','(…바다 냄새. 소독약 냄새. 요양원이다.)');
    await say('서윤','(한 달 전. 그가 마지막 가을을 보낸 방.)');
    await say('서윤','(오르골은 가장 가까운 기억부터 보여준다. 거꾸로, 처음을 향해.)');
    letterbox(false);
  },
  async finale(){
    const jw=ent('jw'),nurse=ent('nurse'),S0=S;
    await cam(140,70,1.5,1000);
    await nar('— 갑자기 창으로 드는 빛의 색이 바뀐다. 노을이 아니라, 한낮의 하얀 빛.');
    const oldT=S.tint;S.tint='rgba(220,230,255,.18)';SFX.whoosh();$('fader').style.background='#fff';await setOp($('fader'),.8,300);await setOp($('fader'),0,900);
    toast('기억 속의 기억 · 2025년 6월 2일 오후 2시');
    nurse.hidden=true;
    const mr=E({id:'mrv',kind:'char',look:LOOK.mrAdult,dir:'up',x:9,y:9,solid:false});ents.push(mr);SFX.door();
    await walk(mr,[[9,4]],1.6);mr.dir='left';await camOn(mr,1.7);
    await say('미래','…아빠.','sad');
    jw.dir='right';
    await say('정우','아이고, 간호사 선생님. 마침 잘 오셨네.','smile');
    await say('정우','우리 미래 못 보셨어요? 열다섯 살인데. 학교 끝날 시간이 지났는데 안 와요.');
    emote(mr,'…');await say('미래','……아빠. 저 미래예요.','sad');
    await say('정우','에이, 우리 미래는 요만해요. 머리를 이렇게, 하나로 질끈 묶고.','smile');
    await say('정우','그 애 오면 들려줄 노래가 있는데. 제 엄마 노래.');
    hideDialog();await hum([[76,2]],50,jw,24);
    await say('정우','미……');
    await say('정우','…다음이 뭐였더라. 아이고, 이놈의 머리.','closed');
    await nar('미래의 입술이 달싹인다. 그 다음 음을, 그녀는 알고 있다.');
    await say('정우','선생님, 지금 몇 시예요? 불 켤 시간 됐나?');
    jw.dir='up';
    await nar('그는 다시 창밖으로 고개를 돌렸다. 그 뒤로, 미래는 한마디도 하지 못했다.');
    hideDialog();
    await cutin('mrAdult','cry','「…저, 그 다음 알아요. 아빠.」 — 끝내 소리가 되지 못한 말.',3800);
    await walk(mr,[[9,9]],2.2);mr.hidden=true;SFX.door();
    await nar('14시 12분. 면회 기록부의 마지막 줄.');
    hideDialog();
    S.tint=oldT;$('fader').style.background='#fff';await setOp($('fader'),.8,300);nurse.hidden=false;await setOp($('fader'),0,1200);
    toast('다시 · 2026년 10월 · 오후 5시');
    await say('간호사','할아버지, 다섯 시예요. 보세요, 불 켜졌어요.');
    hideDialog();await vista({mode:'dusk',sun:true,sunX:180,beam:true,gulls:true,house:true},1600);
    await say('정우','…그래. 그럼 됐다.','smile');
    await say('정우','이제 다들 돌아오겠구나.');
    hideDialog();await hum([[76,3]],48,jw,24);
    await vista(null,1400);
    await addNotes([76]);
    await say('서윤','(그는 열다섯 살의 미래를 기다리고 있었다. 스물여덟 해 동안.)','sad');
    await say('서윤','(그리고 그 미래가 문을 열고 들어왔을 때 — 알아보지 못했다.)','sad');
    F.m25done=true;ent('mb').glow=true;
    await say('서윤','(오르골이 빛난다. 기억이 아직 선명하던 해로 가자.)');
  }};
/* =========================================================
   기억 1 — 2019 등대 관리실
   ========================================================= */
SC.m19={pal:'light',memory:true,title:'기억 · 2019 · 등대 관리실',map:ROUND_MAP,dark:.42,darkC:'20,14,8',tint:'rgba(255,190,120,.16)',bgm:'m19',amb:'wind',start:[9,9,'up'],
  frags:['m19_jw','m19_cal','m19_win'],
  lights(){return [{x:6*16+8,y:3*16,r:64,c:'255,200,120'},{x:3*16+8,y:6*16+8,r:56,c:'255,140,60',fl:1},{x:8*16,y:26,r:44,c:'255,240,190',beam:1}];},
  ents(){return [
    E({id:'win',kind:'window',x:7,y:1,w:2,view:'sea',layer:0,wallDeco:true,glow:!F.m19_win,on:frag('m19_win',async()=>{
      await nar('창밖은 캄캄한 바다. 머리 위에서 등명기가 돌며 물 위에 빛의 길을 낸다.');
      await nar('어디선가 낮은 목소리가 들린다. 이 방에 스며든, 오래된 혼잣말.');
      await say('정우','…불은 꺼지면 안 돼.');
      await say('정우','누군가는 저 불빛을 보고 집에 돌아오니까.');})}),
    E({id:'cal',kind:'calendar',x:11,y:1,layer:0,wallDeco:true,glow:!F.m19_cal,on:frag('m19_cal',async()=>{
      await nar('2019년 11월 달력. 13일에 동그라미가 쳐져 있다.');
      await nar('그 옆의 작은 글씨 — 「은하, 스물한 번째」. 그리고 31일 칸에 「자동화 공사 완료 · 퇴임」.');
      await say('서윤','(아내의 기일. 그리고 43년 근무의 마지막 달.)');})}),
    E({id:'neck',kind:'neck',x:13,y:1,layer:0,wallDeco:true,on:async()=>{await nar('못에 걸린 조개 목걸이. 끈이 아이 목에 맞는 길이다.');await nar('분홍 조개는 오래 만져서 반들반들하다.');}}),
    E({id:'desk',kind:'desk',x:5,y:3,w:2,on:async()=>{await nar('책상 위에 쓰다 만 편지지와 만년필. 잉크가 아직 마르지 않았다.');}}),
    E({id:'jw',kind:'char',look:LOOK.jwOld,dir:'up',x:6,y:4,glow:!F.m19_jw,on:frag('m19_jw',async(e,again)=>{
      if(again){await nar('정우는 서랍 쪽을 한참 바라보고 있다.');return;}
      await nar('책상 앞에 노인이 앉아 있다. 하얗게 센 머리, 굽은 등. 한정우 씨다.');
      await say('서윤','(기억 속 사람들은 나를 보지 못한다. 그저 그날을 되풀이할 뿐.)');
      await say('정우','…미래야. 오늘은 바람이 많이 불었다.');
      await say('정우','등대 페인트가 또 벗겨졌어. 네가 어릴 때 칠하는 걸 도와줬었지. 붓보다 네 얼굴에 페인트가 더 많이 묻었었는데.');
      await say('정우','이달 말이면 이 등대도 기계가 지킨다더라. 사람은 이제 필요 없대.');
      emote(e,'…');await nar('그는 펜을 멈추고, 한참 동안 종이만 내려다보았다.');
      await say('정우','…이런 걸 보내서 뭐 하나.');SFX.page();
      await nar('편지를 접어 봉투에 넣고, 우표를 붙이고 — 서랍에 넣어 잠근다.');SFX.key();
      await nar('그리고 그 열쇠를, 선반 위 오르골 바닥에 밀어 넣는다.');
      await say('서윤','(보내지 않는 편지. 오르골 바닥의 열쇠.)');})}),
    E({id:'radio',kind:'radio',x:3,y:4,on:async()=>{
      await nar('해상용 무전기가 낮게 치직거린다.');await nar('「…등불리, 등불리. 여기는 해진호. 어르신, 올해도 11월 13일입니다. 덕분에 스물한 번째 겨울을 맞습니다. 이상.」');
      await say('정우','…해진호, 여기는 등불리. 수신 양호. 조심해서 들어오게. 이상.');
      await say('서윤','(21년 동안, 해마다 같은 날 안부를 묻는 배가 있다.)');}}),
    E({id:'bed',kind:'bed',x:15,y:4,h:2,blanket:'#6a7a5a',on:async()=>{await nar('반듯하게 개어 둔 이불. 베개는 하나뿐이다.');}}),
    E({id:'stove',kind:'stove',x:3,y:6,on:async()=>{await nar('무쇠 난로 위에서 주전자가 김을 뿜는다. 장작 타는 냄새는 기억 속에서도 난다.');}}),
    catEnt('c19',4,7,'#8a8a86',true,['난롯가에 늙은 회색 고양이가 몸을 말고 잔다.','목걸이 이름표 — 「소금이 4세」. 11년 전 어느 비 오는 날 서울에서 따라온 녀석이다.']),
    E({id:'stairs',kind:'stairs',x:15,y:7,on:async()=>{await nar('등명기로 올라가는 나선계단. 손잡이가 반질반질하다.');await nar('마흔세 해 동안, 하루도 빠짐없이 오르내린 길.');}}),
    E({id:'jar',kind:'jar',x:10,y:2,glint:!F.keeps.includes('brush'),on:async e=>{
      await nar('선반 위 유리병에 낡은 붓이 꽂혀 있다. 파란 페인트가 굳은 채로.');
      await nar('손잡이에 서툰 글씨 — 「한미래 6살」.');
      if(!F.keeps.includes('brush')){e.glint=false;keep('brush','파란 페인트 붓');await say('서윤','(34년 된 붓을, 그는 아직 씻지 않았다.)');}}}),
    E({id:'mb',kind:'cabinet',x:12,y:2,item:'musicbox',glow:!!F.m19done,on:async()=>{
      if(!F.m19done){await nar('선반 위의 오르골. 아직은 조용하다.');await say('서윤','(이 기억엔 아직 내가 보지 못한 것이 남아 있어.)');return;}
      await nar('오르골이 희미하게 빛나고 있다. 더 깊은 기억이 이 상자에 감겨 있다.');
      await deeper(0,'더 깊은 기억으로','m08',chap('제 3 장','스무 걸음','2008년 5월 17일, 봄비','서울 · 은빛웨딩홀 앞'));}}),
  ];},
  async enter(){
    if(F.m19in)return;F.m19in=true;
    await wait(400);
    await say('서윤','(등대 관리실… 7년 전 그날이다.)');
    await say('서윤','(빛나는 조각들을 따라가자. 기억은 늘 거기서부터 풀린다.)');
    await say('서윤','(희미하게 반짝이는 것들도 있다. 꼭 봐야 하는 건 아니지만… 누군가에겐 소중했던 것들.)');
  },
  async finale(){
    const jw=ent('jw');await camOn(jw,1.7);
    await nar('정우가 펜을 내려놓고, 천천히 창 쪽으로 고개를 돌렸다.');
    jw.dir='right';
    await say('정우','은하야. 그 노래… 어떻게 시작했더라.');
    hideDialog();await hum(MOTIF.slice(0,2),56,jw,24);
    await say('정우','미… 솔……');emote(jw,'…');
    await say('정우','…그 다음이 영 기억이 안 나는구나.','sad');
    await nar('그는 오래도록 창밖의 불빛만 바라보았다.');
    hideDialog();await addNotes([79]);
    F.m19done=true;ent('mb').glow=true;
    await say('서윤','(선반 위 오르골이 빛나고 있다. 더 깊은 기억으로 이어지는 문.)');
  }};

/* =========================================================
   기억 2 — 2008 예식장 앞
   ========================================================= */
let lastCar=-1;
SC.m08={pal:'street',memory:true,title:'기억 · 2008 · 은빛웨딩홀 앞',map:STREET_MAP,dark:.52,darkC:'6,8,22',tint:'rgba(110,130,210,.14)',bgm:'m08',amb:'rainout',weather:'rain',start:[10,8,'up'],
  frags:['m08_wreath','m08_jw','m08_door'],voice:{'정우':{p:.6,r:.9}},
  lights(){return [{x:144,y:60,r:74,c:'255,215,150'},{x:14*16+8,y:6*16,r:58,c:'255,225,160'},{x:40,y:36,r:30,c:'255,215,150'},{x:72,y:36,r:30,c:'255,215,150'},{x:216,y:36,r:30,c:'255,215,150'},{x:248,y:36,r:30,c:'255,215,150'},{x:280,y:36,r:30,c:'255,215,150'},{x:144,y:6,r:44,c:'255,190,215'}];},
  over(){ // 지나가는 자동차
    const per=11,k=T%per,idx=Math.floor(T/per);
    if(k<3.2){const x=-70+k/3.2*460,y=10*16+3;if(idx!==lastCar){lastCar=idx;SFX.car();}
      ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(x+2,y+13,40,3);R(x,y+4,44,10,'#2a3a55');R(x+8,y,24,6,'#22304a');R(x+10,y+1,9,4,'#9ab8d0');R(x+21,y+1,9,4,'#9ab8d0');R(x+6,y+12,7,4,'#111');R(x+31,y+12,7,4,'#111');R(x+42,y+7,2,3,'#fff6c0');R(x,y+7,1.5,3,'#d33');
      ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(x+44,0,x+130,0);g.addColorStop(0,'rgba(255,245,200,.4)');g.addColorStop(1,'rgba(255,245,200,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+44,y+8);ctx.lineTo(x+130,y-6);ctx.lineTo(x+130,y+24);ctx.closePath();ctx.fill();ctx.globalCompositeOperation='source-over';}
  },
  ents(){const done=!!F.m08done;return [
    E({id:'wsign',kind:'wsign',x:7,y:0,w:4,layer:0,solid:false}),
    ...[2,4,13,15,17].map(x=>E({kind:'bwin',x,y:2,layer:0,solid:false})),
    E({id:'gdoor',kind:'gdoor',x:8,y:3,w:2,layer:0,wallDeco:true,glow:!F.m08_door,on:frag('m08_door',async(e,again)=>{
      if(again){await nar('자동문 너머로 축가 연습 소리가 들린다.');return;}
      SFX.bell();await nar('유리문 너머로 환한 불빛과 웃음소리가 새어 나온다.');
      await nar('하얀 드레스를 입은 신부가 하객들 사이에서 웃고 있다.');
      await say('서윤','(…미래 씨. 저렇게 웃는 사람이었구나.)');
      await nar('자동문이다. 한 걸음만 다가서면 열린다. — 정우는 스무 걸음 떨어진 곳에 서 있다.');})}),
    E({id:'wreath',kind:'wreath',x:6,y:4,glow:!F.m08_wreath,glint:done&&!F.keeps.includes('env'),on:async e=>{
      if(F.m08_wreath&&F.m08done&&!F.keeps.includes('env')){
        await nar('화환 리본 밑에, 젖지 않게 끼워 둔 흰 봉투.');await nar('축의금 봉투다. 이름 칸은 비어 있다. 뒷면에 「아버지가」라고 썼다가 — 지운 자국.');
        e.glint=false;keep('env','이름 없는 축의금 봉투');await say('서윤','(이름도 못 쓰고 놓고 간 축하.)');return;}
      await frag('m08_wreath',async(e,again)=>{
        await nar('축하 화환. 리본의 금박 글씨가 빗물에 번들거린다.');await nar('「축 결혼 — 신부 한미래」');
        if(again)return;
        await say('서윤','(미래 씨의 결혼식 날.)');
        await nar('보낸 사람 칸에는 회사 이름, 동창회 이름. 아버지의 이름은 어디에도 없다.');})(e);}}),
    E({id:'wreath2',kind:'wreath',x:11,y:4,on:async()=>{await nar('「두 분의 앞날에 등불 같은 사랑이 —」 리본 끝이 비에 젖어 말려 올라갔다.');}}),
    E({id:'post',kind:'lamppost',x:14,y:5,on:async()=>{await nar('가로등. 빗줄기가 불빛 속에서만 보인다.');}}),
    E({id:'jw',kind:'char',look:LOOK.jwSuit,dir:'up',umb:true,x:14,y:6,hidden:done,glow:!F.m08_jw,on:frag('m08_jw',async(e,again)=>{
      if(again){await nar('정우는 예식장 문을 바라본 채 움직이지 않는다.');return;}
      await nar('가로등 아래, 몸에 맞지 않는 양복을 입은 남자가 서 있다. 한정우 씨. 쉰다섯.');
      await nar('한 손엔 우산, 한 손엔 리본을 묶은 작은 꾸러미.');
      await say('정우','…미래야. 축하한다.');
      await say('정우','아니야. 「결혼 축하한다, 미래야.」 …이것도 아니고.');
      await say('정우','「아빠가… 늦어서 미안하다.」','sad');emote(e,'…');
      await nar('그는 같은 말을 몇 번이고 고쳐 연습한다. 예식장 문에서 스무 걸음 떨어진 곳에서.');
      await say('서윤','(청첩장은 오지 않았다. 날짜는 은하 씨의 친구에게 물어서 알았다. — 꾸러미 속 오르골이 그렇게 말해 준다.)');})}),
    E({id:'mr',kind:'char',look:LOOK.mrBride,dir:'down',x:9,y:4,hidden:true,solid:false}),
    E({id:'booth',kind:'booth',x:17,y:4,on:async()=>{await nar('공중전화 부스. 수화기가 비뚤게 걸려 있다.');await nar('동전 반환구에 백 원짜리 세 개. 누군가 번호를 누르다 끊기를 세 번 되풀이했다.');}}),
    E({id:'bench',kind:'bench',x:3,y:7,w:2,glow:done,on:async()=>{
      if(!F.m08done){await nar('버스 정류장 벤치. 빗물이 고여 있다.');return;}
      await nar('벤치 위에 네모난 마른 자국. 꾸러미가 놓여 있던 자리가 희미하게 빛난다.');
      await deeper(0,'더 깊은 기억으로','m98',chap('제 4 장','불빛이 안 보인다','1998년 11월 12일 밤','등불리 시립병원 304호'));}}),
    E({id:'bus',kind:'busstop',x:1,y:6,on:async()=>{await nar('시외버스 정류장. 「등불리행 막차 22:10」');await nar('그는 왕복표를 끊어 왔다. 처음부터, 돌아갈 생각으로.');}}),
    E({kind:'puddle',x:6,y:7,w:2,layer:0,solid:false}),E({kind:'puddle',x:11,y:8,w:1,layer:0,solid:false}),E({kind:'puddle',x:16,y:7,w:2,layer:0,solid:false}),
    catEnt('c08',1,8,'#8a8a86',false,['비에 젖은 회색 새끼 고양이가 정류장 밑에서 떨고 있다.','정우가 아까부터 우산을 조금씩 이쪽으로 기울여 주고 있었다.','이 녀석은 오늘 밤 막차를 타고 등불리로 간다. 이름은 「소금이 4세」가 된다.']),
  ];},
  async enter(){
    if(F.m08in)return;F.m08in=true;
    await wait(400);
    await say('서윤','(도시의 밤. 빗소리. …등불리가 아니다.)');
    await say('서윤','(11년 전. 오르골은 그날 꾸러미에 싸여 서울에 왔다.)');
  },
  async finale(){
    const jw=ent('jw'),mr=ent('mr'),gd=ent('gdoor'),bench=ent('bench'),wr=ent('wreath');
    await cam(150,80,1.6,1200);
    SFX.door();await nar('— 그때, 문이 열렸다.');
    mr.hidden=false;hop(mr,1);emote(jw,'!');hideDialog();
    await walk(jw,[[15,6],[15,5]],4);jw.dir='left';
    await say('미래','후— 잠깐만, 바람 좀 쐬고 올게!');
    mr.dir='right';emote(mr,'?');
    await say('미래','……?');
    await nar('신부가 가로등 쪽을 본다. 정우는 기둥 뒤에서 숨을 멈춘다.');
    await say('미래','…………');
    mr.dir='down';
    await say('미래','아니야. 누가 서 있는 줄 알았어.');
    await nar('그녀는 잠깐, 아주 잠깐 더 빗속을 바라보다가 — 안으로 들어갔다.');
    hideDialog();SFX.door();mr.hidden=true;await wait(900);
    await camOn(jw,1.8);
    await say('정우','……예쁘구나.','smile');
    await say('정우','네 엄마를 꼭 닮았어.','sad');
    hideDialog();await hum(MOTIF.slice(0,3),54,jw,24);
    await say('정우','미, 솔, 라……');
    await say('정우','…축가 대신 들려주려고 했는데. 아직도 여기까지밖에 모르겠구나.');
    hideDialog();cam(110,100,1.4,1500);
    await walk(jw,[[15,6],[5,6]],2.4);jw.dir='down';bench.item='pkg';
    await nar('그는 벤치에 꾸러미를 내려놓고 한참을 서 있었다. 선물로 주려던, 끝내 고치지 못한 오르골.');
    hideDialog();await walk(jw,[[6,6],[6,5]],2);jw.dir='up';
    await nar('그리고 화환 리본 밑에, 젖지 않게 흰 봉투 하나를 끼워 넣었다.');
    hideDialog();await walk(jw,[[6,6],[5,6]],2);jw.dir='down';bench.item=null;
    await nar('꾸러미를 다시 품에 넣는다.');
    hideDialog();await walk(jw,[[0,6]],2.2);jw.hidden=true;
    await nar('등불리행 막차는 22시 10분이었다.');
    hideDialog();await addNotes([81]);
    F.m08done=true;bench.glow=true;wr.glint=!F.keeps.includes('env');
    await say('서윤','(벤치에 온기가 남아 있다. 오르골이 더 오래된 밤을 가리킨다.)');
  }};

