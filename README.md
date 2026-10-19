[English](README.md) | [한국어](README.ko.md)

# Skill Studio

![HTML5](https://img.shields.io/badge/HTML5-current-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-current-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-current-F7DF1E?logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/Next-TypeScript-3178C6?logo=typescript&logoColor=white)

Skill Studio is a static, browser-based editor for drafting `SKILL.md` files for Codex and Claude Code. It supports manual writing, live preview, completeness checks, copying, and downloading. It does not generate drafts with AI, run your Skill, or install it automatically.

**Implementation direction:** Start new Skill Studio development in TypeScript. If file processing or validation grows substantially, evaluate Python for those isolated tasks rather than adding it preemptively.

## Run locally

Open `index.html` in a browser, or start a static server from this folder:

```sh
python3 -m http.server 8765
```

Then visit `http://127.0.0.1:8765/`.

Public site: <https://skillstudio0.vercel.app/> (`skillstudio.vercel.app` is owned by another team, so this project uses the alternative address.)

GitHub Pages mirror: <https://justcallmelightt.github.io/Skillstudio/>

## Use

1. Choose a blank document or a template.
2. Enter the Skill's name and role, then add its workflow, criteria, and completion checks as needed.
3. Review the live preview and download `SKILL.md`.
4. Create a folder named after the Skill and save the file as `folder-name/SKILL.md`.

The usage guide shows the folder locations for each tool. Codex uses `.agents/skills/` in a project, and Claude Code uses `.claude/skills/`; create a folder named after your Skill inside the relevant directory. Personal installation paths are also shown. The site only creates a downloadable file—it does not install Skills into tools.

No build tools or npm installation are required.

The default theme is dark. Use the theme button in the upper-right corner to switch between light and dark; your choice is saved in the current browser.

Use the language switch in the upper-right header to change the interface language. English opens with `?lang=en`. Your draft remains in the browser when switching languages, but text you have already written is not translated automatically.

Release notes and major public announcements are available in Korean and English. See the [release notes](./CHANGELOG.md).

## Privacy & security

Drafts and theme preferences are stored in the browser's `localStorage`. They are not sent to a server. Copying and downloading `SKILL.md` happen only when you choose those actions.

See [Privacy & Security](./SECURITY.md#privacy--security-english) for details.
