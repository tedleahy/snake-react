import { useRef } from 'react';
import { settings } from '../lib/gameState';

const { gameOverColour } = settings

export default function useCanvas(): [
  React.MutableRefObject<HTMLCanvasElement | null>,
  CanvasRenderingContext2D | null | undefined
] {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas = canvasRef?.current;
  const ctx = canvas?.getContext('2d');

  return [canvasRef, ctx];
}

export function drawGameOver(ctx: CanvasRenderingContext2D) {
  clearBoard(ctx)
  ctx.font = '30px Arial'
  ctx.fillStyle = gameOverColour
  ctx.textAlign = 'center'

  const { width, height } = ctx.canvas
  ctx.fillText('Game Over', width / 2, height / 2)
}

export function clearBoard(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  ctx.clearRect(0, 0, width, height)
}
