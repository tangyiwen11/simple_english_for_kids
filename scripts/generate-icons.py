from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"


def rounded_rectangle(draw, size, radius, fill):
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=fill)


def make_icon(size):
    image = Image.new("RGB", (size, size), "#FBF7EF")
    draw = ImageDraw.Draw(image)
    inset = int(size * 0.11)
    draw.rounded_rectangle(
        (inset, inset, size - inset, size - inset),
        radius=int(size * 0.2),
        fill="#E45D50",
    )

    font_candidates = [
        "/System/Library/Fonts/NewYork.ttf",
        "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/Times.ttc",
    ]
    font_path = next(path for path in font_candidates if Path(path).exists())
    font = ImageFont.truetype(font_path, int(size * 0.58))
    text = "a"
    bounds = draw.textbbox((0, 0), text, font=font)
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    draw.text(
        ((size - width) / 2, (size - height) / 2 - bounds[1] - size * 0.025),
        text,
        fill="#FFFDF8",
        font=font,
    )
    image.save(PUBLIC / f"icon-{size}.png", optimize=True)


for icon_size in (192, 512):
    make_icon(icon_size)
