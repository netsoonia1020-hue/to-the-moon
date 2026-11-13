'use strict';
/* =========================================================
   등대지기의 오르골 — 장면 · 대본 · 퍼즐 · 엔딩
   흐름: 현재 → 2019 → 2008 → 1998 → 1985 → 1976 → 현재 → 엔딩(5종)
   ========================================================= */
const SC={};
const HOUSE_MAP=[
"####################","####################",
"#............#.....#","#............#.....#","#............#.....#",
"#..................#",
"#............#.....#","#............#.....#","#............#.....#","#............#.....#",
"######.#############","####################"];
const ROUND_MAP=[
"####################","####################",
"####............####","###..............###",
"##................##","##................##","##................##","##................##",
"###..............###","####............####",
"####################","####################"];
const BEACH_MAP=[
"gggggggggggggggggggg","gggggggggggggggrrrrr","gggggggggggggggrrrrr",
"gssssssssssssssrrrrr","sssssssssssssssrrrrr","ssssssssssssssssrrrr","ssssssssssssssssssrr",
"ssssssssssssssssssss","ssssssssssssssssssss",
"wwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwww"];
const STREET_MAP=[
"BBBBBBBBBBBBBBBBBBBB","BBBBBBBBBBBBBBBBBBBB","BBBBBBBBBBBBBBBBBBBB","BBBBBBBBBBBBBBBBBBBB",
"pppppppppppppppppppp","pppppppppppppppppppp","pppppppppppppppppppp","pppppppppppppppppppp","pppppppppppppppppppp",
"cccccccccccccccccccc","aaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaa"];
const HOSP_MAP=[
"####################","####################",
"#####..........#####","#####..........#####","#####..........#####","#####..........#####",
"#####..........#####","#####..........#####","#####..........#####",
"#########.##########","####################","####################"];

const CAT_NAMES={c19:'소금이 4세 (할아버지가 됨)',c08:'훗날의 소금이 4세',c98:'소금이 3세 인형',c85:'소금이 2세',c76:'소금이 1세'};
function catEnt(id,x,y,col,sleep,lines){
  return E({id,kind:'cat',x,y,col,sleep,solid:false,on:async e=>{
    SFX.meow();emote(e,'♥');for(const l of lines)await nar(l);
    if(!F.cats.includes(id)){F.cats.push(id);hud();toast(`🐱 ${CAT_NAMES[id]} (${F.cats.length}/5)`);if(F.cats.length===5)egg('cats','소금이 왕조');}}});
}
const deeper=async(q,yes,name,card)=>{const c=await choose([yes,'조금 더 둘러본다']);if(c===0)await goScene(name,card);};

/* ---------- 타이틀 ---------- */
SC.title={vista:{mode:'night',moon:true,beam:true,house:true,shoot:true},noPlayer:true,bgm:'title',amb:'waves'};

/* =========================================================
   현재 — 2026년, 한정우의 집
   ========================================================= */
