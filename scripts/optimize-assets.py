"""
Pipeline de assets para la web de D'Cora Hogar.

Genera, a partir de los archivos fuente (logos/, videos/, Brandboard PDF):
  - public/brand/     logos recortados (apilado, horizontal, isotipo) en WebP
  - src/app/          favicon (icon.png / apple-icon.png)
  - public/images/    fotos reales de la empresa (brandboard + fotogramas de video)
  - public/videos/    videos H.264 compatibles con todos los navegadores + posters

Requisitos: pip install pillow pymupdf imageio-ffmpeg
Uso:        python scripts/optimize-assets.py
"""
import os
import subprocess
from pathlib import Path

import fitz  # PyMuPDF
import imageio_ffmpeg
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LOGOS = ROOT / "logos"
VIDEOS = ROOT / "videos"
PUBLIC = ROOT / "public"
BRAND = PUBLIC / "brand"
IMAGES = PUBLIC / "images"
VOUT = PUBLIC / "videos"
APP = ROOT / "src" / "app"
FF = imageio_ffmpeg.get_ffmpeg_exe()

VIDEO_JOEL = VIDEOS / "Video Joel - Dcora(1).mp4"
VIDEO_COMERCIAL = VIDEOS / "01_VIDEO COMERCIAL.mp4"

TEAL = (20, 76, 66)  # #144C42 Principal

for d in (BRAND, IMAGES, VOUT):
    d.mkdir(parents=True, exist_ok=True)


def save_webp(im: Image.Image, path: Path, quality=82, lossless=False):
    im.save(path, "WEBP", quality=quality, method=6, lossless=lossless)
    print(f"  {path.relative_to(ROOT)}  {im.size}  {path.stat().st_size // 1024} KB")


def run(args):
    subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


# ---------------------------------------------------------------- LOGOS
def split_logo(im: Image.Image):
    """Devuelve (isotipo, wordmark D'CORA, HOGAR, bbox total) del logo apilado."""
    a = np.array(im)[:, :, 3] > 20
    rows = a.any(1)
    segs, start = [], None
    for y, v in enumerate(rows):
        if v and start is None:
            start = y
        if not v and start is not None:
            segs.append((start, y - 1))
            start = None
    if start is not None:
        segs.append((start, len(rows) - 1))
    parts = []
    for s, e in segs:
        cols = np.where(a[s : e + 1].any(0))[0]
        parts.append(im.crop((cols.min(), s, cols.max() + 1, e + 1)))
    return parts


