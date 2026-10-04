# D'Cora Hogar — Sitio web corporativo

Sitio bilingüe (ES/EN) de D'Cora Hogar, fabricante e importador de cortinas roller a medida, orientado a la captación de distribuidores y decoradores.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 · Motion · Nodemailer · Zod · Playwright.

## Identidad de marca (Brandboard)

| Uso | Color | Token CSS |
| --- | --- | --- |
| Principal | `#144C42` | `teal` |
| Secundario | `#DAB36F` | `gold` |
| Fondo claro | `#FBF6E6` | `cream` |
| Fondo alternativo | `#121D2C` | `navy` |
| Apoyo / acento | `#1C3F26` | `forest` |

La paleta de Tailwind está restringida a estos 5 colores (`src/app/globals.css`), así que no se pueden usar otros colores por accidente.

**Tipografías:** Avenir (títulos) y Montserrat (textos). Montserrat se carga desde Google Fonts con `next/font`. Avenir es una fuente comercial: la web la usa si está instalada en el dispositivo (macOS e iOS la incluyen) y, si no, usa Montserrat. Si la empresa tiene la licencia web de Avenir LT Pro, se pueden agregar los `.woff2` en `public/fonts/` con un `@font-face` en `globals.css`.

**Logos:** los originales están en `/logos` y las versiones optimizadas en `public/brand/`:

- `logo-h-*`: horizontal (header), como el letrero de la tienda
- `logo-*`: apilado (footer)
- `isotipo-*`: solo el ícono (preloader, favicon, marcas de agua)
- `wordmark-*`: solo el texto

| Color | Dónde se usa |
| --- | --- |
| crema | sobre fondos oscuros y video |
| azul | sobre fondo claro |
| dorado | sobre verde o navy |

## Desarrollo

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

Sin SMTP configurado, en desarrollo los formularios **simulan** el envío y muestran el correo en la consola.

## Despliegue en Vercel

1. Importa el repositorio en Vercel. Detecta Next.js solo, así que no hace falta configurar nada más.
2. En **Settings → Environment Variables**, carga las variables de `.env.example` (ver la sección siguiente).
3. Conecta el dominio y define `NEXT_PUBLIC_SITE_URL` con la URL final. Se usa en el sitemap, en el SEO y en Open Graph.

## Formularios → correo corporativo (cPanel)

Los formularios **Contacto**, **Quiero ser distribuidor** y **Cotización** envían a `/api/contact`. Esa ruta valida los datos, aplica anti-spam (un campo trampa *honeypot* y un límite de envíos por IP) y envía un correo HTML con la marca usando el SMTP del correo corporativo.

En cPanel ve a **Cuentas de correo → Connect Devices** y copia los datos SMTP:

```
SMTP_HOST=mail.tudominio.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=ventas@tudominio.com
SMTP_PASS=********
MAIL_TO=ventas@tudominio.com           # opcional, se pueden poner varios separados por coma
NEXT_PUBLIC_CONTACT_EMAIL=ventas@tudominio.com   # opcional, se muestra en la web
MAIL_AUTOREPLY=true                    # opcional, envía una confirmación al cliente
```

En producción, si falta el SMTP, la API responde 503 y el formulario ofrece WhatsApp como alternativa.

## Contenido editable

| Qué | Dónde |
| --- | --- |
| Textos ES / EN | `src/i18n/dictionaries/es.ts` y `en.ts` |
| Catálogo de productos (del documento de la empresa) | `src/data/products.ts` |
| Teléfono, WhatsApp, dirección, horario, redes | `src/data/site.ts` |
| Rutas localizadas (`/es/nosotros` ↔ `/en/about`) | `src/i18n/config.ts` |

### Fotos de productos

Cada producto tiene una ilustración generada en los colores de marca. Las telas se muestran como un roller con su textura y color reales. Cuando lleguen las fotos:

1. Guárdalas en `public/images/productos/` (WebP o JPG, unos 1200 px).
2. Agrega `image: "/images/productos/archivo.webp"` al producto en `src/data/products.ts`.

El campo `ref` de cada producto guarda el número de imagen que indica el documento de la empresa, para facilitar esa correspondencia.

### Video del hero

Por ahora el hero usa un montaje provisional con tomas reales del taller (`public/videos/hero.mp4`, `hero.webm` y `hero-poster.webp`). Para usar el video definitivo, reemplaza esos archivos por versiones con el mismo nombre. Recomendado: 1920×1080, entre 10 y 20 s, sin audio, H.264, 6 MB como máximo.

```bash
ffmpeg -i video.mov -an -vf scale=1920:-2 -c:v libx264 -crf 26 -preset slow -movflags +faststart public/videos/hero.mp4
ffmpeg -i video.mov -an -vf scale=1920:-2 -c:v libvpx-vp9 -b:v 0 -crf 38 public/videos/hero.webm
```

### Regenerar assets

`scripts/optimize-assets.py` recrea los logos, el favicon, la imagen OG, las fotos y los videos optimizados a partir de los archivos fuente: `/logos`, `/videos` y el PDF del brandboard. Se ejecuta con `pip install pillow pymupdf imageio-ffmpeg` y luego `npm run assets`.

## Pruebas

```bash
npm run build
MAIL_DRY_RUN=true RATE_LIMIT_MAX=200 npx next start -p 3100
BASE_URL=http://localhost:3100 npm run test:e2e
```

La suite (`tests/site.spec.ts`) se ejecuta en escritorio y en móvil y cubre:

- redirección por idioma, slugs localizados y cambio de idioma
- 404, sitemap y robots
- megamenú, menú móvil y header al hacer scroll
- catálogo: filtros, búsqueda, colores, cotización persistente y envío
- formularios con validación, API y honeypot
- laboratorio de luz y reproducción de video
- desbordes horizontales en todas las páginas