SC.present={pal:'house',map:HOUSE_MAP,title:'등불리 · 고(故) 한정우의 집',dark:.5,darkC:'8,10,24',bgm:'present',amb:'rain',start:[6,9,'up'],
  lights(){return [{x:11*16+8,y:24,r:76,c:'255,190,110'},{x:17*16+10,y:46,r:52,c:'255,210,140'},{x:48,y:30,r:38,c:'140,170,220'},{x:160,y:30,r:38,c:'140,170,220'}];},
  ents(){
    const L=[
      E({id:'win1',kind:'window',x:2,y:1,w:2,view:'rain',curt:'#6a4a4a',shaft:'120,150,220',layer:0,wallDeco:true,on:async()=>{
        await nar('빗방울이 유리창을 두드린다.');await nar('멀리 바다 쪽에서 등대 불빛이 천천히 돌고 있다.');}}),
      E({id:'win2',kind:'window',x:9,y:1,w:2,view:'rain',dot:true,curt:'#6a4a4a',shaft:'120,150,220',layer:0,wallDeco:true,on:async()=>{
        await nar('창 너머, 곶 끝의 등대. 사람이 떠난 뒤에도 불은 자동으로 켜진다.');
        if(F.phase1)await say('서윤','(…50년 전 그 여름에 켜진 불이, 아직도 꺼지지 않았네.)');}}),
      E({id:'win3',kind:'window',x:17,y:1,w:1,view:'rain',layer:0,wallDeco:true,on:async()=>{await nar('작업실 창문. 창틀에 소금기가 하얗게 앉았다.');}}),
      E({id:'marks',kind:'marks',x:1,y:1,layer:0,wallDeco:true,on:async()=>{
        await nar('벽에 연필로 그은 눈금들. 키를 잰 자국이다.');
        await nar('「미래 5살」 「미래 8살」 「미래 12살」 … 맨 위 눈금은 「미래 15살」.');
        await say('서윤','(열다섯에서 멈췄다. 1998년.)');}}),
      E({id:'clock',kind:'clock',x:6,y:1,layer:0,wallDeco:true,on:async()=>{
        await nar('멈춘 벽시계. 3시 7분.');await nar('건전지 칸은 비어 있다. 멈춘 게 아니라, 누군가 멈춰 둔 시계다.');
        if(F.phase1)await say('서윤','(은하 씨가 떠난 새벽의 시각. 그는 28년 동안 이 시계의 건전지를 넣지 않았다.)');}}),
      E({id:'photo',kind:'photo',x:7,y:1,layer:0,wallDeco:true,on:async()=>{
        if(!F.phase1){await nar('빛바랜 결혼사진. 등대 앞에서 어색하게 웃는 남자와, 바닷바람에 머리칼이 날리는 여자.');
          await nar('액자 뒷면에 연필로 쓴 글씨 — 「1978. 은하와.」');}
        else{await nar('결혼사진 속 은하 씨는 그 바위 위에서와 똑같이 웃고 있다.');await say('서윤','(그 여름으로부터 2년 뒤. 그는 약속대로 불을 지켰구나.)');}}}),
      E({id:'piano',kind:'piano',x:4,y:2,w:2,on:async()=>{
        await nar('조율이 한참 어긋난 낡은 피아노.');
        await nar('악보대에 손으로 그린 오선지. 음표를 그렸다 지운 자국이 수십 번 — 끝까지 남은 음표는 하나도 없다.');
        if(F.phase1)await say('서윤','(그는 기억해내려고 애썼던 거야. 혼자서, 몇 년이고.)');
        const c=await choose(['건반을 눌러 본다','그만둔다']);if(c===0){hideDialog();await openPiano();}}}),
      E({id:'cab',kind:'cabinet',x:11,y:2,item:'lantern',on:async()=>{
        await nar('오래된 등대 램프. 유리에 그을음이 앉았지만 정성껏 닦은 흔적이 있다.');
        await nar('받침에 새겨진 글씨 — 「등불리 등대 1976–2019」');}}),
      E({id:'mbox',kind:'table',x:9,y:3,item:F.carry?null:'musicbox',glow:!F.phase1||!F.key,on:async e=>{
        if(!F.phase1){
          await nar('작은 나무 오르골. 뚜껑 안쪽에 글씨가 새겨져 있다.');
          await nar('「은하에게 — 등대에서, 정우」');
          SFX.crank();await nar('태엽을 감아 보았지만… 드르륵, 무언가 걸리는 소리뿐이다.');
          await say('서윤','(음을 내는 원통에 금이 갔어. 핀도 대부분 빠져 있고.)');
          await say('서윤','(…손끝이 저릿하다. 이 상자, 정말 오래 사랑받았구나.)');
          emote(P,'!');await say('서윤','(무언가를 보여주려 하고 있어.)');
          const c=await choose(['오르골의 기억 속으로 들어간다','아직은 집을 더 둘러본다']);
          if(c===0){await say('서윤','(…눈을 감는다.)');
            await goScene('m19','<h1>기억 · 2019년 11월 13일</h1><p>등불리 등대 관리실</p>');}
        }else if(!F.key){
          await nar('오르골을 조심스럽게 뒤집었다.');SFX.drawer();
          await nar('바닥의 얇은 판을 밀자, 덜컥 하고 열린다.');SFX.key();
          await nar('작은 놋쇠 열쇠가 테이프로 붙어 있다.');
          F.key=true;F.carry=true;e.glow=false;e.item=null;const d=ent('desk');d.glow=true;d.item='musicbox';
          await say('서윤','(서랍 열쇠. 오르골도 같이 가져가자. 작업실 책상으로.)');
        }else await nar('오르골이 놓여 있던 자리. 먼지 위에 네모난 자국만 남았다.');}}),
      E({id:'rug',kind:'rug',x:5,y:5,w:4,h:3,layer:0,solid:false}),
      E({id:'sofa',kind:'sofa',x:2,y:7,w:3,on:async()=>{
        F.sofa=(F.sofa||0)+1;
        if(F.sofa===3){
          await say('서윤','(…잠깐만 앉아 볼까. 5분만.)');hideDialog();emote(P,'zZ',2500);
          await setOp($('fader'),0,10);$('fader').style.background='#000';await setOp($('fader'),1,1500);await wait(1500);
          await nar('— 꿈속에서 누군가 창밖을 보며 낮게 흥얼거렸다. 여섯 음. 그 다음은 들리지 않았다.');
          hideDialog();await setOp($('fader'),0,1500);$('fader').style.background='#fff';
          await say('서윤','(…! 일하다 졸다니. 이 자리, 이상하게 편하네.)');egg('nap','한쪽만 꺼진 소파');return;}
        await nar('한쪽만 푹 꺼진 소파. 늘 같은 자리에만 앉았던 모양이다.');
        await nar('창문이, 그러니까 등대가 정면으로 보이는 자리.');}}),
      E({id:'box1',kind:'box',x:1,y:4,on:async()=>{await nar('정리용 상자. 아직 비어 있다.');
        if(!F.phase1)await say('서윤','(「전부 처리해 주세요」라… 이런 의뢰가 제일 어렵다.)');}}),
      E({id:'box2',kind:'box',x:11,y:8,on:async()=>{await nar('정리용 상자. 테이프가 반쯤 붙어 있다.');}}),
      E({id:'box3',kind:'box',x:18,y:8,on:async()=>{await nar('정리용 상자. 옆면에 매직으로 「버림」이라고 써 두었다.');}}),
      E({id:'bowl',kind:'bowl',x:4,y:9,solid:false,on:async()=>{
        await nar('고양이 밥그릇. 옆면에 「소금이」라고 쓰여 있다.');await nar('사료가 조금 남아 있다. …고양이는 보이지 않는다.');}}),
      E({id:'rack',kind:'rack',x:8,y:9,on:async()=>{
        await nar('옷걸이에 남색 근무복과 등대지기 모자가 걸려 있다.');await nar('은퇴한 지 7년. 그런데도 다림질 선이 살아 있다.');}}),
      E({id:'shelf',kind:'shelf',x:14,y:2,w:2,on:async()=>{
        await nar('등대 관리 일지가 연도별로 꽂혀 있다. 1976년부터 2019년까지.');
        await nar('마지막 권의 마지막 장 — 「등대 자동화 완료. 43년간 무사고 점등. 이상 없음.」');
        if(F.phase1&&F.keeps.includes('draw'))await nar('1985년 일지 사이에, 크레파스 그림 한 장이 곱게 접혀 끼워져 있다.');}}),
      E({id:'desk',kind:'desk',x:16,y:3,w:2,glow:!!(F.key&&!F.fixed&&!F.broken),item:F.carry?'musicbox':null,on:deskScript}),
      E({id:'plant',kind:'plant',x:18,y:2,on:async()=>{await nar('말라 버린 화분. 그래도 누군가 마지막까지 물을 준 흔적이 있다.');}}),
      E({id:'vhf',kind:'radio',x:18,y:5,on:async()=>{
        await nar('해상용 무전기. 전원이 아직 들어와 있다.');await nar('— 치직… 「…등불리, 등불리. 여기는 해진호. 올해도 11월 13일입니다, 어르신. …응답 없으시네요. 이상.」 …치직.');
        await say('서윤','(해진호…?)');}}),
      E({id:'door',kind:'door',x:6,y:10,on:async()=>{
        await nar('현관문. 밖에는 비가 쏟아지고 있다.');
        if(F.fixed||F.broken)return;
        const c=await choose(['아직 할 일이 남았다','의뢰대로 「전부」 처리하고 떠난다']);
        if(c===1){await say('서윤','(…의뢰인은 「전부」라고 했다. 내 일은 원래 거기까지다.)');
          const c2=await choose(['아니, 조금만 더 귀를 기울여 보자','상자를 닫는다']);if(c2===1)await ending5();}}}),
    ];
    if(F.phase1&&F.cats.length>=5)L.push(E({id:'follow',kind:'cat',x:7,y:9,col:'#8a8a86',solid:false,on:async e=>{SFX.meow();emote(e,'♥');await nar('소금이 5세가 다리에 머리를 비빈다. 밥그릇의 주인이다.');}}));
    return L;},
  async enter(){
    if(!F.introDone){
      F.introDone=true;letterbox(true);
      await wait(700);
      await say('서윤','(여기가 한정우 씨 댁.)');
      await say('서윤','(평생 등대지기로 일하셨다던 분. 지난달, 혼자 돌아가셨다고 했지.)');
      hideDialog();SFX.ring();emote(P,'!');cam(P.fx*16+8,P.fy*16,1.7,1200);await wait(1500);SFX.ring();
      await nar('— 휴대폰이 울린다.');
      await say('미래','유품정리 업체 분이시죠? 한미래입니다. 한정우 씨… 딸이요.');
      await say('서윤','네, 방금 도착했어요. 혹시 따로 챙기실 물건이 있으면—');
      await say('미래','없어요. 전부 처리해 주세요.');
      await say('서윤','사진이나 편지 같은 것도 있을 텐데요.');
      await say('미래','전부요.');
      await say('미래','…저는 그 사람이랑 할 얘기가 없었어요. 지금도요.');
      await nar('— 뚝.');emote(P,'…');
      await say('서윤','(……)');
      await say('서윤','(전부, 라.)');
      await say('서윤','(나에겐 남들에게 말하지 않는 버릇이 하나 있다. 버리기 전에, 물건의 말을 먼저 들어 보는 것.)');
      await say('서윤','(시작하자. 이 집이 기억하는 것부터.)');
      hideDialog();cam(null);letterbox(false);
      const h=$('hint');if(isTouch)h.textContent='◀▲▶▼ 이동 · 「조사」 버튼으로 살펴보기';h.style.opacity=1;setTimeout(()=>h.style.opacity=0,7000);
    }else if(F.phase1&&!F.backDone){
      F.backDone=true;
      await wait(500);
      await say('서윤','(…돌아왔다.)');
      await say('서윤','(미, 솔, 라, 솔, 미, 레. 그가 끝내 완성하지 못한 노래의 처음 여섯 음.)');
      await say('서윤','(그리고 — 오르골 바닥에 숨긴 열쇠.)');
      const f=ent('follow');
      if(f){SFX.meow();emote(f,'!');await nar('— 야옹.');await say('서윤','(현관에 회색 고양이가 앉아 있다. 기억 속에서 다섯 번이나 본 얼굴… 의 후손.)');await say('서윤','(「소금이 5세」. 밥그릇의 주인이 돌아왔구나. 같이 가자.)');}
    }
  }};

