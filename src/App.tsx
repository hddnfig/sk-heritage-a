import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const assetUrl = (filename: string) => `./assets/${filename}`;

const swift = { duration: 0.72, ease: [0.16, 1, 0.3, 1] } as const;
const spring = { type: "spring", stiffness: 145, damping: 24, mass: 0.9 } as const;

function DeferredSection({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    if (!placeholder || mounted) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 0.5) return;
      setMounted(true);
      observer.disconnect();
    }, { rootMargin: "0px", threshold: 0.5 });
    observer.observe(placeholder);
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) return <div ref={placeholderRef} id={id} className={`deferred-section-placeholder ${className ?? ""}`} data-deferred-section={id} data-section-snap="true" aria-hidden="true" />;
  return <motion.div className={`deferred-section-content ${className ?? ""}`} data-deferred-section={id} data-section-snap="true" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
}

const heroSlides = [
  {
    label: "H.Space",
    title: "시간이 머무는 곳,\n선혜원",
    body: "선혜원은 자연과 전통 건축이 조화를 이루는 공간으로, SK가 오랜 시간 이어온 정신과 가치가 고요히 깃들어 있습니다. 계절에 따라 달라지는 풍경과 깊은 시간의 흔적을 따라 걸으며, 일상에서 잠시 벗어나 변하지 않는 헤리티지의 아름다움을 직접 경험해 보세요.",
    image: assetUrl("hero-seonhyewon-v4.png"),
    peek: assetUrl("hero-memorial-v4.png"),
    imageClass: "seonhyewon",
    peekClass: "memorial",
  },
  {
    label: "H.Space",
    title: "두 거목의 뜻을 기리는 곳,\nSK기념관",
    body: "SK기념관은 최종건 창업회장과 최종현 선대회장의 삶과 정신을 기리고, SK가 걸어온 도전과 성장의 역사를 되새기는 공간입니다. 두 회장의 발자취와 유품, SK의 성장 과정과 경영철학을 따라가며 오늘까지 이어지고 있는 SK의 도전과 혁신의 정신을 만나보세요.",
    image: assetUrl("hero-memorial-v4.png"),
    peek: assetUrl("hero-oldhouse-v4.png"),
    imageClass: "memorial",
    peekClass: "oldhouse",
  },
  {
    label: "H.Space",
    title: "시작의 정신을 간직한 집,\nSK고택",
    body: "최종건 창업회장과 최종현 선대회장이 태어나고 자란 생가를 복원한 SK고택은 SK의 시작과 기업가정신을 만나는 공간입니다. 1950~60년대의 모습을 담은 한옥과 전시 공간을 따라 걸으며, 사업보국과 인재양성으로 이어진 두 회장의 철학과 오늘의 SK를 만든 시작의 정신을 만나보세요.",
    image: assetUrl("hero-oldhouse-v4.png"),
    peek: assetUrl("hero-seonhyewon-v4.png"),
    imageClass: "oldhouse",
    peekClass: "seonhyewon",
  },
];

