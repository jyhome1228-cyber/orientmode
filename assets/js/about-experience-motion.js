/* ORIENTIVE About: staged latest-first history and left-to-right expertise reveals */
(()=>{
 const root=document.querySelector('.about-page');
 if(!root)return;
 const history=root.querySelector('.about-history-animated');
 const cards=root.querySelector('.about-expertise-cards');
 const targets=[history,cards].filter(Boolean);
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce||!('IntersectionObserver' in window)){
   targets.forEach(el=>el.classList.add('is-visible'));
   return;
 }
 const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
   if(!e.isIntersecting)return;
   e.target.classList.add('is-visible');io.unobserve(e.target);
  });
 },{threshold:.08,rootMargin:'0px 0px -25px 0px'});
 targets.forEach(el=>io.observe(el));
 root.classList.add('about-motion-ready');
 // Keep content visible when returning to a page restored far down the scroll.
 requestAnimationFrame(()=>targets.forEach(el=>{
  const r=el.getBoundingClientRect();
  if(r.top<window.innerHeight*.85&&r.bottom>0){el.classList.add('is-visible');io.unobserve(el)}
 }));
})();
