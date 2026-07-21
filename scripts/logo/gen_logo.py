#!/usr/bin/env python3
"""
Generate The Tarzan Way logo SVGs from the design source (HTML+CSS lockup).

Reproduces Chrome's layout of:
  <flex align:center gap:30>
    <tile 114x114 r30 bg#0b1220 rotate(-4deg)>  <vine-t svg 62x71 viewBox 0 0 58 66> </tile>
    <flex align:baseline gap:11>
      <span Inter 800 52px ls -.045em #0b1220>the tarzan</span>
      <span bg#f7e700 r7 pad 1px 13px rotate(-1.5deg)>
        <span Instrument Serif italic 58px ls -.02em #0b1220>way</span>
      </span>
    </flex>
  </flex>

Text is converted to outline paths (the site ships Poppins, not Inter/Instrument Serif).
"""
import os
import math
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform
import uharfbuzz as hb

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)

NAVY = "#0b1220"
YELLOW = "#f7e700"
CREAM = "#fafaf5"
SLATE = "#445069"        # tagline text on light backgrounds (from the design)
SLATE_LIGHT = "#94a2ba"  # tagline text on dark backgrounds (lightened slate)

# ---------------------------------------------------------------- text shaping


class Font:
    def __init__(self, path):
        self.path = path
        self.tt = TTFont(path)
        self.upem = self.tt["head"].unitsPerEm
        os2 = self.tt["OS/2"]
        # Both fonts set USE_TYPO_METRICS, so Chrome's normal line-height derives
        # from sTypoAscender/Descender/LineGap.
        self.ascent = os2.sTypoAscender / self.upem
        self.descent = -os2.sTypoDescender / self.upem
        self.linegap = os2.sTypoLineGap / self.upem
        with open(path, "rb") as f:
            self.blob = hb.Blob(f.read())
        self.face = hb.Face(self.blob)
        self.glyphset = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()

    @property
    def line_height(self):
        return self.ascent + self.descent + self.linegap

    def shape(self, text, size, letter_spacing=0.0):
        """Return (list of (glyph_name, x_px, y_px), advance_width_px).

        letter_spacing is in px, applied after every character (Chrome behaviour,
        including after the final one).
        """
        hbfont = hb.Font(self.face)
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(hbfont, buf, {"kern": True, "liga": True})

        scale = size / self.upem
        pen_x = 0.0
        out = []
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            name = self.order[info.codepoint]
            out.append((name, pen_x + pos.x_offset * scale, -pos.y_offset * scale))
            pen_x += pos.x_advance * scale + letter_spacing
        return out, pen_x

    def outline(self, glyphs, size, baseline_y, x0=0.0):
        """SVG path 'd' for shaped glyphs, y-flipped, sitting on baseline_y."""
        scale = size / self.upem
        d = []
        for name, gx, gy in glyphs:
            pen = SVGPathPen(self.glyphset)
            t = Transform().translate(x0 + gx, baseline_y + gy).scale(scale, -scale)
            self.glyphset[name].draw(TransformPen(pen, t))
            seg = pen.getCommands()
            if seg:
                d.append(seg)
        return " ".join(d)


inter = Font(os.path.join(FONTS, "Inter.ttf"))
serif = Font(os.path.join(FONTS, "InstrumentSerif-Italic.ttf"))
mono = Font(os.path.join(FONTS, "JetBrainsMono-SemiBold.otf"))

# ---------------------------------------------------------------- layout (px)

TILE = 114.0
TILE_R = 30.0
TILE_ROT = -4.0
GAP_OUTER = 30.0
GAP_INNER = 11.0

T1_SIZE = 52.0
T1_LS = -0.045 * T1_SIZE          # -2.34px
T2_SIZE = 58.0
T2_LS = -0.02 * T2_SIZE           # -1.16px
BOX_PAD_X = 13.0
BOX_PAD_Y = 1.0
BOX_R = 7.0
BOX_ROT = -1.5

g1, w1 = inter.shape("the tarzan", T1_SIZE, T1_LS)
g2, w2 = serif.shape("way", T2_SIZE, T2_LS)

