"use client";

import { useCallback, useEffect, useState } from "react";
import type { DragEvent } from "react";

/**
 * Reordering for a grid of items: HTML5 drag-and-drop plus arrow moves.
 * `move(index, delta)` moves an item by `delta` positions (±1 = left/right,
 * ±cols = up/down a row). Both drag and arrows persist the new order via
 * `persist(ids)` and revert on failure. `cols` tracks the responsive column
 * count so up/down move by a full row.
 */
export function useReorder<T extends { id: string }>(
  items: T[],
  setItems: (next: T[]) => void,
  persist: (ids: string[]) => Promise<unknown>,
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const update = () =>
      setCols(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const commit = useCallback(
    async (next: T[]) => {
      const prev = items;
      setItems(next);
      try {
        await persist(next.map((x) => x.id));
      } catch (e) {
        window.alert((e as Error).message);
        setItems(prev); // revert
      }
    },
    [items, setItems, persist],
  );

  const reposition = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= items.length || from === to) return;
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      commit(next);
    },
    [items, commit],
  );

  const move = useCallback(
    (index: number, delta: number) => reposition(index, index + delta),
    [reposition],
  );

  const dragProps = (index: number) => ({
    draggable: true,
    onDragStart: (e: DragEvent) => {
      setDragIndex(index);
      e.dataTransfer.effectAllowed = "move";
    },
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      if (overIndex !== index) setOverIndex(index);
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      if (dragIndex !== null) reposition(dragIndex, index);
      setDragIndex(null);
      setOverIndex(null);
    },
    onDragEnd: () => {
      setDragIndex(null);
      setOverIndex(null);
    },
  });

  return { cols, move, dragProps, dragIndex, overIndex };
}
