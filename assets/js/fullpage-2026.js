/* ORIENTIVE full-page navigation · polished desktop interaction.
   One intentional wheel gesture = one section; native scroll in overflow, mobile and reduced motion. */
(()=> {
  const media=window.matchMedia('(min-width: 1025px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)');
  const scenes=[...document.querySelectorAll('main > section')];
  const footer=document.querySelector('.site-footer');
  if(!scenes.length) return;
  const steps=footer?[...scenes,footer]:scenes;
  const nav=document.createElement('nav');
  nav.className='orv-page-indicator';
  nav.setAttribute('aria-label','홈페이지 섹션 바로가기');
  scenes.forEach((scene,i)=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.setAttribute('aria-label',`섹션 ${i+1} / ${scenes.length} 이동`);
    btn.title=scene.querySelector('h1,h2')?.textContent.trim().replace(/\s+/g,' ').slice(0,45)||`섹션 ${i+1}`;
    btn.addEventListener('click',()=>navigate(i));
    nav.appendChild(btn);
  });
  document.body.append(nav);
  let current=0;
  let blockedUntil=0, lastWheelAt=0, wheelAmount=0, gestureDir=0, scrollFrame=0;
  const topOf=el=>Math.round(el.getBoundingClientRect().top+window.scrollY);
  const indexAtScroll=()=>{
    let best=0,min=Infinity;
    steps.forEach((s,i)=>{const dist=Math.abs(topOf(s)-window.scrollY);if(dist<min){min=dist;best=i}});
    return best;
  };
  const sync=()=>{
    if(!media.matches)return;
    current=indexAtScroll();
    [...nav.children].forEach((btn,i)=>{
      const selected=i===current;
      btn.classList.toggle('is-active',selected);
      if(selected)btn.setAttribute('aria-current','step');else btn.removeAttribute('aria-current');
    });
    nav.classList.toggle('is-light',!!steps[current]?.matches('.orv-intro,.orv-expertise,.orv-solutions,.orv-process,.orv-client'));
  };
  const navigate=(idx)=>{
    if(!media.matches)return;
    const next=Math.max(0,Math.min(steps.length-1,idx));
    current=next;
    wheelAmount=0;
    blockedUntil=performance.now()+1000;
    window.scrollTo({top:topOf(steps[next]),behavior:'smooth'});
    sync();
  };
  const canScrollInside=(node,dir)=>{
    if(!node||node===footer)return false;
    const max=node.scrollHeight-node.clientHeight;
    if(max<=5)return false;
    return dir>0?node.scrollTop<max-3:node.scrollTop>3;
  };
  const isEditableOrDialog=target=>!!target.closest('input,textarea,select,[contenteditable="true"],[role="dialog"],.site-mobile-menu.open');
  const wheel=e=>{
    if(!media.matches||document.body.classList.contains('orv-intro-lock')||document.body.classList.contains('menu-open'))return;
    if(e.ctrlKey||e.metaKey||e.shiftKey||isEditableOrDialog(e.target))return;
    const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
    if(Math.abs(delta)<1)return;
    const dir=Math.sign(delta);
    const index=indexAtScroll();
    // Never trap scroll in a genuinely longer scene. It must remain readable.
    if(canScrollInside(steps[index],dir))return;
    if((index===0&&dir<0)||(index===steps.length-1&&dir>0))return;
    e.preventDefault();
    const now=performance.now();
    if(now<blockedUntil)return;
    // Group trackpad wheel ticks into a single deliberate gesture.
    if(now-lastWheelAt>240||gestureDir!==dir)wheelAmount=0;
    lastWheelAt=now;gestureDir=dir;wheelAmount+=Math.abs(delta);
    if(wheelAmount<38)return;
    navigate(index+dir);
  };
  const key=e=>{
    if(!media.matches||document.body.classList.contains('orv-intro-lock')||document.body.classList.contains('menu-open'))return;
    if(isEditableOrDialog(e.target)||e.target.closest('a,button'))return;
    const delta=['ArrowDown','PageDown'].includes(e.key)?1:['ArrowUp','PageUp'].includes(e.key)?-1:0;
    if(!delta)return;
    const index=indexAtScroll();
    if(canScrollInside(steps[index],delta))return;
    if(index+delta<0||index+delta>=steps.length)return;
    e.preventDefault();
    if(performance.now()>=blockedUntil)navigate(index+delta);
  };
  const onScroll=()=>{
    if(scrollFrame)return;
    scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;sync()});
  };
  const updateMode=()=>{
    const enabled=media.matches;
    document.documentElement.classList.toggle('orv-fullpage-active',enabled);
    nav.hidden=!enabled;
    if(enabled)sync();
  };
  media.addEventListener('change',updateMode);
  window.addEventListener('wheel',wheel,{passive:false});
  document.addEventListener('keydown',key);
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  updateMode();
})();