# secondary line: JetBrains Mono, uppercase, wide tracking, led by a yellow accent
# dot. Emitted as its OWN asset (ttw-tagline*.svg), not baked into the lockup — the
# app composes mark + wordmark + tagline and sizes the tagline independently so it
# stays legible; a tagline scaled with a 32-40px nav lockup is an unreadable smudge.
TAG_TEXT = "AI TRIP PLANNER"
TAG_SIZE = 11.5
TAG_LS = 0.12 * TAG_SIZE           # 1.38px (letter-spacing .12em) — kept tight so
                                   # the line fits within the wordmark width below it
gt, tag_w = mono.shape(TAG_TEXT, TAG_SIZE, TAG_LS)

# span1: block box in a flex line -> height is its line box
h1 = inter.line_height * T1_SIZE
base1 = inter.ascent * T1_SIZE + (inter.linegap * T1_SIZE) / 2.0

# span2: inline-block; content box is one line box of the serif text
content_h = serif.line_height * T2_SIZE
base2_in_content = serif.ascent * T2_SIZE + (serif.linegap * T2_SIZE) / 2.0
box_w = w2 + 2 * BOX_PAD_X
box_h = content_h + 2 * BOX_PAD_Y
base2 = BOX_PAD_Y + base2_in_content        # baseline from box top

# baseline alignment across the inner flex line
above = max(base1, base2)
below = max(h1 - base1, box_h - base2)
word_h = above + below
word_w = w1 + GAP_INNER + box_w

span1_top = above - base1
box_top = above - base2

# outer flex: tile (114) vs wordmark, centered
lock_h = max(TILE, word_h)
lock_w = TILE + GAP_OUTER + word_w
tile_top = (lock_h - TILE) / 2.0
word_top = (lock_h - word_h) / 2.0
word_x = TILE + GAP_OUTER

BASELINE = word_top + above


def fmt(v):
    return f"{v:.3f}".rstrip("0").rstrip(".")


# ---------------------------------------------------------------- pieces

# Ink bbox of the vine-t in its own 58x66 viewBox (stroke width 8, round caps
# => +/-4 beyond each path):
#   stem  (25,9)-(25,53)  -> x 21..29,     y 5..57
#   hook  q curve         -> x 21..40,     y 49..67
#   vine  q curve         -> x 3..50,      y 14.67..31
#   berry circle r6.5     -> x 39.5..52.5, y 17.5..30.5
#   union                 -> x 3..52.5,    y 5..67
INK = (3.0, 5.0, 52.5, 67.0)


def tile_group(bg, stem, accent, x=0.0, y=0.0, rot=TILE_ROT, size=TILE, r=TILE_R,
               art_scale=1.0, optical=False, border=None):
    """The rounded tile + vine-t. Inner art is 62x71 from a 0 0 58 66 viewBox.

    art_scale > 1 enlarges the vine-t within the tile (favicon legibility).
    optical=True centres the art on its ink instead of on the 62x71 box. The
    design centres the box (CSS place-items:center), so the brand lockup and
    mark keep optical=False to stay faithful; only the full-bleed app icons,
    where a 2px drift is visible, opt in.
    """
    s = (size / TILE) * art_scale
    iw, ih = 62.0 * s, 71.0 * s
    sx, sy = iw / 58.0, ih / 66.0
    if optical:
        ink_cx, ink_cy = (INK[0] + INK[2]) / 2.0, (INK[1] + INK[3]) / 2.0
        ix = (size / 2.0) - ink_cx * sx
        iy = (size / 2.0) - ink_cy * sy
    else:
        ix, iy = (size - iw) / 2.0, (size - ih) / 2.0
    cx, cy = x + size / 2.0, y + size / 2.0
    rota = f' transform="rotate({fmt(rot)} {fmt(cx)} {fmt(cy)})"' if rot else ""
    rect_r = f' rx="{fmt(r)}"' if r else ""
    if border:
        # hairline keeps the navy tile legible against a dark page; inset by
        # half the stroke so it sits inside the tile rather than straddling it
        bcol, bw, bop = border
        bw = bw * size / TILE
        h = bw / 2.0
        rect = (f'<rect x="{fmt(x)}" y="{fmt(y)}" width="{fmt(size)}" height="{fmt(size)}"{rect_r} fill="{bg}"/>\n'
                f'    <rect x="{fmt(x + h)}" y="{fmt(y + h)}" width="{fmt(size - bw)}" height="{fmt(size - bw)}"'
                f'{f" rx={chr(34)}{fmt(r - h)}{chr(34)}" if r else ""} fill="none" stroke="{bcol}" stroke-opacity="{bop}" stroke-width="{fmt(bw)}"/>')
    else:
        rect = f'<rect x="{fmt(x)}" y="{fmt(y)}" width="{fmt(size)}" height="{fmt(size)}"{rect_r} fill="{bg}"/>'
    return f'''  <g{rota}>
    {rect}
    <g transform="translate({fmt(x + ix)} {fmt(y + iy)}) scale({fmt(sx)} {fmt(sy)})" fill="none" stroke-width="8" stroke-linecap="round">
      <path d="M25 9V53" stroke="{stem}"/>
      <path d="M25 53q0 10 11 10" stroke="{stem}"/>
      <path d="M7 27q19 -15 39 -3" stroke="{accent}"/>
      <circle cx="46" cy="24" r="6.5" fill="{accent}" stroke="none"/>
    </g>
  </g>'''


