/* ORIENTIVE – Ascending Flow presentation.
   Starts after existing opening sequence ends, honors skip and reduced motion. */
(()=>{
 const hero=document.querySelector('.orv-growth-hero');
 if(!hero)return;
 const intro=document.getElementById('orvOpening');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const graphic=hero.querySelector('.orv-growth-hero__graphic');
 const traveler=hero.querySelector('.orv-growth-hero__traveler animateMotion');
 if(reduce){hero.classList.add('is-active');return}
 let started=false;
 hero.classList.add('is-ready');
 function start(){
  if(started)return;
  started=true;
  hero.classList.add('is-active');
  if(traveler&&typeof traveler.beginElement==='function'){
   try{traveler.beginElement()}catch(e){/* static path still renders */}
  }
 }
 if(!intro||intro.classList.contains('is-finished')){
  requestAnimationFrame(start);
 }else{
  const observer=new MutationObserver(()=>{
   if(intro.classList.contains('is-finished')){
    observer.disconnect();
    requestAnimationFrame(start);
   }
  });
  observer.observe(intro,{attributes:true,attributeFilter:['class']});
 }
 // Very small parallax follows the pointer without shifting the titles.
 if(graphic&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  let frame=0;
  hero.addEventListener('pointermove',e=>{
   if(!started||e.pointerType!=='mouse')return;
   if(frame)cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
    const box=hero.getBoundingClientRect();
    const x=(e.clientX-box.left)/box.width-.5;
    const y=(e.clientY-box.top)/box.height-.5;
    graphic.style.transform='translate(calc(-50% + '+(x*11).toFixed(1)+'px),calc(-50% + '+(y*8).toFixed(1)+'px))';
    frame=0;
   });
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{
   graphic.style.transform='translate(-50%,-50%)';
  },{passive:true});
 }
})();
