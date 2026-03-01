// CONFIGURACIÓN GENERAL
let filas = 25;
let columnas = 25;
let tamañoCelda = 25;

let grid = [];
let inicio = null;
let fin = null;

let algoritmoActual = null;
let ejecutando = false;
let diagonal = true;

let terrenoSeleccionado = "normal";
let caminoOptimo = [];

// DEFINICIÓN DE TERRENOS
const terrenos = {
  normal: { color: [220, 220, 220], costo: 1 },
  arena: { color: [240, 220, 130], costo: 3 },
  agua: { color: [120, 160, 255], costo: 5 },
  lava: { color: [255, 120, 120], costo: 10 },
  muro: { color: [0, 0, 0], costo: Infinity }
};

// CLASE CELDA
class Celda {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.tipo = "normal";
    this.costo = 1;

    this.g = Infinity;
    this.h = 0;
    this.f = 0;

    this.vecinos = [];
    this.padre = null;

    this.abierto = false;
    this.cerrado = false;
  }

  mostrar() {
    let t = terrenos[this.tipo];
    fill(...t.color);
    stroke(80);
    rect(this.i * tamañoCelda, this.j * tamañoCelda, tamañoCelda, tamañoCelda);

    if (this.abierto) {
      fill(0, 200, 0);
      rect(this.i * tamañoCelda, this.j * tamañoCelda, tamañoCelda, tamañoCelda);
    }

    if (this.cerrado) {
      fill(200, 0, 0);
      rect(this.i * tamañoCelda, this.j * tamañoCelda, tamañoCelda, tamañoCelda);
    }

    if (this === inicio) {
      fill(0, 0, 255);
      rect(this.i * tamañoCelda, this.j * tamañoCelda, tamañoCelda, tamañoCelda);
    }

    if (this === fin) {
      fill(160, 0, 160);
      rect(this.i * tamañoCelda, this.j * tamañoCelda, tamañoCelda, tamañoCelda);
    }
  }

  agregarVecinos() {
    this.vecinos = [];
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

    if (diagonal) dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);

    for (let [dx,dy] of dirs) {
      let x = this.i + dx;
      let y = this.j + dy;

      if (x >= 0 && x < columnas && y >= 0 && y < filas) {
        if (dx !== 0 && dy !== 0) {
          if (
            grid[this.i + dx][this.j].tipo === "muro" ||
            grid[this.i][this.j + dy].tipo === "muro"
          ) continue;
        }

        let v = grid[x][y];
        if (v.tipo !== "muro") this.vecinos.push(v);
      }
    }
  }
}

// SETUP & DRAW
function setup() {
  createCanvas(columnas * tamañoCelda, filas * tamañoCelda);

  for (let i = 0; i < columnas; i++) {
    grid[i] = [];
    for (let j = 0; j < filas; j++) {
      grid[i][j] = new Celda(i, j);
    }
  }
}

function draw() {
  background(60);

  for (let col of grid) {
    for (let c of col) c.mostrar();
  }

  dibujarCamino();

  if (ejecutando && algoritmoActual) algoritmoActual();
}

// DIBUJO DEL CAMINO ÓPTIMO
function dibujarCamino() {
  if (caminoOptimo.length < 2) return;

  stroke(255, 255, 0);
  strokeWeight(3);
  noFill();

  for (let i = 0; i < caminoOptimo.length - 1; i++) {
    let a = caminoOptimo[i];
    let b = caminoOptimo[i + 1];

    let x1 = a.i * tamañoCelda + tamañoCelda / 2;
    let y1 = a.j * tamañoCelda + tamañoCelda / 2;
    let x2 = b.i * tamañoCelda + tamañoCelda / 2;
    let y2 = b.j * tamañoCelda + tamañoCelda / 2;

    line(x1, y1, x2, y2);

    let ang = atan2(y2 - y1, x2 - x1);
    let len = 8;

    push();
    translate(x2, y2);
    rotate(ang);
    line(0, 0, -len, -len / 2);
    line(0, 0, -len, len / 2);
    pop();
  }

  strokeWeight(1);
}

// INTERACCIÓN
function mousePressed() { pintar(); }
function mouseDragged() { pintar(); }