def wordmark_group(text_fill, box_fill, way_fill):
    d1 = inter.outline(g1, T1_SIZE, BASELINE, x0=word_x)
    bx = word_x + w1 + GAP_INNER
    by = word_top + box_top
    bcx, bcy = bx + box_w / 2.0, by + box_h / 2.0
    d2 = serif.outline(g2, T2_SIZE, BASELINE, x0=bx + BOX_PAD_X)
    return f'''  <path d="{d1}" fill="{text_fill}"/>
  <g transform="rotate({fmt(BOX_ROT)} {fmt(bcx)} {fmt(bcy)})">
    <rect x="{fmt(bx)}" y="{fmt(by)}" width="{fmt(box_w)}" height="{fmt(box_h)}" rx="{fmt(BOX_R)}" fill="{box_fill}"/>
    <path d="{d2}" fill="{way_fill}"/>
  </g>'''


def rot_bounds(x, y, w, h, deg):
    """Axis-aligned bounds of a rect rotated about its own centre."""
    a = math.radians(deg)
    cx, cy = x + w / 2.0, y + h / 2.0
    xs, ys = [], []
    for px, py in ((x, y), (x + w, y), (x, y + h), (x + w, y + h)):
        dx, dy = px - cx, py - cy
        xs.append(cx + dx * math.cos(a) - dy * math.sin(a))
        ys.append(cy + dx * math.sin(a) + dy * math.cos(a))
    return min(xs), min(ys), max(xs), max(ys)


def text_ink(font, glyphs, size, baseline_y, x0):
    pen = BoundsPen(font.glyphset)
    scale = size / font.upem
    for name, gx, gy in glyphs:
        t = Transform().translate(x0 + gx, baseline_y + gy).scale(scale, -scale)
        font.glyphset[name].draw(TransformPen(pen, t))
    return pen.bounds


def lockup_bbox():
    boxes = [rot_bounds(0, tile_top, TILE, TILE, TILE_ROT)]
    bx = word_x + w1 + GAP_INNER
    by = word_top + box_top
    boxes.append(rot_bounds(bx, by, box_w, box_h, BOX_ROT))
    boxes.append(text_ink(inter, g1, T1_SIZE, BASELINE, word_x))
    # the rotated 'way' glyphs live inside the rotated box, already covered
    x0 = min(b[0] for b in boxes)
    y0 = min(b[1] for b in boxes)
    x1 = max(b[2] for b in boxes)
    y1 = max(b[3] for b in boxes)
    return x0, y0, x1, y1


