# Story Production Prompt

Reusable prompt for taking a new story from idea to published video, following the `DogTired/` pattern.

## Pipeline

| Stage | Artifacts |
|---|---|
| 1. Story | `TEXT_TO_SPEAK.txt`, `SPEAKING_STYLE.txt` |
| 2. Script | `ANIMATION_SCRIPT.md`, `STYLE_GUIDE.md` |
| 3. Flip-book | `images/page-0N.png`, `index.html`, entry in `assets/data/stories.json` |
| 4. Static animation | `<FolderName>-static.mp4`, narration `.mp3` |
| 5. Light animation | `<FolderName>-animated.mp4` |
| 6. Publish | `YOUTUBE_DESCRIPTION.md`, `build/` |

## Prompt

```
Produce a new Gaga/Grumpy story package end to end, following the DogTired pattern.

INPUT
- Title / folder name: <FolderName>
- Premise (2–4 sentences): <...>
- Characters + Milo's age: <...>   (use canonical designs in /Characters; Riley = green collar, larger; Ruby = red collar, smaller)
- Mood / lesson: <...>
- Real photos to use as reference (optional): <paths>

Work in this order and stop after each stage for my approval unless I say "run all":

1. STORY & NARRATION
   - TEXT_TO_SPEAK.txt: ~6 pages, 1–3 short sentences per page, one consistent narrator voice.
   - SPEAKING_STYLE.txt: voice direction in the DogTired style.

2. SHOT LIST (single source of truth)
   - ANIMATION_SCRIPT.md: one scene per page (same count, same numbering, same slug as images/page-0N.png). Each scene has Duration, Narration, Picture, Motion, Camera, Sound, Transition. Total runtime 75–95 s, 1920×1080, 24 fps.
   - STYLE_GUIDE.md: reuse the shared watercolor-and-ink look (../Scenes/00-cover.png), list "Avoid" items, state Milo's age.

3. FLIP-BOOK
   - Write one image-generation prompt per page (landscape 16:9, no embedded text, consistent framing, characters from /Characters). Save them in IMAGE_PROMPTS.md.
   - Build <FolderName>/index.html using the existing storybook template (assets/styles/storybook.css), images in images/page-0N.png, and add the entry to assets/data/stories.json.

4. STATIC ANIMATION
   - Assemble a static video: each page image held for its scene's Duration, Ken Burns pan/zoom taken from the scene's Camera line, dissolves/wipes from Transition, narration .mp3 laid over it. Output <FolderName>/<FolderName>-static.mp4 using ffmpeg with a reproducible script (make_video.ps1) and a timings file (timings.json) derived from ANIMATION_SCRIPT.md.

5. LIGHT ANIMATION
   - For each scene, write a motion prompt for image-to-video, asking for ONE tiny action (from the Motion line), 3–5 s, camera nearly still, character design unchanged (see docs/animation-video-lab.html). Save in MOTION_PROMPTS.md.
   - Replace static clips with the animated clips where they exist and keep the static clip as fallback. Output <FolderName>/<FolderName>-animated.mp4.

6. PUBLISH
   - YOUTUBE_DESCRIPTION.md (same structure and hashtags as DogTired).
   - Update build/ the same way the other stories are.

RULES
- Keep scene count = page count = image count; flag any mismatch.
- Never change established character designs, collars, sizes or ages.
- Name files consistently (no spaces): <FolderName>-static.mp4, <FolderName>-animated.mp4.
- At the end, give a checklist of files created and anything I must do manually (image generation, voice recording, uploading).
```
