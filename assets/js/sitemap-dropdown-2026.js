/* ORIENTIVE – shared site navigation; the renovation notice is preserved below. */
(()=> {
const src=document.currentScript || document.querySelector('script[src*="sitemap-dropdown-2026.js"]');
const base=new URL('../../',src?.src || location.href);
const href=(path)=>{const u=new URL(path,base);return u.pathname+u.search+u.hash};
const page=location.pathname.startsWith(base.pathname)?location.pathname.slice(base.pathname.length).split('/')[0]:'';
const active=page==='service'?'business':page==='cases'?'portfolio':page;
const businessGroups=[
 {name:'운영과 수익',items:[
   {name:'호텔 운영·위탁관리',url:'business/#capability-1'},
   {name:'호텔 매출·마케팅',url:'business/#capability-2'}]},
 {name:'자산과 개발',items:[
   {name:'숙박자산 개발·공간개선',url:'business/#capability-3'},
   {name:'부동산·금융·투자',url:'business/#capability-4'}]},
 {name:'사업 확장',items:[
   {name:'멤버십·제휴 네트워크',url:'business/#capability-5'},
   {name:'브랜드·복합사업 개발',url:'business/#capability-6'}]}
];
const solutions=[
 {name:'BASIC',description:'마케팅 지원형',url:'solutions/basic/'},
 {name:'MIDDLE',description:'매출 개선형',url:'solutions/middle/'},
 {name:'PREMIUM',description:'고객 유입형',url:'solutions/premium/'}
];
const items=[
 {name:'ABOUT',url:'about/'},
 {name:'BUSINESS',url:'business/',groups:businessGroups},
 {name:'PERFORMANCE',url:'performance/'},
 {name:'PORTFOLIO',url:'portfolio/'},
 {name:'SOLUTIONS',url:'solutions/',programs:solutions}
];
const a=(name,path,extra='')=>'<a href="'+href(path)+'"'+extra+'>'+name+'</a>';
function drop(item){
 if(item.groups)return '<div class="orv-nav-dropdown orv-nav-dropdown--business" id="orv-drop-business"><div class="orv-mega-columns">'+item.groups.map(g=>'<div class="orv-mega-column"><h3>'+g.name+'</h3>'+g.items.map(x=>a(x.name,x.url)).join('')+'</div>').join('')+'</div></div>';
 return '<div class="orv-nav-dropdown orv-nav-dropdown--solutions" id="orv-drop-solutions">'+item.programs.map(p=>'<a class="orv-program-link" href="'+href(p.url)+'"><strong>'+p.name+'</strong><span>'+p.description+'</span></a>').join('')+'</div>';
}
const desktop=document.querySelector('.site-nav, .head .links');
if(desktop){
 desktop.innerHTML=items.map(item=>{
  const selected=active===item.url.replace('/','')?' aria-current="page"':'';
  if(!item.groups&&!item.programs)return a(item.name,item.url,' class="orv-nav-direct"'+selected);
  const id='orv-drop-'+item.name.toLowerCase();
  return '<div class="orv-nav-group">'+a(item.name,item.url,' class="orv-nav-parent"'+selected)+
  '<button type="button" class="orv-nav-toggle" aria-label="'+item.name+' 하위 메뉴 열기" aria-expanded="false" aria-controls="'+id+'"><span class="orv-nav-chevron" aria-hidden="true"></span></button>'+drop(item)+'</div>';
 }).join('')+a('무료 호텔 진단','contact/',' class="'+(desktop.classList.contains('site-nav')?'site-cta':'cta')+'"'+(active==='contact'?' aria-current="page"':''));
 const setOpen=(group,on)=>{
  group.classList.toggle('is-open',on);
  const button=group.querySelector('.orv-nav-toggle');
  if(button){button.setAttribute('aria-expanded',String(on));button.setAttribute('aria-label',button.getAttribute('aria-controls')==='orv-drop-business'?'BUSINESS 하위 메뉴 '+(on?'닫기':'열기'):'SOLUTIONS 하위 메뉴 '+(on?'닫기':'열기'));}
 };
 desktop.querySelectorAll('.orv-nav-group').forEach(group=>{
  group.addEventListener('mouseenter',()=>setOpen(group,true));
  group.addEventListener('mouseleave',()=>setOpen(group,false));
  group.addEventListener('focusin',()=>setOpen(group,true));
  group.addEventListener('focusout',(e)=>{if(!group.contains(e.relatedTarget))setOpen(group,false)});
  group.querySelector('.orv-nav-toggle')?.addEventListener('click',()=>setOpen(group,!group.classList.contains('is-open')));
  group.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();setOpen(group,false);group.querySelector('.orv-nav-parent')?.focus();}});
 });
 document.addEventListener('pointerdown',e=>{desktop.querySelectorAll('.orv-nav-group.is-open').forEach(g=>{if(!g.contains(e.target))setOpen(g,false)})});
}
const mobile=document.querySelector('.site-mobile-menu, .mobile-nav');
if(mobile){
 mobile.innerHTML=items.map((item,i)=>{
  if(!item.groups&&!item.programs)return a(item.name,item.url,' class="orv-mobile-parent orv-mobile-direct"'+(active===item.url.replace('/','')?' aria-current="page"':''));
  const key='orv-accordion-'+item.name.toLowerCase();
  const content=item.groups?item.groups.map(g=>'<div class="orv-mobile-group"><p>'+g.name+'</p>'+g.items.map(x=>a(x.name,x.url)).join('')+'</div>').join(''):item.programs.map(p=>a(p.name+' <span>'+p.description+'</span>',p.url)).join('');
  return '<div class="orv-mobile-section"><button type="button" class="orv-mobile-parent" aria-controls="'+key+'" aria-expanded="false">'+item.name+'<span class="orv-mobile-chevron" aria-hidden="true"></span></button><div class="orv-mobile-subnav" id="'+key+'" hidden>'+a(item.name==='BUSINESS'?'사업 역량':'프로그램 안내',item.url,' class="orv-mobile-overview"')+content+'</div></div>';
 }).join('')+a('무료 호텔 진단','contact/',' class="orv-mobile-parent orv-mobile-contact"')+a('INSIGHTS','insights/',' class="orv-mobile-insights"');
 mobile.querySelectorAll('.orv-mobile-section>button').forEach(button=>button.addEventListener('click',()=>{
  const next=button.getAttribute('aria-expanded')!=='true';
  mobile.querySelectorAll('.orv-mobile-section>button').forEach(b=>{b.setAttribute('aria-expanded','false');b.nextElementSibling.hidden=true});
  button.setAttribute('aria-expanded',String(next));button.nextElementSibling.hidden=!next;
 }));
 mobile.setAttribute('aria-hidden',mobile.classList.contains('open')?'false':'true');
 const mobileToggle=document.querySelector('.site-menu-toggle, .mobile-toggle');
 mobileToggle?.addEventListener('click',()=>requestAnimationFrame(()=>mobile.setAttribute('aria-hidden',mobile.classList.contains('open')?'false':'true')));
 mobile.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  mobile.classList.remove('open');mobile.setAttribute('aria-hidden','true');document.body.classList.remove('menu-open');
  document.querySelector('.site-menu-toggle, .mobile-toggle')?.setAttribute('aria-expanded','false');
 }));
}
const logo=document.querySelector('.orv-opening'); // On homepage, show notice after intro.
let shown=false;let skipNotice=false;
try{skipNotice=sessionStorage.getItem('orvRenovationNoticeSeenV2')==='1'}catch(e){}
if(skipNotice)return;
const overlay=document.createElement('div');overlay.id='orvRenovationNotice';overlay.className='orv-renovation-overlay';overlay.hidden=true;
overlay.innerHTML='<section class="orv-renovation-dialog" role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="orv-renovation-title" aria-describedby="orv-renovation-desc"><h2 id="orv-renovation-title">홈페이지 개편 중입니다.</h2><p class="orv-renovation-copy" id="orv-renovation-desc">일부 콘텐츠를 정비하고 있습니다.</p><button class="orv-renovation-continue" type="button">확인</button></section>';
document.body.append(overlay);
let previousFocus;
const close=()=>{overlay.classList.remove('is-visible');document.body.style.overflow='';try{sessionStorage.setItem('orvRenovationNoticeSeenV2','1')}catch(e){}setTimeout(()=>{overlay.hidden=true;previousFocus?.focus?.()},250)};
overlay.querySelector('button').addEventListener('click',close);
document.addEventListener('keydown',e=>{if(!overlay.hidden&&e.key==='Escape')close();});
function show(){if(shown)return;shown=true;previousFocus=document.activeElement;overlay.hidden=false;document.body.style.overflow='hidden';requestAnimationFrame(()=>overlay.classList.add('is-visible'));overlay.querySelector('.orv-renovation-dialog').focus({preventScroll:true});}
if(!logo||logo.classList.contains('is-finished')){setTimeout(show,450)}
else{const observer=new MutationObserver(()=>{if(logo.classList.contains('is-finished')){observer.disconnect();setTimeout(show,350)}});observer.observe(logo,{attributes:true,attributeFilter:['class']});setTimeout(()=>{observer.disconnect();show()},7500)}
})();