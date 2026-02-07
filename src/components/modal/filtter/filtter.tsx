import React, { useEffect, useState } from "react";

interface FilterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLElement>;
  customFilters: { column: string; value: string }[];
  setCustomFilters: React.Dispatch<React.SetStateAction<{ column: string; value: string }[]>>;
  columns: string[];
  columnOptions: Record<string, string[]>;
}

export default function FilterPopup({
  open,
  onOpenChange,
  anchorRef,
  customFilters,
  setCustomFilters,
  columns,
  columnOptions,
}: FilterPopupProps) {
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 8, width: 280 });
  const [expandedCols, setExpandedCols] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!open) return;
    const map: Record<string, string[]> = {};
    customFilters.forEach(({ column, value }) => {
      if (!map[column]) map[column] = [];
      if (!map[column].includes(value)) map[column].push(value);
    });
    setSelectedValues(map);
    setExpandedCols(Object.keys(map));
  }, [customFilters, open]);

  useEffect(() => {
    function updatePos() {
      const el = anchorRef.current as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const popupWidth = Math.max(280, rect.width);
      const left = rect.right + window.scrollX - popupWidth;
      const top = rect.bottom + window.scrollY + 8;
      setPos({ top, left, width: popupWidth });
    }

    if (open) {
      updatePos();
      window.addEventListener("resize", updatePos);
      window.addEventListener("scroll", updatePos, true);
    }
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const popup = document.getElementById("filter-popup");
      const anchor = anchorRef.current as HTMLElement | null;
      if (!popup) return;
      const target = e.target as Node;
      if (popup.contains(target) || (anchor && anchor.contains(target))) return;
      onOpenChange(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onOpenChange, anchorRef]);

  if (!open) return null;

  const toggleColumn = (col: string) => {
    setExpandedCols((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleValueChange = (col: string, val: string) => {
    setSelectedValues((prev) => {
      const current = prev[col] || [];
      const newValues = current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val];
      return { ...prev, [col]: newValues };
    });
  };

  const applyFilters = () => {
    const filters: { column: string; value: string }[] = [];
    Object.entries(selectedValues).forEach(([col, vals]) => {
      vals.forEach((v) => filters.push({ column: col, value: v }));
    });
    setCustomFilters(filters);
    onOpenChange(false);
  };

  const resetFilters = () => {
    setSelectedValues({});
    setExpandedCols([]);
    setCustomFilters([]);
  };

  return (
    <div
      id="filter-popup"
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        minWidth: pos.width,
        zIndex: 60,
      }}
      className="bg-white border shadow-lg rounded-md p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">ตัวกรองการค้นหา</h3>
        <button
          aria-label="close"
          onClick={() => onOpenChange(false)}
          className="text-sm text-muted-foreground hover:text-destructive"
        >
          ×
        </button>
      </div>

      {/* ✅ รายการ Column */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {columns.map((col) => {
          const selectedCount = selectedValues[col]?.length || 0;
          return (
            <div key={col} className="border-b pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={expandedCols.includes(col)}
                  onChange={() => toggleColumn(col)}
                />
                <span className="text-sm font-medium">
                  {col} {selectedCount > 0 && <span className="text-xs text-gray-500">({selectedCount})</span>}
                </span>
              </label>

              {/* ✅ แสดง value ถ้า expand */}
              {expandedCols.includes(col) && (
                <div className="pl-6 mt-2 space-y-1">
                  {(columnOptions[col] || []).map((val) => (
                    <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedValues[col]?.includes(val) || false}
                        onChange={() => handleValueChange(col, val)}
                      />
                      {val}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ ปุ่ม Apply / Reset */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={resetFilters}
          className="px-3 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300"
        >
          ล้างตัวกรอง
        </button>
        <button
          onClick={applyFilters}
          className="px-3 py-1 rounded text-sm bg-primary text-white"
        >
          กรองข้อมูล
        </button>
      </div>
    </div>
  );
}
