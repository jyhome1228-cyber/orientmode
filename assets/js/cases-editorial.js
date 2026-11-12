/* ORIENTIVE Cases — guided explanation of our approach, accessible tab interactions. */
(()=>{
 const root=document.querySelector('.cases-editorial');if(!root)return;
 // Keep the supplied CDN files as primary sources. Recover gracefully if a remote image
 // is blocked, removed, or fails to decode. Do not leave broken-image icons or grey panels.
 root.querySelectorAll('img[data-fallback]').forEach(img=>{
   const fallback=img.dataset.fallback;
   let didFallback=false;
   img.addEventListener('error',()=>{
     if(didFallback)return;
     didFallback=true;
     img.dataset.source='fallback';
     img.src=fallback;
     img.alt='숙박시설 공간 참고 이미지';
   });
   const markLoaded=()=>{
     img.classList.add('is-loaded');
     const figure=img.closest('figure');
     if(figure)figure.classList.add('has-photo');
   };
   img.addEventListener('load',markLoaded);
   // Images can finish (or fail) before a deferred script attaches handlers.
   if(img.complete){
     if(img.naturalWidth>0)markLoaded();
     else img.dispatchEvent(new Event('error'));
   }
 });
 const tablist=root.querySelector('.cases-method__tabs');
 const tabs=[...root.querySelectorAll('.cases-method__tab')];
 const panel=root.querySelector('#cases-panel');
 const stages={
  diagnose:{label:'DIAGNOSIS',title:'먼저, 우리 숙소의 현재를 제대로 봅니다.',copy:'객실 구성과 가격, 예약채널, 고객 후기, 경쟁시설과 운영 환경을 종합적으로 살펴보고 해결해야 할 핵심 과제를 정리합니다.',tags:['객실 및 상품 구성','예약채널·가격','고객 후기와 운영 현황']},
  strategy:{label:'STRATEGY',title:'사업장에 필요한 개선의 우선순위를 설계합니다.',copy:'파악한 문제를 기준으로 상품 구성과 객실 가격, 판매채널, 브랜드 메시지 등 조정이 필요한 영역을 구분하고 실행 순서를 구체화합니다.',tags:['판매·가격 구조','상품·프로모션 방향','브랜드·콘텐츠 전략']},
  execution:{label:'EXECUTION',title:'계획을 실제 업무로 연결합니다.',copy:'협의한 프로그램의 범위 안에서 채널 운영과 콘텐츠, 캠페인 및 판매 전략 등의 개선 업무를 진행하고, 각 단계의 진행 상황을 공유합니다.',tags:['온라인 채널 운영','콘텐츠·마케팅 지원','프로그램별 실행 업무']},
  review:{label:'REVIEW',title:'진행 결과를 점검하고 다음 과제를 찾습니다.',copy:'수행한 업무와 확인 가능한 지표를 함께 살펴보며 개선이 필요한 부분을 정리합니다. 일회성 제안보다 다음 행동으로 이어질 수 있는 관리를 지향합니다.',tags:['진행 현황 확인','성과 지표 검토','후속 과제 정리']}
 };
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function activate(tab,moveFocus=false){
  if(!tab||!panel)return;
  const stage=stages[tab.dataset.stage];if(!stage)return;
  tabs.forEach(b=>{const selected=b===tab;b.classList.toggle('is-active',selected);b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1});
  panel.setAttribute('aria-labelledby',tab.id);
  root.querySelector('#cases-panel-kicker').textContent=stage.label;
  root.querySelector('#cases-panel-title').textContent=stage.title;
  root.querySelector('#cases-panel-copy').textContent=stage.copy;
  const tags=root.querySelector('#cases-panel-tags');tags.replaceChildren();
  stage.tags.forEach(label=>{const li=document.createElement('li');li.textContent=label;tags.append(li)});
  if(!reduce){panel.classList.remove('is-switching');void panel.offsetWidth;panel.classList.add('is-switching')}
  if(moveFocus)tab.focus();
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>activate(tab));
  tab.addEventListener('keydown',event=>{
   if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   event.preventDefault();
   const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:
       (i+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+tabs.length)%tabs.length;
   activate(tabs[next],true);
  });
 });
 // Add reveal progressively; the content remains readable if JS, animations or IntersectionObserver are unavailable.
 if(!reduce&&'IntersectionObserver' in window){
   const elements=[...root.querySelectorAll('.cases-reveal')];
   const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
     if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}
   }),{threshold:.06,rootMargin:'0px 0px -25px 0px'});
   elements.forEach(el=>observer.observe(el));
   root.classList.add('has-cases-reveal');
 }
})();
