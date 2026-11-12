/* ORIENTIVE editorial article detail rendering */
(()=>{
 const articles=window.ORIENTIVE_INSIGHTS||[];
 const slug=new URLSearchParams(location.search).get('slug');
 const item=articles.find(a=>a.slug===slug);
 const root=document.getElementById('journalArticle');
 if(!root)return;
 if(!item){document.title='Insights | ORIENTIVE';root.querySelector('#articleTitle').textContent='콘텐츠를 찾을 수 없습니다.';root.querySelector('#articleLede').textContent='다른 콘텐츠를 살펴보세요.';root.querySelector('.journal-article__visual').hidden=true;root.querySelector('.journal-related').hidden=true;return}
 document.title=item.title+' | ORIENTIVE Insights';
 const description=document.querySelector('meta[name="description"]');if(description)description.content=item.desc;
 root.querySelector('#articleCategory').textContent=item.en;
 root.querySelector('#articleTitle').textContent=item.title;
 root.querySelector('#articleLede').textContent=item.desc;
 const image=root.querySelector('#articleImage');
 image.src='https://images.unsplash.com/'+item.image+'?auto=format&fit=crop&w=1480&h=835&q=85';
 image.alt=item.title+' 관련 숙박 공간 이미지';
 const body=root.querySelector('#articleBody');
 item.sections.forEach(([heading,copy])=>{
  const section=document.createElement('section'),h=document.createElement('h2'),p=document.createElement('p');
  h.textContent=heading;p.textContent=copy;section.append(h,p);body.append(section);
 });
 const related=root.querySelector('#articleRelated');
 articles.filter(a=>a.slug!==slug).slice(0,3).forEach(a=>{
  const link=document.createElement('a'),img=document.createElement('img'),title=document.createElement('strong');
  link.href='./article.html?slug='+encodeURIComponent(a.slug);
  img.src='https://images.unsplash.com/'+a.image+'?auto=format&fit=crop&w=480&h=360&q=78';
  img.loading='lazy';img.alt='';title.textContent=a.title;link.append(img,title);related.append(link);
 });
})();
