import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";

type EditableNumbersTextareaProps = {
  items: number[];
  onChange: (next: number[]) => void;
  height?: number;
  className?: string;
  displaySeparator?: "newline" | "comma" | "space";
};

export function EditableNumbersTextarea({
  items,
  onChange,
  height = 320,
  displaySeparator = "newline",
}: EditableNumbersTextareaProps) {
  const separator =
    displaySeparator === "newline"
      ? "\n"
      : displaySeparator === "comma"
      ? ", "
      : " ";

  const [text, setText] = useState(() => items.join(separator));

  useEffect(() => {
    setText(items.join(separator));
  }, [items, separator]);

  const parseNumbers = (t: string) => {
    const tokens = t.split(/[,\s]+/).filter(Boolean);
    const nums = tokens.map((s) => Number(s)).filter((n) => Number.isFinite(n));
    return { nums, invalidCount: tokens.length - nums.length };
  };

  const { invalidCount } = useMemo(() => parseNumbers(text), [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextText = e.target.value;
    setText(nextText);
    const { nums } = parseNumbers(nextText);
    onChange(nums);
  };

  return (
    <div className="rounded-md border border-white/10 bg-black/30">
      <div className="flex items-center justify-between px-3 py-2 text-xs text-white/70">
        <span>Чисел: {items.length}</span>
        {invalidCount > 0 && (
          <span className="text-amber-300">
            некорректных токенов: {invalidCount}
          </span>
        )}
      </div>

      <Textarea
        value={text}
        onChange={handleChange}
        className="w-full resize-none bg-transparent px-3 pb-3 text-sm text-white/90 overflow-y-auto"
        style={{ height }}
        spellCheck={false}
        placeholder="Введите числа через пробел, запятую или с новой строки…"
      />
    </div>
  );
}

export default EditableNumbersTextarea;
