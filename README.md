# AURA — App Urbana de Reciclaje Ambiental

Aplicación Flask para acercar la guía de separación de residuos y, cuando se
verifiquen fuentes oficiales, los puntos de reciclaje de Las Heras, Mendoza.

## Ejecutar localmente

Requiere Python 3.9 o posterior.

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Abrí <http://127.0.0.1:5000> en el navegador. El mapa base utiliza Leaflet y
teselas de OpenStreetMap; el frontend carga Tailwind CSS, Lucide y las fuentes
desde CDN, por lo que esas funciones visuales requieren conexión a Internet.

## Puntos de reciclaje

El endpoint `/api/puntos-reciclaje` lee `data/puntos_reciclaje.json`. El archivo
se entrega sin ubicaciones de ejemplo porque no hay datos oficiales verificados
cargados. Para agregar un punto, incorporá un objeto a `points` con esta forma:

```json
{
  "verified": true,
  "name": "Nombre oficial",
  "address": "Dirección verificada",
  "lat": -32.85,
  "lng": -68.83,
  "materials": ["Plástico", "Papel y cartón"],
  "hours": "Horarios confirmados",
  "info": "Información adicional con fuente verificable"
}
```

Usá coordenadas, dirección, materiales y horarios verificados antes de marcar
un punto como `verified`. El mapa ignora ubicaciones sin verificación explícita.

## Tailwind CSS

El proyecto utiliza Tailwind mediante CDN para facilitar la ejecución local,
además de CSS propio para la identidad visual de AURA. El CDN está pensado para
desarrollo, no para una publicación optimizada. Para producción, desde la raíz:

```bash
npm install --save-dev tailwindcss@3
npx tailwindcss -i ./static/css/tailwind.input.css \
  -o ./static/css/tailwind.min.css \
  --content "./templates/**/*.html" "./static/js/**/*.js" --minify
```

En `templates/base.html`, quitá el `<script>` de Tailwind CDN (y su bloque
`tailwind.config`) e incluí `<link rel="stylesheet"
href="{{ url_for('static', filename='css/tailwind.min.css') }}">` antes de
`styles.css`. El archivo de entrada queda en `static/css/tailwind.input.css`.