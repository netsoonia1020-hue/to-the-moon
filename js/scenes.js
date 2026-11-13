'use strict';
/* =========================================================
   등대지기의 오르골 — 장면 · 대본 · 퍼즐 · 엔딩
   흐름: 현재 → 2026 요양원 → 2019 → (막간1) → 2008 → 1998 병실 → 1998 폭풍 → (막간2) → 서윤의 장 → 1989 → 1978 → (막간3) → 1976 → 에필로그
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
      E({id:'mbox',kind:'table',x:9,y:3,item:F.carry?null:'musicbox',glow:!!F.after||!F.phase1||!F.key,on:async e=>{
        if(F.after){await nar('오르골이 다시 희미하게 빛나고 있다.');await continueAfter();return;}
        if(!F.phase1){
          await nar('작은 나무 오르골. 뚜껑 안쪽에 글씨가 새겨져 있다.');
          await nar('「은하에게 — 등대에서, 정우」');
          SFX.crank();await nar('태엽을 감아 보았지만… 드르륵, 무언가 걸리는 소리뿐이다.');
          await say('서윤','(음을 내는 원통에 금이 갔어. 핀도 대부분 빠져 있고.)');
          await say('서윤','(…손끝이 저릿하다. 이 상자, 정말 오래 사랑받았구나.)');
          emote(P,'!');await say('서윤','(무언가를 보여주려 하고 있어.)');
          const c=await choose(['오르골의 기억 속으로 들어간다','아직은 집을 더 둘러본다']);
          if(c===0){await say('서윤','(…눈을 감는다.)');
            await goScene('m25',chap('제 1 장','노을 시간','2026년 10월','바다요양원 302호','그는 매일 저녁, 누구를 기다렸을까?'));}
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
        if(F.phase1&&F.keeps.includes('draw'))await nar('1989년 일지 사이에, 크레파스 그림 한 장이 곱게 접혀 끼워져 있다.');}}),
      E({id:'desk',kind:'desk',x:16,y:3,w:2,glow:!!(F.key&&!F.fixed&&!F.broken),item:F.carry?'musicbox':null,on:deskScript}),
      E({id:'plant',kind:'plant',x:18,y:2,on:async()=>{await nar('말라 버린 화분. 그래도 누군가 마지막까지 물을 준 흔적이 있다.');}}),
      E({id:'vhf',kind:'radio',x:18,y:5,glow:!!(F.phase1&&!F.dadTalk&&F.stdone),on:async e=>{
        if(F.phase1&&F.stdone&&!F.dadTalk){
          await nar('— 치직… 「…등불리, 등불리. 여기는 해진호. 올해도 11월 13일입니다, 어르신. …이상.」');
          await say('서윤','(…아빠.)','sad');
          const c=await choose(['송신 버튼을 누른다','듣기만 한다']);
          if(c===1){await say('서윤','(…아직은, 무슨 말을 해야 할지 모르겠다.)');return;}
          F.dadTalk=true;e.glow=false;letterbox(true);
          await say('서윤','…해진호, 여기는 등불리.');
          await nar('잡음. 그리고 긴 침묵.');
          await say('태오','……윤이냐?','surp');
          await say('서윤','응. 나야, 아빠.');
          await say('태오','거기… 어르신 댁이냐. 네가 왜 거기 있어.');
          await say('서윤','유품정리. 내가 맡겠다고 했어. 아빠한테는 말 안 했고.','sad');
          await say('태오','……그랬구나.');
          await say('태오','장례식 날 따님한테 인사를 드렸는데, 얼굴도 안 보시더라. 당연하지. 우리가 그 밤에 그분을 빼앗아 간 거니까.','sad');
          await say('서윤','아빠. 그분 기억을 봤어. 그 밤도.');
          await say('서윤','아빠 목소리, 들었어. 「아이 이름은 윤이요」라고 하는 거.','cry');
          await nar('무전기 너머에서, 늙은 선장이 숨을 삼키는 소리가 들렸다.');
          await say('태오','…스물여덟 해 동안 해마다 불렀다. 대답이 한 번도 안 오는 날에도.','cry');
          await say('태오','윤아. 그 노래, 고쳐 드려라. 아빠 몫까지.');
          await say('서윤','응. 그러려고 왔어.','smile');
          letterbox(false);egg('radio','스물여덟 번째 11월 13일');return;}
        await nar('해상용 무전기. 전원이 아직 들어와 있다.');await nar('— 치직… 「…등불리, 등불리. 여기는 해진호. 올해도 11월 13일입니다, 어르신. …응답 없으시네요. 이상.」 …치직.');
        if(!F.phase1)await say('서윤','(…올해도, 불렀구나.)','closed');}}),
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
    if(F.after&&!F['int'+F.after.n]){const n=F.after.n;F['int'+n]=true;await INTER[n]();hud();
      const c=await choose(['다음 기억으로','집을 조금 둘러본다 (빛나는 오르골로 언제든 이어서)']);if(c===0)await continueAfter();return;}
    if(!F.introDone){
      F.introDone=true;letterbox(true);
      await wait(700);
      await say('서윤','(여기가 한정우 씨 댁.)');
      await say('서윤','(평생 등대지기로 일하셨다던 분. 지난달, 요양원에서 돌아가셨다.)');
      await say('서윤','(이 일은… 내가 맡겠다고 했다. 원래 담당은 다른 사람이었는데.)','closed');
      await say('서윤','(먼저 인사부터 하자.)');
      hideDialog();await cam(11*16+8,22,2.2,1300);
      await nar('서윤은 장갑을 벗고, 선반 위 낡은 등대 램프에 손끝을 댔다.');
      hideDialog();if(A.C){const t=A.C.currentTime;[84,88,91].forEach((m,i)=>mbox(m,t+i*.12,.1));}
      $('fader').style.background='#fff';await setOp($('fader'),.85,350);
      await cardShow('<p>— 매일 저녁, 마른 천으로 유리를 닦던 주름진 손.</p><p style="color:#f4e2b0">「오늘도 불 켰다, 은하야.」</p>',500,true);await wait(3400);
      await cardHide(600);await setOp($('fader'),0,700);cam(null,0,1,1200);
      await say('서윤','(…역시. 이 집의 물건들은 할 말이 많다.)','smile');
      await say('서윤','(나는 오래 사랑받은 물건에 손을 대면, 그 물건이 기억하는 장면을 본다. 어릴 때부터 그랬다.)');
      await say('서윤','(대부분은 방금처럼 몇 초. 하지만 아주 오래, 아주 많이 사랑받은 물건은 — 나를 그 사람의 시간 속으로 데려간다.)');
      await introCard('seoyun');
      hideDialog();SFX.ring();emote(P,'!');cam(P.fx*16+8,P.fy*16,1.7,1200);await wait(1500);SFX.ring();
      await nar('— 휴대폰이 울린다.');
      await say('미래','유품정리 업체 분이시죠? 한미래입니다. 한정우 씨… 딸이요.');
      await say('서윤','네, 방금 도착했어요. 혹시 따로 챙기실 물건이 있으면—');
      await say('미래','없어요. 전부 처리해 주세요.');
      await say('서윤','사진이나 편지 같은 것도 있을 텐데요.');
      await say('미래','전부요.');
      await say('미래','…저는 그 사람이랑 할 얘기가 없었어요. 지금도요.');
      await nar('— 뚝.');emote(P,'…');
      await introCard('mrAdult');
      await say('서윤','(……)');
      await say('서윤','(전부, 라.)');
      await say('서윤','(유품정리사의 일은 버리는 것. 하지만 나는 — 버리기 전에, 물건의 말을 먼저 들어 본다.)');
      await say('서윤','(왜 이 집이어야 했는지는 — 아직 아무에게도 말하지 않았다.)');
      await say('서윤','(시작하자. 이 집이 기억하는 것부터.)','closed');
      hideDialog();cam(null);letterbox(false);
      const h=$('hint');if(isTouch)h.textContent='◀▲▶▼ 이동 · 「조사」 버튼으로 살펴보기';h.style.opacity=1;setTimeout(()=>h.style.opacity=0,7000);
    }else if(F.phase1&&!F.backDone){
      F.backDone=true;
      await wait(500);
      letterbox(true);
      await say('서윤','(…돌아왔다.)','closed');
      await say('서윤','(요양원의 창가. 부치지 않은 편지. 빗속의 스무 걸음. 폭풍의 밤. 점등. 결혼식. 그리고 바위 위의 노래.)');
      await say('서윤','(미, 솔, 라, 솔, 미, 레. 그가 끝내 완성하지 못한 노래의 처음 여섯 음.)');
      await say('서윤','(아빠를 집에 돌려보낸 사람의 노래.)','sad');
      await say('서윤','(…무전기가 울리고 있다. 그리고 — 오르골 바닥에 숨긴 열쇠.)');
      letterbox(false);
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
    if(F.keeps.length>=6){F.tin=true;SFX.keep();
      await nar('그리고 서랍 가장 안쪽 — 녹슨 양철 과자 상자.');
      await nar('여섯 살 미래의 사진 원본. 파란 페인트가 말라붙은 붓. 크레파스 그림. 「엄마 힘내」 카드. 조개 목걸이. 이름 칸이 빈 축의금 봉투.');
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
   기억 연대표 (일지) · 화면 목표 안내
   ========================================================= */
