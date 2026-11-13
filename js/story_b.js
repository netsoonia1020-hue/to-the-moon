'use strict';
/* 제4장 1998 병실 · 제5장 폭풍 · 제6장 1985 · 제7장 1978 · 제8장 1976 */
/* =========================================================
   기억 3 — 1998 병실
   ========================================================= */
SC.m98={pal:'hosp',memory:true,title:'기억 · 1998 · 병실 304호',map:HOSP_MAP,dark:.32,darkC:'8,14,30',tint:'rgba(120,150,220,.16)',bgm:'m98',amb:'storm',storm:true,start:[9,8,'up'],
  frags:['m98_mr','m98_chart','m98_eh'],voice:{'미래':{p:1.55,r:1.05},'정우':{p:.62,r:.9}},blipMul:{'미래':1.15},
  lights(){return [{x:6*16+8,y:3*16,r:54,c:'255,220,160'},{x:10*16,y:26,r:46,c:'160,190,255'}];},
  ents(){const done=!!F.m98done;return [
    E({id:'win',kind:'window',x:9,y:1,w:2,view:'storm',dot:true,shaft:'140,170,240',layer:0,wallDeco:true,on:async()=>{
      await nar('창밖에 비바람이 몰아친다. 멀리, 등대 불빛이 깜빡인다.');
      await nar('…불규칙하게. 렌즈에 소금이 끼면 저렇게 된다.');}}),
    E({id:'side',kind:'cabinet',x:6,y:3,item:done?null:'musicbox',on:async()=>{
      if(!F.m98done){await nar('침대 옆 협탁. 오르골이 놓여 있다. 은하가 병원까지 가져온 단 하나의 물건.');return;}
      await nar('오르골이 있던 자리. 은하가 그것을 정우의 손에 쥐여 주었다.');}}),
    E({id:'bed',kind:'bed',x:7,y:3,h:2,who:LOOK.ehBed,blanket:'#9fb4c8',glow:!F.m98_eh,on:frag('m98_eh',async(e,again)=>{
      if(again){await nar('은하는 눈을 감은 채 창밖의 빗소리를 듣고 있다.');return;}
      await nar('창백한 얼굴의 여자가 베개에 기대어 있다. 그래도 눈매는 웃고 있다.');
      await say('은하','여보, 그 오르골 말이야.');
      await say('은하','요즘 소리가 자꾸 끊겨. 원통에 금이 갔나 봐.');
      await say('정우','내가 고칠게. 새 원통 깎아서, 핀도 전부 새로 박고.');
      await say('은하','고치면… 우리 노래, 처음부터 끝까지 다시 들려줘.');
      await say('정우','끝? 여섯 음이 끝 아니었어?');
      await say('은하','후후… 아직도 모르는구나. 고쳐 오면 알려 줄게.');
      await say('정우','…응. 약속할게.');})}),
    E({id:'clip',kind:'clip',x:7,y:5,glow:!F.m98_chart,on:frag('m98_chart',async()=>{
      await nar('침대 발치에 걸린 진료 기록지.');
      await nar('「윤은하 (41) — 호스피스 병동 이관 예정」');
      emote(P,'…');await say('서윤','(……)');})}),
    E({id:'iv',kind:'iv',x:8,y:2,on:async()=>{await nar('수액이 아주 느리게 떨어지고 있다.');}}),
    E({id:'jw',kind:'char',look:LOOK.jwMid,dir:'left',x:8,y:4,hidden:done,on:async()=>{
      await nar('정우는 아내의 손을 꼭 잡고 있다. 다른 손에는 등대 열쇠 꾸러미가 들려 있다.');
      await nar('무전기에서 낮은 목소리가 샌다. 「…해진호, 기관 고장. 현재 위치 등불리 남동 4해리…」');}}),
    E({id:'mr',kind:'char',look:LOOK.mrTeen,dir:done?'left':'up',x:done?9:11,y:done?4:2,glow:!F.m98_mr,on:frag('m98_mr',async(e,again)=>{
      if(F.m98done){await nar('미래는 엄마의 손을 붙잡은 채 고개를 묻고 있다.');return;}
      if(again){await nar('미래는 창문에 이마를 대고 서 있다.');return;}
      await say('미래','아빠 또 가?');
      await say('정우','태풍 경보야. 오늘 밤 들어와야 할 배가 아직 세 척이나 남았어.');
      await say('미래','등대는 자동으로도 켜진다며!');
      await say('정우','이런 날은 사람이 지켜야 해. 렌즈에 소금이 끼면 불빛이 반도 못 나가.');
      emote(e,'!');await say('미래','…엄마보다 배가 더 중요해?','angry');
      await nar('정우는 대답하지 못했다.');})}),
    E({id:'chair',kind:'chair',x:13,y:6,item:'plush',on:async e=>{
      await nar('보호자용 접이식 의자. 담요가 개켜져 있다. 며칠째 여기서 잔 모양이다.');
      await nar('담요 위에 낡은 고양이 인형. 미래가 집에서 가져다 놓았다. 「엄마 심심하지 말라고. 소금이 3세 대신.」');
      if(!F.cats.includes('c98')){SFX.meow();F.cats.push('c98');hud();toast(`🐱 ${CAT_NAMES.c98} (${F.cats.length}/5)`);if(F.cats.length===5)egg('cats','소금이 왕조');}}}),
    E({id:'vase',kind:'cabinet',x:13,y:2,item:'vase',glint:!F.keeps.includes('card'),on:async e=>{
      await nar('노란 국화와 분홍 패랭이꽃. 꽃병에 카드가 기대어 있다.');await nar('삐뚤빼뚤한 글씨 — 「엄마 힘내 ♡ 미래」.');
      if(!F.keeps.includes('card')){e.glint=false;keep('card','「엄마 힘내」 카드');}}}),
    E({id:'door',kind:'door',x:9,y:9,glow:done,on:async()=>{
      if(!F.m98done){await nar('병실 문. 복도 끝에서 비상등이 깜빡인다.');return;}
      await nar('정우가 나간 문. 문틈으로, 코트 주머니 속 오르골의 기척이 멀어져 간다.');
      await nar('— 따라가면, 이 밤의 나머지를 보게 될 것이다.');
      await deeper(0,'오르골을 따라간다','mstorm',chap('제 5 장','폭풍의 등대','1998년 11월 13일, 새벽 1시 30분','등불리 등대 꼭대기 · 등명실'));}}),
  ];},
  async enter(){
    if(F.m98in)return;F.m98in=true;
    await wait(400);
    await say('서윤','(병실… 창밖은 폭풍이다.)');
    await say('서윤','(벽시계가 멈춘 그 새벽의, 몇 시간 전.)');
  },
  async finale(){
    const jw=ent('jw'),mr=ent('mr'),door=ent('door');
    flash=1;SFX.thunder();shake(600,3);
    await nar('천둥이 병실 창을 흔들었다.');
    await camOn(jw,1.6);jw.dir='down';
    await nar('무전기 — 「…등불리 등대, 응답 바람. 불빛이 안 보인다. 반복한다, 불빛이 안 보인다…」');
    emote(jw,'!');await say('정우','…다녀올게. 새벽에 바로 올게.','sad');
    await say('은하','응. 가. 다들 기다리잖아.','smile');
    await say('은하','아, 이거 가져가.');
    ent('side').item=null;SFX.key();
    await nar('은하가 협탁 위의 오르골을 그의 손에 쥐여 준다.');
    await say('은하','고쳐 와서 들려줘. 처음부터, 끝까지. 약속했지?','smile');
    await say('정우','…응. 꼭.');
    hideDialog();cam(null,0,1,1200);
    door.open=true;door.solid=false;
    await walk(jw,[[8,8],[9,8],[9,9]],2.2);SFX.door();jw.hidden=true;door.open=false;door.solid=true;
    await wait(800);
    mr.dir='down';emote(mr,'…');
    await say('미래','……엄마는 왜 맨날 가라고만 해?');
    await say('은하','미래야, 이리 와.');
    hideDialog();await walk(mr,[[11,4],[9,4]],2);mr.dir='left';await cam(130,60,1.7,1200);
    await say('은하','외할아버지 배가 돌아오지 못한 날 밤에, 등대가 꺼져 있었대.');
    await say('은하','그래서 엄마는… 불빛을 지키는 사람이 좋았어.');
    await say('은하','아빠 미워하지 마. 응?','sad');
    await nar('은하가 미래의 머리를 쓸어 넘기며, 낮게 노래를 흥얼거린다.');
    hideDialog();await hum(MOTIF.slice(0,4),58,ent('bed'));
    hideDialog();await vista({mode:'storm',boat:true,rain:true},1500);
    await nar('— 그 밤, 등대는 단 한 번도 꺼지지 않았다.');
    await nar('등대의 불빛은 꺼져 있었다. 그 너머 어딘가에서, 배 한 척이 길을 잃고 있었다.');
    hideDialog();await vista(null,1500);
    await addNotes([79]);
    F.m98done=true;ent('door').glow=true;
    await say('서윤','(오르골은 정우 씨의 주머니 속에 있다. 이 밤의 나머지를, 그 상자가 기억하고 있다.)');
  }};


