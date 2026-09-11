# Open Graph image assets

These files exist **only to build `opengraph-image.tsx`**. They are never
served to the browser: they are read from disk at build time and inlined into
the card, which is generated as PNG by Satori and re-encoded to JPEG before it
is written.

| File                   | What it is                                                                                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero-og.jpg`          | The hero photograph cropped to 1200×630 with the SAME framing the desktop home uses: `object-cover` focused at 62% horizontal and 50% vertical. Derived from `public/hero-vehiculo-cargando.webp`; if that one changes, regenerate this one |
| `poppins-semibold.ttf` | Poppins SemiBold, the system's headline typeface                                                                                                                                                                                            |
| `manrope.ttf`          | Manrope at weight 400, the body typeface                                                                                                                                                                                                    |

## Why the typefaces live here instead of loading like the rest of the site

The site serves them through `next/font` as **woff2**, and **Satori, the engine
that draws this image, does not read woff2**. It needs TTF or OTF.

They are **subset to the 57 glyphs** that appear on the card in the three
languages, using `fontTools`: from 139 KB and 163 KB down to 5 KB and 12 KB.
Manrope is a variable font and was instanced at weight 400 before subsetting,
because Satori does not interpolate axes.

**If the card's copy changes, the subset has to be regenerated**, or the new
characters will render blank.

## Licences

Poppins and Manrope are under the **SIL Open Font License 1.1**, which allows
redistribution, subsets included, as long as the licence travels with the file.
See `OFL.txt`.
