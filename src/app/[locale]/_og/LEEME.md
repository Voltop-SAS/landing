# Assets de la imagen Open Graph

Estos ficheros existen **solo para construir `opengraph-image.tsx`**. No se
sirven al navegador: se leen del disco en tiempo de build y se incrustan en el
PNG que se genera.

| Fichero                | Qué es                                                                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero-og.jpg`          | La fotografía del hero recortada a 1200×630 con el MISMO encuadre que usa la Home en escritorio: `object-cover` con foco al 62% horizontal y 50% vertical. Derivada de `public/hero-vehiculo-cargando.jpg`; si esa cambia, hay que regenerar esta |
| `poppins-semibold.ttf` | Poppins SemiBold, la tipografía de titular del sistema                                                                                                                                                                                            |
| `manrope.ttf`          | Manrope en peso 400, la de cuerpo                                                                                                                                                                                                                 |

## Por qué las tipografías viven aquí y no se cargan como en el resto del sitio

El sitio las sirve por `next/font` en **woff2**, y **Satori —el motor que dibuja
esta imagen— no lee woff2**. Necesita TTF u OTF.

Están **reducidas a los 57 glifos** que aparecen en la tarjeta en los tres
idiomas, con `fontTools`: de 139 KB y 163 KB a 5 KB y 12 KB. Manrope es una
fuente variable y se instanció al peso 400 antes de reducirla, porque Satori no
interpola ejes.

**Si cambia el copy de la tarjeta hay que regenerar el subconjunto**, o los
caracteres nuevos saldrán en blanco.

## Licencias

Poppins y Manrope son **SIL Open Font License 1.1**, que permite redistribuir
—incluidos subconjuntos— manteniendo la licencia junto al fichero. Ver `OFL.txt`.
