import { useRef } from "react";
import { settings } from "../lib/gameState";
import useFruit from "../hooks/useFruit";
import useSnake from "../hooks/useSnake";

const { gridSquareSize, snakeColour, fruitColour, gameOverColour, snakeSpeed} = settings

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvas = canvasRef?.current
  const ctx = canvas?.getContext('2d')
  // TODO store snake in context/redux or something
  const [snake, setSnake] = useSnake(ctx)
  useFruit(ctx, snake, setSnake)

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="600"
      style={{ border: '1px solid black' }}
    />
  )
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
