/* ORIENTIVE SOLUTIONS interactive tabs and detail accordions */
(()=>{
const tabs=[...document.querySelectorAll('.sol-select')];
const panels=[...document.querySelectorAll('.sol-detail')];
function activate(index,updateUrl=false){
 if(index<0||index>=tabs.length)return;
 tabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});
 panels.forEach((panel,i)=>{panel.hidden=i!==index});
 if(updateUrl){const u=new URL(location.href);u.searchParams.set('program',tabs[index].dataset.program);history.replaceState(null,'',u)}
}
const requested=(new URLSearchParams(location.search).get('program')||'').toLowerCase();
const requestedIndex=tabs.findIndex(t=>t.dataset.program===requested);
activate(requestedIndex>=0?requestedIndex:0);
tabs.forEach((tab,i)=>{
 tab.addEventListener('click',()=>activate(i,true));
 tab.addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
 e.preventDefault();
 const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
 activate(next,true);tabs[next].focus();
 });
});
document.querySelectorAll('.sol-detail').forEach(panel=>{
 panel.querySelectorAll('.sol-task').forEach(task=>task.addEventListener('toggle',()=>{
 if(!task.open)return;
 panel.querySelectorAll('.sol-task').forEach(other=>{if(other!==task)other.open=false});
 }));
});
const els=document.querySelectorAll('.sol-fade');
if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(x=>x.classList.add('in-view'))}
else{const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');obs.unobserve(entry.target)}}),{threshold:.05});els.forEach(x=>obs.observe(x))}
})();