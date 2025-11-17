import { useCallback, useEffect, useRef } from 'react';

interface KeyboardNavigationOptions {
  onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onSelect?: () => void;
  onCancel?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onMove,
  onSelect,
  onCancel,
  enabled = true,
}: KeyboardNavigationOptions) {
  const activeElementRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if (onMove) onMove('up');
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (onMove) onMove('down');
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (onMove) onMove('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (onMove) onMove('right');
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (onSelect) onSelect();
          break;
        case 'Escape':
          event.preventDefault();
          if (onCancel) onCancel();
          break;
      }
    },
    [enabled, onMove, onSelect, onCancel]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  return { activeElementRef };
}
