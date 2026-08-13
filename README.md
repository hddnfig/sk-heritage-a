# SK Heritage Motion Prototype

Figma의 `SKHeritage Research ans Draft` 최신 프레임(`350:42`)을 기반으로 만든 1920 x 1080 기준 인터랙션 프로토타입입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`을 엽니다.

프로덕션 빌드는 다음 명령으로 확인할 수 있습니다.

```bash
npm run build
npm run preview
```

## 인터랙션 구성

- 히어로 이미지 호버 시 그리드 컬럼 확장과 이미지 크롭 변화
- 히어로 화살표 클릭 시 이미지, 타이포, 설명 스와이프와 스프링 스냅
- 그룹 역사 화살표 클릭 시 인물 이미지와 기록 패널 동시 전환
- 타임라인 이미지 호버 시 해당 기록 강조와 주변 정보 감쇠
- 소장품 호버 시 패널 확장, 오브젝트 이동, 중앙 이미지 채움 전환
- 뉴스 카드 호버 시 색면 채움과 화살표 피드백
- `HERITAGE`, `SK`, `SKMS`, `SUPEX`는 Figma 원본에서 추출한 심볼 이미지 사용
- 본문·한글 UI는 Pretendard, 연도 `1953`은 Roboto Serif 적용
- `prefers-reduced-motion` 환경에서 모션 최소화

## GitHub Pages 배포 준비

Vite 설정의 `base`가 상대 경로인 `./`로 지정되어 있어 정적 빌드 결과를 GitHub Pages에 올릴 수 있습니다. 추후 저장소가 확정되면 GitHub Actions 배포 워크플로를 추가하면 됩니다.

## 디자인 참고 자료

Figma 원본에서 내려받은 실제 이미지 에셋은 `public/assets`에 저장되어 있습니다. 최신 비교 검수용 캡처는 `figma-reference-v2`에 있습니다.
