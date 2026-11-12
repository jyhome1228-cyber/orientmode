/* ORIENTIVE cursor accent: native mouse pointer remains unchanged. */
(()=>{
 'use strict';
 const media=window.matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
 if(!media.matches)return;
 const dot=document.createElement('span');
 dot.className='orv-cursor-dot';
 dot.setAttribute('aria-hidden','true');
 const ring=document.createElement('span');
 ring.className='orv-cursor-ring';
 ring.setAttribute('aria-hidden','true');
 document.body.append(dot,ring);
 let targetX=0,targetY=0,x=0,y=0,frame=0,visible=false;
 const draw=()=>{
   x+=(targetX-x)*.26;
   y+=(targetY-y)*.26;
   dot.style.transform='translate3d('+x+'px,'+y+'px,0)';
   if(Math.abs(targetX-x)>.12||Math.abs(targetY-y)>.12){frame=requestAnimationFrame(draw)}else{frame=0}
 };
 const move=e=>{
   if(e.pointerType!=='mouse')return;
   targetX=e.clientX;targetY=e.clientY;
   if(!visible){x=targetX;y=targetY;visible=true;dot.classList.add('is-visible')}
   if(!frame)frame=requestAnimationFrame(draw);
   dot.classList.toggle('is-hover',!!e.target.closest('a,button,[role="button"],input,select,textarea,summary'));
 };
 document.addEventListener('pointermove',move,{passive:true});
 document.addEventListener('pointerdown',e=>{
   if(e.pointerType!=='mouse'||e.button!==0)return;
   ring.classList.remove('is-active');
   ring.style.setProperty('--orv-click-x',e.clientX+'px');
   ring.style.setProperty('--orv-click-y',e.clientY+'px');
   // Restart the transient click ripple at the exact click coordinate.
   void ring.offsetWidth;
   ring.classList.add('is-active');
 },{passive:true});
 ring.addEventListener('animationend',()=>ring.classList.remove('is-active'));
 document.addEventListener('pointerout',e=>{
   if(!e.relatedTarget){visible=false;dot.classList.remove('is-visible')}
 },{passive:true});
 window.addEventListener('blur',()=>{visible=false;dot.classList.remove('is-visible')});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){visible=false;dot.classList.remove('is-visible')}});
 media.addEventListener('change',()=>{dot.remove();ring.remove();if(frame)cancelAnimationFrame(frame)});
})();
