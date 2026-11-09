/* ORIENTIVE five-panel native scrolling narrative */
(()=> {
 const story=document.querySelector('[data-scroll-story]');
 if(!story)return;
 const sticky=story.querySelector('.orient-story__sticky');
 const scenes=[...story.querySelectorAll('.orient-story__scene')];
 const progress=[...story.querySelectorAll('.orient-story__progress span')];
 const currentLabel=story.querySelector('[data-current]');
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 let active=-1,queued=false;
 function update(){
  queued=false;
  const rect=story.getBoundingClientRect();
  const available=Math.max(1,rect.height-window.innerHeight);
  const ratio=Math.max(0,Math.min(0.9999,-rect.top/available));
  const index=Math.min(scenes.length-1,Math.floor(ratio*scenes.length));
  if(index===active)return;
  active=index;
  scenes.forEach((scene,i)=>{
   const showing=i===index;
   scene.classList.toggle('is-active',showing);
   scene.setAttribute('aria-hidden',String(!showing));
   scene.querySelectorAll('a,button').forEach(control=>{if(showing)control.removeAttribute('tabindex');else control.setAttribute('tabindex','-1')});
  });
  progress.forEach((el,i)=>el.classList.toggle('is-active',i===index));
  sticky.classList.toggle('is-last',index===scenes.length-1);
  currentLabel.textContent=String(index+1).padStart(2,'0');
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(update)}}
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule);
 motion.addEventListener?.('change',schedule);
 update();
})();