function pintar() {
  let i = floor(mouseX / tamañoCelda);
  let j = floor(mouseY / tamañoCelda);
  if (i < 0 || j < 0 || i >= columnas || j >= filas) return;

  let c = grid[i][j];

  if (!inicio) inicio = c;
  else if (!fin && c !== inicio) fin = c;
  else {
    c.tipo = terrenoSeleccionado;
    c.costo = terrenos[terrenoSeleccionado].costo;
  }
}

// HEURÍSTICA
function heuristica(a, b) {
  return abs(a.i - b.i) + abs(a.j - b.j);
}

// RECONSTRUIR CAMINO
function reconstruirCamino(actual) {
  caminoOptimo = [];
  while (actual) {
    caminoOptimo.push(actual);
    actual = actual.padre;
  }
  caminoOptimo.reverse(); // ← CLAVE: inicio → fin
  ejecutando = false;
}

// PREPARAR BÚSQUEDA
let abiertos = [];

function prepararBusqueda() {
  abiertos = [];
  caminoOptimo = [];

  for (let col of grid) {
    for (let c of col) {
      c.g = Infinity;
      c.h = 0;
      c.f = 0;
      c.padre = null;
      c.abierto = false;
      c.cerrado = false;
      c.agregarVecinos();
    }
  }

  inicio.g = 0;
  inicio.abierto = true;
  abiertos.push(inicio);
  ejecutando = true;
}

// A*
function iniciarAStar() {
  prepararBusqueda();
  inicio.h = heuristica(inicio, fin);
  inicio.f = inicio.h;
  algoritmoActual = pasoAStar;
}

function pasoAStar() {
  if (abiertos.length === 0) return ejecutando = false;

  let actual = abiertos.reduce((a,b)=>a.f<b.f?a:b);
  if (actual === fin) return reconstruirCamino(actual);

  abiertos = abiertos.filter(n=>n!==actual);
  actual.cerrado = true;

  for (let v of actual.vecinos) {
    let temp = actual.g + v.costo;
    if (temp < v.g) {
      v.padre = actual;
      v.g = temp;
      v.h = heuristica(v, fin);
      v.f = v.g + v.h;
      if (!v.abierto) {
        v.abierto = true;
        abiertos.push(v);
      }
    }
  }
}

// DIJKSTRA
function iniciarDijkstra() {
  prepararBusqueda();
  algoritmoActual = pasoDijkstra;
}

function pasoDijkstra() {
  if (abiertos.length === 0) return ejecutando = false;

  let actual = abiertos.reduce((a,b)=>a.g<b.g?a:b);
  if (actual === fin) return reconstruirCamino(actual);

  abiertos = abiertos.filter(n=>n!==actual);
  actual.cerrado = true;

  for (let v of actual.vecinos) {
    let temp = actual.g + v.costo;
    if (temp < v.g) {
      v.g = temp;
      v.padre = actual;
      if (!v.abierto) {
        v.abierto = true;
        abiertos.push(v);
      }
    }
  }
}

// BFS
function iniciarBFS() {
  prepararBusqueda();
  algoritmoActual = pasoBFS;
}

function pasoBFS() {
  if (abiertos.length === 0) return ejecutando = false;

  let actual = abiertos.shift();
  if (actual === fin) return reconstruirCamino(actual);

  for (let v of actual.vecinos) {
    if (!v.abierto && !v.cerrado) {
      v.padre = actual;
      v.abierto = true;
      abiertos.push(v);
    }
  }
  actual.cerrado = true;
}

// DFS
function iniciarDFS() {
  prepararBusqueda();
  algoritmoActual = pasoDFS;
}

function pasoDFS() {
  if (abiertos.length === 0) return ejecutando = false;

  let actual = abiertos.pop();
  if (actual === fin) return reconstruirCamino(actual);

  for (let v of actual.vecinos) {
    if (!v.abierto && !v.cerrado) {
      v.padre = actual;
      v.abierto = true;
      abiertos.push(v);
    }
  }
  actual.cerrado = true;
}

// LIMPIAR TABLERO
function limpiarTablero() {
  inicio = null;
  fin = null;
  caminoOptimo = [];
  ejecutando = false;

  for (let col of grid) {
    for (let c of col) {
      c.tipo = "normal";
      c.costo = 1;
      c.g = Infinity;
      c.h = 0;
      c.f = 0;
      c.padre = null;
      c.abierto = false;
      c.cerrado = false;
    }
  }
}

function cambiarTerreno(t) {
  terrenoSeleccionado = t;
}