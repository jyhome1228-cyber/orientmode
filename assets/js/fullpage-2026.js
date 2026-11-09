/* ORIENTIVE full-page scroll: wheel per scene, keyboard, click indicators.
   Disabled on mobile/short viewports and reduced-motion settings. */
(()=> {
 const media=window.matchMedia('(min-width: 1025px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)');
 const scenes=[...document.querySelectorAll('main > section')];
 const footer=document.querySelector('.site-footer');
 if(!scenes.length)return;
 const steps=footer?[...scenes,footer]:scenes;
 const nav=document.createElement('nav');
 nav.className='orv-page-indicator';nav.setAttribute('aria-label','메인 섹션 이동');
 scenes.forEach((scene,i)=>{
   const b=document.createElement('button');b.type='button';
   b.setAttribute('aria-label',`섹션 ${i+1} / ${scenes.length} 이동`);
   b.addEventListener('click',()=>go(i));
   nav.appendChild(b);
 });
 document.body.appendChild(nav);
 let lockedUntil=0,active=0,accum=0,clearAccum=0;
 const positions=()=>steps.map(s=>Math.round(s.getBoundingClientRect().top+window.scrollY));
 const closest=()=>{
   const ys=positions();let best=0,d=Infinity;
   ys.forEach((y,i)=>{const v=Math.abs(y-window.scrollY);if(v<d){best=i;d=v}});
   return best;
 };
 const update=()=>{
   active=closest();
   [...nav.children].forEach((b,i)=>b.classList.toggle('is-active',i===active));
   const scene=steps[active];nav.classList.toggle('is-light',!!scene?.matches('.orv-intro,.orv-expertise,.orv-solutions,.orv-process,.orv-client'));
 };
 const go=(index)=>{
   if(!media.matches)return;
   const n=Math.max(0,Math.min(steps.length-1,index));
   active=n;lockedUntil=performance.now()+800;accum=0;
   window.scrollTo({top:positions()[n],behavior:'smooth'});
   update();
 };
 const scrollWithin=(scene,dir)=>{
   if(!scene||scene===footer)return false;
   if(scene.scrollHeight<=scene.clientHeight+4)return false;
   return dir>0?scene.scrollTop+scene.clientHeight<scene.scrollHeight-3:scene.scrollTop>3;
 };
 function wheel(e){
   if(!media.matches||document.body.classList.contains('orv-intro-lock'))return;
   if(e.ctrlKey||e.metaKey||e.shiftKey)return;
   if(e.target.closest('.site-mobile-menu,.orv-opening'))return;
   const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1);
   if(Math.abs(delta)<1)return;
   const dir=Math.sign(delta);
   const current=closest();
   // Keep natural scrolling inside genuinely overflowing scenes or after the final scene.
   if(scrollWithin(steps[current],dir))return;
   if(current===steps.length-1&&dir>0)return;
   if(current===0&&dir<0)return;
   e.preventDefault();
   if(performance.now()<lockedUntil)return;
   accum+=delta;
   clearTimeout(clearAccum);clearAccum=setTimeout(()=>{accum=0},180);
   if(Math.abs(accum)<24)return;
   go(current+dir);
 }
 function key(e){
   if(!media.matches||document.body.classList.contains('orv-intro-lock'))return;
   if(e.target.closest('input,textarea,select,[contenteditable="true"],button,a'))return;
   const next=['ArrowDown','PageDown'].includes(e.key)?1:['ArrowUp','PageUp'].includes(e.key)?-1:0;
   if(!next)return;
   e.preventDefault();if(performance.now()<lockedUntil)return;
   const i=closest();if(scrollWithin(steps[i],next))return;
   go(i+next);
 }
 const mode=()=>{
   document.documentElement.classList.toggle('orv-fullpage-active',media.matches);
   nav.hidden=!media.matches;
   update();
 };
 media.addEventListener('change',mode);
 window.addEventListener('wheel',wheel,{passive:false});
 document.addEventListener('keydown',key);
 window.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});
 window.addEventListener('resize',update,{passive:true});
 mode();
})();
