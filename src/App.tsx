import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const swift = { duration: 0.72, ease: [0.16, 1, 0.3, 1] } as const;
const spring = { type: "spring", stiffness: 145, damping: 24, mass: 0.9 } as const;

const heroSlides = [
  {
    label: "H.Space",
    title: "시간이 머무는 곳,\n선혜원",
    body: "선혜원은 자연과 전통 건축이 조화를 이루는 공간으로, SK가 오랜 시간 이어온 정신과 가치가 고요히 깃들어 있습니다. 계절에 따라 달라지는 풍경과 깊은 시간의 흔적을 따라 걸으며, 일상에서 잠시 벗어나 변하지 않는 헤리티지의 아름다움을 직접 경험해 보세요.",
    image: "/assets/hero-palace-v2.png",
    peek: "/assets/hero-garden-v2.png",
  },
  {
    label: "Archive",
    title: "시간을 잇는 기록,\nSK Heritage",
    body: "한 사람의 신념에서 시작된 길은 세대를 지나 이어졌습니다. 수많은 도전과 선택의 순간을 따라 오늘의 SK를 만든 생각과 실천을 만나보세요.",
    image: "/assets/hero-garden-v2.png",
    peek: "/assets/factory-v2.png",
  },
  {
    label: "Collection",
    title: "기억을 품은 사물,\n다음 시대의 가치",
    body: "창업의 순간부터 성장의 과정까지, 시대의 흔적을 간직한 소장품을 통해 SK의 정신과 문화가 어떻게 이어져 왔는지 살펴봅니다.",
    image: "/assets/collection-hall-v2.png",
    peek: "/assets/loom-v2.png",
  },
];

const historySlides = [
  {
    person: "최종건 창업회장",
    range: "1926 ~1973",
    title: "1953.10 창업, 무에서 유를 창조하다.",
    body: "1953년 4월 전쟁 후 폐허가 된 채 매물로 나온 공장 부지를 매입하여 이전에 함께 일했던 직장동료들을 다시 불러 모아 폐허 더미 속에서 부서진 벽돌과 못 하나도 주워가며 공장을 재건하고, 파손된 직기들도 최종건 창업회장이 손수 재조립하며, 1953년 10월 직기 15대로 선경직물을 창업한다.",
    image: "/assets/founder-v2.png",
    nextPerson: "최종현 선대회장",
    nextImage: "/assets/chairman-v2.png",
  },
  {
    person: "최종현 선대회장",
    range: "1929–1998",
    title: "일화1. 사람이 중요한 거야",
    body: "최종현 선대회장은 항상 “사람이 먼저다.”라고 말했습니다. “기업에서 사람은 시작이자 마지막인 것 같습니다. 그만큼 사람은 중요합니다. 어떤 사람들과 일하느냐 하는 것은 개인뿐만 아니라 회사 전체로도 매우 중요한 일입니다.”\n\n한번은 큰 손해를 끼친 프로젝트에 대해 브리핑하는 시간을 갖게 되었습니다. 프로젝트 실패로 잔뜩 주눅이 들어 있는 책임자는 큰 손해를 봤다는 이유로 어찌할 바를 모르고 있었습니다. 이때 최종현 선대회장은 실수한 것을 나무라기보다 도리어 따뜻하게 격려해 주었습니다.\n\n“돈을 죽여도 사람을 죽이면 안 되지. 사람이 중요한 거야.”\n\n이렇듯 최종현 선대회장이 가장 중요시한 것은 첫째도, 둘째도 ‘사람’이었습니다.",
    image: "/assets/chairman-history-v2.png",
    nextPerson: "최종건 창업회장",
    nextImage: "/assets/founder-history-preview-v2.png",
  },
];

function AssetArrowButton({ onClick, label, small = false }: { onClick: () => void; label: string; small?: boolean }) {
  return (
    <motion.button
      className={small ? "asset-arrow-small" : "asset-arrow-large"}
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ x: small ? 2 : 9 }}
      whileTap={{ scale: 0.97 }}
      transition={spring}
    >
      <img src={small ? "/assets/cta-arrow.png" : "/assets/large-arrow.png"} alt="" />
    </motion.button>
  );
}

