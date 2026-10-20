'use strict';
const CRITERIA=[
 {label:'Понимаю алгоритм',short:'Понимаю',angle:-90},
 {label:'Вижу, где применить',short:'Применю',angle:0},
 {label:'Смогу создать HTML',short:'Создам',angle:90},
 {label:'Знаю, как проверить',short:'Проверю',angle:180}
];
const OUTCOMES={prompt:'Составил(а) промпт',code:'Получил(а) HTML-код',opened:'Открыл(а) тренажер',intro:'Познакомился(ась) с алгоритмом'};
const NEXT_STEPS={game:'Создать учебную игру',repeat:'Сделать тренажер для повторения',case:'Разработать практические задания',tech:'Разобраться с техническими вопросами'};
const PALETTE=['#f8e7cf','#e9eee4','#dce8d9','#c0d9c3','#99c4a8'];
function endpoint(){return (window.MK_REFLECTION?.endpoint||'').trim();}
function isLive(){return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(?:\?.*)?$/.test(endpoint());}
function safeText(s){return String(s==null?'':s);}
function escapeHtml(s){return safeText(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function showMessage(target,message,type){target.textContent=message;target.className='msg show '+type;}
function polar(cx,cy,r,deg){let a=deg*Math.PI/180;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];}
function wedge(cx,cy,inner,outer,from,to){const p1=polar(cx,cy,outer,from),p2=polar(cx,cy,outer,to),p3=polar(cx,cy,inner,to),p4=polar(cx,cy,inner,from);
 return `M ${p1.join(' ')} A ${outer} ${outer} 0 0 1 ${p2.join(' ')} L ${p3.join(' ')} A ${inner} ${inner} 0 0 0 ${p4.join(' ')} Z`;}
function targetMarkup(id,interactive=true){let html=`<svg id="${id}" class="target" role="img" aria-label="Концентрическая мишень с четырьмя секторами, оценки от одного до пяти" viewBox="0 0 440 420" xmlns="http://www.w3.org/2000/svg"><g>`;
 for(let sector=0;sector<4;sector++)for(let score=1;score<=5;score++){
   const inner=(5-score)*31,outer=(6-score)*31;
   const from=CRITERIA[sector].angle-45,to=CRITERIA[sector].angle+45;
   html+=`<path class="zone" data-sector="${sector}" data-score="${score}" d="${wedge(220,215,inner,outer,from,to)}" fill="${PALETTE[score-1]}" ${interactive?`tabindex="0" role="button" aria-label="${CRITERIA[sector].label}: ${score} из 5"`:'pointer-events="none"'}/>`;
 }
 html+=`<circle cx="220" cy="215" r="155" stroke="#6a8675" stroke-width="1.4" fill="none" pointer-events="none"/>`;
 for(const angle of [-45,45,135,225]){const v=polar(220,215,155,angle);html+=`<path class="divide" d="M220 215 L${v[0]} ${v[1]}"/>`;}
 html+=`<text text-anchor="middle" x="220" y="31">Понимаю алгоритм</text><text text-anchor="middle" x="220" y="400">Смогу создать HTML</text><text text-anchor="end" x="58" y="210">Проверю</text><text text-anchor="start" x="382" y="210">Применю</text><g id="${id}-marks"></g></g></svg>`;return html;
}
function drawMarkers(svgId,values){const root=document.getElementById(svgId+'-marks');if(!root)return;root.innerHTML='';values.forEach((value,s)=>{if(value<1||value>5)return;const r=(5-value)*31+16;const [x,y]=polar(220,215,r,CRITERIA[s].angle);const circ=document.createElementNS('http://www.w3.org/2000/svg','circle');circ.setAttribute('cx',x);circ.setAttribute('cy',y);circ.setAttribute('r','7');circ.setAttribute('fill','#ba7738');circ.setAttribute('class','marker');root.append(circ);});}
function requestJsonp(action,extra={}){return new Promise((resolve,reject)=>{
 if(!isLive())return reject(new Error('Не задан адрес Google Apps Script'));
 const name='mkCallback_'+Math.random().toString(36).slice(2)+'_'+Date.now();let tag=document.createElement('script');let finished=false;const kill=()=>{if(finished)return;finished=true;clearTimeout(timer);delete window[name];tag.remove();};
 const timer=setTimeout(()=>{kill();reject(new Error('Превышено время ожидания сервера'));},15000);
 window[name]=data=>{kill();resolve(data);};tag.onerror=()=>{kill();reject(new Error('Не удалось получить ответ сервера'));};
 const url=new URL(endpoint());url.searchParams.set('action',action);url.searchParams.set('callback',name);url.searchParams.set('_',Date.now().toString());Object.entries(extra).forEach(([k,v])=>url.searchParams.set(k,v));tag.src=url.toString();document.head.append(tag);
 });}

function newAnonymousId(){
 if(window.crypto&&typeof crypto.randomUUID==='function')return crypto.randomUUID();
 const bytes=new Uint8Array(16);
 if(window.crypto&&typeof crypto.getRandomValues==='function')crypto.getRandomValues(bytes);
 else for(let i=0;i<16;i++)bytes[i]=Math.floor(Math.random()*256);
 bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 let h=[...bytes].map(x=>x.toString(16).padStart(2,'0')).join('');
 return [h.slice(0,8),h.slice(8,12),h.slice(12,16),h.slice(16,20),h.slice(20)].join('-');
}