const CH=[
 {y:'2026년 10월 · 바다요양원',t:'제1장 노을 시간',done:'m25done',s:'기억을 잃어 가던 정우는 매일 오후 다섯 시 「불 켰나?」라고 물으며 열다섯 살의 딸을 기다렸다. 1년 전 찾아온 진짜 미래는 알아보지 못했다.'},
 {y:'2019년 11월 13일 · 등대 관리실',t:'제2장 부치지 않은 편지',done:'m19done',s:'아내의 21번째 기일. 정우는 딸에게 편지를 쓰고, 부치지 않은 채 서랍에 잠갔다. 열쇠는 오르골 바닥에 숨겼다.'},
 {y:'2008년 5월 17일 · 서울',t:'제3장 스무 걸음',done:'m08done',s:'초대받지 못한 딸의 결혼식. 정우는 예식장 앞 가로등 아래까지 왔지만 들어가지 못하고, 이름 없는 축의금만 남긴 채 돌아갔다.'},
 {y:'1998년 11월 12일 밤 · 병실',t:'제4장 불빛이 안 보인다',done:'m98done',s:'은하가 위독한 밤, 태풍 속에서 등대의 불이 꺼졌다. 은하는 오르골을 쥐여 주며 정우를 등대로 보냈다. 열다섯 살 미래는 그런 아빠를 용서하지 못했다.'},
 {y:'1998년 11월 13일 새벽 · 등명실',t:'제5장 폭풍의 등대',done:'stdone',s:'정우는 불을 다시 켜 해진호의 일곱 명을 살렸다. 그 배의 통신사 서태오는 — 서윤의 아버지였다. 정우는 새벽 3시 7분, 아내의 곁을 지키지 못했다.'},
 {y:'1998년 11월 13일 새벽 · 해진호',t:'제6장 배 위의 불빛 (서윤의 장)',done:'btdone',s:'같은 밤, 바다 위. 아버지는 태어날 딸의 이름을 무전에 실어 보냈다. 서윤은 열두 살 생일에 처음으로 이 기억을 보았고, 그날부터 물건의 말을 듣게 되었다.'},
 {y:'1989년 8월 · 등명실',t:'제7장 점등',done:'m85done',s:'정우는 13년 걸려 직접 만든 오르골을 은하에게 선물했다. 상자에는 여섯 음뿐. 정우가 아래층에 내려간 사이, 은하는 딸에게만 노래의 끝을 지어 불러 주었다.'},
 {y:'1978년 4월 · 등대 앞마당',t:'제8장 바다 위의 결혼식',done:'m78done',s:'「평생 불을 끄지 않겠다」는 정우와 「기다리는 건 잘하니까 꼭 돌아와」라는 은하. 두 사람은 이 약속을 지키려다 평생 엇갈렸다.'},
 {y:'1976년 여름 · 해변',t:'제9장 기다리는 노래',done:'phase1',s:'아버지를 바다에서 잃은 은하가 미완성 노래를 불렀고, 새로 온 등대지기가 「이제 불은 꺼지지 않는다」고 약속했다. 모든 것이 시작된 날.'},
];
const NEXT_OBJ={m25:'창가 탁자 위 오르골',m19:'선반 위 오르골',m08:'정류장 벤치',m98:'병실 문',mstorm:'계단 해치',m85:'창가 탁자 위 오르골',m78:'바닷가의 조개',mboat:''};
function defGoal(){
  if(!S||!S.frags)return '';const n=S.frags.filter(f=>F[f]).length;
  if(n<S.frags.length)return `빛나는 「기억의 조각」을 조사하자 (${n}/${S.frags.length})`;
  const o=NEXT_OBJ[sceneName];return o?`빛나는 ${o}을(를) 조사해 다음 기억으로`:'';
}
SC.present.goal=()=>{
  if(F.after)return '빛나는 오르골에 다시 손을 대자';
  if(!F.phase1)return F.introDone?'집을 둘러보고, 빛나는 오르골을 조사하자':'';
  if(F.fixed||F.broken)return '';
  if(!F.key)return '오르골을 다시 살펴보자';
  if(!F.drawer)return '작업실(오른쪽 방) 책상 서랍을 열자';
  return '책상에서 오르골 원통에 핀을 꽂자 — 오른쪽 위 ♪ 가 들은 순서';
};

