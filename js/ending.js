'use strict';
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
  if(!META.ends.includes(n))META.ends.push(n);META.cleared=true;F.ended=true;saveMeta();store.del('lhmb_save');
  const d=ENDS[n],ec=$('endcard');$('endTag').textContent=`${d.tag} · ${n}/5`;$('endTitle').textContent=d.title;$('endDesc').textContent=d.desc;
  $('endProg').textContent=`본 엔딩 ${META.ends.length}/5 · 이스터에그 ${META.eggs.length}/7 · 이번 회차: 미래의 조각 ${F.keeps.length}/6, 소금이 ${F.cats.length}/5`;
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
  await say('미래','…문이 열려 있어서요.','sad');
  await say('서윤','한미래 씨…!','surp');
  await say('미래','그 노래. 전화로 들은 그 여섯 음.');
  await say('미래','오다가 돌아가려고 했어요. 세 번이나.');
  await say('미래','그런데 해안도로에서 등대 불빛이 보이더라고요. 아직도 돌고 있어서. 바보같이, 그걸 따라 여기까지 와 버렸어요.','sad');
  await say('서윤','이거… 책상 서랍에 있었어요.');
  await say('서윤','「전부」에 넣을 수가 없어서요.');
  hideDialog();await walk(mr,[[14,5],[14,4]],2);mr.dir='right';await cam(250,60,1.6,1200);
  SFX.page();await nar('서윤은 편지 뭉치를 건넸다. 미래는 한참을 망설이다가, 맨 위의 봉투를 열었다.');
  hideDialog();await wait(1600);emote(mr,'…');
  await say('미래','…해진호.');
  await say('미래','장례식에 모르는 아저씨가 와서, 아빠 사진 앞에서 한참을 울었어요. 그날 밤 아빠 덕에 살았다고.');
  await say('미래','저는 그 사람 얼굴도 안 봤어요.');
  await say('미래','……처음 여섯 음밖에 모른다고 썼네, 이 사람.');
  await say('미래','물어보기만 했으면 됐잖아. 나한테.','cry');
  // 반전 1: 요양원
  await say('서윤','…작년 여름에, 요양원에 가셨었죠.');
  emote(mr,'!');await say('미래','……어떻게 아세요.','surp');
  await say('미래','갔었어요. 딱 한 번. 12분.');
  await say('미래','저를 못 알아보더라고요. 열다섯 살 미래를 찾더라고요. 머리를 하나로 묶은.','cry');
  await say('미래','그래서 「할 얘기가 없다」고 한 거예요. 그 사람이 기다리는 미래는… 제가 아니니까.');
  await say('서윤','아니요.');
  await say('서윤','그분 방 달력, 10월의 서른한 칸에 전부 미래 씨 이름이 적혀 있었어요.');
  await say('서윤','매일 오후 다섯 시면 창가에 앉아서, 불 켰냐고 물으셨대요. 다들 돌아오게.');
  await say('서윤','열다섯 살이든 마흔세 살이든 — 그분이 기다린 건, 처음부터 끝까지 미래 씨 한 사람이었어요.');
  hideDialog();await wait(900);
  // 반전 2: 미래의 편지
  await nar('미래가 가방 안쪽에서 무언가를 꺼냈다. 모서리가 닳은 흰 봉투.');
  await say('미래','…저도 하나 있어요. 부치지 못한 거.');
  await nar('봉투에는 「아빠에게 · 2008. 5. 17.」');
  await cutin('mrAdult','cry','결혼식 날 밤에 쓴 편지. 열여덟 해 동안, 가방 안쪽에.',3600);
  SFX.page();
  await nar('「아빠. 오늘 왔지. 가로등 밑에. 다 봤어.」');
  await nar('「나가면 울 것 같아서 못 나갔어. 신부 화장 지워지면 안 되잖아.」');
  await nar('「다음엔 들어와. 엄마 노래 끝, 나 알아. 들려줄게.」');
  await say('미래','…다음이 없을 줄은 몰랐어요.','cry');
  await say('서윤','(스무 걸음. 두 사람은 같은 밤, 같은 문을 사이에 두고 똑같이 편지를 썼다.)','sad');
  if(trueEnd){
    await say('서윤','그리고… 이것도요. 서랍 가장 안쪽에 있었어요.');
    await nar('녹슨 양철 상자. 미래가 뚜껑을 연다.');
    await say('미래','…이 사진. 이 붓. 내 거야. 여섯 살 때, 등대 칠한다고.','surp');
    await say('미래','이 그림도. 이 카드도… 조개 목걸이, 잃어버린 줄 알았는데.');
    await nar('그리고 맨 밑의 흰 봉투. 이름 칸이 비어 있는 축의금 봉투.');
    emote(mr,'!');await say('미래','……이거.');
    await say('미래','화환 밑에 누가 이름도 없이 놓고 갔다고, 접수 보던 친구가 그랬어요. 삼십만 원. 만 원짜리로만.');
    await say('미래','…왔었구나. 아빠, 왔었구나. 다 갖고 있었구나.','cry');
    hideDialog();await wait(1500);
  }
  // 반전 3: 서윤
  await say('서윤','미래 씨. 저도 말씀드릴 게 있어요.');
  await say('서윤','제가 이 일을 맡은 건, 우연이 아니에요.','closed');
  await say('서윤','해진호 통신사 서태오 — 제 아버지예요.');
  emote(mr,'!');await say('미래','…….','surp');
  await say('서윤','저는 그 밤으로부터 한 달 뒤에 태어났어요.');
  await say('서윤','장례식에서 울던 사람, 저희 아빠예요. …그 불빛이 없었다면, 저는 여기 없어요.','cry');
  await say('서윤','죄송합니다. 그 밤, 미래 씨에게서 아버지를 빼앗아 간 사람의 딸이라서.','sad');
  hideDialog();await wait(1400);
  await say('미래','……');
  await say('미래','엄마가 그랬어요. 그 밤에.','sad');
  await say('미래','「아빠 미워하지 마. 불빛을 지키는 사람이라 좋았어.」','cry');
  await say('미래','이제야 알겠네. 엄마가 뭘 기다렸는지.');
  await say('미래','…태어나 줘서 고마워요. 아빠 대신, 그 말 하고 싶었을 거예요. 그 사람.','smile');
  // 무전
  hideDialog();SFX.dial();await wait(900);
  await nar('— 치직. 책상 옆 무전기가 깨어났다.');
  await say('태오','…등불리, 등불리. 여기는 해진호. 올해도 11월 13일입니다. …이상.');
  await nar('미래가 천천히 무전기 앞으로 걸어갔다. 송신 버튼 위에서 손가락이 오래 머문다.');
  await say('미래','……해진호, 여기는 등불리.');
  await say('미래','한정우의 딸, 한미래입니다. 수신… 양호합니다.','cry');
  await nar('긴 잡음. 그리고, 늙은 선장의 울음소리.');
  await say('태오','…따님이세요……. 고맙습니다. 고맙습니다…….','cry');
  await say('미래','내년에도 불러 주세요. 이제는 제가 대답할게요.','smile');
  hideDialog();await wait(800);
  // 노래의 끝
  await nar('미래가 오르골 앞으로 다가와 태엽을 다시 감았다.');
  await nar('그리고 여섯 번째 음이 사라지는 자리에서, 조용히 노래를 이어 불렀다.');
  hideDialog();playBgm(null);await wait(800);
  await boxPlay(MOTIF,72,{duckIt:false,who:ent('desk')});
  await playSeq(CONT,72,(m,t,d)=>{voice(m-12,t,d*.95,.2);mbox(m,t,.08);INST.cello(m-24,t,d,.04,A.sfx);},{duckIt:false,onNote:()=>noteFx(mr)});
  await say('미래','엄마가 저 재울 때마다 끝까지 불러 줬어요. 아빠가 등대에 있던 밤마다.','smile');
  await cutin('ehMid','smile','「끝은… 이제 알 것 같아. 조금만 더 기다려 봐.」',3400);
  await say('서윤','(은하 씨는 끝을 붙였구나. 기다리던 것이 돌아오면 붙이겠다던, 그 끝을.)','cry');
  await say('서윤','(매일 밤 아빠를 기다리던 아이에게. — 언젠가 그 아이가, 아빠에게 들려주라고.)','cry');
  playBgm('end');
  if(trueEnd){
    await say('서윤','…끝까지, 한 번만 더 불러 주실래요? 원통에 받아 적을게요. 핀이 아직 남았거든요.','smile');
    hideDialog();
    await playSeq(CONT,80,(m,t)=>mbox(m,t,.2),{duckIt:false,onNote:()=>{noteFx(ent('desk'));sparkFx(ent('desk').fx*16+20,ent('desk').fy*16,3);}});
    await nar('원통의 빈자리에 아홉 개의 음이 더 꽂혔다. 정우 씨가 스물여덟 해 동안 찾던 음들이다.');
  }
  await say('미래','…이 오르골, 제가 가져가도 될까요?');
  await say('서윤','처음부터 전부, 미래 씨 거였어요.','smile');
  if(ent('follow')){SFX.meow();emote(ent('follow'),'♥');await nar('— 야옹. 소금이 5세가 미래의 발등에 올라앉았다. 이 녀석도 「전부」에 포함인 모양이다.');}
  hideDialog();await fadeBlack();setAmb('waves');
  const cat=F.cats.length>=5;
  if(trueEnd){
    await toVista({mode:'dawn',sun:true,sunX:230,beam:true,bench:true,gulls:true,boat:true,figs:[{x:446,h:30,sit:true,hair:15},{x:466,h:19,sit:true,hair:6,cat},{x:494,h:31}]});
    await cardLines(['미래는 스물한 통의 편지에 스물한 통의 답장을 썼다. 부칠 곳은 없었지만, 전부 우표를 붙였다.','그해 겨울, 해진호가 등불리 항구에 들어왔다. 늙은 선장은 등대 앞에서 오래 모자를 벗고 서 있었다.','다음 해 봄, 등대 앞에 작은 벤치가 하나 놓였다.','여름이면 미래는 딸 하늘이를 데리고 그 벤치에 앉는다. 가끔은 서윤도 함께.',
      '「엄마, 이 노래 끝은 누가 만들었어?」','「외할머니가. 외할아버지가 등대에서 내려오길 기다리면서.」','「그럼 외할아버지는 들었어?」','「…응. 이제는 매일 들으셔.」','오르골은 이제 열다섯 개의 음을 노래한다. 처음부터, 끝까지.',GOLD('「불빛이 있으면, 돌아올 수 있어.」')],true,2600);
    await rollCredits();finish(1);
  }else{
    await toVista({mode:'dawn',sun:true,sunX:230,beam:true,bench:true,gulls:true,figs:[{x:460,h:30,sit:true,hair:15,cat}]});
    await cardLines(['그해 겨울, 해진호가 등불리 항구에 들어왔다.','다음 해 봄, 등불리 등대 앞에 작은 벤치가 하나 놓였다.','미래는 가끔 그 벤치에 앉아, 여섯 음짜리 오르골에 맞춰 나머지를 부른다.','아버지가 끝내 모았던 것들이 어딘가 더 있었을지도 모른다고, 그녀는 가끔 생각한다.',GOLD('「불빛이 있으면, 돌아올 수 있어.」')],true,2600);
    await rollCredits();finish(2);
  }
  await wait(1500);
  await playSeq([...MOTIF,...CONT],70,(m,t)=>mbox(m,t,.18),{duckIt:false});
}
async function rollCredits(){
  playBgm('credits');
  await credits(['<b>등대지기의 오르골</b>','','','<b>등장인물</b>','서윤 — 유품정리사','한정우 — 등불리 등대지기 (1953–2026)','윤은하 — 기다리는 노래를 만든 사람 (1957–1998)','한미래 — 끝을 아는 사람','서태오 — 해진호 통신사','박순례 · 김 선장 · 302호 간호사','소금이 1세 ~ 5세','','',
    '<b>이야기 · 그림 · 음악</b>','모든 그림은 코드로 그린 픽셀 아트','모든 음악은 실시간 합성 — 피아노 · 첼로 · 바이올린 · 플루트 · 하프','낭독은 기기 내장 음성','','','<b>테마</b>','「기다리는 노래」','미 · 솔 · 라 · 솔 · 미 · 레','도 · 레 · 미 · 솔 · 라 · 솔 · 미 · 레 · 도','','','',
    '기다리는 사람에게,','그리고 불을 켜 주는 사람에게.','','','','<b>끝까지 들어 주셔서 고맙습니다</b>'],30000);
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
  const anySlot=['s1','s2','s3'].some(k=>store.get('lhmb_slot_'+k,null));
  const openLoad=async()=>{menu=null;const pick=await openSaves('load');if(pick)startGame('cont',pick);else buildMenu();};
  if(anySlot)items.splice(sv&&SC[sv.scene]?1:0,0,['불러오기',openLoad]);
  if(META.cleared)items.push(['기억을 모두 본 뒤부터 (엔딩 수집)',()=>startGame('after')]);
  let sel=0;
  const render=()=>[...el.children].forEach((c,i)=>c.classList.toggle('sel',i===sel));
  items.forEach(([t,fn],i)=>{const d=document.createElement('div');d.className='mi';d.textContent=t;d.onclick=()=>{audioInit();sel=i;menu=null;fn();};d.onmouseenter=()=>{sel=i;render();};el.appendChild(d);});
  menu={openLoad,move(d){sel=(sel+d+items.length)%items.length;render();SFX.blip();},pick(){const f=items[sel][1];menu=null;f();}};render();
  $('gallery').innerHTML=META.ends.length||META.eggs.length?`엔딩 ${[1,2,3,4,5].map(n=>META.ends.includes(n)?`<b style="color:#f2c46d">${ENDS[n].title}</b>`:'???').join(' · ')}<br>이스터에그 ${META.eggs.length}/7`:'';
}
let titleTaps=0;
$('titleH').onclick=()=>{if(++titleTaps%7===0){F.catMode=!F.catMode;audioInit();SFX.meow();toast(F.catMode?'🐱 소금이 모드 ON':'소금이 모드 OFF');META.eggs.includes('konami')||egg('konami','소금이 모드');}};
async function startGame(mode,sv){
  if(started)return;started=true;audioInit();const cm=F.catMode;
  const t=$('title');t.style.transition='opacity 1.2s';t.style.opacity=0;setTimeout(()=>t.classList.add('hidden'),1200);
  locked=true;
  if(mode==='cont'){resetF(sv.F);F.catMode=cm;await cardShow('<p>이어서…</p>',800);loadScene(sv.scene);
    if(sv.pos){const [x,y,d]=sv.pos;if(!solidAt(x,y))Object.assign(P,{x,y,fx:x,fy:y,tx:x,ty:y,dir:d||'down'});}
    await wait(600);await cardHide(1000);if(S.title)toast(S.title);locked=false;if(S.enter)await run(S.enter);return;}
  if(mode==='after'){const b=META.best||{};resetF({introDone:true,phase1:true,stdone:true,notes:PZ_ANS.slice(),keeps:(b.keeps||[]).slice(),cats:(b.cats||[]).slice(),catMode:cm});
    await goScene('present','<h1>에필로그</h1><p>기억에서 돌아온 뒤, 한정우의 집</p>',{white:false,hold:1800});return;}
  resetF({catMode:cm});store.del('lhmb_save');
  await opening();
  await goScene('present',chap('프 롤 로 그','빈집의 비','2026년 11월 13일','해안 마을 등불리'),{white:false,hold:2600});
}
// 오프닝 시네마틱: 폭풍의 밤 → 불빛 → 제목
async function opening(){
  await wait(500);
  S=Object.assign({},SC.title,{vista:{mode:'storm',boat:true,rain:true,beam:false}});ents=[];P.hidden=true;playBgm('storm');setAmb('storm');
  await setOp($('title'),0,10);LB.t=1;
  await cardLines(['1998년 11월 13일 새벽.','등불리 앞바다.','배 한 척이 길을 잃었다. 등대의 불은 꺼져 있었다.'],true,1800);
  flash=1;SFX.thunder();shake(600,3);await wait(800);
  S.vista={mode:'storm',boat:true,rain:true,beam:true};SFX.chime();
  await cardLines(['— 그리고, 불이 켜졌다.','일곱 명이 집으로 돌아왔다.','한 사람은, 돌아가야 할 곳에 끝내 닿지 못했다.'],true,1800);
  playBgm('title');setAmb('rain');
  S.vista={mode:'night',moon:true,beam:true,house:true,rain:false};
  await cardShow('<p>사람이 떠나도, 물건은 남는다.</p>',1600,true);await wait(2600);
  await cardShow('<p>사람이 떠나도, 물건은 남는다.</p><p>그리고 오래 사랑받은 물건은 — 가끔, 기억을 한다.</p>',10,true);await wait(4000);
  await cardShow('<h1 style="letter-spacing:.3em">등대지기의 오르골</h1>',1400,true);await wait(3200);
  await setOp($('card'),0,900);$('card').classList.remove('clear');LB.t=0;
}
// 개발용 바로가기: #m19 #m08 #m98 #m85 #m76 #p1 #p1t
function debugJump(){
  const h=location.hash.slice(1);if(!h)return false;
  const go=()=>{started=true;menu=null;$('title').classList.add('hidden');};
  if(h==='p1'||h==='p1t'){go();resetF({introDone:true,phase1:true,notes:PZ_ANS.slice(),keeps:h==='p1t'?['photo','brush','env','card','draw','shell']:[],stdone:true,cats:h==='p1t'?['c19','c08','c98','c85','c76']:[]});loadScene('present');locked=false;return true;}
  if(SC[h]&&h!=='title'){go();resetF({introDone:true});loadScene(h);locked=false;return true;}
  return false;
}
syncOpts();layout();
if(!debugJump()){loadScene('title');buildMenu();}
requestAnimationFrame(frame);
if('serviceWorker' in navigator&&location.protocol==='https:'&&window.top===window){navigator.serviceWorker.register('sw.js').catch(()=>{});}