/* =========================================================
   제5장 — 1998년 11월 13일 새벽, 폭풍의 등명실 「폭풍의 등대」
   ========================================================= */
SC.mstorm={pal:'lamp',memory:true,title:'기억 · 1998년 11월 13일 새벽 · 등명실',map:ROUND_MAP,dark:.68,darkC:'4,6,16',tint:'rgba(90,120,200,.16)',bgm:'storm',amb:'storm',storm:true,start:[9,9,'up'],
  frags:['st_lens','st_crank','st_radio'],port:{'정우':'jwMid'},voice:{'정우':{p:.62,r:.95},'태오':{p:.8,r:1.08}},
  lights(){return [{x:160,y:94,r:130,c:'255,235,170',lit:1},{x:232,y:56,r:34,c:'120,255,140'}];},
  ents(){return [
    ...[3,8,13].map(x=>E({kind:'window',x,y:1,w:2,view:'storm',layer:0,wallDeco:true,on:async()=>{await nar('유리창이 바람에 덜컹거린다. 바깥은 먹물처럼 캄캄하다. 바다와 하늘의 경계가 보이지 않는다.');}})),
    E({id:'lens',kind:'lens',x:9,y:5,w:2,h:2,zb:-.4,glow:!F.st_lens,on:frag('st_lens',async()=>{
      await nar('거대한 렌즈가 하얀 소금 막으로 뒤덮여 있다.');
      await say('정우','…역시. 바람에 소금이 다 들러붙었어.','angry');
      await say('정우','이래서야 불을 켜도 반도 못 나가.');
      await say('서윤','(나는 기억 속에 손을 댈 수 없다. 그래도 — 나도 모르게 소매를 걷는다.)');
      hideDialog();await mashGame('렌즈 닦기','정우 씨와 같은 동작으로, 소금을 닦아 낸다.<br><b>버튼이나 Space를 빠르게 연타</b>하세요.',{btn:'닦기'});
      const s=ent('salt');if(s)s.hidden=true;sparkFx(176,90,20,'240,248,255');
      await say('정우','됐다…! 이제 빛이 나갈 수 있어.','smile');})}),
    E({id:'salt',kind:'salt',x:9,y:5,w:2,layer:2,solid:false,hidden:!!F.st_lens}),
    E({id:'weight',kind:'weight',x:5,y:4,glow:!F.st_crank,on:frag('st_crank',async e=>{
      await nar('렌즈를 돌리는 시계추가 바닥까지 내려와 있다. 정전이다. 사람이 손으로 감아 올려야 한다.');
      await say('정우','하나… 둘…! 이 추가 다 풀리기 전에 불빛이 돌아야 해.');
      hideDialog();
      const iv=setInterval(()=>{e.turn=(e.turn||0)+.6;},50);
      await mashGame('추 감아 올리기','무거운 추를 끝까지 감아 올린다.<br><b>멈추면 다시 내려간다.</b> 계속 연타하세요.',{btn:'감기',gain:.055,decay:.22});
      clearInterval(iv);
      await say('정우','후우…','closed');})}),
    E({id:'radio',kind:'radio',x:14,y:3,glow:!F.st_radio,on:frag('st_radio',async()=>{
      await nar('무전기가 잡음만 토해 낸다. 주파수가 폭풍에 흔들리고 있다.');
      await say('정우','해진호… 해진호, 들립니까. 여기는 등불리.');
      hideDialog();await tuneGame('주파수 맞추기','잡음 너머의 목소리를 찾는다.<br><b>◀ ▶ 로 바늘을 움직여</b> 초록 신호가 가득 찰 때 잠시 멈추세요.');
      await say('태오','…치직… 등불… 여기는 해진…… 기관 정지… 불빛이… 안 보…… 치직…','surp');
      await say('정우','들립니다! 조금만 버티십시오!','angry');})}),
    E({id:'clockw',kind:'clock',x:11,y:1,layer:0,wallDeco:true,on:async()=>{await nar('벽시계. 새벽 1시 40분.');}}),
    E({id:'jw',kind:'char',look:LOOK.jwMid,dir:'up',x:11,y:7,on:async()=>{
      await nar('비에 흠뻑 젖은 정우. 코트 주머니가 네모나게 불룩하다. — 은하가 쥐여 준 오르골.');
      await say('정우','은하야… 조금만 기다려. 불만 켜고 갈게.','sad');}}),
    E({id:'hatch',kind:'hatch',x:15,y:8,layer:0,solid:false,glow:!!F.stdone,on:async()=>{
      if(!F.stdone){await nar('아래로 내려가는 철계단. 젖은 발자국이 이어져 있다.');return;}
      await nar('계단참에 떨어진 오르골. 금 간 원통 틈으로 오래된 빛이 샌다.');
      await nar('— 상자가 처음 노래하던 날의 기억이, 그 틈으로 흘러나온다.');
      await deeper(0,'더 깊은 기억으로','m85',chap('제 6 장','점등','1985년 8월, 해 질 녘','등불리 등대 꼭대기 · 등명실'));}}),
  ];},
  async enter(){
    if(F.stin)return;F.stin=true;letterbox(true);
    flash=1;SFX.thunder();shake(700,3);await wait(900);
    await say('서윤','(…등대 꼭대기. 폭풍 한가운데.)','surp');
    await say('서윤','(병실을 나선 정우 씨가 도착한 곳. 오르골은 그의 코트 주머니 속에 있었다.)');
    await say('정우','자동 점등기가 나갔어… 불이 꺼져 있었다니…!','angry');
    await say('서윤','(이 밤의 일을, 나는 들어서 알고 있다. — 아주 어릴 때부터.)');
    letterbox(false);
  },
  async finale(){
    const jw=ent('jw'),S0=S;letterbox(true);
    await camOn(jw,1.6);
    await say('정우','렌즈, 됐고. 추, 됐고. …점등!','angry');
    hideDialog();await cam(160,96,1.4,700);S.lit=true;SFX.chime();shake(500,3);sparkFx(160,94,40);await tweenDark(.32,1200);
    await nar('빛이 폭풍을 찢고 바다로 뻗어 나간다.');
    await say('태오','…등불리! 보인다, 불빛 보인다!!','surp');
    await say('정우','해진호, 여기는 등불리. 그 불빛만 보고 들어오십시오. 이상.');
    await say('태오','여기는 해진호 통신사, 서태오입니다…!');
    await say('태오','집사람이 만삭이에요. 다음 달이 예정일입니다. 꼭… 꼭 돌아가야 합니다…!','cry');
    await say('정우','돌아가십시오. 불은 내가 지킵니다.');
    await say('정우','…아이 이름은 지었습니까.');
    await say('태오','네. …「윤」이요. 서윤.','smile');
    hideDialog();playBgm('reveal');await wait(600);
    await cutin('seoyun','surp','서태오 — 우리 아빠의 이름이다.',3600);
    await say('서윤','(아빠는 해마다 11월 13일 새벽이면 무전기를 켰다.)','sad');
    await say('서윤','(어릴 땐 몰랐다. 아무도 대답하지 않는 주파수에 아빠가 누구에게 말을 거는지.)','sad');
    await say('서윤','(「네가 태어난 건, 그 밤에 꺼지지 않은 불빛 덕분이다.」)');
    await say('서윤','(지난주, 회사로 들어온 의뢰서에서 「한정우」라는 이름을 봤을 때 — 나는 다른 사람의 일을 가로채 왔다.)','sad');
    await cutin('seoyun','cry','그 밤의 불빛이 없었다면, 나는 태어나지 못했다.',3800);
    await vista({mode:'storm',boat:true,rain:true,beam:true},1500);
    await nar('새벽 2시 55분. 해진호의 선원 일곱 명이 불빛을 따라 항구로 들어왔다.');
    await say('태오','등불리… 일곱 명 전원, 입항했습니다. …고맙습니다. 고맙습니다…!','cry');
    await vista(null,1200);
    await say('정우','…2시 58분.','surp');
    await say('정우','은하야…!!');
    hideDialog();cam(null,0,1,800);
    await walk(jw,[[11,8],[15,8]],4.2);
    SFX.crack();shake(400,4);emote(P,'!');
    await nar('계단을 뛰어 내려가던 그의 주머니에서, 무언가가 떨어져 철판에 부딪혔다.');
    await nar('— 오르골이었다. 원통에 금이 갔다. 그는 돌아보지 못했다.');
    jw.hidden=true;
    await nar('그리고 새벽 3시 7분.');
    await nar('그가 병원 계단을 뛰어 올라갔을 때, 노래는 이미 멈춰 있었다.');
    await say('서윤','(그는 일곱 사람을 집에 보냈고, 단 한 사람의 곁에 있지 못했다.)','sad');
    await say('서윤','(그 일곱 중 한 사람의 딸이, 지금 그의 기억 속에 서 있다.)','cry');
    await say('서윤','(…갚을 수 없는 빚이라는 건 알아. 그래도 — 이 노래만은 끝까지 들려드릴게요.)');
    F.stdone=true;ent('hatch').glow=true;letterbox(false);
  }};
