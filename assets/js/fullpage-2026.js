/* ORIENTIVE homepage — discrete full-page wheel navigation.
   Desktop only. Tall scenes scroll naturally; mobile, short windows and reduced
   motion use native document scrolling. A trackpad gesture never skips scenes. */
(()=>{
  const enabledMedia=matchMedia('(min-width:1025px) and (min-height:680px) and (prefers-reduced-motion:no-preference)');
  const scenes=[...document.querySelectorAll('main > section')];
  const footer=document.querySelector('.site-footer');
  if(!scenes.length)return;
  const stops=footer?[...scenes,footer]:scenes;
  const state={lockedUntil:0,lastInput:0,needFresh:false,accum:0,dir:0};
  const topOf=el=>Math.round(el.getBoundingClientRect().top+window.scrollY);
  const scrollYNow=()=>window.scrollY||document.documentElement.scrollTop||0;
  const currentStop=()=>{
    const y=scrollYNow()+15;
    let i=0;
    for(let n=1;n<stops.length;n++){
      if(topOf(stops[n])<=y)i=n;
      else break;
    }
    return i;
  };
  const scrollInside=(index,dir)=>{
    const el=stops[index];
    if(!el||el===footer)return false;
    const top=topOf(el),bottom=top+el.offsetHeight,y=scrollYNow();
    // Only a genuinely taller-than-viewport scene uses natural scroll.
    if(el.offsetHeight<=innerHeight+8)return false;
    return dir>0?y+innerHeight<bottom-8:y>top+8;
  };
  const navigate=(index)=>{
    const next=Math.max(0,Math.min(stops.length-1,index));
    state.lockedUntil=performance.now()+950;
    state.needFresh=true;state.accum=0;
    window.scrollTo({top:topOf(stops[next]),behavior:'smooth'});
  };
  const isInteractive=target=>target instanceof Element&&!!target.closest(
    'input,textarea,select,[contenteditable="true"],[role="dialog"],.site-mobile-menu,.sol-tabs'
  );
  const wheel=e=>{
    if(!enabledMedia.matches||document.body.classList.contains('orv-intro-lock')||document.body.classList.contains('menu-open'))return;
    if(e.ctrlKey||e.metaKey||e.shiftKey||isInteractive(e.target))return;
    const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
    if(Math.abs(delta)<1)return;
    const dir=Math.sign(delta),now=performance.now(),gap=now-state.lastInput;
    state.lastInput=now;
    const index=currentStop();
    if(now<state.lockedUntil){e.preventDefault();return}
    if(state.needFresh){
      e.preventDefault();
      if(gap<190)return;
      state.needFresh=false;state.accum=0;
    }
    if(scrollInside(index,dir)){state.accum=0;return}
    if(index===0&&dir<0 || index===stops.length-1&&dir>0)return;
    e.preventDefault();
    if(gap>190||state.dir!==dir)state.accum=0;
    state.dir=dir;state.accum+=Math.abs(delta);
    if(state.accum>=28)navigate(index+dir);
  };
  const key=e=>{
    if(!enabledMedia.matches||document.body.classList.contains('orv-intro-lock')||document.body.classList.contains('menu-open'))return;
    if(isInteractive(e.target)||e.target instanceof Element&&e.target.closest('a,button'))return;
    const dir=['ArrowDown','PageDown'].includes(e.key)?1:['ArrowUp','PageUp'].includes(e.key)?-1:0;
    if(!dir)return;
    const i=currentStop();
    if(scrollInside(i,dir))return;
    if(i+dir<0||i+dir>=stops.length)return;
    e.preventDefault();
    if(performance.now()>=state.lockedUntil)navigate(i+dir);
  };
  const mode=()=>{
    const active=enabledMedia.matches;
    document.documentElement.classList.toggle('orv-fullpage-active',active);
    if(!active){state.needFresh=false;state.accum=0}
  };
  enabledMedia.addEventListener('change',mode);
  window.addEventListener('wheel',wheel,{passive:false});
  document.addEventListener('keydown',key);
  mode();
})();