const historySlides = [
  {
    person: "최종건 창업회장",
    range: "1926 ~1973",
    title: "1953.10 창업, 무에서 유를 창조하다.",
    body: "1953년 4월 전쟁 후 폐허가 된 채 매물로 나온 공장 부지를 매입하여 이전에 함께 일했던 직장동료들을 다시 불러 모아 폐허 더미 속에서 부서진 벽돌과 못 하나도 주워가며 공장을 재건하고, 파손된 직기들도 최종건 창업회장이 손수 재조립하며, 1953년 10월 직기 15대로 선경직물을 창업한다.",
    image: assetUrl("founder-v2.png"),
    nextPerson: "최종현 선대회장",
    nextImage: assetUrl("chairman-v2.png"),
  },
  {
    person: "최종현 선대회장",
    range: "1929–1998",
    title: "일화1. 사람이 중요한 거야",
    body: "최종현 선대회장은 항상 “사람이 먼저다.”라고 말했습니다. “기업에서 사람은 시작이자 마지막인 것 같습니다. 그만큼 사람은 중요합니다. 어떤 사람들과 일하느냐 하는 것은 개인뿐만 아니라 회사 전체로도 매우 중요한 일입니다.”\n\n한번은 큰 손해를 끼친 프로젝트에 대해 브리핑하는 시간을 갖게 되었습니다. 프로젝트 실패로 잔뜩 주눅이 들어 있는 책임자는 큰 손해를 봤다는 이유로 어찌할 바를 모르고 있었습니다. 이때 최종현 선대회장은 실수한 것을 나무라기보다 도리어 따뜻하게 격려해 주었습니다.\n\n“돈을 죽여도 사람을 죽이면 안 되지. 사람이 중요한 거야.”\n\n이렇듯 최종현 선대회장이 가장 중요시한 것은 첫째도, 둘째도 ‘사람’이었습니다.",
    image: assetUrl("chairman-history-v2.png"),
    nextPerson: "최종건 창업회장",
    nextImage: assetUrl("founder-history-preview-v2.png"),
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
      <img src={small ? assetUrl("cta-arrow.png") : assetUrl("large-arrow.png")} alt="" />
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
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [targetIndex, setTargetIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [peekHovered, setPeekHovered] = useState(false);
  const slide = heroSlides[index];
  const incomingIndex = transitioning ? targetIndex : (index + 1) % heroSlides.length;
  const incomingSlide = heroSlides[incomingIndex];
  const move = useCallback((step: number) => {
    if (transitioning) return;
    setDirection(step);
    setTargetIndex((index + step + heroSlides.length) % heroSlides.length);
    setPeekHovered(false);
    setTransitioning(true);
  }, [index, transitioning]);
  const finishMove = () => {
    if (!transitioning) return;
    setIndex(targetIndex);
    setTransitioning(false);
  };
  const reveal = (delay: number, x = 0, y = 18) => reduce
    ? { initial: false as const }
    : {
        initial: { opacity: 0, x, y },
        animate: { opacity: 1, x: 0, y: 0 },
        transition: { duration: 0.82, delay, ease: [0.16, 1, 0.3, 1] as const },
      };
  return (
    <section className="canvas-section hero" id="top">
      <span className="hero-snap-anchor" data-snap-id="hero-space" aria-hidden="true" />
      <motion.div className="hero-title-symbol" aria-label="HERITAGE" {...reveal(0.08, -24, 0)}><img src={assetUrl("heritage-symbol.png")} alt="HERITAGE" /></motion.div>
      <motion.nav className="top-nav" aria-label="주요 메뉴" {...reveal(0.2, 0, -14)}>
        <a href="#">그룹역사</a><a href="#">H.Space</a><a href="#">전시/소장품</a><a href="#">뉴스보드</a>
      </motion.nav>
      <motion.div className="hero-sk-symbol" {...reveal(0.32, 24, 0)}><img src={assetUrl("sk-symbol.png")} alt="SK" /></motion.div>
      <motion.p className="hero-intro" {...reveal(0.44)}>시간이 흘러도 변하지 않는 가치가 있습니다. 한 사람의 신념에서 시작된 길은 세대를 지나 이어지고,<br />수많은 도전과 선택의 순간들이 모여 오늘의 SK를 만들었습니다. 그 시간 속에 쌓인 이야기와 가치를<br />SK Heritage에서 만나보세요.</motion.p>
      <motion.div
        className="hero-rule"
        initial={reduce ? false : { opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.56, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "left center" }}
      />
      <motion.div className="hero-control-row" {...reveal(0.68, -18, 0)}><Pager index={index} previous={() => move(-1)} next={() => move(1)} /><span>{slide.label}</span></motion.div>
      <div className="hero-panel-stage">
        <motion.div
          className="hero-panel hero-panel-current"
          initial={reduce ? false : { opacity: 0, x: 84 }}
          animate={{ opacity: transitioning ? 0 : 1, x: transitioning ? direction * -44 : 0 }}
          transition={{ duration: reduce ? 0.01 : transitioning ? 0.48 : 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-image" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <motion.img className={`hero-asset-${slide.imageClass}`} src={slide.image} alt={slide.title.replace("\n", " ")} animate={{ scale: hovered && !reduce ? 1.035 : 1 }} transition={spring} />
          </div>
          <div className="hero-copy"><div className="hero-copy-motion">
            <h2>{slide.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
            <div><p>{slide.body}</p><a className="figma-cta" href="#collection"><img src={assetUrl("cta-arrow.png")} alt="" /><strong>방문예약하러가기</strong></a></div>
          </div></div>
        </motion.div>
        <motion.div
          key={`incoming-${incomingIndex}-${direction}`}
          className="hero-panel hero-panel-incoming"
          initial={{ x: direction < 0 ? -1249 : 1249 }}
          animate={{ x: transitioning ? 0 : direction < 0 ? -1249 : 1249 }}
          transition={{ duration: reduce ? 0.01 : 1.18, delay: reduce ? 0 : transitioning ? 0.24 : 0, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={finishMove}
          aria-hidden={!transitioning}
        >
          <div className="hero-image"><img className={`hero-asset-${incomingSlide.imageClass}`} src={incomingSlide.image} alt="" /></div>
          <div className="hero-copy"><div className="hero-copy-motion">
            <h2>{incomingSlide.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
            <div><p>{incomingSlide.body}</p><a className="figma-cta" href="#collection" tabIndex={transitioning ? 0 : -1}><img src={assetUrl("cta-arrow.png")} alt="" /><strong>방문예약하러가기</strong></a></div>
          </div></div>
        </motion.div>
      </div>
      <motion.button
        className="hero-peek"
        type="button"
        onClick={() => move(1)}
        onHoverStart={() => setPeekHovered(true)}
        onHoverEnd={() => setPeekHovered(false)}
        aria-label="다음 콘텐츠 보기"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={transitioning ? undefined : { x: -10 }}
        transition={{
          opacity: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 1.08, ease: [0.16, 1, 0.3, 1] },
          x: spring,
        }}
      >
        <motion.span className="hero-peek-dim" animate={{ opacity: peekHovered ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }} />
        <motion.img className="hero-peek-arrow" src={assetUrl("large-arrow.png")} alt="" animate={{ opacity: peekHovered ? 1 : 0, x: peekHovered ? 0 : -24 }} transition={{ duration: reduce ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }} />
      </motion.button>
    </section>
  );
}

function History() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [nextHovered, setNextHovered] = useState(false);
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
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.title}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { x: direction * -40, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Pager index={index} total={historySlides.length} previous={() => move(-1)} next={() => move(1)} />
              <motion.h2
                initial={reduce ? false : { clipPath: "inset(0 100% 0 0)", x: -12, opacity: 0 }}
                animate={{ clipPath: "inset(0 0% 0 0)", x: 0, opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.78, delay: reduce ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {slide.title}
              </motion.h2>
              <motion.p
                className="history-body"
                initial={reduce ? false : { clipPath: "inset(0 0 100% 0)", y: 18, opacity: 0 }}
                animate={{ clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.86, delay: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {slide.body}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
        <motion.button className="history-next" type="button" onClick={() => move(1)} aria-label={`${slide.nextPerson} 보기`} onHoverStart={() => setNextHovered(true)} onHoverEnd={() => setNextHovered(false)} animate={{ backgroundColor: nextHovered ? "rgba(240, 83, 39, 0.09)" : "rgba(255, 255, 255, 0)" }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          <div><span>{slide.nextPerson}</span><motion.img className="large-arrow-static" src={assetUrl("large-arrow.png")} alt="" animate={nextHovered ? { x: [0, 18, 5, 18, 0], opacity: [1, .68, 1, .78, 1] } : { x: 0, opacity: 1 }} transition={nextHovered ? { duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.45 } : spring} /></div>
          <div className="history-next-image"><AnimatePresence initial={false} mode="popLayout"><motion.img key={slide.nextImage} src={slide.nextImage} alt={slide.nextPerson} initial={{ x: -90, opacity: 0 }} animate={{ x: 0, opacity: 1, scale: nextHovered ? 1.065 : 1 }} exit={{ x: 90, opacity: 0 }} transition={spring} /></AnimatePresence></div>
        </motion.button>
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
      { slot: "a", image: assetUrl("timeline-1953-factory.png"), title: "창립무렵의 선경직물", body: "최종건 창업회장은 한국전쟁 중 폐허가 된 선경직물 건물을 복구해 재건하기로 결심, 건물 복구와 흩어진 부속품을 모아 직기를 재조립하였습니다." },
      { slot: "b", image: assetUrl("timeline-1953-blanket.png"), title: "봉황새 이불감", body: "봉황새 이불감은 출시하자마자 날개 돋친 듯 팔렸고, 한동안 예비 신부가 꼭 준비해야 할 필수 혼숫감이 될 정도로 큰 인기를 누렸다." },
      { slot: "c", image: assetUrl("timeline-1953-founding.png"), title: "선경직물 창립", body: "한국전쟁의 폐허 속에서 선경직물을 창업, SK의 역사가 시작되었습니다." },
    ],
  },
  {
    year: "1970",
    activeTick: 10,
    statement: ["SK의 무대는 더 넓은 세상으로", "확장 되었습니다. 끊임없는 변화와", "도전은 항상 새로운 길을 열었습니다."],
    items: [
      { slot: "a", image: assetUrl("timeline-1970-export.png"), title: "종합상사 설립, 수출 선봉에 서다", body: "인도네시아에 수출하기 위해 폴리에스터 원면을 선적하고 있습니다. 선경은 1976년 수출액 1억 1,335만 달러, 당기순이익 65만 4,000달러의 실적을 올렸습니다." },
      { slot: "b", image: assetUrl("timeline-1970-cdma.png"), title: "세계 최초 CDMA 이동전화 상용화", body: "한국이동통신(현 SK텔레콤)은 세계 최초로 CDMA 이동전화 상용 서비스에 성공, 세계 CDMA 리더로 부상했습니다." },
      { slot: "c", image: assetUrl("timeline-1970-film.png"), title: "국내 최초 폴리에스터 필름 개발", body: "선경화학(현 SKC)은 국내 최초로 폴리에스터 필름 개발에 성공했습니다." },
    ],
  },
];

function Timeline() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [era, setEra] = useState(0);
  const [direction, setDirection] = useState(1);
  const [phase, setPhase] = useState<"idle" | "exit" | "year" | "enter">("idle");
  const [isVisible, setIsVisible] = useState(false);
  const [displayYear, setDisplayYear] = useState("1953");
  const sectionRef = useRef<HTMLElement | null>(null);
  const wheelLock = useRef(false);
  const lockedScrollY = useRef(0);
  const unlockTimer = useRef<number | undefined>(undefined);
  const transitionDoneAt = useRef(0);
  const lastTimelineWheelAt = useRef(0);
  const sequenceTimers = useRef<number[]>([]);
  const previousEra = useRef(0);
  const entrySnapArmed = useRef(true);

  useEffect(() => () => {
    if (unlockTimer.current !== undefined) window.clearTimeout(unlockTimer.current);
    sequenceTimers.current.forEach(window.clearTimeout);
    delete document.documentElement.dataset.timelineLocked;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let wasVisible = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.12) {
        if (!wasVisible) {
          previousEra.current = 0;
          setDisplayYear("1953");
          setEra(0);
          setDirection(1);
          setPhase("idle");
        }
        wasVisible = true;
        setIsVisible(true);
      }
      if (entry.intersectionRatio < 0.04) {
        wasVisible = false;
        setIsVisible(false);
        entrySnapArmed.current = true;
      }
    }, { threshold: [0.04, 0.12, 0.55] });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = timelineEras[era].year;
    if (reduce || previousEra.current === era) {
      previousEra.current = era;
      setDisplayYear(target);
      return;
    }
    previousEra.current = era;
    const frames = target === "1970"
      ? ["1956", "1959", "1962", "1965", "1968", "1970"]
      : ["1967", "1964", "1961", "1958", "1955", "1953"];
    const timers = frames.map((year, index) => window.setTimeout(() => setDisplayYear(year), 120 + index * 72));
    return () => timers.forEach(window.clearTimeout);
  }, [era, reduce]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const releaseTimelineWhenQuiet = () => {
      if (unlockTimer.current !== undefined) window.clearTimeout(unlockTimer.current);
      const now = performance.now();
      const wait = Math.max(transitionDoneAt.current - now, lastTimelineWheelAt.current + 260 - now, 0);
      unlockTimer.current = window.setTimeout(() => {
        const current = performance.now();
        if (current < transitionDoneAt.current || current - lastTimelineWheelAt.current < 250) {
          releaseTimelineWhenQuiet();
          return;
        }
        setPhase("idle");
        wheelLock.current = false;
        unlockTimer.current = undefined;
        delete document.documentElement.dataset.timelineLocked;
      }, Math.max(16, wait));
    };
    const holdPinnedPosition = () => {
      if (wheelLock.current && Math.abs(window.scrollY - lockedScrollY.current) > 1) {
        window.scrollTo(0, lockedScrollY.current);
      }
    };
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 18) return;
      if (wheelLock.current) {
        event.preventDefault();
        lastTimelineWheelAt.current = performance.now();
        holdPinnedPosition();
        releaseTimelineWhenQuiet();
        return;
      }
      const bounds = section.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));
      const visibleRatio = visibleHeight / Math.max(1, bounds.height);
      if (entrySnapArmed.current && visibleRatio >= 0.5) {
        event.preventDefault();
        const exactTop = window.scrollY + bounds.top;
        window.scrollTo(0, exactTop);
        entrySnapArmed.current = false;
        lockedScrollY.current = exactTop;
        wheelLock.current = true;
        lastTimelineWheelAt.current = performance.now();
        transitionDoneAt.current = performance.now() + (reduce ? 40 : 2100);
        document.documentElement.dataset.timelineLocked = "true";
        releaseTimelineWhenQuiet();
        return;
      }
      const isPinned = Math.abs(bounds.top) <= 24;
      if (!isPinned) return;
      const step = event.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(timelineEras.length - 1, era + step));
      if (next === era) return;
      event.preventDefault();
      const exactTop = window.scrollY + bounds.top;
      window.scrollTo(0, exactTop);
      lockedScrollY.current = exactTop;
      wheelLock.current = true;
      lastTimelineWheelAt.current = performance.now();
      document.documentElement.dataset.timelineLocked = "true";
      setDirection(step);
      setPhase("exit");
      sequenceTimers.current.forEach(window.clearTimeout);
      sequenceTimers.current = [];

      const exitDuration = reduce ? 20 : 1260;
      const yearDuration = reduce ? 20 : 620;
      const enterDuration = reduce ? 30 : 1960;
      transitionDoneAt.current = performance.now() + exitDuration + yearDuration + enterDuration;
      sequenceTimers.current.push(window.setTimeout(() => {
        setEra(next);
        setPhase("year");
      }, exitDuration));
      sequenceTimers.current.push(window.setTimeout(() => {
        setPhase("enter");
      }, exitDuration + yearDuration));
      unlockTimer.current = window.setTimeout(releaseTimelineWhenQuiet, exitDuration + yearDuration + enterDuration);
    };
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    window.addEventListener("scroll", holdPinnedPosition, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("scroll", holdPinnedPosition);
    };
  }, [era, reduce]);

  const currentEra = timelineEras[era];
  return (
    <div className="timeline-scroll-stage">
    <section ref={sectionRef} className="canvas-section timeline" id="space" data-timeline-era={era} data-timeline-phase={phase}>
      <motion.h2
        key={currentEra.year}
        className="timeline-statement"
        custom={direction}
        variants={{
          enter: (d: number) => ({ x: d * 220, opacity: 0 }),
          parked: (d: number) => ({ x: d * 220, opacity: 0 }),
          show: { x: 0, opacity: 1 },
          leave: { x: -80, opacity: 0 },
        }}
        initial="enter"
        animate={!isVisible ? "enter" : phase === "exit" ? "leave" : phase === "year" ? "parked" : "show"}
        transition={{ duration: reduce ? 0.01 : phase === "exit" ? 0.7 : 1.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {currentEra.statement.map((line) => <span key={line}>{line}</span>)}
      </motion.h2>
      {currentEra.items.map((item, index) => (
        <motion.article
          key={`${currentEra.year}-${item.slot}`}
          className={`timeline-record era-${currentEra.year} slot-${item.slot}`}
          custom={{ direction, index }}
          variants={{
            enter: ({ direction: d, index: i }: { direction: number; index: number }) => ({ x: d * (1920 + i * 180), opacity: 0 }),
            parked: ({ direction: d, index: i }: { direction: number; index: number }) => ({ x: d * (1920 + i * 180), opacity: 0, transition: { duration: 0 } }),
            show: ({ index: i }: { index: number }) => ({ x: 0, opacity: 1, transition: { duration: reduce ? 0.01 : 1.55, delay: reduce ? 0 : i * 0.18, ease: [0.16, 1, 0.3, 1] } }),
            leave: ({ index: i }: { index: number }) => ({ x: -54 - i * 18, opacity: 0, transition: { duration: reduce ? 0.01 : 0.72, delay: reduce ? 0 : i * 0.2, ease: [0.4, 0, 0.2, 1] } }),
          }}
          initial="enter"
          animate={!isVisible ? "enter" : phase === "exit" ? "leave" : phase === "year" ? "parked" : "show"}
          onHoverStart={() => setActive(index)}
          onHoverEnd={() => setActive(null)}
        ><motion.img src={item.image} alt={item.title} animate={{ scale: active === index ? 1.035 : 1 }} transition={spring} /><div><h3>{item.title}</h3><p>{item.body}</p></div></motion.article>
      ))}
      <div className="timeline-year"><div className="timeline-year-wheel"><AnimatePresence initial={false} custom={direction}><motion.span key={displayYear} custom={direction} initial={{ y: direction * 64, rotateX: direction * 78, opacity: 0 }} animate={{ y: 0, rotateX: 0, opacity: 1 }} exit={{ y: direction * -64, rotateX: direction * -78, opacity: 0 }} transition={{ duration: reduce ? 0.01 : 0.085, ease: [0.22, 1, 0.36, 1] }}>{displayYear}</motion.span></AnimatePresence></div></div>
      <div className="year-navigation" aria-label="연도 선택">
        <div className="year-bars" aria-hidden="true">{Array.from({ length: 12 }).map((_, i) => <i key={i} className={i === currentEra.activeTick ? "active" : ""} />)}</div>
        <div className="year-hit-zones">{timelineEras.map((item, index) => <button key={item.year} type="button" aria-label={`${item.year}년 보기`} onClick={() => { setDirection(index > era ? 1 : -1); setEra(index); }} />)}</div>
      </div>
      <motion.a className="timeline-skip" href="#collection" whileHover={{ y: 3 }} whileTap={{ scale: 0.98 }} transition={spring}>
        <span>연혁 건너뛰기</span><i><img src={assetUrl("timeline-skip-arrow.svg")} alt="" /></i>
      </motion.a>
    </section>
    </div>
  );
}

const sideObjects = [
  { className: "rooster", image: assetUrl("object-rooster-v3.png"), colorImage: assetUrl("object-rooster-color-v4.png"), label: "황금 장식품" },
  { className: "glasses", image: assetUrl("object-glasses-v4.png"), colorImage: assetUrl("object-glasses-color-v5.png"), label: "안경과 소장품" },
  { className: "clock", image: assetUrl("object-clock-v3.png"), colorImage: assetUrl("object-clock-color-v4.png"), label: "탁상시계" },
];

function Collection() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <section className="canvas-section collection" id="collection">
      <motion.button className="collection-left top" type="button" onHoverStart={() => setHovered("loom")} onHoverEnd={() => setHovered(null)}><span>SK의 시작을 짜 올린 기계</span><div className="collection-left-image"><img src={assetUrl("loom-v2.png")} alt="직기" /><motion.img className="color-layer" src={assetUrl("loom-color-v3.png")} alt="" animate={{ opacity: hovered === "loom" ? 1 : 0, scale: hovered === "loom" ? 1.035 : 1 }} transition={spring} /></div></motion.button>
      <motion.button className="collection-left bottom" type="button" onHoverStart={() => setHovered("car")} onHoverEnd={() => setHovered(null)}><span>창업회장 사용 차량</span><div className="collection-left-image"><img src={assetUrl("car-v2.png")} alt="창업회장 사용 차량" /><motion.img className="color-layer" src={assetUrl("car-color-v3.png")} alt="" animate={{ opacity: hovered === "car" ? 1 : 0, scale: hovered === "car" ? 1.035 : 1 }} transition={spring} /></div></motion.button>
      <div className="collection-center">
        <div className="collection-site-frame">
          <div className="collection-site-pan"><motion.img src={assetUrl("collection-memorial-hd.png")} alt="SK 기념관" animate={reduce ? undefined : { scale: [1, 1.065, 1], x: [0, -18, 0], y: [0, -8, 0] }} transition={reduce ? undefined : { duration: 22, ease: "easeInOut", repeat: Infinity }} /></div>
          <div className="collection-site-gradient" />
          <div className="collection-site-copy">
            <h2>두 거목을 기리는 공간,<br />SK 기념관</h2>
            <div><p className="collection-site-place"><b>경기도 용인시 처인구 원삼면</b><span>Memorial, History &amp; Legacy</span></p><p>최종건 창업회장과 최종현 선대회장의<br />도전과 열정, 경영철학과 발자취를 기리고<br />오늘의 SK로 이어진 역사와 정신을 되새기는 공간입니다.</p></div>
          </div>
        </div>
      </div>
      <div className="collection-side"><div className="collection-side-head"><span>전시/소장품</span><AssetArrowButton onClick={() => undefined} label="다음 소장품" /></div><div className="collection-object-stage">{sideObjects.map((item) => <motion.button type="button" key={item.className} className={`side-object ${item.className}`} onHoverStart={() => setHovered(item.className)} onHoverEnd={() => setHovered(null)} whileHover={{ scale: 1.08 }} transition={spring}><img src={item.image} alt={item.label} /><motion.img className="color-layer" src={item.colorImage} alt="" animate={{ opacity: hovered === item.className ? 1 : 0 }} transition={{ duration: .45, ease: [0.16, 1, 0.3, 1] }} /></motion.button>)}</div></div>
    </section>
  );
}

