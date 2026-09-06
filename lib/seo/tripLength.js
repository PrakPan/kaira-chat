// Trip-length buckets, shared by the build-time card model and the client-side
// filter bar.
//
// Deliberately its own module with no imports: lib/seo/tripsCards reads the
// .seo-cache off disk, so anything a component pulls from there drags `fs` into
// the client bundle and the page fails to build. This file is pure data plus one
// pure function, so both sides can use it.
//
// Cut where the corpus actually sits: the 1,718 released trips peak at 6 nights,
// with 5–7N the densest band (696 trips), 1–4N below it (392), 8–11N above
// (493) and a thin 12+ tail (~90). Ordered short → long so the row reads as a
// scale rather than an arbitrary set.
const LENGTH_BUCKETS = [
  { id: "short", label: "Up to 4 nights", min: 1, max: 4 },
  { id: "week", label: "5 – 7 nights", min: 5, max: 7 },
  { id: "long", label: "8 – 11 nights", min: 8, max: 11 },
  { id: "extended", label: "12+ nights", min: 12, max: Infinity },
];

// A handful of rows carry a nonsense duration (one is -57), so anything outside
// the buckets gets no length filter rather than landing in "short".
const lengthBucket = (duration) => {
  const n = Number(duration);
  if (!Number.isFinite(n) || n < 1) return null;
  return LENGTH_BUCKETS.find((b) => n >= b.min && n <= b.max)?.id || null;
};

module.exports = { LENGTH_BUCKETS, lengthBucket };
