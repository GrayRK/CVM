# 🎙️ ClaudeVoiceMaster

> Watch YouTube in any language — translated and voiced in real time.

![Status](https://img.shields.io/badge/status-in%20development-orange)
![Manifest](https://img.shields.io/badge/manifest-v3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![WXT](https://img.shields.io/badge/built%20with-WXT-purple)

---

## What is it?

**ClaudeVoiceMaster (CVM)** is a Chrome extension that translates YouTube videos on the fly — extracting subtitles, translating them via Claude AI, and reading the translation aloud so you can watch content in any language without knowing it.

No more pausing to read. No more struggling with auto-translated captions. Just watch.

---

## Features

- 🌍 **Supports any language** available on YouTube — English, Japanese, Spanish, Korean and more
- 🔊 **Voice-over translation** — hear the content in your language, not read it
- 📝 **Subtitle overlay** — translated captions displayed directly on the video
- ⚡ **Pre-translated before playback** — no lag, no stuttering mid-sentence
- 🎚️ **Adjustable mix** — control TTS volume and how much the original audio is ducked
- 💾 **Smart caching** — translated videos load instantly on repeat watches
- 🛠️ **Developer panel** — live state inspector and API monitor for transparent debugging

---

## How it works

```
YouTube Subtitles  →  Claude AI (translation)  →  TTS Engine (voice-over)
                                                         ↓
                                               Overlay + ducked original audio
```

CVM reads the existing subtitle track from YouTube — no audio processing, no speech recognition needed. The text goes to Claude for translation, comes back, and is read aloud in sync with the video.

---

## Voice Engine Roadmap

| Engine | Status | Quality | Notes |
|---|---|---|---|
| Edge TTS (Microsoft) | ✅ Current | ⭐⭐⭐⭐ | DmitryNeural / SvetlanaNeural |
| CosyVoice 3 | 🔜 Planned | ⭐⭐⭐⭐⭐ | Local, voice cloning, 150ms latency |
| Qwen3-TTS | 🔜 Planned | ⭐⭐⭐⭐⭐ | Local, 0.6B model, Russian support |
| Yandex SpeechKit | 🔜 Planned | ⭐⭐⭐⭐⭐ | Best Russian voices on the market |

All engines implement a common `TTSEngine` interface — swapping is a one-line change.

---

## Tech Stack

- **[WXT](https://wxt.dev)** — modern Chrome extension framework with HMR
- **TypeScript** — strict mode throughout
- **Claude AI** — translation via [aiprimetech.io](https://aiprimetech.io)
- **Web Speech API** — voice synthesis (initial engine)
- **Manifest V3** — current Chrome extension standard

---

## Project Status

| Component | Status |
|---|---|
| Popup UI + Settings | 🔨 In progress |
| Live State Inspector | 🔨 In progress |
| Claude API integration | ⬜ Planned |
| API Monitor panel | ⬜ Planned |
| TTS voice-over | ⬜ Planned |
| Subtitle overlay | ⬜ Planned |

---

## Getting Started

> Requires Node.js 18+ and a Chrome-based browser.

```bash
git clone https://github.com/yourusername/ClaudeVoiceMaster
cd ClaudeVoiceMaster
npm install
npm run dev
```

WXT will automatically open Chrome with the extension loaded.
Add your API key in the extension popup and open any YouTube video with subtitles.

---

## License

MIT
