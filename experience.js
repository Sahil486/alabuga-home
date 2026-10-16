/* Optional learning modes. The published rules remain the source of every card. */
(()=>{
 'use strict';
 const data=window.HOSTEL_DATA;
 const dialog=document.getElementById('xp-dialog');
 if(!data||!dialog)return;
 const body=document.getElementById('xp-mode-body');
 const title=document.getElementById('xp-dialog-title');
 const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const STORE='alabuga-learning-v1';
 const QUIZ_URL='https://alabuga-home.ru/#quest';
 const QR_MATRIX=[[1,1,1,1,1,1,1,0,0,1,0,0,1,1,1,1,0,0,0,1,1,0,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,1,0,1,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,0,0,0,1,1,1,1,1,1,0,1,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,1,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,1,1,0,0,0,0,0,0,0,0],[1,0,1,1,1,1,1,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1,0,0],[1,1,1,0,0,0,0,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,0,0,0,1],[0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0],[1,0,1,1,0,1,0,1,0,0,1,1,1,1,0,1,0,0,0,0,1,0,0,0,1,1,0,1,0],[1,1,0,0,0,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,0,0,0,0,0,1,1,0,0],[1,0,1,1,0,0,0,1,0,1,0,1,0,0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,1],[0,1,0,1,1,0,1,0,0,1,1,1,1,0,0,0,0,0,1,0,1,0,0,1,1,1,1,0,0],[1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,1,0],[0,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,1,1,0,1,0,0,0,0,0,1,1,0,0],[1,0,0,1,1,1,0,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,1,0,1],[1,0,1,0,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,1,1,0,0,1,0,1,0,0],[1,0,1,0,1,1,0,0,1,0,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,0,0,1,0],[1,0,0,0,0,0,1,0,1,0,1,1,0,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1],[0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,1,1,0,1,0,1,0,0,0,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,1,0,1,0,0,0,0,0,0,1,1,0,1,0,1,1,1,0,0],[1,0,0,0,0,0,1,0,1,1,1,0,0,0,1,0,1,0,0,1,1,0,0,0,1,0,0,1,1],[1,0,1,1,1,0,1,0,1,1,1,0,0,0,0,0,0,1,0,0,1,1,1,1,1,0,1,0,1],[1,0,1,1,1,0,1,0,1,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,1,1,0,0],[1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0],[1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,1,0,1,0],[1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,0,0,0,1,0,1,0,0]];
 let saved={known:[],later:[],index:0,best:0,last:null};
 try{const value=JSON.parse(localStorage.getItem(STORE)||'null');if(value&&typeof value==='object')saved={...saved,...value};}catch{}
 const valid=new Set(data.rules.map(rule=>rule.number));
 let known=new Set((Array.isArray(saved.known)?saved.known:[]).filter(n=>valid.has(n)));
 let later=new Set((Array.isArray(saved.later)?saved.later:[]).filter(n=>valid.has(n)&&!known.has(n)));
 let studyIndex=Number.isInteger(saved.index)&&saved.index>=0&&saved.index<data.rules.length?saved.index:0;
 let best=Number.isInteger(saved.best)&&saved.best>=0&&saved.best<=5?saved.best:0;
 let last=Number.isInteger(saved.last)&&saved.last>=0&&saved.last<=5?saved.last:null;
 let mode='',returnHash='#rules',returnFocus=null,busy=false,swapToken=0,swapAnimation=null,studyLater=false,quiz=null,themeTimer=0;
 const source=(number)=>data.faq.find(q=>q.number===number);
 const scenarios=[
  {faq:1,title:'Задерживаешься на работе. Скоро 23:00, а вернуться вовремя не получается.',question:'Как поступишь?',choices:['Заранее подготовлю СЗ и согласую её с сотрудником ССП.','Вернусь без согласования — работа же.','Расскажу об опоздании после возвращения.'],correct:0,explanation:'Подготовь СЗ с уважительной причиной опоздания и заранее согласуй её с сотрудником ССП.'},
  {faq:3,title:'Нашёл в квартире никотиносодержащую продукцию.',question:'Что сделаешь?',choices:['Выброшу и никому не скажу.','Зафиксирую и сообщу администрации или HR.','Оставлю всё как есть и подожду.'],correct:1,explanation:'Зафиксируй на фото или видео и сразу сообщи администрации или HR. Не скрывай и не выбрасывай найденное.'},
  {faq:5,title:'Выходишь из квартиры буквально на пару минут.',question:'Что с дверью?',choices:['Оставлю приоткрытой, ведь я ненадолго.','Подопру, чтобы удобнее вернуться.','Закрою, даже если ухожу ненадолго.'],correct:2,explanation:'Закрывай дверь даже при недолгом выходе: так посторонние не смогут войти в квартиру.'},
  {faq:6,title:'Уже после 23:00. Друзья зовут в гости в другую квартиру.',question:'Как поступишь?',choices:['Останусь в своей квартире, встречу перенесём.','Зайду на пять минут.','Пойду, если соседи не против.'],correct:0,explanation:'После 23:00 не покидай свою квартиру и не находись в гостях. Возвращение и перемещения лучше планировать заранее.'},
  {faq:7,title:'В кабинете 202 попросили повторно написать объяснительную по тому же случаю.',question:'Теперь нарушений два?',choices:['Да, каждая объяснительная — новое нарушение.','Нет, в учёте по этому случаю остаётся одно нарушение.','Нет, первое нарушение автоматически отменяется.'],correct:1,explanation:'Повторная объяснительная в кабинете 202 по тому же случаю не увеличивает количество нарушений. Меру порицания применяют сотрудники HR корпоративного развития.'}
 ];
 const shuffle=items=>{const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
 function persist(){
  try{localStorage.setItem(STORE,JSON.stringify({known:[...known],later:[...later],index:studyIndex,best,last}));}catch{}
  updateHub();
 }
 function updateHub(){
  document.getElementById('xp-known-count').textContent=known.size+' из 27 изучено';
  document.getElementById('xp-study-ring').style.setProperty('--known-fraction',known.size/data.rules.length);
  document.getElementById('xp-quest-meta').textContent=last===null?'5 ситуаций · около минуты':'Твой результат: '+last+'/5 · ещё раз?';
 }
 function focusPanel(){
  const heading=body.querySelector('[data-panel-heading]');
  if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
 }
 function draw(render,animate=false,direction=1){
  if(busy)return;
  const previous=body.querySelector('.xp-mode-panel');
  const token=++swapToken;
  if(!animate||!previous||reduced.matches||typeof previous.animate!=='function'){
   swapAnimation?.cancel();render();focusPanel();return;
  }
  busy=true;body.setAttribute('aria-busy','true');swapAnimation?.cancel();
  swapAnimation=previous.animate([{opacity:1,transform:'perspective(1000px) rotateY(0deg)'},{opacity:0,transform:'perspective(1000px) rotateY('+(-direction*9)+'deg)'}],{duration:130,easing:'ease-in',fill:'both'});
  swapAnimation.finished.then(()=>{
   if(token!==swapToken||!dialog.open)return;
   swapAnimation.cancel();render();busy=false;body.removeAttribute('aria-busy');focusPanel();
   const incoming=body.querySelector('.xp-mode-panel');
   if(incoming&&!reduced.matches)swapAnimation=incoming.animate([{opacity:0,transform:'perspective(1000px) rotateY('+(direction*9)+'deg) translateY(4px)'},{opacity:1,transform:'perspective(1000px) rotateY(0deg) translateY(0)'}],{duration:250,easing:'cubic-bezier(.22,1,.36,1)'});
  }).catch(()=>{});
 }
 function openExperience(next,changeUrl=true){
  if(!['quest','learn'].includes(next))return;
  if(dialog.open&&mode===next)return;
  if(!dialog.open){returnHash=['#quest','#learn'].includes(location.hash)?'#rules':(location.hash||'#rules');returnFocus=document.activeElement;dialog.showModal();document.body.classList.add('xp-modal-open');}
  ++swapToken;busy=false;body.removeAttribute('aria-busy');swapAnimation?.cancel();mode=next;
  if(changeUrl&&location.hash!=='#'+next)history.pushState({experience:next},'','#'+next);
  title.textContent=next==='quest'?'Разрули ситуацию':'27 из 27';
  if(next==='quest'){
   quiz={questions:shuffle(scenarios).map(q=>({...q,options:shuffle(q.choices.map((text,index)=>({text,correct:index===q.correct})))})),index:0,score:0,answered:false,selected:null,complete:false};
   renderQuestion();
  }else{studyLater=false;reviewing=false;renderStudy();}
  dialog.scrollTop=0;focusPanel();
 }
 function closeExperience(changeUrl=true){
  ++swapToken;busy=false;body.removeAttribute('aria-busy');swapAnimation?.cancel();
  if(dialog.open)dialog.close();document.body.classList.remove('xp-modal-open');mode='';
  if(changeUrl&&['#quest','#learn'].includes(location.hash))history.replaceState(null,'',returnHash);
  if(returnFocus&&returnFocus.isConnected&&returnFocus!==document.body)returnFocus.focus({preventScroll:true});
 }
 function route(){const hash=location.hash.slice(1);if(['quest','learn'].includes(hash))openExperience(hash,false);else if(dialog.open)closeExperience(false);}
 function progressMarkup(index){return '<div class="xp-mode-meta"><span>Ситуация '+(index+1)+' из 5</span><span class="xp-dots" aria-hidden="true">'+Array.from({length:5},(_,i)=>'<i'+(i<=index?' class="is-done"':'')+'></i>').join('')+'</span></div>';}
 function renderQuestion(){
  const q=quiz.questions[quiz.index];quiz.answered=false;quiz.selected=null;
  body.innerHTML='<section class="xp-mode-panel">'+progressMarkup(quiz.index)+'<h3 data-panel-heading>'+esc(q.title)+'</h3><p class="xp-lead">'+esc(q.question)+'</p><div class="xp-choice-list">'+q.options.map((answer,i)=>'<button type="button" class="xp-choice" data-quest-answer="'+i+'"><span class="xp-choice-letter" aria-hidden="true">'+['А','Б','В'][i]+'</span><span>'+esc(answer.text)+'</span></button>').join('')+'</div></section>';
 }
 function answerQuestion(index){
  if(busy||!quiz||quiz.answered||quiz.complete)return;
  const q=quiz.questions[quiz.index];if(!q.options[index])return;
  quiz.answered=true;quiz.selected=index;if(q.options[index].correct)quiz.score++;
  body.querySelectorAll('[data-quest-answer]').forEach(button=>button.disabled=true);
  draw(renderFeedback,true);
 }
 function renderFeedback(){
  const q=quiz.questions[quiz.index],correct=q.options[quiz.selected].correct;
  body.innerHTML='<section class="xp-mode-panel">'+progressMarkup(quiz.index)+'<div class="xp-feedback-mark'+(correct?'':' is-review')+'" aria-hidden="true">'+(correct?'✓':'↗')+'</div><h3 data-panel-heading>'+(correct?'Верно, так и стоит поступить.':'Давай разберёмся.')+'</h3><div class="xp-answer">'+esc(q.explanation)+'</div><a href="#faq-'+q.faq+'" class="xp-source" data-open-source="faq-'+q.faq+'">Подробнее: '+esc(source(q.faq).title)+' <span aria-hidden="true">↗</span></a><div class="xp-actions"><button type="button" class="xp-btn xp-btn--primary" data-quest-next>'+(quiz.index===4?'Посмотреть результат':'Следующая ситуация')+' <span aria-hidden="true">→</span></button></div></section>';
 }
 function resultTitle(score){return score===5?'Идеальный сосед':score===4?'Почти эксперт':score===3?'Хороший старт':'Разбираемся вместе';}
 function qrSvg(){
  const n=QR_MATRIX.length;let path='';QR_MATRIX.forEach((row,y)=>row.forEach((cell,x)=>{if(cell)path+='M'+(x+4)+' '+(y+4)+'h1v1h-1z';}));
  return '<svg class="xp-qr" viewBox="0 0 '+(n+8)+' '+(n+8)+'" role="img" aria-label="QR-код: пройти мини-квест" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="white"/><path d="'+path+'" fill="#0b2881"/></svg>';
 }
 function renderResult(){
  quiz.complete=true;last=quiz.score;best=Math.max(best,last);persist();
  body.innerHTML='<section class="xp-mode-panel"><div class="xp-result"><div class="xp-confetti" aria-hidden="true">'+Array.from({length:7},(_,i)=>'<i style="--piece:'+i+'"></i>').join('')+'</div><span class="xp-result-kicker">Проверка себя · 5 ситуаций</span><div class="xp-result-score">'+quiz.score+'<span> / 5</span></div><h3 data-panel-heading>'+resultTitle(quiz.score)+'</h3><p>'+(quiz.score===5?'Все пять ситуаций разобраны. Хороший сосед начинается с простых решений.':'Теперь знакомые ситуации станут понятнее. Можно повторить квест или пройти все 27 правил.')+'</p><div class="xp-result-bottom"><span>Алабуга Политех<br>alabuga-home.ru</span>'+qrSvg()+'</div></div><div class="xp-actions"><button type="button" class="xp-btn xp-btn--primary" data-download-result>Скачать PNG <span aria-hidden="true">↓</span></button><button type="button" class="xp-btn" data-restart-quest>Ещё раз</button><button type="button" class="xp-btn xp-btn--quiet" data-switch-mode="learn">Изучить 27 правил →</button></div><p class="xp-status" role="status" id="xp-result-status"></p></section>';
 }
 function nextQuestion(){if(busy||!quiz?.answered)return;if(quiz.index===4)draw(renderResult,true);else{quiz.index++;draw(renderQuestion,true);}}
 const categoryName=id=>data.categories.find(category=>category.id===id)?.label||'';
 function nextStudyIndex(direction=1,onlyUnseen=false){
  for(let step=1;step<=data.rules.length;step++){
   const index=(studyIndex+direction*step+data.rules.length*2)%data.rules.length,n=data.rules[index].number;
   if((!studyLater||later.has(n))&&(!onlyUnseen||!known.has(n)))return index;
  }
  return -1;
 }
 function renderStudy(){
  if(known.size===data.rules.length&&!studyLater&&!reviewing){renderStudyComplete();return;}
  if(studyLater&&!later.size){renderLaterComplete();return;}
  if(studyLater&&!later.has(data.rules[studyIndex].number))studyIndex=data.rules.findIndex(rule=>later.has(rule.number));
  const rule=data.rules[studyIndex];
  body.innerHTML='<section class="xp-mode-panel"><div class="xp-study-top"><span class="xp-study-count">'+known.size+' / 27 изучено</span><button type="button" class="xp-study-filter" data-study-filter aria-pressed="'+studyLater+'">Повторить позже: '+later.size+'</button></div><div class="xp-study-progress" role="progressbar" aria-label="Изученные правила" aria-valuemin="0" aria-valuemax="27" aria-valuenow="'+known.size+'"><span style="width:'+(known.size/27*100)+'%"></span></div><article class="xp-study-card"><div class="xp-study-caption"><span class="xp-study-number">'+String(rule.number).padStart(2,'0')+'</span><span>'+esc(categoryName(rule.category))+'</span>'+(known.has(rule.number)?'<span class="xp-known-tag">✓ Уже изучено</span>':'')+'</div><h3 data-panel-heading>'+esc(rule.title)+'</h3><div class="xp-study-stages">'+rule.stages.map(stage=>'<section class="xp-study-stage"><h4>'+esc(stage.label)+'</h4><ul>'+stage.items.map(item=>'<li>'+esc(item)+'</li>').join('')+'</ul></section>').join('')+'</div></article><div class="xp-actions"><button type="button" class="xp-btn xp-btn--primary" data-study-known>Понятно <span aria-hidden="true">✓</span></button><button type="button" class="xp-btn" data-study-later>Повторить позже</button><a href="#rule-'+rule.number+'" class="xp-btn xp-btn--quiet" data-open-source="rule-'+rule.number+'">Открыть в списке ↗</a></div><div class="xp-study-bottom"><span>Листай свайпом или стрелками</span><div class="xp-study-arrows"><button type="button" data-study-prev aria-label="Предыдущее правило">←</button><button type="button" data-study-next aria-label="Следующее правило">→</button></div></div><details class="xp-study-jump"><summary>Выбрать пункт</summary><div class="xp-study-index">'+data.rules.map((item,i)=>'<button type="button" data-study-jump="'+i+'" aria-label="Пункт '+item.number+(known.has(item.number)?', изучен':'')+'" aria-current="'+(i===studyIndex)+'" class="'+(known.has(item.number)?'is-known':'')+'">'+item.number+'</button>').join('')+'</div></details></section>';
 }
 function renderStudyComplete(){body.innerHTML='<section class="xp-mode-panel"><div class="xp-complete-symbol">27 / 27</div><h3 data-panel-heading>Все пункты изучены.</h3><p class="xp-lead">Прогресс сохранён. Можно проверить себя на пяти ситуациях или вернуться к любому правилу.</p><div class="xp-actions"><button type="button" class="xp-btn xp-btn--primary" data-switch-mode="quest">Разрули ситуацию →</button><button type="button" class="xp-btn" data-study-review>Посмотреть правила</button><button type="button" class="xp-btn xp-btn--quiet" data-study-reset>Начать заново</button></div></section>';}
 function renderLaterComplete(){body.innerHTML='<section class="xp-mode-panel"><div class="xp-feedback-mark" aria-hidden="true">✓</div><h3 data-panel-heading>Здесь пока пусто.</h3><p class="xp-lead">В отложенных остаются только пункты, к которым ты решил вернуться. Всё уже повторено или ещё не отложено.</p><div class="xp-actions"><button type="button" class="xp-btn xp-btn--primary" data-study-all>Ко всем правилам →</button></div></section>';}
 let reviewing=false;
 function renderStudyView(){renderStudy();}
 function moveStudy(direction){if(busy)return;const index=nextStudyIndex(direction);if(index<0)return;studyIndex=index;persist();draw(renderStudyView,true,direction);}
 function markStudy(postpone){
  if(busy)return;const n=data.rules[studyIndex].number;
  if(postpone){known.delete(n);later.add(n);}else{known.add(n);later.delete(n);}
  reviewing=false;const next=nextStudyIndex(1,!postpone);if(next>=0)studyIndex=next;persist();draw(renderStudy,true);
 }
 let swipe=null;
 body.addEventListener('pointerdown',event=>{if(mode!=='learn'||event.pointerType!=='touch'||event.target.closest('button,a,summary'))return;swipe={x:event.clientX,y:event.clientY};});
 body.addEventListener('pointerup',event=>{if(!swipe)return;const dx=event.clientX-swipe.x,dy=event.clientY-swipe.y;swipe=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.4)moveStudy(dx<0?1:-1);});
 body.addEventListener('pointercancel',()=>{swipe=null;});
 function roundRect(ctx,x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();}
 function wrapText(ctx,text,x,y,maxWidth,lineHeight){let line='';for(const word of text.split(' ')){const next=line?line+' '+word:word;if(ctx.measureText(next).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineHeight;line=word;}else line=next;}if(line)ctx.fillText(line,x,y);return y+lineHeight;}
 async function downloadResult(button){
  if(!quiz?.complete||button.disabled)return;const status=document.getElementById('xp-result-status');button.disabled=true;button.textContent='Готовлю PNG…';
  try{
   await document.fonts.ready;
   const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');
   ctx.fillStyle='#f1f5ff';ctx.fillRect(0,0,1080,1350);
   const logo=document.querySelector('.brand-art').cloneNode(true);logo.querySelectorAll('.brand-orbit,.brand-orbit-track,.brand-halo').forEach(node=>node.remove());logo.querySelector('.brand-wordmark')?.setAttribute('fill','#15223d');
   const picture=new Image();picture.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(logo));await picture.decode();ctx.drawImage(picture,64,50,344,108);
   ctx.fillStyle='#61728e';ctx.font='700 24px Montserrat,Arial,sans-serif';ctx.fillText('ПРОВЕРКА СЕБЯ · 5 СИТУАЦИЙ',64,231);
   ctx.fillStyle='#1245cf';ctx.font='800 188px Montserrat,Arial,sans-serif';ctx.fillText(String(quiz.score),55,444);const width=ctx.measureText(String(quiz.score)).width;ctx.font='750 84px Montserrat,Arial,sans-serif';ctx.fillStyle='#8096bc';ctx.fillText('/ 5',75+width,438);
   ctx.font='800 62px Montserrat,Arial,sans-serif';ctx.fillStyle='#15223d';const bottom=wrapText(ctx,resultTitle(quiz.score),64,568,940,76);
   ctx.font='500 30px Montserrat,Arial,sans-serif';ctx.fillStyle='#61728e';wrapText(ctx,'Проверил себя в пяти ситуациях из жизни хостела.',64,bottom+30,850,46);
   roundRect(ctx,64,810,952,449,28,'#1245cf');ctx.fillStyle='#fff';ctx.font='800 56px Montserrat,Arial,sans-serif';ctx.fillText('Твой ход.',104,907);ctx.font='600 28px Montserrat,Arial,sans-serif';wrapText(ctx,'Проверь себя за минуту',104,965,470,42);ctx.font='600 25px Montserrat,Arial,sans-serif';ctx.fillStyle='#d2e5ff';ctx.fillText('27 правил · Алабуга Политех',104,1166);
   const size=QR_MATRIX.length+8,module=7,x=1016-40-size*module,y=870;roundRect(ctx,x-15,y-15,size*module+30,size*module+30,15,'#fff');ctx.fillStyle='#0b2881';QR_MATRIX.forEach((row,ry)=>row.forEach((cell,rx)=>{if(cell)ctx.fillRect(x+(rx+4)*module,y+(ry+4)*module,module,module);}));
   ctx.fillStyle='#61728e';ctx.font='600 25px Montserrat,Arial,sans-serif';ctx.fillText('alabuga-home.ru',64,1310);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG export failed');const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='alabuga-result-'+quiz.score+'-of-5.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);status.textContent='Готово. QR-код ведёт на мини-квест.';
  }catch{status.textContent='Не удалось сохранить картинку. Попробуй скачать ещё раз.';}finally{button.disabled=false;button.innerHTML='Скачать PNG <span aria-hidden="true">↓</span>';}
 }
 document.addEventListener('click',event=>{
  const open=event.target.closest('[data-open-experience]');if(open){openExperience(open.dataset.openExperience);return;}
  const zone=event.target.closest('[data-house-category]');if(zone){document.dispatchEvent(new CustomEvent('hostel:category',{detail:zone.dataset.houseCategory}));return;}
 });
 dialog.addEventListener('click',event=>{
  const target=event.target.closest('button,a');
  if(event.target===dialog){closeExperience();return;}if(!target)return;
  if(target.hasAttribute('data-close-experience')){closeExperience();return;}
  if(busy)return;
  if(target.dataset.switchMode){openExperience(target.dataset.switchMode);return;}
  if(target.hasAttribute('data-restart-quest')){mode='';openExperience('quest');return;}
  if(target.dataset.questAnswer!==undefined){answerQuestion(Number(target.dataset.questAnswer));return;}
  if(target.hasAttribute('data-quest-next')){nextQuestion();return;}
  if(target.hasAttribute('data-download-result')){downloadResult(target);return;}
  if(target.dataset.openSource){event.preventDefault();const hash=target.dataset.openSource;closeExperience();document.dispatchEvent(new CustomEvent('hostel:open',{detail:hash}));return;}
  if(target.hasAttribute('data-study-known')){markStudy(false);return;}
  if(target.hasAttribute('data-study-later')){markStudy(true);return;}
  if(target.hasAttribute('data-study-next')){moveStudy(1);return;}
  if(target.hasAttribute('data-study-prev')){moveStudy(-1);return;}
  if(target.hasAttribute('data-study-filter')){studyLater=!studyLater;reviewing=false;draw(renderStudy,true);return;}
  if(target.hasAttribute('data-study-all')){studyLater=false;draw(renderStudy,true);return;}
  if(target.hasAttribute('data-study-review')){reviewing=true;studyIndex=0;draw(renderStudyView,true);return;}
  if(target.hasAttribute('data-study-reset')){known.clear();later.clear();studyIndex=0;reviewing=false;persist();draw(renderStudy,true);return;}
  if(target.dataset.studyJump!==undefined){studyIndex=Number(target.dataset.studyJump);studyLater=false;persist();draw(renderStudyView,true);}
 });
 dialog.addEventListener('cancel',event=>{event.preventDefault();closeExperience();});
 dialog.addEventListener('keydown',event=>{if(mode==='learn'&&!busy&&['ArrowLeft','ArrowRight'].includes(event.key)&&!event.target.closest('input,textarea,select')){event.preventDefault();moveStudy(event.key==='ArrowRight'?1:-1);}});
 window.addEventListener('hashchange',route);window.addEventListener('popstate',route);
 const themeButton=document.getElementById('theme-toggle');
 function applyTheme(theme){
  const dark=theme==='dark';document.documentElement.dataset.theme=dark?'dark':'light';themeButton.setAttribute('aria-pressed',String(dark));themeButton.setAttribute('aria-label',dark?'Включить светлую тему':'Включить тёмную тему');themeButton.title=dark?'Светлая тема':'Тёмная тема';document.querySelector('meta[name="theme-color"]').content=dark?'#0a1223':'#1245cf';
  try{localStorage.setItem('alabuga-theme',dark?'dark':'light');}catch{}
 }
 themeButton.addEventListener('click',()=>{clearTimeout(themeTimer);document.documentElement.classList.add('theme-switching');applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');themeTimer=setTimeout(()=>document.documentElement.classList.remove('theme-switching'),420);});
 applyTheme(document.documentElement.dataset.theme==='dark'?'dark':'light');
 const house=document.querySelector('.xp-house-art');let houseFrame=0;
 house.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType==='touch')return;const r=house.getBoundingClientRect(),x=((event.clientX-r.left)/r.width-.5)*10,y=((event.clientY-r.top)/r.height-.5)*5;cancelAnimationFrame(houseFrame);houseFrame=requestAnimationFrame(()=>{house.style.setProperty('--house-x',x.toFixed(2)+'px');house.style.setProperty('--house-y',y.toFixed(2)+'px');});});
 house.addEventListener('pointerleave',()=>{cancelAnimationFrame(houseFrame);house.style.removeProperty('--house-x');house.style.removeProperty('--house-y');});
 house.querySelectorAll('[data-house-category]').forEach(zone=>zone.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();zone.dispatchEvent(new MouseEvent('click',{bubbles:true}));}}));
 reduced.addEventListener('change',()=>{if(busy){++swapToken;swapAnimation?.cancel();busy=false;body.removeAttribute('aria-busy');if(mode==='learn')renderStudyView();else if(quiz?.complete)renderResult();else if(quiz?.answered)renderFeedback();else if(mode==='quest')renderQuestion();}});
 updateHub();route();
})();
