// src/features/layout/hooks/useResizablePanels.ts
import { useState, useCallback, useRef, useEffect } from 'react';

export const useResizablePanels = () => {
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(400);
  
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLeftMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingLeft.current = true;
    e.preventDefault();
  }, []);

  const handleRightMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRight.current = true;
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    
    if (isDraggingLeft.current) {
      const newLeftWidth = e.clientX - containerRect.left;
      const minWidth = 200;
      const maxWidth = containerWidth - rightPanelWidth - 400;
      
      setLeftPanelWidth(Math.max(minWidth, Math.min(maxWidth, newLeftWidth)));
    }
    
    if (isDraggingRight.current) {
      const newRightWidth = containerRect.right - e.clientX;
      const minWidth = 300;
      const maxWidth = containerWidth - leftPanelWidth - 400;
      
      setRightPanelWidth(Math.max(minWidth, Math.min(maxWidth, newRightWidth)));
    }
  }, [leftPanelWidth, rightPanelWidth]);

  const handleMouseUp = useCallback(() => {
    isDraggingLeft.current = false;
    isDraggingRight.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    leftPanelWidth,
    rightPanelWidth,
    containerRef,
    handleLeftMouseDown,
    handleRightMouseDown
  };
};