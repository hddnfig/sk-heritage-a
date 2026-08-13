import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useId,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./hspace-reservation.css";

const EASE = [0.16, 1, 0.3, 1] as const;

const SPACES = [
  {
    id: "seonhyewon",
    name: "SK 선혜원",
    description: "한옥의 시간과 정원을 따라 SK의 뿌리와 사람을 만나는 해설 관람",
    location: "서울특별시 종로구 삼청로9길 3-5",
    tour: "약 40~60분",
    operation: "9:00 ~ 18:00",
    image: "./assets/reservation/space-seonhyewon.png",
    tone: "coral",
  },
  {
    id: "memorial",
    name: "SK 기념관",
    description: "창업의 순간부터 오늘의 SK까지 기록과 소장품으로 이어 보는 전시 관람",
    location: "경기도 용인시 처인구 원삼면 모래실로 17",
    tour: "해설 관람 약 60분",
    operation: "9:00 ~ 18:00",
    image: "./assets/reservation/space-memorial.png",
    tone: "paper",
  },
  {
    id: "oldhouse",
    name: "SK고택",
    description: "기업가 정신의 시작과 생활의 흔적을 고택의 공간 속에서 살펴보는 관람",
    location: "경기도 수원시 권선구 평동로76번길 5",
    tour: "약 40분",
    operation: "9:00 ~ 18:00",
    image: "./assets/reservation/space-oldhouse.png",
    tone: "paper",
  },
] as const;

const TIMES = [
  { value: "10:00", available: true },
  { value: "11:30", available: false },
  { value: "14:00", available: true },
  { value: "15:30", available: true },
  { value: "17:00", available: true },
  { value: "20:00", available: true },
] as const;

type SpaceId = (typeof SPACES)[number]["id"];

type CalendarCell = {
  day: number;
  month: "previous" | "current" | "next";
  available: boolean;
};

const CALENDAR_CELLS: CalendarCell[] = [
  { day: 30, month: "previous", available: false },
  { day: 31, month: "previous", available: false },
  ...Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const weekday = (2 + index) % 7; // 2026-09-01 is Tuesday.
    return {
      day,
      month: "current" as const,
      available: weekday !== 0 && weekday !== 6,
    };
  }),
  { day: 1, month: "next", available: false },
  { day: 2, month: "next", available: false },
  { day: 3, month: "next", available: false },
];

const PHONE_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 34, clipPath: "inset(0 0 18% 0)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : 0.82, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function StepIntro({ number, children, note }: { number: string; children: ReactNode; note?: ReactNode }) {
  return (
    <aside className="hs-step-intro">
      <span className="hs-step-number">{number}</span>
      <div className="hs-step-heading">{children}</div>
      {note ? <p className="hs-step-note">{note}</p> : null}
    </aside>
  );
}

function MetaRows({ space }: { space: (typeof SPACES)[number] }) {
  return (
    <dl className="hs-meta-rows">
      <div><dt>LOCATION</dt><dd>{space.location}</dd></div>
      <div><dt>TOUR</dt><dd>{space.tour}</dd></div>
      <div><dt>OPERATION</dt><dd>{space.operation}</dd></div>
    </dl>
  );
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="hs-field">
      <label htmlFor={id}>
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>
      {children}
    </div>
  );
}

