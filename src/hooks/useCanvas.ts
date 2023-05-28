import { useRef } from 'react';
import { settings } from '../lib/gameState';
import { CanvasLocation } from '../types/general';

const { gameOverColour, gridSquareSize } = settings

export default function useCanvas(): [
  React.MutableRefObject<HTMLCanvasElement | null>,
  CanvasRenderingContext2D | null | undefined
] {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas = canvasRef?.current;
  const ctx = canvas?.getContext('2d');

  return [canvasRef, ctx];
}

export function drawSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colour: string,
): void {
  ctx.fillStyle = colour
  ctx.fillRect(x * gridSquareSize, y * gridSquareSize, gridSquareSize, gridSquareSize)
}

export function drawRandomSquare(ctx: CanvasRenderingContext2D, colour: string): CanvasLocation {
  const newLocation = getRandomBoardSquare(ctx.canvas)
  drawSquare(ctx, newLocation.x, newLocation.y, colour)

  return newLocation
}

export function getRandomBoardSquare(canvas: HTMLCanvasElement): CanvasLocation {
  return {
    x: Math.floor(randomBetween(0, canvas.width) / gridSquareSize),
    y: Math.floor(randomBetween(0, canvas.height) / gridSquareSize),
  }
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function drawGameOver(ctx: CanvasRenderingContext2D) {
  clearBoard(ctx)
  ctx.font = '60px Arial'
  ctx.fillStyle = gameOverColour
  ctx.textAlign = 'center'

  const { width, height } = ctx.canvas
  ctx.fillText('Game Over', width / 2, height / 2)
}

export function clearBoard(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  ctx.clearRect(0, 0, width, height)
}
