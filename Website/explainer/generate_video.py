#!/usr/bin/env python3
"""Generate Harvest Hold Rwanda SHCCS prototype explainer video frames.

Improved with arrow callouts labeling every material and component.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
FRAMES = ROOT / "frames"
W, H = 1280, 720
FPS = 24

GREEN = (46, 158, 74)
ORANGE = (232, 140, 48)
CREAM = (236, 242, 232)
WHITE = (255, 255, 255)
DARK = (12, 22, 16)
PANEL = (20, 36, 26)
WOOD = (122, 84, 48)
WOOD_DK = (84, 56, 30)
CHARCOAL = (48, 48, 48)
WATER = (72, 160, 220)
COOL = (120, 210, 230)
WARM = (255, 150, 90)
ALERT = (220, 60, 50)
MESH = (160, 160, 155)
LABEL_BG = (14, 28, 20)

FONT_REG = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/noto/NotoSans-SemiCondensedSemiBold.ttf"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def clamp(t: float) -> float:
    return max(0.0, min(1.0, t))


def ease(t: float) -> float:
    t = clamp(t)
    return t * t * (3 - 2 * t)


def scene_progress(frame: int, start: int, end: int) -> float:
    if frame < start:
        return 0.0
    if frame >= end:
        return 1.0
    return ease((frame - start) / max(1, end - start))


def draw_bg(draw: ImageDraw.ImageDraw, img: Image.Image) -> None:
    for y in range(H):
        t = y / H
        draw.line([(0, y), (W, y)], fill=(int(lerp(10, 18, t)), int(lerp(28, 42, t)), int(lerp(16, 24, t))))
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for i in range(8):
        pad = 40 + i * 50
        od.ellipse([pad, pad - 40, W - pad, H - pad + 80], fill=(46, 158, 74, 18 - i * 2))
    img.alpha_composite(overlay)


def draw_header(draw: ImageDraw.ImageDraw, title: str, subtitle: str = "") -> None:
    draw.rounded_rectangle([36, 28, W - 36, 108], radius=18, fill=PANEL)
    draw.rectangle([36, 28, 48, 108], fill=ORANGE)
    draw.text((68, 42), title, font=font(26, True), fill=GREEN)
    if subtitle:
        draw.text((68, 76), subtitle, font=font(15), fill=CREAM)


def draw_footer(draw: ImageDraw.ImageDraw, step: str, progress: float) -> None:
    draw.text((48, H - 42), "Harvest Hold Rwanda  ·  Smart Hybrid Charcoal Cooler", font=font(13), fill=(160, 190, 165))
    bbox = draw.textbbox((0, 0), step, font=font(13, True))
    draw.text((W - 48 - (bbox[2] - bbox[0]), H - 42), step, font=font(13, True), fill=ORANGE)
    bw = W - 96
    draw.rounded_rectangle([48, H - 58, 48 + bw, H - 52], radius=3, fill=(40, 60, 45))
    draw.rounded_rectangle([48, H - 58, 48 + int(bw * progress), H - 52], radius=3, fill=GREEN)


def draw_arrow(
    draw: ImageDraw.ImageDraw,
    tip: tuple[int, int],
    label_pos: tuple[int, int],
    text: str,
    color: tuple[int, int, int] = ORANGE,
    sub: str = "",
    appear: float = 1.0,
) -> None:
    """Draw an arrow from label_pos toward tip, with a material/part label."""
    if appear <= 0.02:
        return
    lx, ly = label_pos
    tx, ty = tip

    # fade via simple skip for early frames; full draw otherwise
    f = font(13, True)
    sf = font(11)
    lines = [text] + ([sub] if sub else [])
    widths = [draw.textbbox((0, 0), line, font=(f if i == 0 else sf))[2] for i, line in enumerate(lines)]
    tw = max(widths) + 16
    th = 22 + (16 if sub else 0)
    box = [lx - 8, ly - 6, lx - 8 + tw, ly - 6 + th]

    # leader line + arrow head
    draw.line([(lx + tw // 2 - 8, ly + th // 2), (tx, ty)], fill=color, width=2)
    ang = math.atan2(ty - (ly + th // 2), tx - (lx + tw // 2 - 8))
    ah = 10
    p1 = (tx - int(ah * math.cos(ang - 0.4)), ty - int(ah * math.sin(ang - 0.4)))
    p2 = (tx - int(ah * math.cos(ang + 0.4)), ty - int(ah * math.sin(ang + 0.4)))
    draw.polygon([(tx, ty), p1, p2], fill=color)
    draw.ellipse([tx - 3, ty - 3, tx + 3, ty + 3], fill=color)

    draw.rounded_rectangle(box, radius=6, fill=LABEL_BG, outline=color, width=1)
    draw.text((lx, ly), text, font=f, fill=WHITE if appear > 0.5 else CREAM)
    if sub:
        draw.text((lx, ly + 16), sub, font=sf, fill=(170, 195, 175))


def draw_cooler(
    draw: ImageDraw.ImageDraw,
    img: Image.Image,
    cx: int,
    cy: int,
    scale: float,
    wet: float,
    fan_angle: float,
    cool_flow: float,
    show_produce: bool = True,
    pump_on: bool = False,
    alert: bool = False,
    show_mesh: bool = True,
) -> dict[str, tuple[int, int]]:
    """Draw cutaway cooler and return named anchor points for arrow labels."""
    sw = int(440 * scale)
    sh = int(310 * scale)
    x0, y0 = cx - sw // 2, cy - sh // 2
    gap = int(40 * scale)

    # outer wooden crate
    draw.rounded_rectangle([x0, y0, x0 + sw, y0 + sh], radius=10, fill=WOOD, outline=WOOD_DK, width=3)
    # wood grain hints
    for i in range(5):
        yy = y0 + 20 + i * int(50 * scale)
        draw.line([(x0 + 6, yy), (x0 + sw - 6, yy)], fill=(140, 100, 60), width=1)

    # charcoal walls (~10 cm gap)
    draw.rectangle([x0 + 8, y0 + 8, x0 + gap, y0 + sh - 8], fill=CHARCOAL)
    draw.rectangle([x0 + sw - gap, y0 + 8, x0 + sw - 8, y0 + sh - 8], fill=CHARCOAL)
    draw.rectangle([x0 + 8, y0 + sh - gap, x0 + sw - 8, y0 + sh - 8], fill=CHARCOAL)
    # charcoal texture dots
    for i in range(18):
        px = x0 + 14 + (i % 3) * 10
        py = y0 + 18 + (i // 3) * 28
        draw.ellipse([px, py, px + 5, py + 5], fill=(70, 70, 70))
        draw.ellipse([x0 + sw - gap + 10 + (i % 3) * 10, py, x0 + sw - gap + 15 + (i % 3) * 10, py + 5], fill=(70, 70, 70))

    # mesh screens over charcoal
    if show_mesh:
        for mx in (x0 + 8, x0 + sw - gap):
            for gy in range(y0 + 12, y0 + sh - 12, 8):
                draw.line([(mx, gy), (mx + gap - 8, gy)], fill=MESH, width=1)
            for gx in range(mx, mx + gap - 8, 8):
                draw.line([(gx, y0 + 12), (gx, y0 + sh - 12)], fill=MESH, width=1)

    # wet charcoal shimmer
    if wet > 0:
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        a = int(90 * wet)
        od.rectangle([x0 + 8, y0 + 8, x0 + gap, y0 + sh - 8], fill=(*WATER, a // 2))
        od.rectangle([x0 + sw - gap, y0 + 8, x0 + sw - 8, y0 + sh - 8], fill=(*WATER, a // 2))
        for i in range(6):
            dy = int((y0 + 20 + i * 35 + wet * 40) % (sh - 40))
            od.ellipse([x0 + gap // 2 - 3, y0 + dy, x0 + gap // 2 + 3, y0 + dy + 8], fill=(*WATER, a))
            od.ellipse([x0 + sw - gap // 2 - 3, y0 + dy, x0 + sw - gap // 2 + 3, y0 + dy + 8], fill=(*WATER, a))
        img.alpha_composite(overlay)

    # inner produce chamber
    ix0, iy0 = x0 + gap + 6, y0 + 18
    ix1, iy1 = x0 + sw - gap - 6, y0 + sh - gap - 6
    chamber = (35, 55, 42) if cool_flow < 0.3 else (30, 70, 55)
    draw.rounded_rectangle([ix0, iy0, ix1, iy1], radius=8, fill=chamber, outline=(70, 110, 80), width=2)

    # perforated shelf
    shelf_y = iy1 - int(55 * scale)
    draw.line([(ix0 + 8, shelf_y), (ix1 - 8, shelf_y)], fill=(100, 120, 100), width=2)
    for sx in range(ix0 + 16, ix1 - 10, 14):
        draw.ellipse([sx, shelf_y - 2, sx + 4, shelf_y + 2], fill=(60, 80, 60))

    if show_produce:
        for px, py in [(ix0 + 36, shelf_y - 28), (ix0 + 70, shelf_y - 32), (ix0 + 52, shelf_y - 50)]:
            draw.ellipse([px, py, px + 26, py + 26], fill=(200, 55, 45), outline=(150, 30, 25))
        draw.ellipse([ix1 - 95, shelf_y - 40, ix1 - 35, shelf_y - 8], fill=(70, 160, 70))
        draw.ellipse([ix1 - 115, shelf_y - 28, ix1 - 60, shelf_y - 4], fill=(50, 130, 55))
        draw.polygon([(ix0 + 115, shelf_y - 4), (ix0 + 128, shelf_y - 48), (ix0 + 140, shelf_y - 4)], fill=(230, 120, 40))

    # water reservoir
    rx0, ry0 = x0 + sw - gap - 78, y0 - 58
    draw.rounded_rectangle([rx0, ry0, rx0 + 58, ry0 + 48], radius=6, fill=(40, 90, 140), outline=WATER, width=2)
    water_h = int(30 * (0.4 + 0.6 * wet))
    draw.rectangle([rx0 + 4, ry0 + 42 - water_h, rx0 + 54, ry0 + 44], fill=WATER)
    # drip tube
    draw.line([(rx0 + 29, ry0 + 48), (rx0 + 29, y0 + 12)], fill=(30, 30, 30), width=3)
    if pump_on:
        for i in range(3):
            dy = int((fan_angle * 20 + i * 12) % 40)
            draw.ellipse([rx0 + 26, y0 + 8 + dy, rx0 + 32, y0 + 16 + dy], fill=WATER)

    # solar panel
    sx0, sy0 = x0 + 36, y0 - 32
    draw.rounded_rectangle([sx0, sy0, sx0 + 130, sy0 + 22], radius=3, fill=(20, 40, 80), outline=(80, 140, 200), width=2)
    for i in range(4):
        draw.line([sx0 + 12 + i * 28, sy0 + 2, sx0 + 12 + i * 28, sy0 + 20], fill=(60, 100, 160), width=1)

    # fan
    fx, fy = x0 + sw - 16, y0 + sh // 2 + 10
    draw.ellipse([fx - 24, fy - 24, fx + 24, fy + 24], fill=(30, 30, 30), outline=GREEN, width=2)
    for blade in range(3):
        ang = fan_angle + blade * (2 * math.pi / 3)
        draw.line([(fx, fy), (fx + int(math.cos(ang) * 17), fy + int(math.sin(ang) * 17))], fill=CREAM, width=4)
    draw.ellipse([fx - 5, fy - 5, fx + 5, fy + 5], fill=ORANGE)

    # airflow
    if cool_flow > 0:
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        for i in range(10):
            t = (cool_flow + i * 0.08 + fan_angle * 0.02) % 1.0
            wx = int(lerp(x0 + sw + 28, x0 + sw - gap // 2, t))
            wy = int(fy - 40 + (i % 5) * 18 + math.sin(t * 6 + i) * 4)
            od.ellipse([wx, wy, wx + 10, wy + 6], fill=(*WARM, int(140 * (1 - t))))
            if t > 0.35:
                ct = (t - 0.35) / 0.65
                cxp = int(lerp(x0 + sw - gap, ix0 + 30, ct))
                cyp = int(fy - 20 + (i % 4) * 16)
                od.ellipse([cxp, cyp, cxp + 12, cyp + 7], fill=(*COOL, int(160 * (1 - ct * 0.5))))
        img.alpha_composite(overlay)

    # OLED housing
    ox0, oy0 = x0 + 22, y0 + sh // 2 - 36
    draw.rounded_rectangle([ox0, oy0, ox0 + 74, oy0 + 50], radius=4, fill=(10, 10, 10), outline=(80, 80, 80), width=2)
    temp = 22.5 - cool_flow * 8
    hum = 55 + cool_flow * 20
    oled_color = ALERT if alert else GREEN
    draw.text((ox0 + 8, oy0 + 6), f"{temp:.1f}°C", font=font(11, True), fill=oled_color)
    draw.text((ox0 + 8, oy0 + 22), f"RH {hum:.0f}%", font=font(10), fill=CREAM)
    draw.ellipse([ox0 + 28, oy0 + 56, ox0 + 42, oy0 + 70], fill=GREEN if not alert else ALERT)

    # tiny sensor dots inside chamber
    sens_x, sens_y = ix1 - 28, iy0 + 24
    draw.ellipse([sens_x, sens_y, sens_x + 12, sens_y + 12], fill=(90, 200, 120), outline=GREEN, width=1)
    eth_x, eth_y = ix1 - 28, iy0 + 48
    draw.ellipse([eth_x, eth_y, eth_x + 12, eth_y + 12], fill=(200, 160, 60), outline=ORANGE, width=1)

    return {
        "wood": (x0 + 20, y0 + sh // 3),
        "charcoal": (x0 + gap // 2, y0 + sh // 2),
        "charcoal_right": (x0 + sw - gap // 2, y0 + sh // 2 - 20),
        "mesh": (x0 + gap // 2, y0 + 30),
        "chamber": ((ix0 + ix1) // 2, (iy0 + iy1) // 2),
        "produce": (ix0 + 70, shelf_y - 20),
        "shelf": ((ix0 + ix1) // 2, shelf_y),
        "reservoir": (rx0 + 29, ry0 + 20),
        "drip": (rx0 + 29, y0 + 8),
        "solar": (sx0 + 65, sy0 + 10),
        "fan": (fx, fy),
        "oled": (ox0 + 37, oy0 + 25),
        "button": (ox0 + 35, oy0 + 63),
        "sht31": (sens_x + 6, sens_y + 6),
        "ethylene": (eth_x + 6, eth_y + 6),
        "gap": (x0 + gap // 2, y0 + sh - gap // 2),
        "crate_top": (x0 + sw // 2, y0 + 4),
        "bounds": (x0, y0, sw, sh),
    }


def draw_labeled_prototype(
    draw: ImageDraw.ImageDraw,
    img: Image.Image,
    n: int,
    appear: float,
) -> None:
    """Full labeled cutaway — main materials scene."""
    anchors = draw_cooler(
        draw, img,
        cx=560,
        cy=400,
        scale=1.12,
        wet=0.75,
        fan_angle=n * 0.28,
        cool_flow=0.7,
        pump_on=True,
        show_mesh=True,
    )

    # Staggered arrow labels (left side materials, right/top electronics)
    labels = [
        # tip, label_xy, title, color, subtitle, delay
        (anchors["wood"], (48, 150), "Wooden crate", WOOD, "Local timber · double-walled", 0.00),
        (anchors["charcoal"], (48, 210), "Activated charcoal", (180, 180, 180), "Porous bed · ~10 cm wall gap", 0.08),
        (anchors["mesh"], (48, 270), "Wire mesh screen", MESH, "Holds charcoal · allows airflow", 0.16),
        (anchors["gap"], (48, 330), "Air gap / charcoal fill", (150, 170, 155), "Between inner & outer walls", 0.24),
        (anchors["chamber"], (48, 400), "Produce chamber", CREAM, "Insulated storage space", 0.32),
        (anchors["shelf"], (48, 470), "Perforated shelf", (140, 160, 140), "Metal / mesh tray", 0.40),
        (anchors["solar"], (900, 140), "Solar PV panel", (120, 180, 255), "Off-grid charging", 0.12),
        (anchors["reservoir"], (980, 200), "Water reservoir", WATER, "Plastic tank · drip feed", 0.20),
        (anchors["drip"], (1000, 260), "Drip / irrigation tube", WATER, "Wets charcoal bed", 0.28),
        (anchors["fan"], (1000, 340), "5V DC brushless fan", ORANGE, "Pulls air through charcoal", 0.36),
        (anchors["oled"], (980, 420), "0.96\" OLED display", GREEN, "Live T/H & status", 0.44),
        (anchors["sht31"], (980, 480), "SHT31 sensor", GREEN, "Temp + humidity (I²C)", 0.52),
        (anchors["ethylene"], (960, 540), "Ethylene sensor", ORANGE, "C₂H₄ ripening gas", 0.60),
    ]

    for tip, lab, title, col, sub, delay in labels:
        a = ease(clamp((appear - delay) / 0.25))
        if a > 0:
            draw_arrow(draw, tip, lab, title, color=col, sub=sub, appear=a)


def draw_esp_block(draw: ImageDraw.ImageDraw, x: int, y: int, active: float, alert: bool = False) -> None:
    draw.rounded_rectangle([x, y, x + 280, y + 230], radius=12, fill=PANEL, outline=GREEN if active > 0.5 else (60, 80, 65), width=2)
    draw.text((x + 16, y + 12), "Electronics bill of materials", font=font(15, True), fill=GREEN)
    items = [
        ("ESP32 DevKit C V4", "Main microcontroller"),
        ("SHT31 T/H sensor", "I²C · GPIO21 / GPIO22"),
        ("Ethylene (C₂H₄) sensor", "Ripening detection"),
        ("0.96\" OLED 128×64", "Local farmer display"),
        ("TP4056 + 3.7V LiPo", "Solar charge / boost to 5V"),
        ("Buzzer + red LED", "Alerts · GPIO17 / GPIO19"),
    ]
    for i, (a, b) in enumerate(items):
        yy = y + 42 + i * 28
        on = active > i * 0.12
        draw.ellipse([x + 16, yy + 4, x + 26, yy + 14], fill=GREEN if on else (50, 70, 55))
        draw.text((x + 36, yy), a, font=font(12, True), fill=CREAM if on else (100, 120, 105))
        draw.text((x + 36, yy + 13), b, font=font(10), fill=(140, 170, 145) if on else (70, 90, 75))
    if alert:
        draw.rounded_rectangle([x + 16, y + 205, x + 264, y + 222], radius=5, fill=(80, 25, 20))
        draw.text((x + 28, y + 206), "ALERT · TEMP HIGH", font=font(12, True), fill=ALERT)


def draw_dashboard(draw: ImageDraw.ImageDraw, x: int, y: int, t: float) -> None:
    draw.rounded_rectangle([x, y, x + 340, y + 240], radius=12, fill=(18, 28, 22), outline=(60, 100, 70), width=2)
    draw.text((x + 16, y + 12), "IoT Dashboard", font=font(16, True), fill=GREEN)
    draw.text((x + 16, y + 34), "Live silo · Musanze Node 01", font=font(11), fill=(150, 180, 155))
    pts = []
    for i in range(24):
        pts.append((x + 20 + i * 12, y + 120 - int(28 * math.sin(i * 0.35 + t * 4) + 18 * math.cos(i * 0.2))))
    if len(pts) > 1:
        draw.line(pts, fill=GREEN, width=3)
    draw.text((x + 16, y + 150), "Temp trend  ·  Humidity  ·  Ethylene", font=font(11), fill=(140, 170, 150))
    for i, (v, l) in enumerate([("22.1°C", "Chamber"), ("78% RH", "Humidity"), ("OK", "Status")]):
        kx = x + 16 + i * 105
        draw.rounded_rectangle([kx, y + 178, kx + 95, y + 220], radius=8, fill=(28, 48, 34))
        draw.text((kx + 10, y + 184), v, font=font(14, True), fill=ORANGE if i < 2 else GREEN)
        draw.text((kx + 10, y + 202), l, font=font(10), fill=CREAM)


def render_frame(n: int, total: int) -> Image.Image:
    img = Image.new("RGBA", (W, H), (*DARK, 255))
    draw = ImageDraw.Draw(img, "RGBA")
    draw_bg(draw, img)
    progress = n / max(1, total - 1)

    # Timeline (~62s): intro, problem, LABELED MATERIALS, cooling, electronics, dashboard, impact, build
    t0 = 0
    t1 = 3 * FPS
    t2 = 7 * FPS
    t3 = 18 * FPS   # long labeled materials scene
    t4 = 27 * FPS
    t5 = 36 * FPS
    t6 = 44 * FPS
    t7 = 52 * FPS
    t8 = total

    if n < t1:
        p = scene_progress(n, t0, t1)
        draw_header(draw, "HARVEST HOLD RWANDA", "Eliminating post-harvest loss through IoT & AI")
        title_y = int(lerp(380, 300, p))
        draw.text((W // 2 - 340, title_y), "How the Prototype Works", font=font(42, True), fill=WHITE)
        draw.text((W // 2 - 290, title_y + 60), "Smart Hybrid Charcoal Cooler (SHCCS)", font=font(22), fill=ORANGE)
        draw.text((W // 2 - 260, title_y + 110), "Materials · parts · cooling cycle — labeled", font=font(18), fill=(180, 200, 185))
        draw_footer(draw, "01 / Intro", progress)

    elif n < t2:
        p = scene_progress(n, t1, t2)
        draw_header(draw, "THE PROBLEM", "Why smallholders need off-grid cold chain")
        stats = [
            ("40%", "Horticulture yield loss"),
            ("$140M+", "Lost rural income / year"),
            ("70%", "Farmers off-grid"),
        ]
        for i, (big, label) in enumerate(stats):
            appear = ease(clamp((p - i * 0.15) / 0.4))
            x = 90 + i * 380
            y = int(lerp(420, 280, appear))
            draw.rounded_rectangle([x, y, x + 320, y + 160], radius=16, fill=PANEL)
            draw.text((x + 28, y + 28), big, font=font(48, True), fill=GREEN)
            draw.text((x + 28, y + 100), label, font=font(16), fill=CREAM)
        draw_footer(draw, "02 / Problem", progress)

    elif n < t3:
        # ★ Main labeled materials / components scene
        local = (n - t2) / (t3 - t2)
        draw_header(draw, "PARTS & MATERIALS", "Every component labeled — what you will build with")
        draw_labeled_prototype(draw, img, n, appear=local)
        draw_footer(draw, "03 / Labeled parts", progress)

    elif n < t4:
        local = (n - t3) / (t4 - t3)
        draw_header(draw, "COOLING CYCLE", "How materials work together to drop 10–15°C")
        wet = ease(clamp((local - 0.05) / 0.25))
        pump = 0.1 < local < 0.75
        flow = ease(clamp((local - 0.25) / 0.35))
        anchors = draw_cooler(
            draw, img,
            cx=460,
            cy=400,
            scale=1.0,
            wet=wet,
            fan_angle=n * 0.35,
            cool_flow=flow,
            pump_on=pump,
        )
        # Active process arrows
        if local > 0.1:
            draw_arrow(draw, anchors["drip"], (40, 180), "1. Water wets charcoal", WATER, "From plastic reservoir", ease(clamp((local - 0.1) / 0.2)))
        if local > 0.3:
            draw_arrow(draw, anchors["fan"], (40, 260), "2. Fan draws warm air", ORANGE, "Through wet charcoal bed", ease(clamp((local - 0.3) / 0.2)))
        if local > 0.5:
            draw_arrow(draw, anchors["chamber"], (40, 340), "3. Cool air enters chamber", COOL, "Evaporation removes heat", ease(clamp((local - 0.5) / 0.2)))
        if local > 0.7:
            draw_arrow(draw, anchors["sht31"], (40, 420), "4. Sensors monitor", GREEN, "ESP32 adjusts fan & pump", ease(clamp((local - 0.7) / 0.2)))

        steps = [
            (0.05, "Water → charcoal"),
            (0.25, "Fan → airflow"),
            (0.45, "Evaporation cools"),
            (0.65, "Sensors control"),
            (0.80, "Cloud sync"),
        ]
        draw.rounded_rectangle([860, 160, 1235, 520], radius=14, fill=PANEL)
        draw.text((885, 180), "Cycle steps", font=font(18, True), fill=ORANGE)
        for i, (thr, text) in enumerate(steps):
            on = local >= thr
            draw.ellipse([885, 230 + i * 48, 901, 246 + i * 48], fill=GREEN if on else (80, 100, 85))
            draw.text((915, 226 + i * 48), text, font=font(14, True if on else False), fill=CREAM if on else (110, 130, 115))
        draw_footer(draw, "04 / Cooling", progress)

    elif n < t5:
        local = (n - t4) / (t5 - t4)
        draw_header(draw, "ELECTRONICS & POWER", "Sensors, brain, and solar charge path")
        anchors = draw_cooler(
            draw, img,
            cx=340,
            cy=410,
            scale=0.78,
            wet=0.8,
            fan_angle=n * 0.3,
            cool_flow=0.85,
            alert=local > 0.75,
        )
        draw_arrow(draw, anchors["oled"], (40, 170), "OLED + button", GREEN, "Farmer local UI", min(1, local * 2))
        draw_arrow(draw, anchors["solar"], (40, 240), "Solar → TP4056", (120, 180, 255), "Charges 3.7V LiPo", ease(clamp((local - 0.2) / 0.3)))
        draw_arrow(draw, anchors["fan"], (40, 310), "5V fan output", ORANGE, "PWM / on-off control", ease(clamp((local - 0.35) / 0.3)))
        draw_esp_block(draw, 700, 160, active=local, alert=local > 0.75)
        draw.rounded_rectangle([700, 420, 1180, 545], radius=12, fill=PANEL)
        draw.text((720, 438), "Wire map (I²C shared bus)", font=font(14, True), fill=ORANGE)
        draw.text((720, 468), "SDA → GPIO21   ·   SCL → GPIO22   ·   OLED + SHT31", font=font(13), fill=CREAM)
        draw.text((720, 495), "Buzzer GPIO19  ·  Red LED GPIO17  ·  Fan / pump via driver", font=font(13), fill=CREAM)
        draw.text((720, 520), "Power: Solar → TP4056 → LiPo 3.7V → boost 5V → ESP32", font=font(12), fill=(160, 190, 165))
        draw_footer(draw, "05 / Electronics", progress)

    elif n < t6:
        local = (n - t5) / (t6 - t5)
        draw_header(draw, "DASHBOARD & MARKET VALUE", "Wi-Fi / MQTT → certification + fleet ops")
        draw_cooler(draw, img, cx=300, cy=410, scale=0.7, wet=0.85, fan_angle=n * 0.25, cool_flow=0.9)
        for i in range(5):
            a = ease(clamp(local * 1.5 - i * 0.12))
            x = 480 + i * 55
            y = 300 - abs(i - 2) * 8
            r = int(6 + a * 4)
            overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            ImageDraw.Draw(overlay).ellipse([x - r, y - r, x + r, y + r], fill=(*GREEN, int(220 * a)))
            img.alpha_composite(overlay)
        draw_dashboard(draw, 860, 180, local)
        bullets = [
            "Live T/H + ethylene ripeness index",
            "SMS / alert when storage is unsafe",
            "Downloadable quality certificates",
            "Multi-silo fleet view for cooperatives",
        ]
        draw.rounded_rectangle([80, 540, 820, 640], radius=12, fill=PANEL)
        for i, b in enumerate(bullets):
            draw.text((110 + (i % 2) * 360, 555 + (i // 2) * 40), "• " + b, font=font(14), fill=CREAM if local > i * 0.18 else (90, 110, 95))
        draw_footer(draw, "06 / Dashboard", progress)

    elif n < t7:
        p = scene_progress(n, t6, t7)
        draw_header(draw, "IMPACT FOR FARMERS", "Cool longer. Prove quality. Earn more.")
        cards = [
            ("3–7 days", "Extra shelf life without grid power"),
            ("10–15°C", "Cooler than ambient air"),
            ("100 FRW", "Per crate / day HaaS fee model"),
            ("Certified", "Logs for premium market access"),
        ]
        for i, (big, small) in enumerate(cards):
            appear = ease(clamp((p - i * 0.12) / 0.35))
            x = 70 + (i % 4) * 300
            y = int(lerp(450, 270, appear))
            draw.rounded_rectangle([x, y, x + 275, y + 200], radius=16, fill=PANEL)
            draw.rectangle([x, y, x + 8, y + 200], fill=ORANGE if i % 2 else GREEN)
            draw.text((x + 28, y + 40), big, font=font(28, True), fill=GREEN)
            draw.text((x + 28, y + 110), small[:18], font=font(15), fill=CREAM)
            draw.text((x + 28, y + 132), small[18:].strip(), font=font(15), fill=CREAM)
        draw_footer(draw, "07 / Impact", progress)

    else:
        p = scene_progress(n, t7, t8)
        draw_header(draw, "MATERIALS CHECKLIST", "Gather these before you start building")
        checklist = [
            ("Wood / timber boards", "Double-walled crate body"),
            ("Activated charcoal", "~10 cm fill between walls"),
            ("Wire mesh", "Contain charcoal · airflow"),
            ("Plastic water reservoir + tube", "Drip / wetting path"),
            ("5V DC fan + small solar panel", "Airflow + off-grid power"),
            ("ESP32 · SHT31 · OLED · TP4056 · LiPo", "Sensing, display, power mgmt"),
            ("Buzzer · LED · ethylene sensor", "Alerts + ripening detection"),
        ]
        draw.rounded_rectangle([80, 140, 1200, 580], radius=18, fill=PANEL)
        for i, (item, detail) in enumerate(checklist):
            on = p > i * 0.1
            yy = 165 + i * 55
            draw.rounded_rectangle([110, yy, 150, yy + 32], radius=6, outline=GREEN if on else (70, 90, 75), width=2)
            if on:
                draw.text((120, yy + 4), "✓", font=font(16, True), fill=GREEN)
            draw.text((170, yy + 2), item, font=font(17, True), fill=CREAM if on else (100, 120, 105))
            draw.text((170, yy + 24), detail, font=font(13), fill=(150, 175, 155) if on else (80, 100, 85))
        draw.text((W // 2 - 260, 610), "Securing Rwanda's harvest — one village at a time", font=font(15), fill=ORANGE)
        draw_footer(draw, "08 / Build list", progress)

    return img.convert("RGB")


def main() -> None:
    FRAMES.mkdir(parents=True, exist_ok=True)
    for old in FRAMES.glob("*.png"):
        old.unlink()

    duration_s = 62
    total = duration_s * FPS
    print(f"Rendering {total} frames at {W}x{H} @ {FPS}fps …")
    for n in range(total):
        frame = render_frame(n, total)
        frame.save(FRAMES / f"frame_{n:05d}.png")
        if n % 48 == 0:
            print(f"  {n}/{total} ({100 * n / total:.0f}%)")
    print("Done frames.")


if __name__ == "__main__":
    main()
