# Proyecto U1 – Visualización de Algoritmos de Búsqueda de Caminos

## Descripción general

Este programa es una aplicación interactiva que permite visualizar y comparar algoritmos de búsqueda de caminos sobre una cuadrícula.  
El usuario puede definir el punto de inicio, el punto final, obstáculos, tipos de terreno y ejecutar distintos métodos de búsqueda para observar su comportamiento.

Los algoritmos implementados son:
- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Algoritmo A*

## Cómo usar el programa

### 1. Selección de inicio y fin
- Da un primer click para selecionar el inicio(Cuadro azul fuerte).
- Posteriormente da un segundo click para seleccionar el destino(Cuadro morado).

### 2. Colocar terrenos u obstáculos
- Selecciona el tipo de terreno u obstáculo desde los botones(Normal/borrador, arena, agua, lava o muro).
- puedes mantener el click para poner mas de un cuadro a la vez.

### 3. Elegir algoritmo
- Selecciona el algoritmo:
  - BFS
  - DFS
  - A*
- Al cambiar de algoritmo, el estado anterior se limpia automáticamente.

### 4. Opciones adicionales
- Activar o desactivar búsqueda en diagonal.
- Mostrar u ocultar el costo de cada celda.
- Limpiar el tablero para empezar de nuevo.

---

## Significado de los colores

| Color     | Significado                   | 
|-----------|-------------                  |
| Gris      | Celda libre                   |
| Negro     | Obstáculo (no se puede pasar) |
| Azul      | Nodo inicial                  |
| Morado    | Nodo objetivo                 |
| Verde     | Nodos por visitar             |
| Rojo      | Nodos ya evaluado             |
| Amarillo  | Camino óptimo encontrado      |
| Arena     | Terreno dificil(Arena)        |
| Celeste   | Terreno dificil(Agua)         |
| Rojo claro| Terreno dificil(Lava)         |

---

## Costos y heurística

- El costo `g(n)` representa el costo acumulado desde el inicio.
- La heurística `h(n)` utilizada es **distancia Manhattan**:h = |x1 - x2| + |y1 - y2|

- El valor `f(n)` se calcula como:f(n) = g(n) + h(n)

Estos valores pueden mostrarse visualmente en cada celda si la opción está activada.

---

## Descripción de los algoritmos

### Breadth-First Search (BFS)
Explora el mapa por niveles, garantizando el camino más corto en número de pasos cuando todos los costos son iguales. Consume mucha memoria y no usa heurística.

### Depth-First Search (DFS)
Explora primero en profundidad. Usa poca memoria, pero **no garantiza el camino óptimo** y puede no llegar rápidamente a la solución.

### Algoritmo A*
Utiliza una heurística (distancia Manhattan) para guiar la búsqueda hacia el objetivo. Es más eficiente y garantiza el camino óptimo cuando la heurística es admisible.

---

## Análisis comparativo: A* vs BFS

| Característica          | BFS            | A*             |
|-------------------------|----------------|----------------|
| Tipo de búsqueda        | No informada   | Informada      |
| Uso de heurística       | No             | Sí             |
| Camino óptimo           | Sí (por pasos) | Sí (por costo) |
| Eficiencia              | Baja           | Alta           |
| Exploración innecesaria | Alta           | Baja           |

---

## Justificación del uso de DFS

DFS se incluye con fines académicos para mostrar un enfoque diferente de búsqueda. Permite observar claramente las desventajas de no usar heurísticas ni control de costos, reforzando la importancia de algoritmos informados como A*.

---

## Conclusión

Este proyecto permite comprender de forma visual y práctica las diferencias entre algoritmos de búsqueda, destacando a **A\*** como la mejor opción para la planeación de rutas eficientes, mientras que BFS y DFS sirven como referencia teórica y comparativa.