/* =========================================================
   기억 4 — 1985 등명실
   ========================================================= */
SC.m85={pal:'lamp',memory:true,title:'기억 · 1985 · 등명실',map:ROUND_MAP,dark:.06,darkC:'10,12,34',tint:'rgba(255,165,90,.22)',bgm:'m85',amb:'wind',start:[9,9,'up'],
  frags:['m85_mr','m85_jw','m85_eh'],voice:{'미래':{p:1.9,r:1.1},'정우':{p:.72,r:.95},'은하':{p:1.3,r:.97}},blipMul:{'미래':1.35},
  lights(){return [{x:160,y:94,r:130,c:'255,235,170',lit:1}];},
  ents(){const done=!!F.m85done;if(done){this.lit=true;curDark=.5;this.nightK=1;}else this.nightK=0;return [
    E({id:'w1',kind:'window',x:5,y:1,w:2,view:'sunset',night:1,shaft:'255,180,110',layer:0,wallDeco:true,on:async()=>{await nar('서쪽 창. 해가 수평선 한 뼘 위에 걸려 있다. 바다 전체가 구릿빛이다.');}}),
    E({id:'w2',kind:'window',x:8,y:1,w:2,view:'sunset',night:1,shaft:'255,180,110',layer:0,wallDeco:true,on:async()=>{await nar('창밖으로 고깃배들이 줄지어 항구로 돌아오고 있다.');}}),
    E({id:'w3',kind:'window',x:13,y:1,w:2,view:'sunset',night:1,shaft:'255,180,110',layer:0,wallDeco:true,on:async()=>{
      await nar('동쪽 창. 아직 밝은 하늘에 하얀 낮달이 떠 있다.');
      if(F.m85done)return;
      await say('미래','아빠, 달에도 등대 있어?');
      await say('정우','달까지는… 우리 불빛이 좀 모자라겠다.');
      await say('서윤','(달까지 가고 싶어 하던 어떤 노인의 이야기를 들은 적이 있는 것 같다. …그건 또 다른 이야기지.)');egg('moon','달까지는');}}),
    E({id:'draw',kind:'drawing',x:11,y:1,layer:0,wallDeco:true,glint:!F.keeps.includes('draw'),on:async e=>{
      await nar('벽에 테이프로 붙인 크레파스 그림. 빨간 줄무늬 등대, 그 옆에 세 사람이 손을 잡고 있다.');
      await nar('「아빠 등대 엄마 나」 — 그리고 구석에 고양이 한 마리.');
      if(!F.keeps.includes('draw')){e.glint=false;keep('draw','크레파스 그림');}}}),
    E({id:'lens',kind:'lens',x:9,y:5,w:2,h:2,zb:-.4,on:async()=>{await nar('사람 키만 한 프레넬 렌즈. 수백 장의 유리가 양파처럼 겹쳐 있다.');await nar('작은 등불 하나를 20해리 밖까지 보내는 유리.');}}),
    E({id:'jw',kind:'char',look:LOOK.jw30,dir:'right',x:8,y:5,hidden:done,glow:!F.m85_jw,on:frag('m85_jw',async(e,again)=>{
      if(again){await nar('정우는 렌즈에 숨결로 김을 내고, 마른 천으로 닦는다.');return;}
      await nar('서른둘의 정우가 렌즈를 한 장 한 장 닦고 있다.');
      await say('정우','렌즈에 소금이 끼면 불빛이 반도 못 나가.');
      await say('정우','불빛이 반밖에 못 나가면, 배도 반밖에 못 돌아오는 거야.');
      await say('서윤','(…13년 뒤 폭풍의 밤에도, 그는 똑같은 말을 한다.)');})}),
    E({id:'tool',kind:'toolbox',x:6,y:3,on:async()=>{await nar('빨간 공구함. 뚜껑 안쪽에 가족사진이 붙어 있다.');await nar('그리고 조각칼 몇 자루. 놋쇠 가루가 묻어 있다. 등대 일에 쓰는 물건은 아니다.');}}),
    E({id:'stool',kind:'stool',x:13,y:3,solid:false,noShadow:true}),
    E({id:'eh',kind:'char',look:LOOK.ehMid,dir:'down',sit:true,x:13,y:3,glow:!F.m85_eh,on:frag('m85_eh',async(e,again)=>{
      if(again){await nar('은하는 오르골 뚜껑을 열었다 닫았다 하며 웃고 있다.');return;}
      await nar('은하가 창가에 앉아 무릎 위의 작은 상자를 만지작거린다. 새 나무 냄새가 나는 오르골.');
      await say('은하','여보, 이거 진짜 당신이 만든 거야? 원통까지 손으로?');
      await say('정우','약속했잖아. 상자에 담아 주겠다고. …9년이나 걸렸지만.');
      hideDialog();await boxPlay(MOTIF,84,{who:ent('mb')});
      await say('은하','여섯 음뿐이네.');
      await say('정우','네가 끝을 안 알려 줬잖아.');
      emote(e,'♥');await say('은하','후후. 끝은… 이제 알 것 같아. 조금만 더 기다려 봐.','smile');})}),
    E({id:'mb',kind:'table',x:14,y:3,item:'musicbox',glow:done,on:async()=>{
      if(!F.m85done){await nar('갓 만든 오르골. 뚜껑 안쪽의 글씨는 아직 칼자국이 선명하다. 「은하에게 — 등대에서, 정우」');return;}
      await nar('새 오르골이 빛나고 있다. 이 노래가 처음 태어난 바닷가를 가리키듯이.');
      await deeper(0,'더 오래된 기억으로','m78',chap('제 7 장','바다 위의 결혼식','1978년 4월','등불리 등대 앞마당'));}}),
    E({id:'bucket',kind:'bucket',x:4,y:7,on:async()=>{await nar('파란 페인트 통. 붓 자국이 통 바깥에 더 많다.');}}),
    E({id:'mr',kind:'char',look:LOOK.mrChild,scale:.74,dir:done?'up':'left',x:done?12:5,y:done?4:7,glow:!F.m85_mr,on:frag('m85_mr',async(e,again)=>{
      if(F.m85done){await nar('미래는 엄마 무릎에 기대어 눈을 감고 있다.');return;}
      if(again){await nar('미래는 혀를 내밀고 열심히 붓질 중이다.');return;}
      await nar('여섯 살 아이가 난간 벽에 페인트를 칠하고 있다. 벽보다 얼굴에 더 많이.');
      await say('미래','아빠! 나 여기 다 칠했어! 봐 봐!');
      await say('정우','어디 보자. …우리 미래, 등대를 칠한 거야, 미래를 칠한 거야?');
      hop(e,2);emote(e,'♪');await say('미래','둘 다!','smile');
      await say('서윤','(2019년의 편지에 쓰여 있던 바로 그날이다.)');})}),
    catEnt('c85',5,3,'#f0ece2',true,['볕 드는 자리에서 흰 고양이가 식빵을 굽고 있다.','목걸이 이름표 — 「소금이 2세」. 등대에는 대대로 소금이가 산다.']),
    E({id:'hatch',kind:'hatch',x:15,y:8,layer:0,solid:false,on:async()=>{await nar('아래층으로 내려가는 해치. 저녁밥 냄새가 올라온다.');}}),
  ];},
  async enter(){
    if(F.m85in)return;F.m85in=true;
    await wait(400);
    await say('서윤','(따뜻하다. …등대 꼭대기, 등명실.)');
    await say('서윤','(병실의 오르골이 「처음 노래하던 날」이라고 했지.)');
  },
  async finale(){
    const jw=ent('jw'),mr=ent('mr'),eh=ent('eh'),S0=S;
    await nar('해가 수평선에 닿는다.');hideDialog();
    const t0=performance.now();(function f(){const k=Math.min(1,(performance.now()-t0)/3000);S0.nightK=k;if(k<1)requestAnimationFrame(f);})();
    await tweenDark(.5,3000);
    await say('정우','점등 시간이다.');
    hideDialog();await cam(160,96,1.5,900);await wait(400);
    S.lit=true;SFX.chime();shake(300,1.5);sparkFx(160,94,30);hop(mr,3);emote(mr,'!');
    await say('미래','아빠 불 켰다!!');
    await nar('빛이 방을 한 바퀴 돌 때마다, 세 사람의 그림자가 벽을 스쳐 지나간다.');
    await say('정우','아래 내려가서 발전기 좀 보고 올게. 금방 올라올게.');
    hideDialog();cam(null,0,1,1000);await walk(jw,[[8,7],[15,7],[15,8]],2.6);jw.hidden=true;
    emote(mr,'…');await say('미래','아빠 또 가…');
    await say('은하','금방 오실 거야. 아빠 올라올 때까지, 엄마가 노래 불러 줄게.');
    hideDialog();await walk(mr,[[5,8],[12,8],[12,4]],3);mr.dir='up';await camOn(eh,1.8);
    await hum(MOTIF.slice(0,5),62,eh);
    await nar('미, 솔, 라, 솔, 미 —');
    await say('은하','…그리고 여기서부터는, 엄마가 새로 지은 거야. 아빠한텐 아직 비밀.');
    hideDialog();
    if(A.C){const t=A.C.currentTime+.1;[74,72,74,76].forEach((m,i)=>voice(m-12,t+i*.9,.8,.16*Math.pow(.5,i)));}
    $('fader').style.background='#fff';setOp($('fader'),.75,3000);await wait(1800);
    await nar('— 노랫소리가 물속처럼 멀어진다.');
    await say('서윤','(…들리지 않아. 이건 오르골의 기억이고, 오르골은 여섯 음까지밖에 모르니까.)');
    await say('서윤','(은하 씨가 끝을 붙인 밤. 정우 씨는 아래층에 있었다.)');
    hideDialog();await setOp($('fader'),0,1500);
    await addNotes([76]);
    F.m85done=true;ent('mb').glow=true;
    await say('서윤','(오르골이 마지막 문을 연다. 여섯 음이 태어난 곳.)');
  }};


