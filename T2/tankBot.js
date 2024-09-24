import * as THREE from 'three';
import { tank1, tank2, tank3, tank1BB, tank2BB, tank3BB } from './tank.js';

function getQuadrant(x, y) {
  // Divide a arena em quadrantes com base na posição do bot e player
  if (x < 8 && y < 5) return 1; // Quadrante 1
  if (x >= 8 && y < 5) return 2; // Quadrante 2
  if (x < 8 && y >= 5) return 3; // Quadrante 3
  return 4; // Quadrante 4
}

function moveToCenter(tankBot) {
  // Coordenadas do centro da arena
  const centerX = 8;
  const centerY = 6;

  // Mover o tankBot em direção ao centro (código simplificado)
  if (tankBot.x < centerX) {
      tankBot.x += 1; // Move para direita
  } else if (tankBot.x > centerX) {
      tankBot.x -= 1; // Move para esquerda
  }
  if (tankBot.y < centerY) {
      tankBot.y += 1; // Move para baixo
  } else if (tankBot.y > centerY) {
      tankBot.y -= 1; // Move para cima
  }

  // Checar se chegou ao centro//inutil
  return (tankBot.x === centerX && tankBot.y === centerY);
}

function updateTankBot(tankBot, tankPlayer) {
  const botQuadrant = getQuadrant(tankBot.x, tankBot.y);
  const playerQuadrant = getQuadrant(tankPlayer.x, tankPlayer.y);

  if ((botQuadrant % 2 !== 0 && playerQuadrant % 2 !== 0)&&botQuadrant!=playerQuadrant){} {
      // Ambos estão em quadrantes ímpares
      if (!moveToCenter(tankBot)) {
          return; // Ainda não chegou no centro
      }
  }

  // Recalcular a rota até o player quando chegar ao centro ou se os quadrantes forem diferentes
  moveToPlayer(tankBot, tankPlayer);
}

function moveToPlayer(tankBot, tankPlayer) {
  // Aqui você implementa a lógica de mover o bot até o player
  if (tankBot.x < tankPlayer.x) {
      tankBot.x += 1; // Move para a direita
  } else if (tankBot.x > tankPlayer.x) {
      tankBot.x -= 1; // Move para a esquerda
  }

  if (tankBot.y < tankPlayer.y) {
      tankBot.y += 1; // Move para baixo
  } else if (tankBot.y > tankPlayer.y) {
      tankBot.y -= 1; // Move para cima
  }
}