function Pager({ index, previous, next, total = 3 }: { index: number; previous: () => void; next: () => void; total?: number }) {
  return (
    <div className="pager">
      <i />
      <button type="button" onClick={previous} aria-label="이전"><span>‹</span></button>
      <b>{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</b>
      <button type="button" onClick={next} aria-label="다음"><span>›</span></button>
    </div>
  );
}

function Hero() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const slide = heroSlides[index];
  const move = useCallback((step: number) => setIndex((current) => (current + step + 3) % 3), []);
  return (
    <section className="canvas-section hero" id="top">
      <div className="hero-title-symbol" aria-label="HERITAGE"><img src="/assets/heritage-symbol.png" alt="HERITAGE" /></div>
      <nav className="top-nav" aria-label="주요 메뉴">
        <a href="#history">그룹역사</a><a href="#space">H.Space</a><a href="#collection">전시/소장품</a><a href="#news">뉴스보드</a>
      </nav>
      <div className="hero-sk-symbol"><img src="/assets/sk-symbol.png" alt="SK" /></div>
      <p className="hero-intro">시간이 흘러도 변하지 않는 가치가 있습니다. 한 사람의 신념에서 시작된 길은 세대를 지나 이어지고,<br />수많은 도전과 선택의 순간들이 모여 오늘의 SK를 만들었습니다. 그 시간 속에 쌓인 이야기와 가치를<br />SK Heritage에서 만나보세요.</p>
      <div className="hero-rule" />
      <div className="hero-control-row"><Pager index={index} previous={() => move(-1)} next={() => move(1)} /><span>{slide.label}</span></div>
      <motion.div className="hero-image" onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} animate={{ width: hovered ? 760 : 722 }} transition={spring}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img key={slide.image} src={slide.image} alt="선혜원" initial={{ x: 90, scale: 1.05 }} animate={{ x: 0, scale: hovered ? 1.035 : 1 }} exit={{ x: -90, opacity: 0 }} transition={spring} />
        </AnimatePresence>
      </motion.div>
      <div className="hero-copy">
        <AnimatePresence initial={false} mode="wait">
          <motion.div key={slide.title} className="hero-copy-motion" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -32, opacity: 0 }} transition={swift}>
            <h2>{slide.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
            <div><p>{slide.body}</p><a className="figma-cta" href="#collection"><img src="/assets/cta-arrow.png" alt="" /><strong>방문예약하러가기</strong></a></div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="hero-peek"><AnimatePresence initial={false} mode="popLayout"><motion.img key={slide.peek} src={slide.peek} alt="다음 장면" initial={{ x: 80 }} animate={{ x: 0 }} exit={{ x: -80 }} transition={spring} /></AnimatePresence></div>
    </section>
  );
}

function History() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const slide = historySlides[index];
  const move = (step: number) => { setDirection(step); setIndex((current) => (current + step + historySlides.length) % historySlides.length); };
  return (
    <section className={`canvas-section history ${index === 1 ? "history-alt" : ""}`} id="history">
      <div className="history-frame">
        <div className="history-primary">
          <div className="history-meta"><span>{slide.person}</span><span>{slide.range}</span></div>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img key={slide.image} src={slide.image} alt={slide.person} custom={direction} variants={{ enter: (d: number) => ({ x: d * 180, opacity: 0 }), show: { x: 0, opacity: 1 }, exit: (d: number) => ({ x: d * -180, opacity: 0 }) }} initial="enter" animate="show" exit="exit" transition={spring} />
          </AnimatePresence>
        </div>
        <div className="history-copy">
          <AnimatePresence initial={false} mode="wait">
            <motion.div key={slide.title} initial={{ x: direction * 48, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: direction * -40, opacity: 0 }} transition={swift}>
              <Pager index={index} total={historySlides.length} previous={() => move(-1)} next={() => move(1)} />
              <h2>{slide.title}</h2><p className="history-body">{slide.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <button className="history-next" type="button" onClick={() => move(1)} aria-label={`${slide.nextPerson} 보기`}>
          <div><span>{slide.nextPerson}</span><motion.img className="large-arrow-static" src="/assets/large-arrow.png" alt="" whileHover={{ x: 12 }} transition={spring} /></div>
          <AnimatePresence initial={false} mode="popLayout"><motion.img key={slide.nextImage} src={slide.nextImage} alt={slide.nextPerson} initial={{ x: -90, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 90, opacity: 0 }} transition={spring} /></AnimatePresence>
        </button>
      </div>
    </section>
  );
}

