# Skill Studio

질문에 답해 Codex와 Claude Code에서 사용할 `SKILL.md` 초안을 만드는 정적 웹앱입니다. 현재 공개 버전은 수동 편집·미리보기·복사·다운로드를 지원하며, AI 초안 작성이나 자동 설치는 제공하지 않습니다.

## 실행

`index.html`을 브라우저에서 열거나, 이 폴더에서 정적 서버를 실행하세요. 첫 화면에서 바로 Skill을 만들 수 있습니다.

Skill이 처음이라면 `about.html`에서 정의와 사용 순서를, `benefits.html`에서 사용 전후 예시를 볼 수 있습니다. 편집 화면의 “Skill 알아보기” 링크에서 시작하세요.

```sh
python3 -m http.server 8765
```

그다음 `http://127.0.0.1:8765/`에 접속합니다.

공개 페이지: https://skillstudio0.vercel.app/ (`skillstudio.vercel.app`은 다른 팀이 소유 중이어서 대체 주소를 사용합니다.)

GitHub Pages 미러: https://justcallmelightt.github.io/Skillstudio/

## 사용

1. 빈 문서나 템플릿을 선택합니다.
2. 이름과 역할을 작성하고, 필요에 따라 작업 단계·기준·완료 확인을 적습니다.
3. 미리보기를 확인하고 `SKILL.md`를 다운로드합니다.
4. 이름과 같은 폴더를 만들고 다운로드한 파일을 `폴더명/SKILL.md`로 넣습니다.

오른쪽 사용 가이드에서 도구별 위치를 확인할 수 있습니다. Codex는 프로젝트의 `.agents/skills/`, Claude Code는 `.claude/skills/` 아래에 Skill 이름의 폴더를 만듭니다. 개인용 경로도 가이드에 표시됩니다. 이 사이트는 파일을 다운로드할 뿐, 도구에 자동 설치하지는 않습니다.

별도의 빌드 도구나 npm 설치는 필요하지 않습니다.

오른쪽 위의 테마 버튼으로 라이트·다크 화면을 바꿀 수 있습니다. 처음에는 기기 설정을 따르며, 직접 선택한 테마는 현재 브라우저에 저장됩니다.

상단의 `English`/`한국어` 링크로 화면 언어를 바꿀 수 있습니다. 영어 화면은 `?lang=en`으로 열리며, 작성 중인 초안은 언어를 바꿔도 유지됩니다. 이미 작성한 문장 자체를 자동 번역하지는 않습니다.

릴리즈 노트와 주요 공개 안내는 한국어와 영어를 함께 제공합니다. 변경 사항은 [릴리즈 노트](./CHANGELOG.md)에서 확인하세요.

## 개인정보 보호 및 보안

초안과 테마는 브라우저 `localStorage`에 저장됩니다. 서버 전송은 없으며, 복사와 `SKILL.md` 다운로드는 사용자가 직접 실행할 때만 발생합니다.

자세한 내용은 [개인정보 보호 및 보안](./SECURITY.md)을 참고하세요.

---

## English

Skill Studio is a static, browser-based editor for drafting `SKILL.md` files for Codex and Claude Code. It supports manual writing, live preview, completeness checks, copying, and downloading. It does not generate drafts with AI, run your Skill, or install it automatically.

Open the [public site](https://skillstudio0.vercel.app/?lang=en) or serve this folder locally with `python3 -m http.server 8765`. The preferred `skillstudio.vercel.app` address belongs to another Vercel team, so this release uses `skillstudio0.vercel.app`. A [GitHub Pages mirror](https://justcallmelightt.github.io/Skillstudio/?lang=en) is also available. Read [What is a Skill?](https://skillstudio0.vercel.app/about.html?lang=en) for the definition and [Why use a Skill?](https://skillstudio0.vercel.app/benefits.html?lang=en) for before-and-after examples. Choose a blank document or template, describe the Skill, review the preview, download `SKILL.md`, and put it in a folder named after the Skill. The editor shows project and personal folder paths for each tool.

Use the `English`/`한국어` link to switch languages. The draft stays in the browser across language switches, but text you already wrote is not translated. Drafts and theme preferences are stored in your browser’s `localStorage`; the app does not upload drafts to a server. See [Privacy & Security](./SECURITY.md#privacy--security-english) for details.

Release notes and major public announcements are published in both Korean and English. See the [release notes](./CHANGELOG.md) for changes.