function News() {
  const [hovered, setHovered] = useState<string | null>(null);
  const newsCards = [
    { key: "summer", title: "선혜원 여름 관람\n예약 안내", image: assetUrl("news-card-summer-v6.png"), alt: "선혜원", body: "푸른 자연과 전통 건축이 조화를 이루는 선혜원의 여름 풍경을 만나보세요. 공간에 깃든 역사와 이야기를 깊이 경험할 수 있도록 사전 예약제로 관람 프로그램을 운영합니다." },
    { key: "archive", title: "SK 디지털 헤리티지\n아카이브 오픈", image: assetUrl("news-card-archive-v3.png"), alt: "SK 디지털 헤리티지 아카이브", body: "SK의 성장 과정과 시대별 주요 순간을 담은 디지털 헤리티지 아카이브가 새롭게 문을 열었습니다. 창업 초기의 기록부터 주요 소장품에 이르기까지 SK의 역사와 정신을 온라인에서 폭넓게 만나볼 수 있습니다." },
  ];
  return (
    <section className="canvas-section news" id="news">
      <motion.article className="exhibition" onHoverStart={() => setHovered("exhibition")} onHoverEnd={() => setHovered(null)} animate={{ backgroundColor: hovered === "exhibition" ? "#000" : "#e3edf4", color: hovered === "exhibition" ? "#fff" : "#000", borderColor: hovered === "exhibition" ? "#fff" : "#000" }} transition={swift}>
        <div className="exhibition-copy"><h2>김수자 개인전 〈호흡 – 선혜원〉 개막</h2><p>고요한 숨결과 명상이 어우러진 공간은 과거와 현재, 존재와 공간이 교차하는 새로운 경험을 제시하며, 실재와 허상이 혼재된 유동적인 건축 환경을 형성한다.</p></div>
        <a href="#"><img src={assetUrl("cta-arrow.png")} alt="" /><strong>자세히 보기</strong></a>
        <div className="exhibition-image"><motion.img src={assetUrl("news-exhibition-hover-v4.png")} alt="김수자 개인전" animate={{ scale: hovered === "exhibition" ? 1.025 : 1 }} transition={spring} /></div>
      </motion.article>
      <div className="philosophy">
        <h2>그룹 철학</h2>
        <div className="philosophy-photo-frame"><motion.img src={assetUrl("news-group-philosophy-v4.png")} alt="그룹 철학" whileHover={{ scale: 1.025 }} transition={spring} /></div>
        <motion.p className="philosophy-note" whileHover={{ x: 10 }} transition={spring}>최고의 경쟁력을 보유하고 장기적 생존 조건을 확보하여 지속적으로 경제적 가치, 사회적 가치, 구성원 행복을 창출해 나가는 회사가 SUPEX Company 입니다.</motion.p>
        <div className="philosophy-label label-skms">SK Managemtent System</div><div className="philosophy-label label-supex">Super Excellent Level</div>
        <div className="philosophy-type"><img src={assetUrl("skms-symbol.png")} alt="SKMS" /><i /><img src={assetUrl("supex-symbol.png")} alt="SUPEX" /></div>
      </div>
      {newsCards.map((item, index) => <motion.article key={item.title} className={`news-card card-${index}`} onHoverStart={() => setHovered(item.key)} onHoverEnd={() => setHovered(null)} animate={{ backgroundColor: hovered === item.key ? "#000" : "#e3edf4", color: hovered === item.key ? "#fff" : "#000", borderColor: item.key === "archive" ? "#000" : hovered === item.key ? "#fff" : "#000" }} transition={swift}><h3>{item.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h3><div className="news-card-image"><img src={item.image} alt={item.alt} /></div><p>{item.body}</p></motion.article>)}
      <a className="news-board-link" href="#"><span>뉴스보드</span><img src={assetUrl("large-arrow.png")} alt="" /></a>
    </section>
  );
}

function Footer() {
  return <footer className="footer"><div className="footer-statement"><h2>한 세대의 신념이,<br />다음 시대의 가치로.</h2><p>Built through time. Carried into tomorrow.</p></div><nav><a href="#history">그룹역사</a><a href="#space">H.Space</a><a href="#collection">전시/소장품</a><a href="#news">뉴스보드</a></nav><div className="footer-rule" /><img src={assetUrl("sk-logo-v2.png")} alt="SK Heritage" /><span>©SK HERITAGE MUSEUM, All Rights Reserved.</span></footer>;
}

export function App() {
  const reduce = useReducedMotion();
  return <main data-reduced-motion={reduce ? "true" : "false"}>
    <Hero />
    <DeferredSection id="history"><History /></DeferredSection>
    <DeferredSection id="space" className="deferred-timeline"><Timeline /></DeferredSection>
    <DeferredSection id="collection"><Collection /></DeferredSection>
    <DeferredSection id="news"><News /><Footer /></DeferredSection>
  </main>;
}