const timelineEras = [
  {
    year: "1953",
    activeTick: 11,
    statement: ["새로운 가능성을 향한 도전과", "흔들리지 않는 신념은 오늘의 SK를", "이루는 단단한 뿌리가 되었습니다."],
    items: [
      { slot: "a", image: "/assets/timeline-1953-factory.png", title: "창립무렵의 선경직물", body: "최종건 창업회장은 한국전쟁 중 폐허가 된 선경직물 건물을 복구해 재건하기로 결심, 건물 복구와 흩어진 부속품을 모아 직기를 재조립하였습니다." },
      { slot: "b", image: "/assets/timeline-1953-blanket.png", title: "봉황새 이불감", body: "봉황새 이불감은 출시하자마자 날개 돋친 듯 팔렸고, 한동안 예비 신부가 꼭 준비해야 할 필수 혼숫감이 될 정도로 큰 인기를 누렸다." },
      { slot: "c", image: "/assets/timeline-1953-founding.png", title: "선경직물 창립", body: "한국전쟁의 폐허 속에서 선경직물을 창업, SK의 역사가 시작되었습니다." },
    ],
  },
  {
    year: "1970",
    activeTick: 10,
    statement: ["SK의 무대는 더 넓은 세상으로", "확장 되었습니다. 끊임없는 변화와", "도전은 항상 새로운 길을 열었습니다."],
    items: [
      { slot: "a", image: "/assets/timeline-1970-export.png", title: "종합상사 설립, 수출 선봉에 서다", body: "인도네시아에 수출하기 위해 폴리에스터 원면을 선적하고 있습니다. 선경은 1976년 수출액 1억 1,335만 달러, 당기순이익 65만 4,000달러의 실적을 올렸습니다." },
      { slot: "b", image: "/assets/timeline-1970-cdma.png", title: "세계 최초 CDMA 이동전화 상용화", body: "한국이동통신(현 SK텔레콤)은 세계 최초로 CDMA 이동전화 상용 서비스에 성공, 세계 CDMA 리더로 부상했습니다." },
      { slot: "c", image: "/assets/timeline-1970-film.png", title: "국내 최초 폴리에스터 필름 개발", body: "선경화학(현 SKC)은 국내 최초로 폴리에스터 필름 개발에 성공했습니다." },
    ],
  },
];

