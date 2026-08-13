# Theme hero images

Backgrounds for `/chat`'s `IntakeLeftPanel` when a theme page hands off to the
themed mini-form. One file per theme-form slug, referenced from
`components/theme/cinematic/themeForms/<slug>.ts` as `hero.image`.

Served straight from `public/` rather than the media CDN, so they are **not**
resized at the edge — each file is already sized for the panel (long edge
2000px, JPEG q72, 270–670 KB). If you replace one, re-encode to roughly those
numbers rather than dropping in an original.

The panel is a tall, full-height box painted with `object-cover`, so portrait
sources crop best; landscape ones lose their sides. Both are represented below.

## Licence

All seven are from Unsplash under the [Unsplash
License](https://unsplash.com/license) — free for commercial use, no permission
or attribution required. Attribution is recorded here anyway, for provenance.
None are Unsplash+ / Premium.

| File | Unsplash photo | Subject |
| --- | --- | --- |
| `christmas-markets.jpg` | [`OEBeLcrzlaw`](https://unsplash.com/photos/OEBeLcrzlaw) | Lit carousel and stalls on a half-timbered market square at night |
| `edinburgh-hogmanay.jpg` | [`edBEflTCG_8`](https://unsplash.com/photos/edBEflTCG_8) | Fireworks bursting over Edinburgh Castle |
| `greece-islands-done-right.jpg` | [`cQpFzar6iqg`](https://unsplash.com/photos/cQpFzar6iqg) | Blue domes above the Santorini caldera |
| `hokkaido-powder.jpg` | [`oNDZBDTIOhk`](https://unsplash.com/photos/oNDZBDTIOhk) | Skier through deep powder in snow-laden trees |
| `lapland.jpg` | [`7fCnofuYKCQ`](https://unsplash.com/photos/7fCnofuYKCQ) | Husky sled team on a snowy forest trail |
| `northern-lights.jpg` | [`Gs1ZG7sdP88`](https://unsplash.com/photos/Gs1ZG7sdP88) | Green aurora over a frosted Finnish treeline |
| `switzerland-ddlj.jpg` | [`vBrdcXqWa4Q`](https://unsplash.com/photos/vBrdcXqWa4Q) | Green Lauterbrunnen valley under the Bernese Alps |