def lockup(path, tile_bg, tile_stem, tile_accent, text_fill, box_fill, way_fill,
           border=None):
    # Round the bbox outward to integers: next/image reads width/height off a
    # static SVG import, and fractional values there are brittle. An integer
    # viewBox with matching width/height keeps the aspect ratio exact.
    fx0, fy0, fx1, fy1 = lockup_bbox()
    x0, y0 = math.floor(fx0), math.floor(fy0)
    x1, y1 = math.ceil(fx1), math.ceil(fy1)
    vw, vh = x1 - x0, y1 - y0
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {vw} {vh}" width="{vw}" height="{vh}" fill="none" role="img" aria-label="The Tarzan Way">
{tile_group(tile_bg, tile_stem, tile_accent, border=border)}
{wordmark_group(text_fill, box_fill, way_fill)}
</svg>
'''
    with open(os.path.join(OUT, path), "w") as f:
        f.write(svg)
    return svg


def wordmark_bbox():
    bx = word_x + w1 + GAP_INNER
    by = word_top + box_top
    b_text = text_ink(inter, g1, T1_SIZE, BASELINE, word_x)
    b_box = rot_bounds(bx, by, box_w, box_h, BOX_ROT)
    return (min(b_text[0], b_box[0]), min(b_text[1], b_box[1]),
            max(b_text[2], b_box[2]), max(b_text[3], b_box[3]))


def wordmark(path, text_fill, box_fill, way_fill):
    # "the tarzan way" alone, tightly cropped. Lets the app compose the lockup
    # itself (mark + wordmark + a LIVE-text tagline), so the tagline can be sized
    # independently and stay legible at the 32-40px the lockup renders in nav —
    # a tagline baked into the full-lockup SVG shrinks to an unreadable smudge.
    fx0, fy0, fx1, fy1 = wordmark_bbox()
    x0, y0 = math.floor(fx0), math.floor(fy0)
    x1, y1 = math.ceil(fx1), math.ceil(fy1)
    vw, vh = x1 - x0, y1 - y0
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {vw} {vh}" width="{vw}" height="{vh}" fill="none" role="img" aria-label="the tarzan way">
{wordmark_group(text_fill, box_fill, way_fill)}
</svg>
'''
    with open(os.path.join(OUT, path), "w") as f:
        f.write(svg)
    return svg


def tagline_svg(path, tag_fill):
    # "AI TRIP PLANNER" outlined, led by a yellow accent dot, tightly cropped to
    # its ink. The dot is vertically centred on the caps and its left edge sits at
    # x=0 so the app can butt the line's left edge against the wordmark's.
    base_in_line = mono.ascent * TAG_SIZE + (mono.linegap * TAG_SIZE) / 2.0
    # measure the text ink first (at x0=0) to size + place the dot off the caps
    ix0, iy0, ix1, iy1 = text_ink(mono, gt, TAG_SIZE, base_in_line, 0.0)
    cap_h = iy1 - iy0
    dot_r = 0.34 * cap_h               # ~68% of cap height — big enough to read at 6-7px
    dot_gap = 0.50 * cap_h             # space between dot and first letter
    dot_cx = dot_r                     # dot left edge at x=0
    dot_cy = (iy0 + iy1) / 2.0         # centred on the caps
    text_x = 2 * dot_r + dot_gap - ix0  # shift text right to clear the dot + gap
    dt = mono.outline(gt, TAG_SIZE, base_in_line, x0=text_x)
    # union bounds: dot (x 0..2r, y within the caps) + shifted text ink
    fx0, fy0 = 0.0, min(iy0, dot_cy - dot_r)
    fx1, fy1 = ix1 + text_x, max(iy1, dot_cy + dot_r)
    x0, y0 = math.floor(fx0), math.floor(fy0)
    x1, y1 = math.ceil(fx1), math.ceil(fy1)
    vw, vh = x1 - x0, y1 - y0
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {vw} {vh}" width="{vw}" height="{vh}" fill="none" role="img" aria-label="AI Trip Planner">
  <circle cx="{fmt(dot_cx)}" cy="{fmt(dot_cy)}" r="{fmt(dot_r)}" fill="{YELLOW}"/>
  <path d="{dt}" fill="{tag_fill}"/>