function Timeline() {
  const [active, setActive] = useState<number | null>(null);
  const [era, setEra] = useState(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLElement | null>(null);
  const wheelLock = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let wasInside = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.55 && !wasInside) {
        wasInside = true;
        setDirection(1);
        setEra(0);
      } else if (entry.intersectionRatio < 0.1) {
        wasInside = false;
      }
    }, { threshold: [0.1, 0.55] });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 20 || wheelLock.current) return;
      const step = event.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(timelineEras.length - 1, era + step));
      if (next === era) return;
      event.preventDefault();
      wheelLock.current = true;
      setDirection(step);
      setEra(next);
      window.setTimeout(() => { wheelLock.current = false; }, 900);
    };
    section.addEventListener("wheel", handleWheel, { passive: false });
    return () => section.removeEventListener("wheel", handleWheel);
  }, [era]);

  const currentEra = timelineEras[era];
  return (
    <section ref={sectionRef} className="canvas-section timeline" id="space">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          className={`timeline-era era-${currentEra.year}`}
          key={currentEra.year}
          custom={direction}
          variants={{ enter: (d: number) => ({ x: d * 1920 }), show: { x: 0 }, exit: (d: number) => ({ x: d * -1920 }) }}
          initial="enter"
          animate="show"
          exit="exit"
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="timeline-statement">{currentEra.statement.map((line) => <span key={line}>{line}</span>)}</h2>
          {currentEra.items.map((item, index) => <motion.article key={`${currentEra.year}-${item.slot}`} className={`timeline-record slot-${item.slot}`} onHoverStart={() => setActive(index)} onHoverEnd={() => setActive(null)}><motion.img src={item.image} alt={item.title} animate={{ scale: active === index ? 1.035 : 1 }} transition={spring} /><div><h3>{item.title}</h3><p>{item.body}</p></div></motion.article>)}
        </motion.div>
      </AnimatePresence>
      <div className="timeline-year"><AnimatePresence initial={false} mode="wait"><motion.span key={currentEra.year} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={swift}>{currentEra.year}</motion.span></AnimatePresence></div>
      <div className="year-navigation" aria-label="연도 선택">
        <div className="year-bars" aria-hidden="true">{Array.from({ length: 12 }).map((_, i) => <i key={i} className={i === currentEra.activeTick ? "active" : ""} />)}</div>
        <div className="year-hit-zones">{timelineEras.map((item, index) => <button key={item.year} type="button" aria-label={`${item.year}년 보기`} onClick={() => { setDirection(index > era ? 1 : -1); setEra(index); }} />)}</div>
      </div>
      <motion.a className="timeline-skip" href="#collection" whileHover={{ y: 3 }} whileTap={{ scale: 0.98 }} transition={spring}>
        <span>연혁 건너뛰기</span><i><img src="/assets/timeline-skip-arrow.svg" alt="" /></i>
      </motion.a>
    </section>
  );
}

const sideObjects = [
  { className: "rooster", image: "/assets/object-rooster-v2.png", label: "황금 장식품" },
  { className: "glasses", image: "/assets/object-watch-v2.png", mask: "/assets/object-glasses-v2.svg", label: "안경" },
  { className: "clock", image: "/assets/object-clock-v2.png", label: "탁상시계" },
  { className: "gift", image: "/assets/object-gift-source-v2.png", mask: "/assets/object-gift-v2.svg", label: "기념품" },
];

function Collection() {
  const [main, setMain] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <section className="canvas-section collection" id="collection">
      <motion.button className="collection-left top" type="button" onHoverStart={() => setHovered("loom")} onHoverEnd={() => setHovered(null)} onClick={() => setMain(0)}><span>SK의 시작을 짜 올린 기계</span><motion.img src="/assets/loom-v2.png" alt="직기" animate={{ scale: hovered === "loom" ? 1.05 : 1 }} transition={spring} /></motion.button>
      <motion.button className="collection-left bottom" type="button" onHoverStart={() => setHovered("car")} onHoverEnd={() => setHovered(null)} onClick={() => setMain(1)}><span>창업회장 사용 차량</span><motion.img src="/assets/car-v2.png" alt="창업회장 사용 차량" animate={{ scale: hovered === "car" ? 1.05 : 1 }} transition={spring} /></motion.button>
      <div className="collection-center"><AnimatePresence initial={false} mode="popLayout"><motion.img key={main} src={main === 0 ? "/assets/collection-hall-v2.png" : "/assets/hero-garden-v2.png"} alt="SK Heritage 전시 공간" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }} exit={{ clipPath: "inset(0 0 0 100%)" }} transition={swift} /></AnimatePresence></div>
      <div className="collection-side"><div className="collection-side-head"><span>전시/소장품</span><AssetArrowButton onClick={() => setMain((main + 1) % 2)} label="다음 소장품" /></div><div className="collection-object-stage">{sideObjects.map((item, index) => <motion.button type="button" key={item.className} className={`side-object ${item.className}`} onClick={() => setMain(index % 2)} whileHover={{ scale: 1.08 }} transition={spring}>{item.mask ? <span className="masked-object" style={{ maskImage: `url(${item.mask})`, WebkitMaskImage: `url(${item.mask})` }}><img src={item.image} alt={item.label} /></span> : <img src={item.image} alt={item.label} />}</motion.button>)}</div></div>
    </section>
  );
}

