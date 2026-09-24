const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("show");
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const glow=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",(e)=>{
  glow.style.left=e.clientX+"px";
  glow.style.top=e.clientY+"px";
});

const menu=document.querySelector(".menu-btn");
const nav=document.querySelector(".nav");
menu.addEventListener("click",()=>{
  const open=nav.style.display==="flex";
  nav.style.display=open?"none":"flex";
  if(!open){
    nav.style.position="absolute";
    nav.style.top="74px";
    nav.style.left="0";
    nav.style.right="0";
    nav.style.padding="20px 6vw";
    nav.style.background="rgba(6,27,42,.98)";
    nav.style.flexDirection="column";
  }
});
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>nav.style.display="none"));


/* ===== V2 MOTION BOOST JS — additive only ===== */
(() => {
  const root=document.documentElement;
  const header=document.querySelector(".site-header");

  // Smooth pointer glow follow.
  const glow=document.querySelector(".cursor-glow");
  if(glow){
    let tx=0,ty=0,cx=0,cy=0;
    addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY},{passive:true});
    const tick=()=>{
      cx+=(tx-cx)*.17; cy+=(ty-cy)*.17;
      glow.style.left=cx+"px"; glow.style.top=cy+"px";
      requestAnimationFrame(tick);
    };
    tick();
  }

  const updateScroll=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    root.style.setProperty("--scroll-progress",Math.min(1,scrollY/max));
    if(header) header.classList.toggle("scrolled",scrollY>40);

    // Subtle hero parallax; does not alter content.
    if(innerWidth>900){
      const hero=document.querySelector(".hero");
      const copy=hero?.querySelector(".hero-copy");
      const visual=hero?.querySelector(".hero-profile");
      const y=Math.min(scrollY*.035,18);
      if(copy) copy.style.translate=`0 ${y}px`;
      if(visual) visual.style.translate=`0 ${Math.min(scrollY*.06,28)}px`;
    }

    // Active navigation.
    document.querySelectorAll(".site-header nav a").forEach(link=>{
      const id=link.getAttribute("href");
      if(!id?.startsWith("#")) return;
      const sec=document.querySelector(id);
      link.classList.toggle("active",!!sec && scrollY+120>=sec.offsetTop && scrollY+120<sec.offsetTop+sec.offsetHeight);
    });
  };
  addEventListener("scroll",updateScroll,{passive:true});
  updateScroll();

  // Reveal existing V2 elements.
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("motion-in");
        obs.unobserve(entry.target);
      }
    });
  },{threshold:.08});
  document.querySelectorAll(".about-card,.fact,.timeline-item,.skill-card,.project-card,.edu,.contact-grid>a,.contact-grid>div,.hero-copy,.hero-profile").forEach(el=>obs.observe(el));

  // Existing skill bars animate only when visible.
  document.querySelectorAll(".meter i").forEach(bar=>{
    const width=bar.style.width;
    bar.style.width="0";
    const bObs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        requestAnimationFrame(()=>bar.style.width=width);
        bObs.disconnect();
      }
    },{threshold:.5});
    bObs.observe(bar);
  });

  // Desktop 3D tilt for existing cards.
  if(matchMedia("(pointer:fine)").matches && innerWidth>900){
    document.querySelectorAll(".about-card,.fact,.skill-card,.project-card,.profile-card").forEach(card=>{
      card.addEventListener("pointermove",e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5;
        const y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(900px) rotateX(${(-y*3.5).toFixed(2)}deg) rotateY(${(x*4.5).toFixed(2)}deg) translateY(-8px)`;
      });
      card.addEventListener("pointerleave",()=>{card.style.transform=""});
    });

    // Magnetic movement for existing buttons.
    document.querySelectorAll(".btn,.nav-pill").forEach(btn=>{
      btn.addEventListener("pointermove",e=>{
        const r=btn.getBoundingClientRect();
        btn.style.transform=`translate(${((e.clientX-(r.left+r.width/2))*.07).toFixed(2)}px,${((e.clientY-(r.top+r.height/2))*.07).toFixed(2)}px)`;
      });
      btn.addEventListener("pointerleave",()=>{btn.style.transform=""});
    });
  }
})();

