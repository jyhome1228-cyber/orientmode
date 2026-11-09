/* ORIENTIVE brand-motion interaction: intro + accessible scroll / section reveal */
(()=> {
 const intro=document.getElementById('orvOpening');
 const skip=document.getElementById('orvIntroSkip');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let finished=false;
 const timers=[];
 const queue=(fn,delay)=>timers.push(window.setTimeout(fn,delay));
 const finish=()=>{
   if(finished)return;finished=true;
   timers.forEach(window.clearTimeout);
   intro?.classList.add('is-finished');
   document.body.classList.remove('orv-intro-lock');
   intro?.setAttribute('aria-hidden','true');
   intro?.setAttribute('inert','');
   if(skip)skip.tabIndex=-1;
 };
 skip?.addEventListener('click',finish);
 if(reduce){finish();}
 else {
   document.body.classList.add('orv-intro-lock');
   queue(()=>intro?.classList.add('is-message'),2450);
   queue(()=>intro?.classList.add('is-logo'),3500);
   queue(finish,4800);
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!finished)finish()});
   document.addEventListener('visibilitychange',()=>{if(document.hidden)finish()});
 }
 const scroll=document.getElementById('orvScrollCue');
 const section=document.getElementById('about');
 scroll?.addEventListener('click',()=>section?.scrollIntoView({behavior:reduce?'instant':'smooth'}));
 const targets=[...document.querySelectorAll('.orv-intro__grid,.orv-expertise__head,.orv-steps,.orv-top,.orv-solutions__list,.orv-casegrid,.orv-process__grid,.orv-client__grid,.orv-final .orv-wrap')];
 if(!('IntersectionObserver' in window)||reduce){targets.forEach(el=>el.classList.add('is-visible'));return}
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
 }),{threshold:.08,rootMargin:'0px 0px -35px 0px'});
 targets.forEach(el=>{el.classList.add('orv-motion-reveal');observer.observe(el)});
})();
