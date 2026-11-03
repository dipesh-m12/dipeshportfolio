// The vendored UMD build is loaded as a deferred classic script in index.html.
const gsap=window.gsap;
if(gsap){
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
    gsap.from('.hero-copy',{y:24,opacity:0,duration:.65,ease:'power2.out',clearProps:'all'});
    gsap.from('.hero-art',{y:15,opacity:0,duration:.65,delay:.1,ease:'power2.out',clearProps:'all'});
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);gsap.fromTo(entry.target,{y:24,opacity:.25},{y:0,opacity:1,duration:.55,ease:'power2.out',clearProps:'transform,opacity'});}
    },{threshold:.07});
    document.querySelectorAll('.career-card,.project-card,.about-layout,.education-line,.honors-list article,.expertise-layout,.contact-form-layout').forEach(element=>observer.observe(element));
    return ()=>observer.disconnect();
  });
  // Pointer-only card depth; keyboard focus and touch remain stationary.
  mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',()=>{
    const cleanups=[];
    document.querySelectorAll('.project-cover').forEach(card=>{
      const move=event=>{const r=card.getBoundingClientRect();gsap.to(card,{rotationX:(.5-(event.clientY-r.top)/r.height)*3,rotationY:((event.clientX-r.left)/r.width-.5)*4,transformPerspective:1200,duration:.35,ease:'power2.out',overwrite:true});};
      const reset=()=>gsap.to(card,{rotationX:0,rotationY:0,duration:.4,ease:'power2.out',clearProps:'transform'});
      card.addEventListener('pointermove',move);card.addEventListener('pointerleave',reset);card.addEventListener('blur',reset);
      cleanups.push(()=>{card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',reset);card.removeEventListener('blur',reset);gsap.killTweensOf(card);gsap.set(card,{clearProps:'transform'});});
    });return()=>cleanups.forEach(cleanup=>cleanup());
  });
}
const progress=document.querySelector('.reading-progress>span');
let scheduled=false;
const update=()=>{const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?Math.min(1,Math.max(0,scrollY/total)):0})`;scheduled=false;};
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
addEventListener('resize',update);update();