async function deskScript(e){
  if(F.fixed||F.broken)return;
  if(!F.key){await nar('책상 서랍이 잠겨 있다.');await nar('책상 위에는 시계 수리용 공구와 돋보기, 그리고 놋쇠 핀이 몇 개 굴러다닌다.');return;}
  if(!F.drawer){
    F.drawer=true;letterbox(true);
    SFX.drawer();await nar('열쇠가 딸깍, 돌아갔다.');
    await nar('서랍 안에는 편지 뭉치와 오르골 부품이 들어 있었다.');
    await nar('편지는 스물한 통. 1999년부터 2019년까지, 해마다 11월 13일 날짜로.');
    await nar('전부 우표까지 붙어 있지만, 한 번도 부쳐지지 않았다. 봉투마다 같은 이름 — 「미래에게」.');
    await say('서윤','(가장 오래된 것 하나만… 실례할게요.)');SFX.page();
    await nar('「미래야. 엄마가 떠난 밤, 나는 등대에 있었다.」');
    await nar('「변명은 하지 않으마. 다만 그 밤, 해진호 선원 일곱 명이 무사히 집에 돌아갔다.」');
    await nar('「네 엄마라면 가라고 했을 거다. 실제로도 그랬고.」');
    await nar('「그래도 미안하다. 네 곁에 있어 주지 못해서.」');
    await nar('「추신. 엄마 노래를 기억하니. 나는 처음 여섯 음밖에 모르겠구나.」');
    emote(P,'…');await say('서윤','(……)');
    await nar('편지 밑에는 깎다 만 새 원통과 핀 한 줌, 그리고 쪽지가 있다.');
    await nar('「은하의 노래. 처음 여섯 음만이라도 다시 들려주고 싶은데, 순서가 자꾸 흐려진다.」');
    if(F.keeps.length>=5){F.tin=true;SFX.keep();
      await nar('그리고 서랍 가장 안쪽 — 녹슨 양철 과자 상자.');
      await nar('파란 페인트가 말라붙은 붓. 크레파스 그림. 「엄마 힘내」 카드. 조개 목걸이. 이름 칸이 빈 축의금 봉투.');
      await say('서윤','(기억 속에서 본 것들이다. 전부… 미래 씨의 조각들. 그는 하나도 버리지 않았어.)');}
    letterbox(false);
  }
  if(F.called===undefined){
    await say('서윤','(…이 편지들은 내가 읽을 것이 아니다. 읽어야 할 사람은 따로 있다.)');
    const c=await choose(['미래 씨에게 전화를 건다','걸지 않는다 — 유품정리사가 나설 일이 아니다']);
    if(c===0){
      hideDialog();SFX.dial();await wait(3400);
      await say('미래','…네.');
      await say('서윤','한미래 씨, 유품정리사 서윤입니다. 정리하다가 말씀드릴 게 있어서—');
      await say('미래','전부 처리해 달라고 했잖아요.');
      const c2=await choose(['「아버님이 편지를 스물한 통 남기셨어요.」','「노래가 하나 있어요. 처음 여섯 음뿐인 노래요.」','「…죄송합니다. 아무것도 아니에요.」']);
      if(c2===0){await say('미래','……편지요.');await say('미래','할 말이 있었으면, 살아 있을 때 했어야죠.');await say('미래','버려 주세요.');await nar('— 뚝.');emote(P,'…');
        await say('서윤','(…다시 걸었지만, 받지 않는다. 말을 잘못 골랐을까.)');F.called=false;}
      else if(c2===1){await say('미래','……뭐라고요?');await say('서윤','미, 솔, 라, 솔, 미, 레.');hideDialog();await hum(MOTIF,72,P);
        await say('미래','…………');await say('미래','…그걸, 어떻게.');await say('미래','……몇 시까지 계세요.');await say('서윤','오르골을 다 고칠 때까지요.');await nar('— 뚝.');emote(P,'!');
        await say('서윤','(…오겠다는 말은 없었다. 오지 않겠다는 말도.)');F.called=true;}
      else{await say('미래','…네. 수고하세요.');await nar('— 뚝.');F.called=false;await say('서윤','(…끝내 말하지 못했다.)');}
    }else{F.called=false;await say('서윤','(나는 물건을 정리하는 사람이다. 사람 사이를 정리하는 사람이 아니라.)');}
    store.set('lhmb_save',{scene:'present',F});
  }
  await nar('깎다 만 원통과 놋쇠 핀들. 오르골이 다시 노래하기를 기다리고 있다.');
  await say('서윤','(순서라면 내가 알아. 기억 속에서 들었으니까. …다만 낡은 태엽이 몇 번이나 버텨 줄지.)');
  const c=await choose(['원통에 핀을 꽂는다','나중에 한다']);
  if(c!==0)return;
  hideDialog();
  const r=await openPuzzle();
  if(r==='ok'){F.fixed=true;e.glow=false;if(F.called)await endingHappy(!!F.tin);else await ending3();}
  else if(r==='broken'){F.broken=true;e.glow=false;await ending4();}
}

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
      await deeper(0,'더 깊은 기억으로','m08','<h1>기억 · 2008년 5월 17일</h1><p>서울, 은빛웨딩홀 앞 · 봄비</p>');}}),
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
    await say('정우','…그 다음이 영 기억이 안 나는구나.');
    await nar('그는 오래도록 창밖의 불빛만 바라보았다.');
    hideDialog();await addNotes([76,79]);
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
      await say('정우','「아빠가… 늦어서 미안하다.」');emote(e,'…');
      await nar('그는 같은 말을 몇 번이고 고쳐 연습한다. 예식장 문에서 스무 걸음 떨어진 곳에서.');
      await say('서윤','(청첩장은 오지 않았다. 날짜는 은하 씨의 친구에게 물어서 알았다. — 꾸러미 속 오르골이 그렇게 말해 준다.)');})}),
    E({id:'mr',kind:'char',look:LOOK.mrBride,dir:'down',x:9,y:4,hidden:true,solid:false}),
    E({id:'booth',kind:'booth',x:17,y:4,on:async()=>{await nar('공중전화 부스. 수화기가 비뚤게 걸려 있다.');await nar('동전 반환구에 백 원짜리 세 개. 누군가 번호를 누르다 끊기를 세 번 되풀이했다.');}}),
    E({id:'bench',kind:'bench',x:3,y:7,w:2,glow:done,on:async()=>{
      if(!F.m08done){await nar('버스 정류장 벤치. 빗물이 고여 있다.');return;}
      await nar('벤치 위에 네모난 마른 자국. 꾸러미가 놓여 있던 자리가 희미하게 빛난다.');
      await deeper(0,'더 깊은 기억으로','m98','<h1>기억 · 1998년 11월 12일 밤</h1><p>등불리 시립병원 304호</p>');}}),
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
    await say('정우','……예쁘구나.');
    await say('정우','네 엄마를 꼭 닮았어.');
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
    E({id:'side',kind:'cabinet',x:6,y:3,item:'musicbox',glow:done,on:async()=>{
      if(!F.m98done){await nar('침대 옆 협탁. 오르골이 놓여 있다. 은하가 병원까지 가져온 단 하나의 물건.');return;}
      await nar('오르골이 빛나고 있다. 이 상자가 처음 노래하던 날을 가리키듯이.');
      await deeper(0,'더 깊은 기억으로','m85','<h1>기억 · 1985년 8월</h1><p>등불리 등대 꼭대기, 등명실 · 해 질 녘</p>');}}),
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
      emote(e,'!');await say('미래','…엄마보다 배가 더 중요해?');
      await nar('정우는 대답하지 못했다.');})}),
    E({id:'chair',kind:'chair',x:13,y:6,item:'plush',on:async e=>{
      await nar('보호자용 접이식 의자. 담요가 개켜져 있다. 며칠째 여기서 잔 모양이다.');
      await nar('담요 위에 낡은 고양이 인형. 미래가 집에서 가져다 놓았다. 「엄마 심심하지 말라고. 소금이 3세 대신.」');
      if(!F.cats.includes('c98')){SFX.meow();F.cats.push('c98');hud();toast(`🐱 ${CAT_NAMES.c98} (${F.cats.length}/5)`);if(F.cats.length===5)egg('cats','소금이 왕조');}}}),
    E({id:'vase',kind:'cabinet',x:13,y:2,item:'vase',glint:!F.keeps.includes('card'),on:async e=>{
      await nar('노란 국화와 분홍 패랭이꽃. 꽃병에 카드가 기대어 있다.');await nar('삐뚤빼뚤한 글씨 — 「엄마 힘내 ♡ 미래」.');
      if(!F.keeps.includes('card')){e.glint=false;keep('card','「엄마 힘내」 카드');}}}),
    E({id:'door',kind:'door',x:9,y:9,on:async()=>{await nar('병실 문. 복도 끝에서 비상등이 깜빡인다.');}}),
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
    emote(jw,'!');await say('정우','…다녀올게. 새벽에 바로 올게.');
    await say('은하','응. 가. 다들 기다리잖아.');
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
    await say('은하','아빠 미워하지 마. 응?');
    await nar('은하가 미래의 머리를 쓸어 넘기며, 낮게 노래를 흥얼거린다.');
    hideDialog();await hum(MOTIF.slice(0,4),58,ent('bed'));
    hideDialog();await vista({mode:'storm',boat:true,rain:true},1500);
    await nar('— 그 밤, 등대는 단 한 번도 꺼지지 않았다.');
    await nar('해진호의 선원 일곱 명은 새벽 3시, 불빛을 따라 항구로 돌아왔다.');
    await nar('그리고 새벽 3시 7분. 정우가 병원 계단을 뛰어 올라왔을 때 — 노래는 이미 멈춰 있었다.');
    hideDialog();await vista(null,1500);
    await addNotes([79]);
    F.m98done=true;ent('side').glow=true;
    await say('서윤','(…협탁 위 오르골이 빛난다. 이 상자가 처음 노래하던 날로.)');
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
      emote(e,'♥');await say('은하','후후. 끝은… 이제 알 것 같아. 조금만 더 기다려 봐.');})}),
    E({id:'mb',kind:'table',x:14,y:3,item:'musicbox',glow:done,on:async()=>{
      if(!F.m85done){await nar('갓 만든 오르골. 뚜껑 안쪽의 글씨는 아직 칼자국이 선명하다. 「은하에게 — 등대에서, 정우」');return;}
      await nar('새 오르골이 빛나고 있다. 이 노래가 처음 태어난 바닷가를 가리키듯이.');
      await deeper(0,'노래가 태어난 기억으로','m76','<h1>기억 · 1976년 여름</h1><p>등불리 해변, 해 질 녘</p>');}}),
    E({id:'bucket',kind:'bucket',x:4,y:7,on:async()=>{await nar('파란 페인트 통. 붓 자국이 통 바깥에 더 많다.');}}),
    E({id:'mr',kind:'char',look:LOOK.mrChild,scale:.74,dir:done?'up':'left',x:done?12:5,y:done?4:7,glow:!F.m85_mr,on:frag('m85_mr',async(e,again)=>{
      if(F.m85done){await nar('미래는 엄마 무릎에 기대어 눈을 감고 있다.');return;}
      if(again){await nar('미래는 혀를 내밀고 열심히 붓질 중이다.');return;}
      await nar('여섯 살 아이가 난간 벽에 페인트를 칠하고 있다. 벽보다 얼굴에 더 많이.');
      await say('미래','아빠! 나 여기 다 칠했어! 봐 봐!');
      await say('정우','어디 보자. …우리 미래, 등대를 칠한 거야, 미래를 칠한 거야?');
      hop(e,2);emote(e,'♪');await say('미래','둘 다!');
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
    await say('정우','제가 왔으니까.');
    emote(eh,'♪');await nar('은하가 처음으로 소리 내어 웃었다.');
    await say('은하','정말요? 약속이에요.');
    await say('정우','노래, 뒷부분은 어떻게 돼요?');
    await say('은하','음… 여기까지 만들었어요.');
    hideDialog();await hum(MOTIF,70,eh);
    await say('은하','미, 솔, 라, 솔, 미, 레. 뒷부분은 아직 몰라요.');
    await say('은하','언젠가 기다리던 게 돌아오면, 그때 끝을 붙일래요.');
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
    await goScene('present','<h1>2026년 11월 13일</h1><p>다시, 한정우의 집</p>');
  }};

/* =========================================================
   오르골 퍼즐 · 피아노
   ========================================================= */
const PZ_ROWS=[83,81,79,77,76,74,72],PZ_ANS=MOTIF.map(n=>n[0]);
function openPuzzle(){
  return new Promise(res=>{
    const pz=$('puzzle'),grid=$('pzGrid'),msg=$('pzMsg');
    const pins=Array(6).fill(-1);let cur={c:0,r:4},busy=false;F.tries=F.tries==null?3:F.tries;
    const showTries=()=>$('pzTries').textContent='●'.repeat(F.tries)+'○'.repeat(3-F.tries);
    grid.innerHTML='';const cells=[];
    PZ_ROWS.forEach((m,r)=>{const l=document.createElement('div');l.className='pzl';l.textContent=NOTE_NAME[m];grid.appendChild(l);
      for(let c=0;c<6;c++){const d=document.createElement('div');d.className='pzc';d.onclick=ev=>{ev.stopPropagation();cur={c,r};toggle(c,r);};grid.appendChild(d);cells.push(d);}});
    const render=()=>cells.forEach((d,i)=>{const r=Math.floor(i/6),c=i%6;d.classList.toggle('on',pins[c]===r);d.classList.toggle('cur',!isTouch&&cur.c===c&&cur.r===r);});
    function toggle(c,r){if(busy)return;pins[c]=pins[c]===r?-1:r;SFX.pin(PZ_ROWS[r]);msg.textContent='';render();}
    async function play(){
      if(busy)return;
      if(pins.includes(-1)){msg.textContent='아직 비어 있는 세로줄이 있다. 여섯 줄 모두 핀을 꽂자.';return;}
      busy=true;msg.textContent='드르륵… 태엽이 풀린다.';SFX.crank();await wait(900);
      await boxPlay(pins.map((r,i)=>[PZ_ROWS[r],MOTIF[i][1]]),84,{onNote:i=>cells.forEach((d,j)=>d.classList.toggle('play',j%6===i))});
      cells.forEach(d=>d.classList.remove('play'));
      const bad=pins.filter((r,i)=>PZ_ROWS[r]!==PZ_ANS[i]).length;
      if(!bad){msg.textContent='…이 노래다.';await wait(1400);close('ok');return;}
      F.tries--;showTries();
      if(F.tries<=0){msg.textContent='— 딱.';await wait(900);close('broken');return;}
      msg.textContent=`어긋난 음이 ${bad}개 있다. 원통에 실금이 간다… 남은 태엽 ${F.tries}번.`;busy=false;
    }
    function close(v){pz.classList.add('hidden');panelKeys=null;res(v);}
    $('pzPlay').onclick=play;$('pzClear').onclick=()=>{if(!busy){pins.fill(-1);render();msg.textContent='';}};$('pzClose').onclick=()=>{if(!busy)close('closed');};
    panelKeys=k=>{if(busy)return;
      if(k==='left')cur.c=(cur.c+5)%6;else if(k==='right')cur.c=(cur.c+1)%6;else if(k==='up')cur.r=(cur.r+6)%7;else if(k==='down')cur.r=(cur.r+1)%7;
      else if(k==='act')toggle(cur.c,cur.r);else if(k==='enter')play();else if(k==='esc')close('closed');render();};
    msg.textContent=isTouch?'칸을 눌러 핀을 꽂으세요. (오른쪽 위 ♪ 표시가 들은 순서입니다)':'방향키 이동 · Space 핀 · Enter 태엽 · Esc 닫기 (오른쪽 위 ♪ 가 들은 순서)';
    showTries();pz.classList.remove('hidden');render();
  });
}
const TWINKLE=[72,72,79,79,81,81,79];
function openPiano(){
  return new Promise(res=>{
    const pn=$('piano'),keys=$('pnKeys'),msg=$('pnMsg'),ns=[72,74,76,77,79,81,83];let seq=[];
    keys.innerHTML='';msg.textContent='';
    const hit=i=>{const m=ns[i];SFX.key1(m);noteFx(ent('piano'));const k=keys.children[i];k.classList.add('down');setTimeout(()=>k.classList.remove('down'),160);
      seq.push(m);seq=seq.slice(-7);
      if(seq.slice(-6).join()===PZ_ANS.join()){msg.textContent=F.notes.length>=6?'…누군가 옆에서 같이 흥얼거린 것만 같다.':'…어? 이 가락을, 어떻게 알고 있지?';
        if(A.C){const t=A.C.currentTime+.5;CONT.slice(0,3).forEach(([n],j)=>voice(n-12,t+j*.7,.6,.05));}egg('piano','누군가의 허밍');}
      if(seq.join()===TWINKLE.join()){msg.textContent='창밖 구름 사이로, 별 하나가 반짝였다.';for(let j=0;j<5;j++)sparkFx(40+Math.random()*130,20+Math.random()*8,6,'255,255,220');egg('twinkle','작은 별');}};
    ns.forEach((m,i)=>{const d=document.createElement('div');d.className='pk';d.textContent=`${NOTE_NAME[m]} ${i+1}`;d.onclick=ev=>{ev.stopPropagation();hit(i);};keys.appendChild(d);});
    const close=()=>{pn.classList.add('hidden');panelKeys=null;res();};
    $('pnClose').onclick=close;panelKeys=k=>{if(k==='esc')close();else if(k[0]==='n')hit(+k[1]-1);};
    pn.classList.remove('hidden');
  });
}

/* =========================================================
   엔딩 5종
   ========================================================= */
const ENDS={
  1:{tag:'TRUE ENDING ★',title:'돌아오는 노래',desc:'노래는 처음부터 끝까지, 다시 불렸다.'},
  2:{tag:'HAPPY ENDING',title:'여섯 음, 그리고 그 다음',desc:'어딘가에 아직, 미래의 조각들이 남아 있는 것 같다.'},
  3:{tag:'BITTERSWEET ENDING',title:'부치지 못한 편지',desc:'전화 한 통이, 그리고 어떤 말을 고르느냐가 결말을 바꾼다.'},
  4:{tag:'BAD ENDING',title:'금이 간 원통',desc:'기억 속에서 들은 순서를 다시 떠올려 보자.'},
  5:{tag:'BAD ENDING',title:'전부 처리해 주세요',desc:'물건에 귀를 기울이면, 다른 결말이 있다.'},
};
const GOLD=s=>`<span style="color:#f2dca0;font-size:1.25em">${s}</span>`;
async function fadeBlack(ms=2500){await setOp($('fader'),0,10);$('fader').style.background='#000';await setOp($('fader'),1,ms);}
async function toVista(o){S=Object.assign({},SC.title,{vista:o});ents=[];P.hidden=true;LB.t=0;$('hud').innerHTML='';await setOp($('fader'),0,2500);$('fader').style.background='#fff';}
async function finish(n){
  if(!META.ends.includes(n))META.ends.push(n);META.cleared=true;saveMeta();store.del('lhmb_save');
  const d=ENDS[n],ec=$('endcard');$('endTag').textContent=`${d.tag} · ${n}/5`;$('endTitle').textContent=d.title;$('endDesc').textContent=d.desc;
  $('endProg').textContent=`본 엔딩 ${META.ends.length}/5 · 이스터에그 ${META.eggs.length}/6 · 이번 회차: 미래의 조각 ${F.keeps.length}/5, 소금이 ${F.cats.length}/5`;
  ec.classList.remove('hidden');void ec.offsetWidth;ec.style.opacity=1;locked=true;
}
$('restart').onclick=()=>{try{history.replaceState(null,'',location.pathname);}catch(e){}location.reload();};

async function playFixedBox(){
  letterbox(true);
  await nar('새 원통을 끼우고, 태엽을 끝까지 감았다.');
  hideDialog();SFX.crank();await wait(900);playBgm(null);await camOn(ent('desk'),1.6,1200);
  await boxPlay(MOTIF,80,{duckIt:false,who:ent('desk')});
  await boxPlay(MOTIF,76,{duckIt:false,who:ent('desk')});
  await say('서윤','(……이 노래였구나.)');hideDialog();await wait(700);
}
async function miraeArrives(){
  SFX.knock();await wait(1100);await nar('똑, 똑, 똑.');emote(P,'?');await say('서윤','……?');hideDialog();cam(null,0,1,1200);
  const door=ent('door');door.open=true;door.solid=false;SFX.door();
  const mr=E({id:'mr',kind:'char',look:LOOK.mrAdult,dir:'up',x:6,y:10,solid:false});ents.push(mr);
  await walk(mr,[[6,9],[6,5],[12,5]],2.2);mr.dir='right';P.dir='left';door.open=false;
  return mr;
}
async function endingHappy(trueEnd){
  await playFixedBox();
  const mr=await miraeArrives();
  await say('미래','…문이 열려 있어서요.');
  await say('서윤','한미래 씨…!');
  await say('미래','그 노래. 전화로 들은 그 여섯 음.');
  await say('미래','오다가 돌아가려고 했어요. 세 번이나.');
  await say('미래','그런데 해안도로에서 등대 불빛이 보이더라고요. 아직도 돌고 있어서. 바보같이, 그걸 따라 여기까지 와 버렸어요.');
  await say('서윤','이거… 책상 서랍에 있었어요.');
  await say('서윤','「전부」에 넣을 수가 없어서요.');
  hideDialog();await walk(mr,[[14,5],[14,4]],2);mr.dir='right';await cam(250,60,1.6,1200);
  SFX.page();await nar('서윤은 편지 뭉치를 건넸다. 미래는 한참을 망설이다가, 맨 위의 봉투를 열었다.');
  hideDialog();await wait(1600);emote(mr,'…');
  await say('미래','…해진호.');
  await say('미래','장례식에 모르는 아저씨가 와서, 아빠 사진 앞에서 한참을 울었어요. 그날 밤 아빠 덕에 살았다고.');
  await say('미래','저는 그 사람 얼굴도 안 봤어요.');
  await say('미래','……처음 여섯 음밖에 모른다고 썼네, 이 사람.');
  await say('미래','물어보기만 했으면 됐잖아. 나한테.');
  if(trueEnd){
    await say('서윤','그리고… 이것도요. 서랍 가장 안쪽에 있었어요.');
    await nar('녹슨 양철 상자. 미래가 뚜껑을 연다.');
    await say('미래','…이 붓. 내 거야. 여섯 살 때, 등대 칠한다고.');
    await say('미래','이 그림도. 이 카드도… 조개 목걸이, 잃어버린 줄 알았는데.');
    await nar('그리고 맨 밑의 흰 봉투. 이름 칸이 비어 있는 축의금 봉투.');
    emote(mr,'!');await say('미래','……이거.');
    await say('미래','결혼식 날 누가 이름도 없이 화환 밑에 놓고 갔다고, 접수 보던 친구가 그랬어요. 삼십만 원. 만 원짜리로만.');
    await say('미래','문 앞에서… 누가 서 있는 것 같았는데.');
    await say('미래','…왔었구나. 아빠, 왔었구나.');
    hideDialog();hop(mr,1);await wait(1500);
  }
  await nar('미래가 오르골 앞으로 다가와 태엽을 다시 감았다.');
  await nar('그리고 여섯 번째 음이 사라지는 자리에서, 조용히 노래를 이어 불렀다.');
  hideDialog();playBgm('end');await wait(800);
  await boxPlay(MOTIF,72,{duckIt:false,who:ent('desk')});
  await playSeq(CONT,72,(m,t,d)=>{voice(m-12,t,d*.95,.2);mbox(m,t,.08);},{duckIt:false,onNote:()=>noteFx(mr)});
  await say('미래','엄마가 저 재울 때마다 끝까지 불러 줬어요. 아빠가 등대에 있던 밤마다.');
  await say('서윤','(은하 씨는 끝을 붙였구나. 기다리던 것이 돌아오면 붙이겠다던, 그 끝을.)');
  await say('서윤','(매일 밤 아빠를 기다리던 아이에게.)');
  if(trueEnd){
    await say('서윤','…끝까지, 한 번만 더 불러 주실래요? 원통에 받아 적을게요. 핀이 아직 남았거든요.');
    hideDialog();
    await playSeq(CONT,80,(m,t)=>mbox(m,t,.2),{duckIt:false,onNote:()=>{noteFx(ent('desk'));sparkFx(ent('desk').fx*16+20,ent('desk').fy*16,3);}});
    await nar('원통의 빈자리에 아홉 개의 음이 더 꽂혔다. 정우 씨가 스무 해 동안 찾던 음들이다.');
  }
  await say('미래','…이 오르골, 제가 가져가도 될까요?');
  await say('서윤','처음부터 전부, 미래 씨 거였어요.');
  if(ent('follow')){SFX.meow();emote(ent('follow'),'♥');await nar('— 야옹. 소금이 5세가 미래의 발등에 올라앉았다. 이 녀석도 「전부」에 포함인 모양이다.');}
  hideDialog();await fadeBlack();setAmb('waves');
  const cat=F.cats.length>=5;
  if(trueEnd){
    await toVista({mode:'dawn',sun:true,sunX:230,beam:true,bench:true,gulls:true,shoot:false,figs:[{x:452,h:30,sit:true,hair:15},{x:470,h:19,sit:true,hair:6,cat}]});
    await cardLines(['미래는 스물한 통의 편지에 스물한 통의 답장을 썼다. 부칠 곳은 없었지만, 전부 우표를 붙였다.','그해 겨울, 그녀는 처음으로 해진호 선장에게 전화를 걸었다.','다음 해 봄, 등불리 등대 앞에 작은 벤치가 하나 놓였다.','여름이면 미래는 딸 하늘이를 데리고 그 벤치에 앉는다.',
      '「엄마, 이 노래 끝은 누가 만들었어?」','「외할머니가. 외할아버지가 등대에서 내려오길 기다리면서.」','「그럼 외할아버지는 들었어?」','「…응. 이제는 매일 들으셔.」','오르골은 이제 열다섯 개의 음을 노래한다. 처음부터, 끝까지.',GOLD('「불빛이 있으면, 돌아올 수 있어.」')]);
    finish(1);
  }else{
    await toVista({mode:'dawn',sun:true,sunX:230,beam:true,bench:true,gulls:true,figs:[{x:460,h:30,sit:true,hair:15,cat}]});
    await cardLines(['그해 겨울, 미래는 처음으로 해진호 선장에게 전화를 걸었다.','다음 해 봄, 등불리 등대 앞에 작은 벤치가 하나 놓였다.','미래는 가끔 그 벤치에 앉아, 여섯 음짜리 오르골에 맞춰 나머지를 부른다.','벤치 등받이에는 짧은 문장이 새겨져 있다.',GOLD('「불빛이 있으면, 돌아올 수 있어.」')]);
    finish(2);
  }
  await wait(1500);
  await playSeq([...MOTIF,...CONT],70,(m,t)=>mbox(m,t,.18),{duckIt:false});
}
async function ending3(){
  await playFixedBox();
  await nar('노래는 빈집에서 여섯 음을 울리고, 멈췄다.');
  await say('서윤','(…아무도 오지 않는다. 당연하지. 이 노래를 들어야 할 사람은 여기 없으니까.)');
  cam(null,0,1,1200);
  await nar('서윤은 「전부」를 상자에 담았다. 단 하나의 상자만 빼고.');
  await nar('편지 스물한 통과 오르골. 송장에는 의뢰인의 주소를 적었다.');
  await say('서윤','(유품정리사가 할 수 있는 일은 여기까지다. 버리지 않는 것까지.)');
  hideDialog();await fadeBlack();playBgm('end');
  await toVista({mode:'rain',beam:true,rain:true,house:'dark'});
  await cardLines(['소포는 사흘 뒤, 「수취 거부」 도장이 찍혀 돌아왔다.','서윤은 그것을 사무실 선반에 올려 두었다. 버리지 않았다.','석 달 뒤, 사무실로 전화가 한 통 걸려 왔다.','「…그 소포, 아직 갖고 계세요?」','「네. 여섯 음도 그대로예요.」','「……그럼, 그 다음 부분은 제가 알아요.」']);
  finish(3);await wait(1200);await boxPlay(MOTIF,66,{duckIt:false});
}
async function ending4(){
  letterbox(true);playBgm(null);SFX.crack();shake(500,4);
  await nar('낡은 원통이 태엽의 힘을 이기지 못하고, 세로로 갈라졌다.');emote(P,'!');
  await say('서윤','(……아.)');
  await say('서윤','(순서를 틀렸다. 그가 스무 해를 못 고친 것을, 내가 한 시간 만에 망가뜨렸다.)');
  playBgm('bad');
  if(F.called){
    hideDialog();await miraeArrives();
    await say('미래','…노래가 있다고 하셨잖아요.');
    await say('서윤','죄송합니다. 제가… 원통을.');
    await nar('미래는 갈라진 오르골을 한참 내려다보았다.');
    await say('미래','…괜찮아요. 어차피 이 집에서 끝까지 들어 본 노래는 없었어요.');
    await nar('그녀는 편지 뭉치만 받아 들고, 빗속으로 나갔다.');
  }else await nar('오르골은 「전부」와 함께 상자에 담겼다.');
  hideDialog();await fadeBlack();
  await toVista({mode:'rain',beam:true,rain:true,house:'dark'});
  await cardLines(F.called?['미래는 편지를 전부 읽었다.','하지만 그 노래를 다시 입에 올리는 일은 없었다.','처음 여섯 음을 불러 줄 것이, 세상에 하나도 남지 않았기 때문이다.']
    :['갈라진 원통은 고물상의 놋쇠 더미 속에서 조용히 녹았다.','여섯 음의 순서를 아는 사람은 이제 서윤 하나뿐이다.','그녀는 가끔 비 오는 날, 누구의 것인지도 모르는 노래를 흥얼거린다.']);
  finish(4);
}
async function ending5(){
  letterbox(true);playBgm('bad');
  await nar('서윤은 장갑을 끼고, 상자를 조립하고, 테이프를 끊었다.');
  await nar('사진은 사진 상자에. 책은 책 상자에. 오르골은 — 잡화 상자에.');
  await say('서윤','(물건에 귀를 기울이지 않으면, 일은 놀랄 만큼 빨리 끝난다.)');
  await nar('저녁 무렵 트럭이 왔다. 책상은 서랍을 열어 보지 않은 채로 실려 나갔다.');
  hideDialog();await fadeBlack();
  await toVista({mode:'rain',beam:true,rain:true,house:'dark'});
  await cardLines(['의뢰인에게 문자를 보냈다. 「전부 처리 완료했습니다.」 답장은 없었다.','등불리 등대는 그 겨울에도 자동으로 켜지고, 자동으로 꺼졌다.','그 불빛을 보고 돌아온 사람은, 아무도 없었다.']);
  finish(5);
}

/* =========================================================
   타이틀 · 시작
   ========================================================= */
function buildMenu(){
  const el=$('menu');el.innerHTML='';const items=[['처음부터',()=>startGame('new')]];
  const sv=store.get('lhmb_save',null);if(sv&&SC[sv.scene])items.unshift(['이어하기',()=>startGame('cont',sv)]);
  if(META.cleared)items.push(['기억을 모두 본 뒤부터 (엔딩 수집)',()=>startGame('after')]);
  let sel=0;
  const render=()=>[...el.children].forEach((c,i)=>c.classList.toggle('sel',i===sel));
  items.forEach(([t,fn],i)=>{const d=document.createElement('div');d.className='mi';d.textContent=t;d.onclick=()=>{audioInit();sel=i;menu=null;fn();};d.onmouseenter=()=>{sel=i;render();};el.appendChild(d);});
  menu={move(d){sel=(sel+d+items.length)%items.length;render();SFX.blip();},pick(){const f=items[sel][1];menu=null;f();}};render();
  $('gallery').innerHTML=META.ends.length||META.eggs.length?`엔딩 ${[1,2,3,4,5].map(n=>META.ends.includes(n)?`<b style="color:#f2c46d">${ENDS[n].title}</b>`:'???').join(' · ')}<br>이스터에그 ${META.eggs.length}/6`:'';
}
let titleTaps=0;
$('titleH').onclick=()=>{if(++titleTaps%7===0){F.catMode=!F.catMode;audioInit();SFX.meow();toast(F.catMode?'🐱 소금이 모드 ON':'소금이 모드 OFF');META.eggs.includes('konami')||egg('konami','소금이 모드');}};
async function startGame(mode,sv){
  if(started)return;started=true;audioInit();const cm=F.catMode;
  const t=$('title');t.style.transition='opacity 1.2s';t.style.opacity=0;setTimeout(()=>t.classList.add('hidden'),1200);
  locked=true;
  if(mode==='cont'){resetF(sv.F);F.catMode=cm;await goScene(sv.scene,'<p>이어서…</p>',{white:false,hold:900});return;}
  if(mode==='after'){const b=META.best||{};resetF({introDone:true,phase1:true,notes:PZ_ANS.slice(),keeps:(b.keeps||[]).slice(),cats:(b.cats||[]).slice(),catMode:cm});
    await goScene('present','<h1>2026년 11월 13일</h1><p>기억에서 돌아온 뒤, 한정우의 집</p>',{white:false,hold:1800});return;}
  resetF({catMode:cm});store.del('lhmb_save');
  await wait(600);
  await cardShow('<p>사람이 떠나도, 물건은 남는다.</p>',1600,true);await wait(2600);
  await cardShow('<p>사람이 떠나도, 물건은 남는다.</p><p>그리고 오래 사랑받은 물건은 — 가끔, 기억을 한다.</p>',10,true);await wait(4200);
  await setOp($('card'),0,800);$('card').classList.remove('clear');
  await goScene('present','<h1>2026년 11월 13일</h1><p>해안 마을 등불리 · 비</p>',{white:false,hold:2200});
}
// 개발용 바로가기: #m19 #m08 #m98 #m85 #m76 #p1 #p1t
function debugJump(){
  const h=location.hash.slice(1);if(!h)return false;
  const go=()=>{started=true;menu=null;$('title').classList.add('hidden');};
  if(h==='p1'||h==='p1t'){go();resetF({introDone:true,phase1:true,notes:PZ_ANS.slice(),keeps:h==='p1t'?['brush','env','card','draw','shell']:[],cats:h==='p1t'?['c19','c08','c98','c85','c76']:[]});loadScene('present');locked=false;return true;}
  if(SC[h]&&h!=='title'){go();resetF({introDone:true});loadScene(h);locked=false;return true;}
  return false;
}
syncOpts();layout();
if(!debugJump()){loadScene('title');buildMenu();}
requestAnimationFrame(frame);
if('serviceWorker' in navigator&&location.protocol==='https:'&&window.top===window){navigator.serviceWorker.register('sw.js').catch(()=>{});}
