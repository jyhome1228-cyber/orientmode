/* ORIENTIVE shared navigation behaviour */
(()=> {
  const header=document.querySelector('.site-header');
  const toggle=document.querySelector('.site-menu-toggle');
  const panel=document.querySelector('.site-mobile-menu');
  const backToTop=document.querySelector('.site-back-top');
  if (!header) return;
  const desktop=window.matchMedia('(min-width: 761px)');
  const setHeader=()=>{
    const scrolled=window.scrollY>28;
    header.classList.toggle('scrolled',scrolled);
    if(header.classList.contains('is-home')) header.classList.toggle('at-top',!scrolled);
    backToTop?.classList.toggle('is-visible',window.scrollY>620);
  };
  setHeader();window.addEventListener('scroll',setHeader,{passive:true});
  const closeMenu=(restoreFocus=false)=>{
    if(!panel||!toggle)return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','메뉴 열기');
    document.body.classList.remove('menu-open');
    header.classList.remove('menu-active');
    if(restoreFocus)toggle.focus();
  };
  const openMenu=()=>{
    if(!panel||!toggle)return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden','false');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','메뉴 닫기');
    document.body.classList.add('menu-open');
    header.classList.add('menu-active');
    panel.querySelector('a')?.focus();
  };
  toggle?.addEventListener('click',()=>panel?.classList.contains('open')?closeMenu(true):openMenu());
  panel?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&panel?.classList.contains('open'))closeMenu(true);
    if(e.key==='Tab'&&panel?.classList.contains('open')){
      const nodes=[toggle,...panel.querySelectorAll('a')];const index=nodes.indexOf(document.activeElement);
      if(e.shiftKey&&index===0){e.preventDefault();nodes[nodes.length-1].focus()}
      else if(!e.shiftKey&&index===nodes.length-1){e.preventDefault();nodes[0].focus()}
    }
  });
  desktop.addEventListener('change',()=>closeMenu());
  backToTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
})();