def build_logos():
    print("Logos")
    variants = {
        "dorado": "LOGOTIPO DORADO.png",
        "crema": "LOGOTIPO CREMA.png",
        "azul": "LOGOTIPO AZUL.png",
        "blanco": "LOGOTIPO BANCO.png",
        "negro": "LOGOTIPO NEGRO.png",
    }
    for name, fn in variants.items():
        im = Image.open(LOGOS / fn).convert("RGBA")
        full = im.crop(im.getbbox())
        full.thumbnail((720, 720), Image.LANCZOS)
        save_webp(full, BRAND / f"logo-{name}.webp", quality=90)

        icon, word, hogar = split_logo(im)
        ic = icon.copy()
        ic.thumbnail((360, 360), Image.LANCZOS)
        save_webp(ic, BRAND / f"isotipo-{name}.webp", quality=92)

        # Wordmark solo (D'CORA + HOGAR), usado en el preloader
        gap_w = int(word.height * 0.28)
        wm = Image.new("RGBA", (word.width, word.height + gap_w + hogar.height), (0, 0, 0, 0))
        wm.alpha_composite(word, (0, 0))
        wm.alpha_composite(hogar, ((word.width - hogar.width) // 2, word.height + gap_w))
        wm.thumbnail((640, 640), Image.LANCZOS)
        save_webp(wm, BRAND / f"wordmark-{name}.webp", quality=90)

        # Lockup horizontal (como el letrero de la tienda del brandboard):
        # isotipo a la izquierda, D'CORA + HOGAR apilados a la derecha.
        gap_text = int(word.height * 0.28)
        text_h = word.height + gap_text + hogar.height
        text_w = word.width
        icon_h = int(text_h * 1.08)
        icon_r = icon.resize((int(icon.width * icon_h / icon.height), icon_h), Image.LANCZOS)
        gap = int(icon_r.width * 0.32)
        W = icon_r.width + gap + text_w
        H = max(icon_h, text_h)
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        canvas.alpha_composite(icon_r, (0, (H - icon_h) // 2))
        tx = icon_r.width + gap
        ty = (H - text_h) // 2
        canvas.alpha_composite(word, (tx, ty))
        canvas.alpha_composite(hogar, (tx + (text_w - hogar.width) // 2, ty + word.height + gap_text))
        canvas.thumbnail((900, 900), Image.LANCZOS)
        save_webp(canvas, BRAND / f"logo-h-{name}.webp", quality=90)


def build_icons():
    print("Favicons / OG")
    gold = Image.open(LOGOS / "LOGOTIPO DORADO.png").convert("RGBA")
    icon = split_logo(gold)[0]
    for size, name in ((512, "icon.png"), (180, "apple-icon.png")):
        bg = Image.new("RGBA", (size, size), TEAL + (255,))
        ic = icon.copy()
        ic.thumbnail((int(size * 0.62), int(size * 0.62)), Image.LANCZOS)
        bg.alpha_composite(ic, ((size - ic.width) // 2, (size - ic.height) // 2))
        bg.convert("RGB").save(APP / name, optimize=True)
        print(f"  src/app/{name}")
    ico = Image.new("RGBA", (64, 64), TEAL + (255,))
    ic = icon.copy()
    ic.thumbnail((42, 42), Image.LANCZOS)
    ico.alpha_composite(ic, ((64 - ic.width) // 2, (64 - ic.height) // 2))
    ico.save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print("  src/app/favicon.ico")

    # Imagen Open Graph: composición del brandboard (foto roller + bloque principal con logo)
    pdf = fitz.open(ROOT / "Brandboard_Dcora Hogar.pdf")
    page = pdf[0]
    pix = page.get_pixmap(dpi=144, clip=fitz.Rect(0, 0, 1440, 541))
    banner = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    banner = banner.resize((1200, int(banner.height * 1200 / banner.width)), Image.LANCZOS)
    og = Image.new("RGB", (1200, 630), TEAL)
    og.paste(banner, (0, (630 - banner.height) // 2))
    og.save(APP / "opengraph-image.jpg", quality=86, optimize=True, progressive=True)
    print("  src/app/opengraph-image.jpg", og.size)


# ---------------------------------------------------------------- FOTOS
def build_brandboard_photos():
    print("Fotos del brandboard")
    pdf = fitz.open(ROOT / "Brandboard_Dcora Hogar.pdf")
    page = pdf[0]
    imgs = page.get_images(full=True)
    # Banner superior: rollers sobre ventanas verdes (se renderiza la zona del PDF en alta)
    pix = page.get_pixmap(dpi=216, clip=fitz.Rect(0, 0, 800, 541))
    im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    im.thumbnail((1600, 1600), Image.LANCZOS)
    save_webp(im, IMAGES / "rollers-ventanas.webp", quality=84)
    tmp = IMAGES / "_tmp.png"
    # img4: tira con 3 fotos (oficina, fachada, almacén)
    raw = pdf.extract_image(imgs[4][0])
    tmp.write_bytes(raw["image"])
    strip = Image.open(tmp).convert("RGB")
    w, h = strip.size
    # cortes medidos sobre la composición del PDF (proporciones de 1440 px)
    cuts = [(0, 505), (509, 1089), (1091, 1600)]
    names = ["showroom", "fachada", "almacen-rollos"]
    for (x0, x1), n in zip(cuts, names):
        X0, X1 = int(x0 / 1600 * w), int(x1 / 1600 * w)
        crop = strip.crop((X0 + 2, 6, X1 - 2, int(h * 0.894)))
        save_webp(crop, IMAGES / f"{n}.webp", quality=84)
    tmp.unlink()


def frame(src: Path, t: float) -> Image.Image:
    tmp = IMAGES / "_frame.png"
    run(["-ss", str(t), "-i", str(src), "-frames:v", "1", str(tmp)])
    im = Image.open(tmp).convert("RGB")
    im.load()
    tmp.unlink()
    return im


def build_video_photos():
    print("Fotos desde video (recortes sin subtítulos ni marca de agua)")
    J, M = VIDEO_JOEL, VIDEO_COMERCIAL
    # (fuente, segundo, caja de recorte en 1080x1920, nombre)
    shots = [
        (M, 21.5, (0, 452, 1080, 1430), "taller-corte"),
        (M, 27.5, (0, 452, 1080, 1430), "capacitacion"),
        (M, 14.3, (0, 452, 1080, 1430), "cotizacion"),
        (M, 24.5, (0, 452, 1080, 1430), "equipo-dcora"),
        (M, 11.4, (0, 452, 1080, 1430), "medidas"),
        (M, 12.6, (0, 452, 1080, 1430), "muestrario"),
        (M, 38.6, (0, 452, 1080, 1430), "oficina"),
        (M, 19.5, (0, 600, 1080, 1920), "mariela"),
        (J, 25.3, (0, 0, 1080, 1130), "almacen"),
        (J, 13.5, (0, 340, 1080, 1150), "mostrador"),
        (J, 16.3, (0, 340, 1080, 1150), "seleccion-rollos"),
        (J, 30.4, (0, 300, 1080, 1650), "fabricacion"),
        (J, 33.5, (0, 340, 1080, 1150), "joel"),
        (J, 28.5, (0, 1250, 1080, 1920), "taller-fabricacion"),
    ]
    for src, t, box, name in shots:
        im = frame(src, t).crop(box)
        save_webp(im, IMAGES / f"{name}.webp", quality=80)


# ---------------------------------------------------------------- VIDEOS
def build_videos():
    print("Videos")
    common = ["-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-preset", "slow",
              "-movflags", "+faststart"]
    for src, name, poster_t in ((VIDEO_COMERCIAL, "mariela", 19.5), (VIDEO_JOEL, "joel", 37.8)):
        out = VOUT / f"{name}.mp4"
        run(["-i", str(src), "-vf", "scale=720:-2", *common, "-crf", "25",
             "-c:a", "aac", "-b:a", "112k", "-ac", "2", str(out)])
        print(f"  {out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB")
        im = frame(src, poster_t).resize((720, 1280), Image.LANCZOS)
        save_webp(im, VOUT / f"{name}-poster.webp", quality=78)

    # Hero provisional: b-roll real del taller/almacén en 16:9, sin audio, en bucle.
    # Se reemplazará por el video definitivo del cliente (ver README).
    segments = [
        (VIDEO_COMERCIAL, 21.0, 2.0, 560),   # corte de perfiles
        (VIDEO_COMERCIAL, 12.0, 2.0, 820),   # muestrario de telas
        (VIDEO_JOEL, 26.4, 3.4, 1290),       # taller fabricando rollers
        (VIDEO_COMERCIAL, 11.0, 1.0, 420),   # toma de medidas
        (VIDEO_JOEL, 16.0, 1.6, 400),        # selección de rollos
    ]
    parts = []
    for i, (src, ss, dur, y) in enumerate(segments):
        p = VOUT / f"_seg{i}.mp4"
        run(["-ss", str(ss), "-t", str(dur), "-i", str(src), "-an",
             "-vf", f"crop=1080:608:0:{y},scale=1280:720,fps=30,setsar=1",
             *common, "-crf", "20", str(p)])
        parts.append(p)
    lst = VOUT / "_list.txt"
    lst.write_text("".join(f"file '{p.name}'\n" for p in parts))
    hero = VOUT / "hero.mp4"
    run(["-f", "concat", "-safe", "0", "-i", str(lst), "-an", *common, "-crf", "27",
         "-vf", "eq=saturation=0.85", str(hero)])
    print(f"  {hero.relative_to(ROOT)}  {hero.stat().st_size // 1024} KB")
    run(["-f", "concat", "-safe", "0", "-i", str(lst), "-an", "-c:v", "libvpx-vp9", "-b:v", "0",
         "-crf", "40", "-row-mt", "1", "-vf", "eq=saturation=0.85", str(VOUT / "hero.webm")])
    print(f"  public/videos/hero.webm  {(VOUT / 'hero.webm').stat().st_size // 1024} KB")
    im = frame(VIDEO_JOEL, 27.5).crop((0, 1290, 1080, 1898)).resize((1280, 720), Image.LANCZOS)
    save_webp(im, VOUT / "hero-poster.webp", quality=72)
    for p in parts:
        p.unlink()
    lst.unlink()


if __name__ == "__main__":
    os.chdir(ROOT)
    build_logos()
    build_icons()
    build_brandboard_photos()
    build_video_photos()
    build_videos()
    print("Listo.")
