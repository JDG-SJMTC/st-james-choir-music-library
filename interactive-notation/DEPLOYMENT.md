# Beta v11 — automatic fit-width scores

Upload all files into the existing `interactive-notation/` folder, preserving `song-30/` and `song-150/`. The production root is not modified.

Changes to the two score viewers only:
- Horizontal SVG viewport trimmed to ink bounds with safety margins, without altering any score image or lyric coordinates.
- 100% now fits the available notation viewport width, including after resize/rotation.
- 25–300% zoom remains relative to fitted width; swiping is still enabled only at 100%.
- Floating toolbars, selections, double-tap reset, and navigation retained.

Review on desktop and mobile. This is code-checked, not physical-device QA.
