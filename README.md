# Landing de la marca

Página principal de la marca (nombre provisorio: **Turnia**), con sus tres productos: Hay Cancha, Peluquerías y Restaurantes.

Hecha con React 19, Vite y TypeScript. Los estilos son CSS por componente, con todos los colores como variables en `src/styles/tokens.css` (modo claro y oscuro automáticos).

## Cómo correrla

Necesitás Node 20 o más nuevo.

```bash
npm install
npm run dev        # abre la página en http://localhost:5173
npm run build      # chequea tipos y deja la versión final en dist/
npm run preview    # sirve dist/ para revisarla antes de publicar
```

## Lo que vas a querer cambiar

| Qué | Dónde |
| --- | --- |
| Nombre de la marca, bajada, email, Instagram y WhatsApp | `src/config.ts` (objeto `MARCA`) |
| Título de la pestaña, descripción para Google y vista previa al compartir | `index.html` y `public/og.png` |
| Estado de cada producto ("En lanzamiento", "Próximamente") | `src/config.ts` (lista `PRODUCTOS`) |
| Dirección de la web de Hay Cancha | `src/config.ts` (`HAY_CANCHA.url`) |
| Oferta del primer mes gratis | `src/config.ts` (`OFERTA`) |
| Colores | `src/styles/tokens.css` |
| Textos de cada producto | `src/components/Products.tsx` |
| Notas del cuaderno de la portada y su agenda (una por rubro) | `src/components/Cuaderno.tsx` |
| Preguntas frecuentes | `src/components/Faq.tsx` |
| Respuestas del chat de ejemplo | `src/components/AssistantDemo.tsx` |

## Hay Cancha: web real y demo

Hay dos tipos de botón:

- **"Ver Hay Cancha"** (arriba en el menú, en Productos y en el pie) lleva a la web real, que se carga en `HAY_CANCHA.url` dentro de `src/config.ts`. Si esa dirección queda vacía, estos botones abren la demo.
- **"Probá cómo se reserva"** (en la portada y en Productos) abre una demo de la página de un complejo inventado: elegís deporte, día, horario y cancha, cargás tus datos, simulás el pago y ves la reserva confirmada. No se reserva ni se cobra nada. Sirve para mostrar la experiencia mientras la web real no tenga complejos cargados.

La demo está en `src/components/hay-cancha/`. Los deportes, canchas, horarios, precios y señas de ejemplo están en `datos.ts`. También se abre directo con un link que termine en `#probar-hay-cancha`.

## Formulario de contacto

Las consultas llegan a tu email a través de [Web3Forms](https://web3forms.com), que es gratis y no necesita base de datos ni servidor. Mientras no esté conectado, el formulario muestra un aviso de "vista previa" y no envía nada.

Para conectarlo:

1. Entrá a https://web3forms.com, poné el email donde querés recibir las consultas y confirmá el correo que te mandan.
2. Copiá la clave (*access key*) y pegala en `WEB3FORMS_CLAVE`, dentro de `src/lib/contacto.ts`.
3. Subí el cambio. El aviso de vista previa desaparece solo.

La clave es pública (está pensada para ir en la página), así que puede quedar en el código.

## Estructura

```
src/
├── config.ts               # marca y productos
├── App.tsx                 # orden de las secciones
├── components/
│   ├── Header, Hero, Marquee, Products, HowItWorks,
│   │   AssistantDemo, Calculator, WhyUs, Faq, Contact, Footer
│   ├── HeroShowcase.tsx    # notebook con la pantalla partida (cliente y dueño), una escena por rubro
│   ├── Cuaderno.tsx        # cuaderno con tachones de la portada, uno por rubro
│   ├── hay-cancha/         # demo navegable de la página de un complejo
│   └── visuals/            # agenda de canchas, agenda de peluquería, comanda
├── hooks/                  # animaciones: timeline, en pantalla, scroll, números
├── lib/                    # formato de pesos y formulario
└── styles/                 # tokens de color y estilos base
```

## Publicar en Render

Crear un **Static Site** con:

- Build command: `npm install && npm run build`
- Publish directory: `dist`

## Notas

- Los negocios de las demos (Complejo El Potrero, Barbería Norte, La Esquina), los nombres y los precios son inventados.
- Las animaciones se apagan solas si el visitante tiene activado "reducir movimiento" en su sistema.
- Las tipografías (Bricolage Grotesque, Instrument Sans y JetBrains Mono) se cargan desde Google Fonts.
