# Mapa de calles descargado

El APK incluye un extracto vectorial hasta zoom 14 alrededor de los destinos,
estaciones y aeropuertos del viaje. Natural Earth da contexto fuera de esas áreas.

- Extracto de [Protomaps del 16 de noviembre de 2026](https://build.protomaps.com/20261116.pmtiles).
- Datos © colaboradores de [OpenStreetMap](https://www.openstreetmap.org/copyright), ODbL.
- Cobertura definida en `region.json`. Se puede reproducir con
  `pmtiles extract https://build.protomaps.com/20261116.pmtiles trip-streets.pmtiles --region android/maps/region.json --maxzoom 14`.
- `npm run android:sync` verifica el SHA-256 y copia el mapa al APK. Se puede
  reutilizar una copia local con la variable `TRIP_MAP_SOURCE`.
