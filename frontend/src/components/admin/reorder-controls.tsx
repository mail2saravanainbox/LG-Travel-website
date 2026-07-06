import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, GripVertical } from "lucide-react";

/**
 * Drag handle + four directional arrows for reordering a grid card.
 * ← → move one position; ↑ ↓ move a full row (cols).
 */
export function ReorderControls({
  index,
  count,
  cols,
  onMove,
}: {
  index: number;
  count: number;
  cols: number;
  onMove: (index: number, delta: number) => void;
}) {
  const btn =
    "grid h-7 w-7 shrink-0 place-items-center rounded-md border border-navy-700/15 text-navy-700 transition-colors hover:border-navy-700/40 disabled:opacity-25";
  return (
    <div className="flex items-center gap-1">
      <span className="cursor-grab pr-0.5 text-ink/30" title="Drag to reorder" aria-hidden>
        <GripVertical className="h-4 w-4" />
      </span>
      <button type="button" className={btn} disabled={index === 0}
        onClick={() => onMove(index, -1)} title="Move left" aria-label="Move left">
        <ArrowLeft className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn} disabled={index - cols < 0}
        onClick={() => onMove(index, -cols)} title="Move up a row" aria-label="Move up a row">
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn} disabled={index + cols > count - 1}
        onClick={() => onMove(index, cols)} title="Move down a row" aria-label="Move down a row">
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn} disabled={index === count - 1}
        onClick={() => onMove(index, 1)} title="Move right" aria-label="Move right">
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
