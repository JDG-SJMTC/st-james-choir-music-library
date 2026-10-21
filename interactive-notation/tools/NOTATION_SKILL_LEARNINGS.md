# Notation skill learnings — Release 2 beta

Status: engineering rules awaiting musical regression testing. This is the in-repository skill specification, **not** an installed ChatGPT skill update.

## Mandatory evidence model

1. Preserve the exact original lyric source, including diacritics, punctuation, spaces and line breaks. Validate round-trip before rendering.
2. Confirm score-image dimensions and crop transforms by image registration before comparing coordinates. Distinguish crop-pixel x from original-page x.
3. Separate **printed lyric glyphs**, **musical events**, and **Manglish fragments** as three distinct entities. A musical event may be a chord with multiple noteheads. A syllable may span more than one event. Never pair noteheads and lyric fragments solely by array index.
4. Identify events by voice, onset, pitch set, notated duration, bar/measure and score x; attach printed lyric glyphs to events using visual evidence. Record melismas explicitly.
5. Stanza 1 printed under notation establishes the reference; other stanzas may have different syllable counts and must reflow across *verified* musical phrases. Never force a fixed slot count.
6. Browser-measured collision relaxation is visual-only and may move words away from their note anchors; musical sign-off requires rechecking positions after adjustment.
7. Report independent statuses: source-integrity, coordinate calibration, glyph transcription, note-event mapping, melisma, phrase boundary, layout, human musical review. A pass in one is not a pass in another.
8. Block release if any mandatory evidence is missing. No root production changes until Release 2 final approval.

## KK 8 regression cases

- Three systems, 13/12/15 printed lyric fragments; stanza 1 Manglish round-trip must be exact.
- 878×1241 original score, 3× enlarged crops with registered origins (195,290), (195,465), (195,650).
- Earlier index-based comparison flagged 13 x discrepancies; **do not** use this as 13 verified wrong notes. Chords, isolated stems, and long-duration notes invalidate naive 1:1 indexing.
- System 2 passage around `paarkka Devaa Aashrayam` and system 3 final `koodey paarkka` must receive event-level checks before approval.
- Validate that subsequent stanzas preserve exact source while stretching over approved phrase spans; reject clipping, overlap, or musical-anchor drift.

## Regression coverage

Test the rules against KK 8, KK 30 and KK 150, including their differing stanza lengths and any previously documented QA exceptions. Do not claim regression passed until tests are actually executed.
