/* ORIENTIVE shared hierarchical navigation and one-time renovation notice */
(()=> {
const hrefPrefix=location.pathname.includes('/solutions/basic/')||location.pathname.includes('/solutions/middle/')||location.pathname.includes('/solutions/premium/')?'../../':location.pathname.replace(/\/+$/,'').endsWith('/orientmode')?'./':'../';
const menu=[
 ['ABOUT','about',[['회사 소개','about/'],['주요 연혁','about/#experience'],['그룹 운영 이력','about/#experience']]],
 ['BUSINESS','business',[['6대 핵심 역량','business/'],['호텔 운영·위탁관리','business/#capability-1'],['호텔 매출·마케팅','business/#capability-2'],['숙박자산 개발·공간개선','business/#capability-3'],['부동산·금융·투자','business/#capability-4'],['멤버십·제휴 네트워크','business/#capability-5'],['브랜드·복합사업 개발','business/#capability-6']]],
 ['PERFORMANCE','performance',[['핵심 운영 실적','performance/'],['매출·운영 성과','performance/#operating-results']]],
 ['PORTFOLIO','portfolio',[['프로젝트 전체','portfolio/'],['태안 오션더힐','cases/#taean'],['평창 리조트','cases/#pyeongchang'],['경포콘도','cases/#gyeongpo']]],
 ['SOLUTIONS','solutions',[['프로그램 전체','solutions/'],['BASIC','solutions/basic/'],['MIDDLE','solutions/middle/'],['PREMIUM','solutions/premium/']]]
];
const url=path=>hrefPrefix+path;
const current=location.pathname.split('/').filter(Boolean).filter(x=>x!=='orientmode').slice(0,1)[0]||'';
const desktop=document.querySelector('.site-nav, .head .links');
if(desktop){
 desktop.innerHTML=menu.map(([name,slug,subs])=>'<div class="orv-nav-group"><a href="'+url(slug+'/')+'"'+(current===slug?' aria-current="page"':'')+'>'+name+'<span class="orv-nav-chevron" aria-hidden="true"></span></a><div class="orv-nav-dropdown">'+subs.map(([label,path])=>'<a href="'+url(path)+'">'+label+'</a>').join('')+'</div></div>').join('')+'<a class="'+(desktop.classList.contains('site-nav')?'site-cta':'cta')+'" href="'+url('contact/')+'">무료 진단 신청</a>';
}
const mobile=document.querySelector('.site-mobile-menu,.mobile-nav');
if(mobile){
 mobile.innerHTML=menu.map(([name,slug,subs],i)=>'<div class="orv-mobile-section"><button type="button" class="orv-mobile-parent" aria-expanded="false" aria-controls="orv-sub-'+i+'">'+name+'<span class="orv-mobile-chevron" aria-hidden="true"></span></button><div id="orv-sub-'+i+'" class="orv-mobile-subnav" hidden><a class="orv-mobile-overview" href="'+url(slug+'/')+'">'+name+' 전체보기</a>'+subs.filter(([label,path])=>path!==slug+'/').map(([label,path])=>'<a href="'+url(path)+'">'+label+'</a>').join('')+'</div></div>').join('')+'<a class="orv-mobile-parent orv-mobile-contact" href="'+url('contact/')+'">무료 진단 신청</a><a href="'+url('insights/')+'">INSIGHTS</a>';
 mobile.querySelectorAll('.orv-mobile-section>button').forEach(button=>button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';mobile.querySelectorAll('.orv-mobile-section>button').forEach(el=>el.setAttribute('aria-expanded','false'));mobile.querySelectorAll('.orv-mobile-subnav').forEach(el=>el.hidden=true);button.setAttribute('aria-expanded',String(!open));button.nextElementSibling.hidden=open;}));
 mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');mobile.setAttribute('aria-hidden','true');document.body.classList.remove('menu-open');document.querySelector('.site-menu-toggle,.mobile-toggle')?.setAttribute('aria-expanded','false')}));
}
const logo=document.querySelector('.orv-opening'); // On homepage, show notice after intro.
let shown=false;let skipNotice=false;
try{skipNotice=sessionStorage.getItem('orvRenovationNoticeSeen')==='1'}catch(e){}
if(skipNotice)return;
const overlay=document.createElement('div');overlay.id='orvRenovationNotice';overlay.className='orv-renovation-overlay';overlay.hidden=true;
overlay.innerHTML='<section class="orv-renovation-dialog" role="dialog" aria-modal="true" aria-labelledby="orv-renovation-title" aria-describedby="orv-renovation-desc"><p class="orv-renovation-kicker">ORIENTIVE / SITE NOTICE</p><h2 id="orv-renovation-title">더 나은 경험을 위해<br>홈페이지를 개편하고 있습니다.</h2><p class="orv-renovation-copy" id="orv-renovation-desc">현재 오리엔티브 홈페이지의 콘텐츠와 일부 기능을 개선하고 있습니다. 이용 중 일부 정보가 변경되거나 페이지 구성이 조정될 수 있는 점 양해 부탁드립니다.</p><button class="orv-renovation-continue" type="button">홈페이지 둘러보기</button></section>';
document.body.append(overlay);
let previousFocus;
const close=()=>{overlay.classList.remove('is-visible');document.body.style.overflow='';try{sessionStorage.setItem('orvRenovationNoticeSeen','1')}catch(e){}setTimeout(()=>{overlay.hidden=true;previousFocus?.focus?.()},250)};
overlay.querySelector('button').addEventListener('click',close);
document.addEventListener('keydown',e=>{if(!overlay.hidden&&e.key==='Escape')close();});
function show(){if(shown)return;shown=true;previousFocus=document.activeElement;overlay.hidden=false;document.body.style.overflow='hidden';requestAnimationFrame(()=>overlay.classList.add('is-visible'));overlay.querySelector('button').focus();}
if(!logo||logo.classList.contains('is-finished')){setTimeout(show,450)}
else{const observer=new MutationObserver(()=>{if(logo.classList.contains('is-finished')){observer.disconnect();setTimeout(show,350)}});observer.observe(logo,{attributes:true,attributeFilter:['class']});setTimeout(()=>{observer.disconnect();show()},7500)}
})();