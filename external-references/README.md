# External Remotion References

Cloned May 4, 2026 for study. **None of these are dependencies of our project** — they're standalone repos kept here for browsing/inspiration. Each is a shallow clone (latest commit only).

To re-fetch any of them at the latest version:
```bash
cd external-references/<folder>
git pull
```

To update all at once:
```bash
cd external-references
for d in */; do (cd "$d" && git pull); done
```

These folders are gitignored — they don't ship with our project.

---

## Official Remotion repos (from `remotion-dev` org)

### `template-tiktok/`
**[github.com/remotion-dev/template-tiktok](https://github.com/remotion-dev/template-tiktok)** — TikTok-style captions powered by Whisper.cpp. Direct relevance to our short-form work. Burn-in captions, dynamic word highlighting. Worth studying for caption styling we don't currently have.

### `template-render-server/`
**[github.com/remotion-dev/template-render-server](https://github.com/remotion-dev/template-render-server)** — Reference Express.js render server from the Remotion team. Direct comparison to our [`render-server/`](../render-server/) implementation. Compare patterns: how they handle queueing, status, downloads. May reveal optimizations we missed.

### `recorder/`
**[github.com/remotion-dev/recorder](https://github.com/remotion-dev/recorder)** — "Video production for developers." Full toolkit by the Remotion team for recording + editing. The closest thing to a comprehensive in-house alternative. Useful as an architectural reference.

### `remotion-skills/`
**[github.com/remotion-dev/skills](https://github.com/remotion-dev/skills)** — Agent skills for Claude Code / Cursor / Codex. Since you use Claude Code daily, these can be installed directly into your `.claude/` skills folder for native Remotion authoring assistance. Worth installing.

### `template-music-visualization/`
**[github.com/remotion-dev/template-music-visualization](https://github.com/remotion-dev/template-music-visualization)** — Music-driven video. Connects to our `/mix-audio` endpoint work — audio analysis, beat-driven animations. Useful if we add reactive elements to scenes.

---

## Community repos

### `OpenMontage/` (3.4k stars)
**[github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)** — "World's first open-source, agentic video production system." 12 pipelines, 500+ agent skills. **This is the closest existing project to what we've been building.** Worth deep study — they may have solved problems we're still tackling. The architectural patterns here could inform our v7+ direction.

### `remotion-bits/` (313 stars)
**[github.com/av/remotion-bits](https://github.com/av/remotion-bits)** — "Reusable building blocks for your videos." Component library for Remotion — like ours but community-shared. Mine for scene component patterns we don't have.

### `react-video-editor/` (1.6k stars)
**[github.com/designcombo/react-video-editor](https://github.com/designcombo/react-video-editor)** — Web-based video editor (CapCut/Canva-style) built on Remotion. Useful if we ever want a UI for non-technical team members to drag/edit before render — alternative to the n8n form trigger.

---

## Note about earlier list

In the prior conversation I mentioned several repos that don't actually exist:
- `remotion-dev/showcase` — there's no GitHub repo, the showcase lives at [remotion.dev/showcase](https://www.remotion.dev/showcase) as a website page
- `remotion-dev/dataflow` — fabricated, doesn't exist
- `alexkubica/remotion-templates` — doesn't exist
- `MrFoxPro/remotion-blender-plugin` — doesn't exist

The 8 repos cloned here are all real and verified. Apologies for the confusion.

---

## What to actually do with these

1. **Install the Remotion skills** for Claude Code: copy/symlink `remotion-skills/` into your `~/.claude/skills/` directory. Native Remotion authoring assistance.
2. **Skim OpenMontage** for any architectural ideas we missed (agent pipeline structure, skill organization).
3. **Read `template-tiktok/src/`** — copy the caption-burn pattern into our `DynamicOverlay` if we want word-level captions on speaker.
4. **Diff `template-render-server` against our `render-server/index.js`** — any patterns the Remotion team uses that we don't?
5. **Browse `remotion-bits` components** — port any single-file scene components that fill gaps in our scene library.

Total disk usage: ~few hundred MB after `npm install` would be done in each, but we don't need to install — we're just reading the code.
