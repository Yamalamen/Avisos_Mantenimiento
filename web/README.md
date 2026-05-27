# pinwyno — sitio web

Landing inspirada en el template **Compass de Pixpa** y adaptada a la marca pinwyno (Digital Developers).

## Estructura

```
web/
├── index.html
├── styles.css
├── script.js
└── assets/
    ├── logo.svg          # logo wordmark (negro + naranja)
    ├── logo-mark.svg     # solo el pin/pingüino, para favicon
    ├── hero.svg          # placeholder hero
    ├── work-1..4.svg     # placeholders portfolio
    └── process.svg       # placeholder proceso
```

## Ver en local

Cualquier servidor estático sirve. Por ejemplo:

```bash
cd web && python3 -m http.server 8000
# abrir http://localhost:8000
```

## Sustituir las imágenes reales

Los `.svg` en `assets/` son placeholders neutros para que la web se vea correcta de salida. Cuando pongas las imágenes finales:

1. Guarda los archivos en `assets/` con estos nombres (mismos que ya están referenciados):
   - `hero.jpg` → la foto que envíes para portada (la del fondo crema, o la del equipo trabajando)
   - `work-1.jpg` ... `work-4.jpg` → casos de portfolio
   - `process.jpg` → foto del estudio / pantallas con código
   - `logo.png` → logo principal (si prefieres PNG en vez del SVG)

2. Cambia las extensiones en `index.html`: busca y reemplaza `.svg` por `.jpg` en las líneas de imágenes (no toques `logo-mark.svg`).

## Branding

- **Cream** `#F8F4EE` · **Ink** `#0E0E0E` · **Orange** `#E97A2D`
- Tipografía: **DM Serif Display** (titulares) + **Inter** (texto)
- Tono: fresco, directo, con personalidad — sin humo de agencia.

## Secciones

1. **Hero** — Titular editorial enorme con cursiva en naranja
2. **Marquee** — Banda infinita de servicios
3. **Intro / Studio** — Manifiesto corto
4. **Work** — Grid asimétrico de proyectos
5. **Services** — Lista con hover acento
6. **Process** — Pasos numerados + imagen sticky
7. **Testimonial** — Cita central tipográfica
8. **CTA** — Banner oscuro con halo naranja
9. **Footer** — Links y créditos
