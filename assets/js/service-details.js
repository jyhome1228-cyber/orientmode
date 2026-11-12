/* ORIENTIVE — detailed descriptions for turnaround capabilities */
(()=>{
const details={
diagnosis:{en:"DIAGNOSIS",title:"사업 진단",intro:"숙소의 현재 경쟁력과 운영 구조를 살펴 개선의 출발점을 정합니다. 단순히 한 가지 지표만 확인하기보다 상품, 가격, 채널과 고객 반응을 함께 읽습니다.",points:["객실 유형·부대시설·입지 조건과 주요 고객층 파악","경쟁시설 및 요일·시즌별 요금 구조 비교","예약채널과 고객 후기, 운영 현황을 통한 우선 개선 과제 도출"]},
branding:{en:"BRANDING",title:"브랜딩",intro:"숙소가 지닌 공간적 장점을 고객이 이해하고 기억할 수 있는 브랜드 방향으로 연결합니다. 표현을 바꾸는 것에서 나아가 실제 제공하는 경험과 일치하는 메시지를 구성합니다.",points:["핵심 고객과 숙소의 포지셔닝, 차별점 정리","네이밍·브랜드 메시지·콘셉트 및 시각 표현 방향 검토","고객에게 전달되는 객실 상품과 서비스 경험의 일관성 점검"]},
content:{en:"CONTENT",title:"콘텐츠 제작",intro:"사진과 영상, 소개 콘텐츠가 숙소의 장점을 정확하게 전달하도록 구성합니다. 고객의 예약 판단에 필요한 정보와 브랜드 분위기를 함께 고려합니다.",points:["대표 이미지·객실 상세 사진·영상의 촬영 및 활용 방향","홈페이지와 예약채널에 적합한 상세페이지·소개 콘텐츠","객실 정보, 시설 안내, 시즌 콘텐츠의 메시지와 구성 개선"]},
marketing:{en:"MARKETING",title:"마케팅 실행",intro:"고객이 숙소를 발견하고 관심을 갖는 과정에 맞춰 마케팅 접점을 정리합니다. 숙소의 상황과 예산에 맞는 활동을 선택하고 반응을 살펴봅니다.",points:["검색 노출과 온라인 채널별 고객 유입 경로 점검","SNS·리뷰·체험·프로모션 캠페인 기획 및 실행 검토","반응 지표를 바탕으로 콘텐츠와 운영 우선순위 조정"]},
sales:{en:"SALES INFRASTRUCTURE",title:"판매 인프라",intro:"일반 예약채널을 보완할 수 있는 판매 경로와 상품 구성을 살펴봅니다. 숙소 자산과 고객 접점을 연결해 적용 가능한 추가 수익 기회를 검토합니다.",points:["회원 네트워크와 제휴 판매채널 활용 가능성","객실·식음료·체험을 연결한 패키지 및 부대상품 구성","판매 조건과 수수료, 운영 부담을 고려한 실행 방안 협의"]},
operations:{en:"OPERATIONS",title:"운영 및 투자",intro:"숙소의 운영 효율과 수익 구조를 함께 살펴 다음 단계의 방향을 논의합니다. 사업 확장이나 투자 관련 사안은 일반 운영 지원과 구분해 별도로 검토합니다.",points:["업무 프로세스·시설 운영·고객 대응에서 개선 과제 확인","매출과 비용, 판매 구조를 연결한 운영 개선 방향","투자·인수 등 별도 협의가 필요한 사업 확장 가능성 검토"]}
};
const dialog=document.getElementById('serviceDetailDialog');if(!dialog)return;
const $=id=>document.getElementById(id);
let previous=null;
const close=$('serviceDetailClose');
document.querySelectorAll('[data-service-detail]').forEach(btn=>{
 btn.addEventListener('click',()=>{
 const data=details[btn.dataset.serviceDetail];if(!data)return;
 previous=btn;
 const source=btn.querySelector('img');
 const image=$('serviceDetailImage');image.src=source?.currentSrc||source?.src||'';image.alt=source?.alt||data.title+" 관련 이미지";
 $('serviceDetailCategory').textContent=data.en;
 $('serviceDetailTitle').textContent=data.title;
 $('serviceDetailIntro').textContent=data.intro;
 const list=$('serviceDetailPoints');list.replaceChildren();
 data.points.forEach(point=>{const li=document.createElement('li');li.textContent=point;list.append(li)});
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
 close.focus();
 });
});
function hide(){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open')}
close.addEventListener('click',hide);
dialog.addEventListener('click',e=>{if(e.target===dialog)hide()});
dialog.addEventListener('close',()=>{previous?.focus()});
})();