export default function HSpaceReservation() {
  const reduce = useReducedMotion();
  const formId = useId();
  const [spaceId, setSpaceId] = useState<SpaceId>("seonhyewon");
  const [selectedDay, setSelectedDay] = useState(22);
  const [selectedTime, setSelectedTime] = useState("14:00");
  const [visitors, setVisitors] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("개인관람");
  const [request, setRequest] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedSpace = SPACES.find((space) => space.id === spaceId) ?? SPACES[0];
  const canSubmit = useMemo(
    () =>
      name.trim().length >= 2 &&
      PHONE_PATTERN.test(phone.trim()) &&
      EMAIL_PATTERN.test(email.trim()) &&
      Boolean(selectedDay && selectedTime && agreed),
    [agreed, email, name, phone, selectedDay, selectedTime],
  );

  const updateValue =
    (setter: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setter(event.currentTarget.value);
      setSubmitted(false);
    };

  const submitReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  };

  const chooseSpace = (id: SpaceId) => {
    setSpaceId(id);
    setSubmitted(false);
  };

  const changeVisitors = (step: number) => {
    setVisitors((value) => Math.min(6, Math.max(1, value + step)));
    setSubmitted(false);
  };

  return (
    <div className="hs-page">
      <header className="hs-header">
        <a className="hs-logo" href="#/" aria-label="SK Heritage 홈">
          <img src="./assets/hs-logo-dark.png" alt="SK Heritage" />
        </a>
        <nav className="hs-nav" aria-label="주요 메뉴">
          <a href="#/history">그룹역사</a>
          <a className="is-active" href="#/h-space" aria-current="page">H.Space</a>
          <a href="#/collection">전시/소장품</a>
          <a href="#/news">뉴스보드</a>
        </nav>
      </header>

      <main className="hs-main">
        <section className="hs-hero" aria-labelledby="hs-page-title">
          <motion.div
            className="hs-hero-rule"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
          />
          <Reveal className="hs-eyebrow" delay={0.08}>
            <span aria-hidden="true" /> VISIT RESERVATION
          </Reveal>
          <p className="hs-hero-kicker">THREE HERITAGE SPACES</p>
          <Reveal className="hs-hero-title" delay={0.16}>
            <h1 id="hs-page-title">방문 예약</h1>
            <p>SK의 시작과 정신이 머무는 세 공간을<br />예약하고 직접 만나보세요.</p>
          </Reveal>
        </section>

        <form className="hs-form" id={formId} onSubmit={submitReservation} noValidate>
          <section className="hs-step hs-space-step" aria-labelledby="hs-space-title">
            <StepIntro number="01">
              <h2 id="hs-space-title">방문할 공간을<br />선택해주세요.</h2>
            </StepIntro>
            <div className="hs-space-grid" role="radiogroup" aria-label="방문 공간">
              {SPACES.map((space, index) => {
                const selected = space.id === spaceId;
                return (
                  <motion.label
                    className={`hs-space-card hs-tone-${space.tone}${selected ? " is-selected" : ""}`}
                    key={space.id}
                    initial={reduce ? false : { opacity: 0, x: 72 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    whileHover={reduce ? undefined : { y: -8 }}
                    transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : index * 0.09, ease: EASE }}
                  >
                    <input
                      type="radio"
                      name="space"
                      value={space.id}
                      checked={selected}
                      onChange={() => chooseSpace(space.id)}
                    />
                    <span className="hs-space-image">
                      <motion.img
                        src={space.image}
                        alt={`${space.name} 전경`}
                        animate={{ scale: selected && !reduce ? 1.035 : 1 }}
                        transition={{ duration: reduce ? 0 : 0.72, ease: EASE }}
                      />
                    </span>
                    <span className="hs-space-copy">
                      <span className="hs-space-heading">
                        <strong>{space.name}</strong>
                        <span>{space.description}</span>
                      </span>
                      <span className="hs-select-mark" aria-hidden="true">{selected ? "✓" : "↗"}</span>
                      <MetaRows space={space} />
                    </span>
                  </motion.label>
                );
              })}
            </div>
          </section>

          <section className="hs-step hs-schedule-step" aria-labelledby="hs-schedule-title">
            <StepIntro number="02" note={<>관람일 30일 전부터<br />예약할 수 있습니다.</>}>
              <h2 id="hs-schedule-title">날짜와 시간을<br />선택해주세요.</h2>
            </StepIntro>

            <Reveal className="hs-calendar-panel">
              <div className="hs-calendar-heading">
                <button type="button" disabled aria-label="이전 달">←</button>
                <strong><span>2026.</span> 09</strong>
                <button type="button" disabled aria-label="다음 달">→</button>
              </div>
              <div className="hs-calendar-week" aria-hidden="true">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => <span key={day}>{day}</span>)}
              </div>
              <div className="hs-calendar-grid" role="grid" aria-label="2026년 9월 방문일">
                {CALENDAR_CELLS.map((cell, index) => {
                  const current = cell.month === "current";
                  const selected = current && cell.day === selectedDay;
                  const label = cell.month === "previous" ? `8월 ${cell.day}일` : cell.month === "next" ? `10월 ${cell.day}일` : `9월 ${cell.day}일`;
                  return (
                    <button
                      className={`hs-calendar-day${current ? "" : " is-outside"}${selected ? " is-selected" : ""}`}
                      key={`${cell.month}-${cell.day}`}
                      type="button"
                      role="gridcell"
                      aria-label={`${label}${cell.available ? " 예약 가능" : " 예약 불가"}`}
                      aria-selected={selected}
                      disabled={!current || !cell.available}
                      onClick={() => {
                        setSelectedDay(cell.day);
                        setSubmitted(false);
                      }}
                    >
                      <span>{cell.day}</span>
                      {current && cell.available ? <i aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>
              <div className="hs-calendar-legend"><span><i /> 예약 가능</span><span><i /> 예약 마감</span></div>
            </Reveal>

            <Reveal className="hs-time-panel" delay={0.08}>
              <p className="hs-panel-label">선택한 날짜</p>
              <div className="hs-selected-date"><strong>09.{String(selectedDay).padStart(2, "0")}</strong><span>{["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][new Date(2026, 8, selectedDay).getDay()]}</span></div>
              <div className="hs-time-grid" role="radiogroup" aria-label="관람 시간">
                {TIMES.map((item) => {
                  const selected = selectedTime === item.value;
                  return (
                    <label className={`hs-time-option${selected ? " is-selected" : ""}${item.available ? "" : " is-unavailable"}`} key={item.value}>
                      <input
                        type="radio"
                        name="time"
                        value={item.value}
                        checked={selected}
                        disabled={!item.available}
                        onChange={() => {
                          setSelectedTime(item.value);
                          setSubmitted(false);
                        }}
                      />
                      <strong>{item.value}</strong>
                      <span>{item.available ? "예약 가능" : "예약 마감"}</span>
                    </label>
                  );
                })}
              </div>
              <div className="hs-visitors">
                <div><span>VISITORS</span><strong>관람 인원</strong><small>한 회차당 최대 6명</small></div>
                <div className="hs-stepper" aria-label="관람 인원">
                  <button type="button" onClick={() => changeVisitors(-1)} disabled={visitors === 1} aria-label="인원 줄이기">−</button>
                  <output aria-live="polite">{visitors}<span>명</span></output>
                  <button type="button" onClick={() => changeVisitors(1)} disabled={visitors === 6} aria-label="인원 늘리기">＋</button>
                </div>
              </div>
            </Reveal>
          </section>

          <section className="hs-step hs-details-step" aria-labelledby="hs-details-title">
            <StepIntro number="03">
              <h2 id="hs-details-title">예약자 정보를<br />입력해주세요.</h2>
            </StepIntro>

            <Reveal className="hs-details-panel">
              <div className="hs-field-grid">
                <Field id={`${formId}-name`} label="예약자명" required>
                  <input id={`${formId}-name`} value={name} onChange={updateValue(setName)} autoComplete="name" placeholder="이름을 입력해주세요." required />
                </Field>
                <Field id={`${formId}-phone`} label="휴대폰 번호" required>
                  <input id={`${formId}-phone`} value={phone} onChange={updateValue(setPhone)} autoComplete="tel" inputMode="tel" placeholder="010-0000-0000" pattern="01[016789]-?[0-9]{3,4}-?[0-9]{4}" required />
                </Field>
                <Field id={`${formId}-email`} label="이메일" required>
                  <input id={`${formId}-email`} value={email} onChange={updateValue(setEmail)} autoComplete="email" type="email" placeholder="heritage@sk.com" required />
                </Field>
                <Field id={`${formId}-purpose`} label="관람 목적">
                  <select id={`${formId}-purpose`} value={purpose} onChange={updateValue(setPurpose)}>
                    <option>개인관람</option>
                    <option>가족관람</option>
                    <option>단체관람</option>
                    <option>교육·연구</option>
                    <option>기타</option>
                  </select>
                </Field>
                <Field id={`${formId}-request`} label="요청사항">
                  <textarea id={`${formId}-request`} value={request} onChange={updateValue(setRequest)} rows={1} placeholder="관람에 필요한 요청사항이 있다면 남겨주세요." />
                </Field>
              </div>
              <label className="hs-consent">
                <input type="checkbox" checked={agreed} onChange={(event) => { setAgreed(event.currentTarget.checked); setSubmitted(false); }} />
                <span className="hs-checkbox" aria-hidden="true">{agreed ? "✓" : ""}</span>
                <span><strong>[필수] 개인정보 수집 및 이용에 동의합니다.</strong><small>예약 확인 및 안내를 위해 이름, 연락처, 이메일을 수집합니다.</small></span>
                <a href="#/privacy" onClick={(event) => event.stopPropagation()}>약관 보기 <i aria-hidden="true">›</i></a>
              </label>
            </Reveal>

            <motion.aside
              className="hs-summary"
              key={spaceId}
              initial={reduce ? false : { opacity: 0, x: 72 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduce ? 0 : 0.72, ease: EASE }}
              aria-label="예약 내용 요약"
            >
              <div className="hs-summary-image"><img src={selectedSpace.image} alt="" /></div>
              <div className="hs-summary-body">
                <h3>{selectedSpace.name}</h3>
                <dl>
                  <div><dt>DATE</dt><dd>2026. 09. {String(selectedDay).padStart(2, "0")}</dd></div>
                  <div><dt>TIME</dt><dd>{selectedTime}</dd></div>
                  <div><dt>VISITORS</dt><dd>{visitors}명</dd></div>
                </dl>
                <motion.button
                  className="hs-submit"
                  type="submit"
                  disabled={!canSubmit}
                  whileHover={canSubmit && !reduce ? { x: 4 } : undefined}
                  whileTap={canSubmit && !reduce ? { scale: 0.985 } : undefined}
                  transition={{ duration: reduce ? 0 : 0.42, ease: EASE }}
                >
                  <span aria-hidden="true">|||</span> 방문 예약하기 <i aria-hidden="true">→</i>
                </motion.button>
                <AnimatePresence>
                  {submitted ? (
                    <motion.p
                      className="hs-success"
                      role="status"
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                    >
                      예약 요청이 접수되었습니다. 확인 안내를 보내드릴게요.
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.aside>
          </section>
        </form>
      </main>

      <footer className="hs-footer">
        <div className="hs-footer-top">
          <div><strong>한 세대의 신념이,<br />다음 시대의 가치로.</strong><span>Built through time. Carried into tomorrow.</span></div>
          <nav aria-label="하단 메뉴">
            <a href="#/history">그룹역사</a><a href="#/h-space">H.Space</a><a href="#/collection">전시/소장품</a><a href="#/news">뉴스보드</a>
          </nav>
        </div>
        <div className="hs-footer-bottom">
          <a className="hs-logo hs-logo-light" href="#/" aria-label="SK Heritage 홈"><img src="./assets/hs-logo-light.png" alt="SK Heritage" /></a>
          <span>©SK HERITAGE, All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}