/* =========================================================
   제7장 — 1978년 4월, 등대 앞마당 「바다 위의 결혼식」
   ========================================================= */
LOOK.ehBride=Object.assign({},LOOK.mrBride,{hair:'#2a1a12',skin:'#f2d2b4',id:'ehBride'});
const YARD_MAP=["gggggggggggggggggggg","gggggggggggggggrrrrr","gggggggggggggggrrrrr",
"gggggggggggggggrrrrr","ggggggggggggggggrrrr","gggggggggggggggggggr","gggggggggggggggggggg",
"ssssssssssssssssssss","ssssssssssssssssssss","wwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwww"];
SC.m78={pal:'beach',memory:true,title:'기억 · 1978년 4월 · 등대 앞마당',map:YARD_MAP,dark:0,tint:'rgba(255,220,180,.12)',bgm:'m78',amb:'waves',sparkle:true,litInit:false,start:[1,7,'right'],
  frags:['m78_soon','m78_jw','m78_eh'],port:{'정우':'jwGroom','은하':'ehBride'},voice:{'정우':{p:.82,r:1},'은하':{p:1.4,r:1},'순례':{p:.85,r:.9}},
  lights(){return [];},
  ents(){return [
    E({id:'lh',kind:'lighthouse',x:16,y:1,w:3,h:2,noShadow:true}),
    E({id:'arch',kind:'arch',x:8,y:3,w:3,solid:false,layer:0}),
    E({kind:'confetti',x:8,y:3,w:3,solid:false,layer:2}),
    E({kind:'chairs',x:3,y:5,w:4,noShadow:true,on:async()=>{await nar('마을 사람들이 집에서 하나씩 들고 온 의자. 모양이 전부 다르다.');}}),
    E({kind:'chairs',x:12,y:5,w:3,noShadow:true,on:async()=>{await nar('맨 앞줄 의자에 고무장화가 가지런히 놓여 있다. 배에서 막 내린 하객의 것.');}}),
    E({id:'cake',kind:'table',x:14,y:3,on:async()=>{await nar('삼단 케이크. 읍내 빵집에서 트럭으로 실어 왔다고 한다. 맨 위에 작은 설탕 등대가 꽂혀 있다.');}}),
    E({kind:'cake',x:14,y:2,solid:false,layer:2}),
    E({id:'jw',kind:'char',look:LOOK.jwGroom,dir:'down',x:9,y:4,glow:!F.m78_jw,on:frag('m78_jw',async(e,again)=>{
      if(again){await nar('신랑은 반지 상자를 몇 번이고 열어 확인한다.');return;}
      await nar('어깨가 조금 큰 양복을 입은 신랑. 스물다섯의 한정우.');
      await say('정우','반지, 있고. 맹세 문구, 외웠고…','surp');
      await say('정우','「은하 씨, 저는…」 아니, 「은하야」라고 해야 하나? 아직 한 번도 그렇게 못 불러 봤는데.');
      await say('서윤','(…스무 걸음 앞에서 말을 고르던 사람. 이때부터 그랬구나.)','smile');})}),
    E({id:'eh',kind:'char',look:LOOK.ehBride,dir:'down',x:10,y:4,glow:!F.m78_eh,on:frag('m78_eh',async(e,again)=>{
      if(again){await nar('신부는 바다 쪽을 보며 무언가를 기다리듯 웃고 있다.');return;}
      await nar('하얀 드레스의 신부. 머리에 꽂은 들꽃이 바람에 흔들린다.');
      await say('은하','있잖아요. 약속 하나만 더 해 줘요.','smile');
      await say('정우','또요? 불 안 끄는 거, 노래 상자 만드는 거…');
      await say('은하','그 노래 상자. 아무리 오래 걸려도 괜찮아요.');
      await say('은하','나는 기다리는 거, 잘하니까.','smile');
      await say('서윤','(…9년. 그는 정말로 9년이 걸렸다.)');})}),
    E({id:'soon',kind:'char',look:LOOK.soon,dir:'right',sit:true,x:4,y:5,solid:false,glow:!F.m78_soon,on:frag('m78_soon',async(e,again)=>{
      if(again){await nar('은하의 어머니는 손수건을 무릎 위에서 접었다 폈다 한다.');return;}
      await nar('맨 앞줄에 앉은 노부인. 은하의 어머니, 박순례 씨.');
      await say('순례','…등대지기 사위는 싫다고 했어.','sad');
      await say('순례','바다를 기다리는 일은 나 하나로 족하다고. 우리 딸까지 그러면 안 된다고.');
      await say('순례','그랬더니 저 애가 그러더라. 「엄마, 이번엔 내가 기다리는 쪽이 아니야. 불을 켜 주는 쪽이야.」');
      await say('서윤','(기다리는 노래를 만든 사람이, 불을 켜 주는 쪽을 골랐다.)');})}),
    E({id:'cap',kind:'char',look:LOOK.fisher,dir:'up',x:13,y:6,on:async()=>{
      await nar('주례를 맡은 늙은 선장 김씨.');await say('김 선장','허허, 등대 앞에서 혼례라니. 이 마을 생기고 처음이여.');
      await say('김 선장','이제 이 불은 안 꺼지겄구먼. 신부가 불을 지키는 사람이랑 살게 됐으니께.');}}),
    E({id:'kid',kind:'char',look:LOOK.kid,scale:.72,dir:'left',x:6,y:7,on:async e=>{hop(e,2);await nar('꽃잎 바구니를 든 동네 꼬마가 신이 나서 뛰어다닌다.');}}),
    E({id:'bq',kind:'shell',x:11,y:7,solid:false,glow:!!F.m78done,on:async()=>{
      if(!F.m78done){await nar('모래 위의 분홍 조개. 2년 전 여름에도 이 해변에 있었던 것 같은 빛깔.');return;}
      await nar('신부가 던진 부케가 떨어진 자리. 꽃잎 사이로 2년 전 여름의 노을빛이 번진다.');
      await say('서윤','(이 노래는 상자보다 오래됐다. …이제는 상자가 아니라, 노래가 기억하고 있다.)');
      await deeper(0,'노래가 태어난 날로','m76',chap('제 8 장','기다리는 노래','1976년 여름, 해 질 녘','등불리 해변'));}}),
  ];},
  async enter(){
    if(F.m78in)return;F.m78in=true;letterbox(true);
    await cam(150,40,1.6,10);await wait(500);await cam(null,0,1,2800);
    await say('서윤','(…눈부시다. 봄바다, 갈매기 소리, 웃음소리.)','smile');
    await say('서윤','(액자 뒷면의 「1978. 은하와.」 — 그날이다.)');
    letterbox(false);
  },
  async finale(){
    const jw=ent('jw'),eh=ent('eh');letterbox(true);
    await cam(152,64,1.7,1200);jw.dir='right';eh.dir='left';
    await say('김 선장','자, 신랑 맹세.');
    await say('정우','저는…','surp');
    await say('정우','저는 평생, 저 불을 끄지 않겠습니다.');
    await say('정우','은하 씨가… 은하가, 다시는 기다리기만 하는 사람이 되지 않도록.');
    await say('김 선장','신부 맹세.');
    await say('은하','저는 기다리는 걸 잘해요.','smile');
    await say('은하','그러니까 꼭 돌아와요. 어디에 있든, 무슨 일이 있든.');
    hideDialog();SFX.bell();sparkFx(152,52,40,'255,230,240');hop(ent('kid'),3);emote(jw,'♥');emote(eh,'♥');
    await nar('박수 소리. 갈매기들이 한꺼번에 날아올랐다.');
    hideDialog();await vista({mode:'dawn',sun:true,sunX:300,beam:false,gulls:true,figs:[{x:450,h:30},{x:464,h:28,hair:14,c:'#f4f2ea'}]},1600);
    await nar('그날 밤, 두 사람은 등명실에 올라가 처음으로 함께 불을 켰다.');
    await say('은하','있잖아. 노래 끝, 아직 못 만들었어.');
    await say('정우','괜찮아. 기다릴게.');
    await say('은하','…그 말, 내가 하려던 건데.','smile');
    await vista(null,1400);
    await say('서윤','(기다리겠다는 사람과, 돌아오겠다는 사람.)');
    await say('서윤','(이 두 사람은 평생, 서로에게 그 약속을 지키려다 엇갈렸다.)','sad');
    F.m78done=true;ent('bq').glow=true;letterbox(false);
  }};
