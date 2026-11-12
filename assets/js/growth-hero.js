/* ORIENTIVE – Ascending Flow: photo reveal, soft magnetic path, hover light.
   Native cursor, existing title hierarchy and intro are left unchanged. */
(()=>{
 'use strict';
 const hero=document.querySelector('.orv-growth-hero');
 if(!hero)return;
 const intro=document.getElementById('orvOpening');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const graphic=hero.querySelector('.orv-growth-hero__graphic');
 const svg=hero.querySelector('.orv-growth-hero__svg');
 const path=hero.querySelector('#orvGrowthPath');
 const trails=[...hero.querySelectorAll('.orv-growth-hero__trail')];
 const traveler=hero.querySelector('.orv-growth-hero__traveler animateMotion');
 if(!svg||!path||!graphic)return;
 const ns='http://www.w3.org/2000/svg';
 const layer=document.createElementNS(ns,'g');
 layer.setAttribute('class','orv-growth-hero__light-trace');
 const halo=document.createElementNS(ns,'circle');halo.setAttribute('class','orv-growth-hero__light-halo');halo.setAttribute('r','17');
 const point=document.createElementNS(ns,'circle');point.setAttribute('class','orv-growth-hero__light-point');point.setAttribute('r','3.5');
 layer.append(halo,point);
 const idle=document.createElementNS(ns,'circle');idle.setAttribute('class','orv-growth-hero__idle-point');idle.setAttribute('r','2.7');
 svg.append(idle,layer);
 if(reduce){
   hero.classList.add('is-active','has-background');
   return;
 }
 const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
 const original=trails.map(p=>p.getAttribute('d'));
 const base=trails.map(el=>{
   const len=el.getTotalLength(),list=[];
   for(let i=0;i<=82;i++){const p=el.getPointAtLength(len*i/82);list.push({x:p.x,y:p.y})}
   return list;
 });
 const baseline=base[trails.indexOf(path)];
 const length=path.getTotalLength();
 let started=false,canInteract=false,heroVisible=true,frame=0,px=0,py=0,mx=0,my=0,hover=false,raf=0,last=0;
 let settleTimer=0;
 hero.classList.add('is-ready');
 const nearest=(x,y)=>{
   let best=Infinity,bestI=0;
   baseline.forEach((pt,i)=>{const d=(pt.x-x)**2+(pt.y-y)**2;if(d<best){best=d;bestI=i}});
   return {distance:Math.sqrt(best),index:bestI};
 };
 const bezierPoints=(points)=>{
   const out=['M'+points[0].x.toFixed(1)+' '+points[0].y.toFixed(1)];
   for(let i=1;i<points.length-1;i++){
     const p=points[i],n=points[i+1];
     out.push('Q'+p.x.toFixed(1)+' '+p.y.toFixed(1)+' '+((p.x+n.x)/2).toFixed(1)+' '+((p.y+n.y)/2).toFixed(1));
   }
   const lastPoint=points[points.length-1];
   out.push('L'+lastPoint.x.toFixed(1)+' '+lastPoint.y.toFixed(1));
   return out.join(' ');
 };
 const restore=()=>{
   trails.forEach((t,i)=>t.setAttribute('d',original[i]));
   hero.classList.remove('is-interacting');
 };
 const tick=(time)=>{
   raf=0;
   if(!started||!heroVisible||document.hidden)return;
   const elapsed=time-last;
   const inertia=Math.min(1,elapsed>100?1:.14);
   px+=(mx-px)*inertia;
   py+=(my-py)*inertia;
   let near={distance:Infinity,index:0};
   if(hover&&fine&&canInteract){
     near=nearest(px,py);
     if(near.distance<135){
       const pt=baseline[near.index];
       halo.setAttribute('cx',pt.x);halo.setAttribute('cy',pt.y);
       point.setAttribute('cx',pt.x);point.setAttribute('cy',pt.y);
       hero.classList.add('is-interacting');
       const influence=Math.max(0,1-near.distance/135);
       trails.forEach((t,j)=>{
         const shiftScale=j===trails.indexOf(path)?1:j===0?.54:.74;
         const adjusted=base[j].map(p=>{
           const distance=Math.hypot(px-p.x,py-p.y);
           const field=Math.exp(-distance*distance/(2*115*115))*influence;
           const dx=Math.max(-13,Math.min(13,(px-p.x)*.16))*field*shiftScale;
           const dy=Math.max(-13,Math.min(13,(py-p.y)*.16))*field*shiftScale;
           return {x:p.x+dx,y:p.y+dy};
         });
         t.setAttribute('d',bezierPoints(adjusted));
       });
     }else{restore()}
   }else{restore()}
   // A slow subtle sparkle travels along the original ascending trajectory every 14 seconds.
   const phase=((time-idleStart)%14000)/14000;
   const p=baseline[Math.min(82,Math.round(phase*82))];
   idle.setAttribute('cx',p.x);idle.setAttribute('cy',p.y);
   const quiet=hover&&near.distance<135;
   idle.style.opacity=canInteract&&!quiet?.38*Math.sin(Math.PI*phase):0;
   last=time;
   if(canInteract||hover)raf=requestAnimationFrame(tick);
 };
 let idleStart=0;
 const schedule=()=>{
   if(!raf&&heroVisible&&!document.hidden&&(canInteract||hover)){
     raf=requestAnimationFrame(tick);
   }
 };
 function enableInteractions(){
   canInteract=true;
   idleStart=performance.now();
   schedule();
 }
 function start(){
   if(started)return;
   started=true;hero.classList.add('is-active');
   if(traveler&&typeof traveler.beginElement==='function'){
     try{traveler.beginElement()}catch(_){}
   }
   // The lines complete their sequence before photo and cursor reaction appear.
   setTimeout(()=>hero.classList.add('has-background'),4200);
   setTimeout(enableInteractions,4600);
 }
 if(!intro||intro.classList.contains('is-finished'))requestAnimationFrame(start);
 else{
   const observer=new MutationObserver(()=>{
     if(intro.classList.contains('is-finished')){observer.disconnect();requestAnimationFrame(start)}
   });
   observer.observe(intro,{attributes:true,attributeFilter:['class']});
 }
 if(fine){
   const svgCoords=e=>{
     const matrix=svg.getScreenCTM();
     if(!matrix)return null;
     const point=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());
     return {x:point.x,y:point.y};
   };
   hero.addEventListener('pointermove',e=>{
     if(e.pointerType!=='mouse'||!canInteract)return;
     const xy=svgCoords(e);if(!xy)return;
     mx=xy.x;my=xy.y;
     if(!hover){px=mx;py=my}
     hover=true;
     const rect=hero.getBoundingClientRect();
     const x=(e.clientX-rect.left)/rect.width-.5;
     const y=(e.clientY-rect.top)/rect.height-.5;
     graphic.style.transform='translate(calc(-50% + '+(x*8).toFixed(1)+'px),calc(-50% + '+(y*6).toFixed(1)+'px))';
     schedule();
   },{passive:true});
   hero.addEventListener('pointerleave',()=>{
     hover=false;restore();graphic.style.transform='translate(-50%,-50%)';
   },{passive:true});
 }
 const visibleObserver=new IntersectionObserver(entries=>{
   heroVisible=entries[0]?.isIntersecting??true;
   if(heroVisible)schedule();
   else if(raf){cancelAnimationFrame(raf);raf=0}
 },{threshold:0});
 visibleObserver.observe(hero);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
})();