function News() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section className="canvas-section news" id="news">
      <article className="exhibition"><div><h2>김수자 개인전 〈호흡 - 선혜원〉 개막</h2><p>고요한 숨결과 명상이 어우러진 공간은 과거와 현재, 존재와 공간이 교차하는 새로운 경험을 제시하며, 실재와 허상이 혼재된 유동적인 건축 환경을 형성한다.</p></div><a href="#top"><img src="/assets/cta-arrow.png" alt="" /><span>Exhibition</span></a><motion.img src="/assets/exhibition-v2.png" alt="김수자 개인전" whileHover={{ scale: 1.035 }} transition={spring} /></article>
      <div className="philosophy"><h2>경영 철학</h2><motion.img className="philosophy-photo" src="/assets/spirit-v2.png" alt="경영 철학" whileHover={{ scale: 1.025 }} transition={spring} /><motion.p className="philosophy-note" whileHover={{ x: 10 }} transition={spring}>최고의 경쟁력을 보유하고 장기적 생존 조건을 확보하여 지속적으로 경제적 가치, 사회적 가치, 구성원 행복을 창출해 나가는 회사가 SUPEX Company 입니다.</motion.p><div className="philosophy-type"><img src="/assets/skms-symbol.png" alt="SKMS" /><i /><img src="/assets/supex-symbol.png" alt="SUPEX" /></div></div>
      {[{ title: "선혜원 여름 관람\n예약 안내", body: "푸른 자연과 전통 건축이 조화를 이루는 선혜원의 여름 풍경을 만나보세요. 공간에 깃든 역사와 이야기를 깊이 경험할 수 있도록 사전 예약제로 관람 프로그램을 운영합니다." }, { title: "SK 디지털 헤리티지\n아카이브 오픈", body: "SK의 성장 과정과 시대별 주요 순간을 담은 디지털 헤리티지 아카이브가 새롭게 문을 열었습니다. 창업 초기의 기록부터 주요 소장품에 이르기까지 SK의 역사와 정신을 온라인에서 폭넓게 만나볼 수 있습니다." }].map((item, index) => <motion.article key={item.title} className={`news-card card-${index}`} onHoverStart={() => setHovered(index)} onHoverEnd={() => setHovered(null)} animate={{ backgroundColor: hovered === index ? "#f05327" : "#e3edf4", color: hovered === index ? "#fff" : "#000" }} transition={swift}><h3>{item.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h3><p>{item.body}</p></motion.article>)}
      <div className="news-list">{["시간을 잇는 기록,\nSK 헤리티지 특별전", "선혜원의\n건축과 예술", "사진으로 만나는\nSK의 시작"].map((title) => <a href="#top" key={title}>{title.split("\n").map((line) => <span key={line}>{line}</span>)}</a>)}</div>
    </section>
  );
}

function Footer() {
  return <footer className="footer"><div className="footer-statement"><h2>한 세대의 신념이,<br />다음 시대의 가치로.</h2><p>Built through time. Carried into tomorrow.</p></div><nav><a href="#history">그룹역사</a><a href="#space">H.Space</a><a href="#collection">전시/소장품</a><a href="#news">뉴스보드</a></nav><div className="footer-rule" /><img src="/assets/sk-logo-v2.png" alt="SK Heritage" /><span>©SK HERITAGE MUSEUM, All Rights Reserved.</span></footer>;
}

export function App() {
  const reduce = useReducedMotion();
  return <main data-reduced-motion={reduce ? "true" : "false"}><Hero /><History /><Timeline /><Collection /><News /><Footer /></main>;
}
