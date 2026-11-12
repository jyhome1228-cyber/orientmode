/* ORIENTIVE Insights filter: accessible, no external dependency */
(()=>{
 const buttons=[...document.querySelectorAll('.journal-filter')],cards=[...document.querySelectorAll('.journal-card')],empty=document.getElementById('journalEmpty'),counter=document.querySelector('.journal-head__count');
 if(!buttons.length||!cards.length)return;
 const apply=category=>{
  let visible=0;
  buttons.forEach(b=>{const on=b.dataset.filter===category;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',String(on))});
  cards.forEach(card=>{const on=category==='ALL'||card.dataset.category===category;card.hidden=!on;if(on)visible++});
  if(empty)empty.hidden=visible>0;
  if(counter)counter.textContent=visible+' ARTICLES';
 };
 buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.filter)));
 apply('ALL');
})();