/* =========================================================
   기억 5 — 1976 해변
   ========================================================= */
SC.m76={pal:'beach',memory:true,title:'기억 · 1976 · 등불리 해변',map:BEACH_MAP,dark:.18,darkC:'60,20,40',tint:'rgba(255,150,80,.2)',bgm:'m76',amb:'waves',sparkle:true,start:[1,4,'right'],
  frags:['m76_boat','m76_jw','m76_eh'],voice:{'정우':{p:.8,r:1},'은하':{p:1.45,r:1}},
  lights(){return [];},
  ents(){return [
    E({id:'lh',kind:'lighthouse',x:16,y:2,w:3,h:2,noShadow:true}),
    E({id:'sign',kind:'sign',x:14,y:3,on:async()=>{
      await nar('「등불리 등대 — 1931년 첫 점등」');
      await nar('그 아래, 누군가 페인트로 덧써 놓았다. 「1974–1976 관리인 없음 · 소등」');}}),
    E({id:'boat',kind:'boat',x:3,y:6,w:3,glow:!F.m76_boat,on:frag('m76_boat',async()=>{
      await nar('모래 위로 끌어올려진 낡은 고깃배. 바닥이 깨져 있다.');
      await nar('뱃머리에 흰 페인트로 — 「은하호」.');
      await say('서윤','(딸 이름을 붙인 배. 다시는 바다에 나가지 못할 배.)');})}),
    E({id:'jw',kind:'char',look:LOOK.jwYoung,dir:'right',x:12,y:4,glow:!F.m76_jw,on:frag('m76_jw',async(e,again)=>{
      if(again){await nar('청년은 등대 꼭대기를 올려다보며 열쇠를 만지작거린다.');return;}
      await nar('제복이 아직 어색한 청년이 등대를 올려다보고 있다.');
      await say('정우','스물셋. 등불리 등대 신임 등대지기, 한정우.');
      await say('정우','…혼자서 불을 켜 본 적은, 아직 없지만.');
      await say('서윤','(이렇게 젊었구나.)');})}),
    E({id:'rock',kind:'rockseat',x:8,y:8,solid:true,noShadow:true}),
    E({id:'eh',kind:'char',look:LOOK.ehYoung,dir:'down',sit:true,x:8,y:8,glow:!F.m76_eh,on:frag('m76_eh',async(e,again)=>{
      if(again){await nar('은하는 파도 소리에 맞춰 발끝을 까딱이고 있다.');return;}
      await nar('바위에 앉은 여자가 바다를 향해 노래를 흥얼거리고 있다.');
      hideDialog();await hum(MOTIF.slice(0,4),70,e);
      emote(P,'!');await say('서윤','(이 노래…!)');
      await nar('그녀는 같은 네 음을 몇 번이고 되풀이하다가, 멈춘다. 그 다음을 고르는 것처럼.');})}),
    E({id:'sh1',kind:'shell',x:5,y:8,solid:false,glint:!F.keeps.includes('shell'),on:async e=>{
      await nar('분홍빛 조개껍데기. 은하가 아까 주워서 바위 옆에 놓아둔 것이다.');
      await nar('이 조개는 훗날 끈에 꿰여, 여섯 살 아이의 목걸이가 된다.');
      if(!F.keeps.includes('shell')){e.glint=false;keep('shell','분홍 조개');}}}),
    E({id:'sh2',kind:'shell',x:13,y:7,solid:false,on:async()=>{await nar('반쯤 묻힌 소라 껍데기. 귀에 대면 파도 소리가 날 것 같다.');}}),
    catEnt('c76',10,2,'#f4f0e6',false,['풀밭에서 흰 새끼 고양이가 나비를 쫓고 있다.','털에 바닷소금이 하얗게 말라붙어 있다. 은하는 이 녀석을 「소금이」라고 부른다. 첫 번째 소금이.']),
  ];},
  async enter(){
    if(F.m76in)return;F.m76in=true;
    await wait(400);
    await say('서윤','(바다 냄새. 노을. …아주 오래된 기억이다.)');
    await say('서윤','(50년 전의 여름. 모든 것이 시작된 날.)');
  },
  async finale(){
    const jw=ent('jw'),eh=ent('eh');
    hideDialog();
    await walk(jw,[[12,7],[9,7]],2.2);jw.dir='down';await cam(140,120,1.7,1200);
    await say('정우','저… 방금 그 노래, 무슨 노래예요?');
    emote(eh,'!');await say('은하','어머, 들으셨어요?');
    await say('은하','기다리는 노래예요. 바다에 나간 사람을 기다리는 사람들이 부르라고, 제가 만들었어요.');
    await say('은하','저기 저 배, 우리 아빠 배예요. 재작년 겨울에 혼자 떠밀려 왔어요. 아빠는 없이.');
    await say('은하','그해엔 등대지기가 없어서 불이 꺼져 있었대요.');
    emote(jw,'…');await say('정우','……');
    await say('정우','그럼 이제 안 꺼질 거예요.');
    await say('정우','제가 왔으니까.','smile');
    emote(eh,'♪');await nar('은하가 처음으로 소리 내어 웃었다.');
    await say('은하','정말요? 약속이에요.','smile');
    await say('정우','노래, 뒷부분은 어떻게 돼요?');
    await say('은하','음… 여기까지 만들었어요.');
    hideDialog();await hum(MOTIF,70,eh);
    await say('은하','미, 솔, 라, 솔, 미, 레. 뒷부분은 아직 몰라요.');
    await say('은하','언젠가 기다리던 게 돌아오면, 그때 끝을 붙일래요.','smile');
    await say('정우','그럼 노래가 완성되면, 제가 그걸 상자에 담아 드릴게요. 언제든 들을 수 있게.');
    hideDialog();await addNotes([74]);
    S.lit=true;sparkFx(280,10,24);
    await vista({mode:'dusk',sun:true,sunX:200,beam:true,gulls:true,figs:[{x:455,h:30,y:270},{x:470,h:27,y:270,hair:14}]},1800);
    await nar('— 노을 속에서, 등대에 첫 불이 켜졌다.');
    await say('은하','불빛이 있으면… 다들 돌아올 수 있잖아요.');
    await say('서윤','(미, 솔, 라, 솔, 미, 레.)');
    await say('서윤','(그는 끝내 이 노래의 끝을 듣지 못했다. 그 끝은 — 어디로 갔을까.)');
    hideDialog();
    F.phase1=true;META.best={keeps:F.keeps.slice(),cats:F.cats.slice()};saveMeta();
    await goScene('present',chap('에 필 로 그','돌아오는 노래','2026년 11월 13일','다시, 한정우의 집'));
  }};


/* 장면별 초상화 매핑 (같은 인물도 시대마다 다른 얼굴) */
Object.assign(SC.m19,{port:{'정우':'jwOld'}});
Object.assign(SC.m08,{port:{'정우':'jwSuit','미래':'mrBride'}});
Object.assign(SC.m98,{port:{'정우':'jwMid','미래':'mrTeen','은하':'ehMid'}});
Object.assign(SC.m85,{port:{'정우':'jw30','미래':'mrChild','은하':'ehMid'}});
Object.assign(SC.m76,{port:{'정우':'jwYoung','은하':'ehYoung'}});