</svg>
'''
    with open(os.path.join(OUT, path), "w") as f:
        f.write(svg)
    return svg


def mark(path, bg, stem, accent, size=64, rot=TILE_ROT, radius_ratio=30.0 / 114.0,
         art_scale=1.0, optical=False, inset=0.0, border=None):
    """Standalone tile mark on a size x size canvas.

    A rotated square needs padding or its corners fall outside the canvas:
    a side-s square at angle a spans s*(cos a + sin a).
    `inset` is an extra fraction of the canvas reserved on every side (maskable
    safe zone).
    """
    a = math.radians(abs(rot))
    span = math.cos(a) + math.sin(a)          # 1.0 when rot == 0
    inner = (size * (1.0 - 2 * inset)) / span
    pad = (size - inner) / 2.0
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(size)} {fmt(size)}" width="{fmt(size)}" height="{fmt(size)}" fill="none" role="img" aria-label="The Tarzan Way">
{tile_group(bg, stem, accent, x=pad, y=pad, rot=rot, size=inner, r=inner * radius_ratio, art_scale=art_scale, optical=optical, border=border)}
</svg>
'''
    with open(os.path.join(OUT, path), "w") as f:
        f.write(svg)
    return svg


# On dark backgrounds the tile stays navy — flipping it to cream reads as a
# white slab. A hairline edge separates it from the page instead.
DARK_BORDER = (CREAM, 1.5, "0.16")

# --- brand lockups (faithful to the design) ---------------------------------
# on-light: navy tile, cream stem, yellow accent, navy wordmark
lockup("ttw-lockup.svg", NAVY, CREAM, YELLOW, NAVY, YELLOW, NAVY)
# on-dark: navy tile + hairline, cream stem, yellow accent, cream wordmark
lockup("ttw-lockup-light.svg", NAVY, CREAM, YELLOW, CREAM, YELLOW, NAVY,
       border=DARK_BORDER)

# --- standalone wordmark (app composes mark + wordmark + tagline) ------------
# on-light: navy wordmark; on-dark: cream wordmark. Yellow "way" box either way.
wordmark("ttw-wordmark.svg", NAVY, YELLOW, NAVY)
wordmark("ttw-wordmark-light.svg", CREAM, YELLOW, NAVY)

# --- standalone tagline (sized independently by the app for legibility) ------
tagline_svg("ttw-tagline.svg", SLATE)         # on light
tagline_svg("ttw-tagline-light.svg", SLATE_LIGHT)  # on dark

# --- standalone marks (keep the -4deg tilt, padded so corners fit) -----------
mark("ttw-mark.svg", NAVY, CREAM, YELLOW)
mark("ttw-mark-light.svg", NAVY, CREAM, YELLOW, border=DARK_BORDER)

# --- app icons: upright, full-bleed tile, art enlarged + optically centred ---
mark("ttw-icon.svg", NAVY, CREAM, YELLOW, rot=0.0, art_scale=1.26, optical=True)
# maskable: square, art inside the 80% safe zone
mark("ttw-icon-maskable.svg", NAVY, CREAM, YELLOW, rot=0.0, radius_ratio=0.0,
     art_scale=1.26, optical=True, inset=0.10)

if __name__ == "__main__":
    bb = lockup_bbox()
    print(f"span1 'the tarzan'  w={w1:.2f}  h={h1:.2f}  baseline={base1:.2f}")
    print(f"'way' advance       w={w2:.2f}")
    print(f"yellow box          {box_w:.2f} x {box_h:.2f}  baseline@{base2:.2f}")
    print(f"wordmark            {word_w:.2f} x {word_h:.2f}")
    print(f"lockup layout       {lock_w:.2f} x {lock_h:.2f}")
    print(f"lockup viewBox      {bb[2]-bb[0]:.2f} x {bb[3]-bb[1]:.2f}  (aspect {(bb[2]-bb[0])/(bb[3]-bb[1]):.4f})")
    print(f"wrote -> {OUT}")
