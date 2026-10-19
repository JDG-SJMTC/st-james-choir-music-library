# SJMTC Beta v14 — lyric fidelity QA and corrections

## Verified corrections

- KK 30, stanza 1, musical staff line 2: `thi` → `thin` in `me rum nin paa da thin kal`.
- KK 30, stanza 1, musical staff line 2: `lh` → `lha` in `nin pai tha nga lha di yaa ri` (last syllable remains `ri` in the current data; the user quoted `r`, so this final syllable needs confirmation).
- KK 150, stanza 4, line 1: `ne` → `nè` in `nèdi`, matching the existing transliterated source spelling. The accent was previously lost in the displayed overlay.

## Checks performed

- Programmatic token-by-token diff against previous KK 30 v13 trial and KK 150 v12 baseline: only the three corrections above changed. All SVG score images, musical coordinates, Malayalam data and other song data are unchanged.
- KK 30 stanza 2 line boundary: first staff line ends `sa nni`, second begins `dhaa na`; Malayalam and Manglish line 1/2 token counts match.
- KK 150: all four stanza Manglish overlay syllable sequences now concatenate exactly to the embedded source transliteration, including the accent in `nèdi`.
- JavaScript syntax validated with `node --check` for embedded scripts of both song files.

## QA limitations — not yet approved for production

- No independently authenticated full Malayalam and Manglish source transcript was supplied for KK 30. Therefore character-perfect fidelity of every stanza cannot be certified; the existing base data may still contain mistakes.
- KK 150 Malayalam mapped overlays have not been independently compared character by character to an authoritative Malayalam source. The original score image is preserved but this does not prove the overlay transcription.
- KK 30 stanza 1 `yaa ri` currently differs from the user's quoted `yaa r`. The existing ending is preserved pending confirmation rather than guessing.
- Musical note-to-syllable correspondence, collisions and mobile browser behavior require visual/singing QA by the choir. Automated syntax and data checks do not certify musical correctness.

**Release gate:** no production promotion until every stanza is checked against an approved lyric source, letter by letter, and the sung staff-line progression is confirmed.