/* =========================================================
   막간 — 기억과 기억 사이, 현재로 돌아와 숨을 고른다
   ========================================================= */
const INTER_T={1:'빈 상자',2:'무전',3:'사진 한 장'};
const deeperI=async(n,yes,next,card)=>{const c=await choose([yes,'조금 더 둘러본다']);if(c!==0)return;
  F.after={n,next,card};await goScene('present',chap('막 간',INTER_T[n],'2026년 11월 13일','다시, 한정우의 집'));};
async function continueAfter(){const a=F.after;if(!a)return;F.after=null;await goScene(a.next,a.card);}
const INTER={
 async 1(){
  letterbox(true);await wait(500);
  await say('서윤','(…하아. 돌아왔다.)','closed');
  await say('서윤','(남의 기억에 너무 오래 있으면, 내가 누군지 흐려진다. 그래서 중간중간 꼭 돌아와 숨을 고른다.)');
  await say('서윤','(지금까지 본 것 — 요양원에서 열다섯 살 딸을 기다리던 노인. 그리고 7년 전, 부치지 않은 편지.)');
  await say('서윤','(오르골은 가장 최근의 기억부터 보여 준다. 끝에서부터 처음으로. 그러니 이 이야기의 「처음」은 아직 한참 아래에 있다.)');
  await nar('책상 위에 만년필 한 자루가 놓여 있다. 기억 속에서 그가 편지를 쓰던 바로 그 펜.');
  const c=await choose(['「남김」 상자에 넣는다','「처분」 상자에 넣는다']);F.pen=c===0;
  await say('서윤',c===0?'(의뢰인은 「전부」라고 했지만… 이건 아직 아니야.)':'(…원칙대로. 그런데 손이 잘 안 떨어진다.)');
  hideDialog();SFX.ring();emote(P,'!');await wait(1400);
  await say('미래','…저예요. 한미래.');
  await say('서윤','네, 미래 씨.');
  await say('미래','혹시… 벌써 다 버리셨어요?','sad');
  await say('서윤','아직요. 하나씩 보고 있어요.');
  await say('미래','……사진 같은 건, 버리기 전에 한 번만—');
  await say('미래','아니에요. 됐어요. 버려 주세요.','closed');
  await nar('— 뚝.');
  await say('서윤','(방금, 망설였다. 「전부」라던 사람이.)','sad');
  await say('서윤','(그녀가 왜 아버지를 그렇게 미워하는지, 나는 아직 모른다. …다음 기억으로 가자.)');
  letterbox(false);
 },
 async 2(){
  letterbox(true);await wait(500);
  await say('서윤','(……)','cry');
  await say('서윤','(아빠. 아빠가 해마다 말하던 「그 밤의 등대지기」가, 이 사람이었어.)','cry');
  await nar('— 치직. 책상 옆 무전기가 깨어났다.');
  await nar('「…등불리, 등불리. 여기는 해진호. 올해도 11월 13일입니다, 어르신. …이상.」');
  await say('서윤','(…아빠 목소리.)','sad');
  const c=await choose(['송신 버튼을 누른다','듣기만 한다']);
  if(c===0){F.dadTalk=true;
    await say('서윤','…해진호, 여기는 등불리.');
    await nar('잡음. 그리고 긴 침묵.');
    await say('태오','……윤이냐?','surp');
    await say('서윤','응. 나야, 아빠.');
    await say('태오','네가 왜 거기 있어. 어르신 댁에.');
    await say('서윤','유품정리. 내가 맡겠다고 했어. 아빠한테는 말 안 했고.','sad');
    await say('태오','……그랬구나.');
    await say('태오','장례식 날 따님께 인사를 드렸는데, 얼굴도 안 보시더라. 당연하지. 그 밤, 우리가 그분을 빼앗아 간 거니까.','sad');
    await say('서윤','아빠. 그분 기억을 봤어. 그 밤도. 아빠 목소리도 들었어.','cry');
    await say('태오','…스물여덟 해 동안 해마다 불렀다. 대답이 한 번도 안 오는 날에도.','cry');
    await say('태오','윤아. 그 노래, 고쳐 드려라. 아빠 몫까지.');
    await say('서윤','응. 그러려고 왔어.','smile');egg('radio','스물여덟 번째 11월 13일');}
  else await say('서윤','(…아직은, 무슨 말을 해야 할지 모르겠다.)','closed');
  await nar('서윤은 가방에 매단 낡은 호루라기를 쥐었다.');
  await say('서윤','(아빠가 그 밤 목에 걸고 있던 구명 호루라기. 열두 살 생일에 받은 뒤로 한 번도 뺀 적이 없다.)');
  await say('서윤','(이 호루라기도 그 밤을 기억한다. 등대가 아니라 — 바다 쪽에서 본 그 밤을.)');
  await say('서윤','(처음으로, 내 이야기를 보러 가자.)','closed');
  letterbox(false);
 },
 async 3(){
  letterbox(true);await wait(500);
  await say('서윤','(…결혼식. 웃음소리가 아직 귀에 남아 있다.)','smile');
  hideDialog();SFX.chime();await wait(500);
  await nar('휴대폰이 짧게 울린다. 문자 한 통.');
  await nar('「한미래 : 그 집 거실 창문에서 등대가 보이죠. 사진 한 장만 보내 주실 수 있어요?」');
  await say('서윤','(……!)','surp');
  hideDialog();await cam(160,28,2,900);
  if(A.C)noiseBurst(A.C.currentTime,.12,4000,'highpass',.4);$('fader').style.background='#fff';await setOp($('fader'),.9,80);await setOp($('fader'),0,500);
  await nar('찰칵. 비에 젖은 창 너머, 아직 돌고 있는 불빛.');
  await nar('「한미래 : …고마워요. 아직 켜져 있네요.」');
  cam(null,0,1,900);
  await say('서윤','(움직이고 있다. 아주 조금씩.)','smile');
  await say('서윤','(이제 마지막 기억이다. 이 노래가 처음 태어난 날.)');
  letterbox(false);
 },
};
