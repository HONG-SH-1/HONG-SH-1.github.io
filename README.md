# 홍승현 — 포트폴리오 (GitHub Pages)

**라이브 사이트:** [https://hong-sh-1.github.io/](https://hong-sh-1.github.io/)

Vite + React + TypeScript + Tailwind 기반 정적 포트폴리오입니다. `main` 브랜치에 푸시하면 GitHub Actions가 빌드 후 Pages에 `dist`를 배포합니다.

## 로컬 실행

```bash
npm ci
# 또는: npm install
npm run dev
```

## 프로덕션 빌드

```bash
npm run build
```

## 배포

별도 로컬 빌드 없이 저장소에 푸시해도 됩니다. 워크플로에서 `npm ci` → `npm run build` 후 결과물이 게시됩니다.

## 저장소 설정 (GitHub 웹)

- **Settings → General → About**
  - **Website:** `https://hong-sh-1.github.io/`
  - **Description:** 한 줄로 직무·기술 스택을 적어 두면 좋습니다.

## 콘텐츠·에셋

- 프로젝트 목록: `src/data/projects.json`
- 정적 파일(영상, OG 이미지, 스크린샷): `public/` (빌드 후 사이트 루트 기준 경로, 예: `/og.png`, `/screenshots/fds.png`)
- **FDS** 항목의 `githubUrl`·`public/screenshots/fds.png`는 실제 저장소·캡처로 교체해도 됩니다.
- 링크 미리보기용 **OG 이미지**는 `https://hong-sh-1.github.io/og.png` (절대 URL)로 `index.html`에 연결되어 있습니다.
