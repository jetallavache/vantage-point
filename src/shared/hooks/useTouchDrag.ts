import { useEffect, useRef } from "react";

interface TouchDragOptions {
  onDrop: (
    dragKey: string,
    dropKey: string,
    position: "before" | "after" | "inside"
  ) => void;
}

export const useTouchDrag = (enabled: boolean, options: TouchDragOptions) => {
  const draggedKey = useRef<string | null>(null);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const treeNode = target.closest("[data-node-key]");
      if (!treeNode) return;

      draggedKey.current = treeNode.getAttribute("data-node-key");
      touchStartY.current = e.touches[0].clientY;
      treeNode.classList.add("dragging");
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!draggedKey.current) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!draggedKey.current) return;

      const target = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );

      const dropNode = target?.closest("[data-node-key]");
      const dragNode = document.querySelector(
        `[data-node-key="${draggedKey.current}"]`
      );

      if (dragNode) {
        dragNode.classList.remove("dragging");
      }

      if (!dropNode || !draggedKey.current) {
        draggedKey.current = null;
        return;
      }

      const dropKey = dropNode.getAttribute("data-node-key");
      if (!dropKey || dropKey === draggedKey.current) {
        draggedKey.current = null;
        return;
      }

      const touchEndY = e.changedTouches[0].clientY;
      const dropRect = dropNode.getBoundingClientRect();
      const relativeY = touchEndY - dropRect.top;
      const height = dropRect.height;

      let position: "before" | "after" | "inside";
      if (relativeY < height * 0.25) {
        position = "before";
      } else if (relativeY > height * 0.75) {
        position = "after";
      } else {
        position = "inside";
      }

      options.onDrop(draggedKey.current, dropKey, position);
      draggedKey.current = null;
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, options]);
};
