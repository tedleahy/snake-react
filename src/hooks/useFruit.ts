import { useEffect, useState } from "react";
import { settings } from "../lib/gameState";
import { Snake } from "./useSnake";
import { CanvasLocation } from "../types/general";
import { drawRandomSquare } from "./useCanvas";

const { fruitColour  } = settings

export default function useFruit(
  ctx: CanvasRenderingContext2D | null | undefined,
  snake: Snake,
  setSnake: React.Dispatch<React.SetStateAction<Snake>>,
) {
  const [fruitLocation, setFruitLocation] = useState<CanvasLocation>({ x: 0, y: 0})
  const snakeHasHitFruit = snake.head.x === fruitLocation.x &&
    snake.head.y === fruitLocation.y

  const drawNewFruit = () => {
    if (ctx) setFruitLocation(drawRandomSquare(ctx, fruitColour))
  }

  // When snake starts moving
  useEffect(() => {
    if (ctx && !snake.stoppedMoving) drawNewFruit()
  }, [snake.stoppedMoving])

  // When snake hits fruit
  useEffect(() => {
    if (ctx && snakeHasHitFruit) {
      setSnake({ ...snake, maxTailLength: snake.maxTailLength + 1 })
      drawNewFruit()
    }
  }, [ctx, snakeHasHitFruit])
}
