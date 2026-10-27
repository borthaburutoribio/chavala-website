"""Prepara las fotos de assets/raw (bajadas del IG de Chavala) para el sitio.
Uso: python _build/img.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'assets' / 'raw'
OUT = ROOT / 'assets' / 'img'
OUT.mkdir(parents=True, exist_ok=True)

# Pantalón blanco: mismo pantalón, diez partes de arriba (posteo Dc3lb0AltJz)
BLANCO = ['camisa-rayada-celeste', 'blusa-floreada-azul', 'polo-fucsia', 'camisa-azul-marino',
          'remera-rayada-beige', 'remera-rayada-marron', 'remera-marinera', 'remera-rayada-gris',
          'campera-de-jean', 'saco-largo-negro']
# Jean claro (posteo Dc3lTMgFmMY, fotos 3 a 9)
JEAN = ['chaleco-de-jean', 'remera-animal-print', 'musculosa-verde-oliva', 'remera-cebra',
        'remera-negra-estampada', 'remera-metalizada', 'camisa-blanca']

JOBS = []
for i, n in enumerate(BLANCO):
    JOBS.append((f'Dc3lb0AltJz_{i}.jpg', f'look-pantalon-blanco-{n}', (960, 1200)))
for i, n in enumerate(JEAN, start=3):
    JOBS.append((f'Dc3lTMgFmMY_{i}.jpg', f'look-jean-claro-{n}', (960, 1200)))

JOBS += [
    ('Dc10O7TR2GY_0.jpg', 'chavala-local-rivadavia-1047-perchero', (1215, 2160)),
    ('DeisfCuFgd4_4.jpg', 'carteras-negras-chavala', (1200, 1600)),
    ('DeisfCuFgd4_0.jpg', 'cartera-media-luna-negra', (960, 1200)),
    ('DeisfCuFgd4_1.jpg', 'cartera-bandolera-negra', (960, 1200)),
    ('calzado_DeislzuRF1j.jpg', 'suecos-y-sandalias-chavala', (1200, 1600)),
    ('DcdwjCAFmaB_1.jpg', 'prendedores-artesanales-ceramica', (1200, 1600)),
    ('DcdwjCAFmaB_2.jpg', 'prendedores-artesanales-flores', (1200, 1600)),
    ('DdmHcdvFrHo_0.jpg', 'etiqueta-lo-nuevo-de-yagmour', (1088, 1344)),
    ('DdmHcdvFrHo_1.jpg', 'yagmour-pantalon-blanco-remera-negra', (960, 1200)),
    ('DdmHcdvFrHo_5.jpg', 'yagmour-jean-musculosa-blanca', (960, 1200)),
    ('DeisWpTFqJ0_8.jpg', 'yagmour-2027-camisa-blanca-jean', (960, 1200)),
    ('DeisWpTFqJ0_3.jpg', 'yagmour-2027-chomba-rayada', (960, 1200)),
    ('DfAJ3nsFq3m_1.jpg', 'kimuan-sweater-azul', (960, 1200)),
    ('DfAJ3nsFq3m_4.jpg', 'kimuan-cardigan-gris', (960, 1200)),
    ('DfAJoCIlhJz_6.jpg', 'sweater-rayado-blanco-negro', (960, 1200)),
    ('DfAJoCIlhJz_5.jpg', 'sweater-cuello-v-camel', (960, 1200)),
    ('DfAJoCIlhJz_4.jpg', 'sweater-verde-agua', (960, 1200)),
    ('DdmHcdvFrHo_2.jpg', 'yagmour-pantalon-ladrillo-musculosa', (960, 1200)),
]

for src, name, size in JOBS:
    p = RAW / src
    if not p.exists():
        print('FALTA', src)
        continue
    im = ImageOps.exif_transpose(Image.open(p)).convert('RGB')
    im = ImageOps.fit(im, size, method=Image.LANCZOS, centering=(0.5, 0.45))
    im.save(OUT / f'{name}.jpg', quality=78, optimize=True, progressive=True)
    # miniatura cuadrada para las viñetas de la lista
    th = ImageOps.fit(im, (160, 160), method=Image.LANCZOS, centering=(0.5, 0.55))
    th.save(OUT / f'{name}-mini.jpg', quality=78, optimize=True)
print('ok', len(JOBS))
