
let workspace;
window.addEventListener('load', () => {
  workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
    horizontalLayout: true,
    scrollbars: true,
    trashcan: true
  });
  dibujar();
});

let mapa = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 1, 1],
  [0, 0, 0, 0, 2],
];

let robot = { x: 2, y: 0, dir: 2 };
const ctx = document.getElementById('canvas').getContext('2d');
const TILE = 60;

function dibujar() {
  ctx.clearRect(0, 0, 480, 480);
  for (let y = 0; y < mapa.length; y++) {
    for (let x = 0; x < mapa[0].length; x++) {
      if (mapa[y][x] === 1) {
        ctx.fillStyle = "#999";
        ctx.fillRect(x * TILE + 4, y * TILE + 4, TILE - 8, TILE - 8);
      } else if (mapa[y][x] === 2) {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(x * TILE + 30, y * TILE + 30, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, robot.x * TILE + 5, robot.y * TILE + 5, 50, 50);
  };
  img.src = "robot.png";
}

function avanzar() {
  let nx = robot.x, ny = robot.y;
  switch (robot.dir) {
    case 0: ny--; break;
    case 1: nx++; break;
    case 2: ny++; break;
    case 3: nx--; break;
  }
  if (ny >= 0 && ny < mapa.length && nx >= 0 && nx < mapa[0].length && mapa[ny][nx] !== 0) {
    robot.x = nx;
    robot.y = ny;
  }
}

function girarDerecha() {
  robot.dir = (robot.dir + 1) % 4;
}
function girarIzquierda() {
  robot.dir = (robot.dir + 3) % 4;
}
function bajar() {
  if (robot.y < mapa.length - 1 && mapa[robot.y + 1][robot.x] !== 0) {
    robot.y++;
  }
}

function ejecutarCodigo() {
  const bloques = workspace.getTopBlocks(true);
  let cuentaTotal = 0;
  bloques.forEach(b => {
    cuentaTotal += contarBloquesConectados(b);
  });
  if (cuentaTotal > 8) {
    alert("¡Máximo 8 instrucciones!");
    return;
  }
  robot = { x: 2, y: 0, dir: 2 };
  dibujar();
  let code;
  try {
    code = Blockly.JavaScript.workspaceToCode(workspace);
    eval(code);
  } catch (e) {
    alert("Error en el código generado: " + e.message);
  }
  dibujar();
  if (mapa[robot.y][robot.x] === 2) {
    setTimeout(() => alert("¡Llegaste a la tuerca! 🎉"), 100);
  }
}

function contarBloquesConectados(bloque) {
  let contador = 1;
  let siguiente = bloque.getNextBlock();
  while (siguiente) {
    contador++;
    siguiente = siguiente.getNextBlock();
  }
  return contador;
}
