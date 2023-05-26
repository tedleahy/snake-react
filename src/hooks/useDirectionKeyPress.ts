import { useEffect, useRef, useState } from 'react'
import useKeyPress from './useKeyPress'
import { SnakeDirection } from "./useSnake"

export default function useDirectionKeyPress(callback: (direction: SnakeDirection) => void): void {
  const upPressed = useKeyPress('ArrowUp')
  const downPressed = useKeyPress('ArrowDown')
  const leftPressed = useKeyPress('ArrowLeft')
  const rightPressed = useKeyPress('ArrowRight')
  const savedCallback = useRef(callback)

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const newDirection = 
        upPressed    ? SnakeDirection.Up
      : downPressed  ? SnakeDirection.Down
      : leftPressed  ? SnakeDirection.Left
      : rightPressed ? SnakeDirection.Right
      : null
    if (newDirection) savedCallback.current(newDirection)
  }, [upPressed, downPressed, leftPressed, rightPressed])
}
