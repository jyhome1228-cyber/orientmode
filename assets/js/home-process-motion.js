/* Animate four steps as the HOW WE WORK section enters the viewport. */
(()=>{
const section=document.getElementById('process');
if(!section||!section.classList.contains('orv-process--active'))return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches){section.classList.add('is-inview');return}
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){section.classList.add('is-inview');observer.disconnect();break}}},{threshold:.25});
observer.observe(section);
})();