import { useEffect, useMemo, useState } from "react";

type EditableNumbersTextareaProps = {
  items: number[];
  onChange: (next: number[]) => void; // вернём обновлённый массив чисел
  height?: number;
  className?: string;
  /** Как разделять числа при показе */
  displaySeparator?: "newline" | "comma" | "space";
};

export function EditableNumbersTextarea({
  items,
  onChange,
  displaySeparator = "newline",
}: EditableNumbersTextareaProps) {
  const separator =
    displaySeparator === "newline"
      ? "\n"
      : displaySeparator === "comma"
      ? ", "
      : " ";

  // Текст в textarea (контролируемый)
  const [text, setText] = useState(() => items.join(separator));

  // Если items пришли новые извне — обновим текст
  useEffect(() => {
    setText(items.join(separator));
  }, [items, separator]);

  // Парсим текст в числа
  const parseNumbers = (t: string) => {
    // разделители: любая комбинация запятых/пробелов/переводов строк/табов
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
    <div className={`rounded-md border border-white/10 bg-black/30 `}>
      <div className="flex items-center justify-between px-3 py-2 text-xs text-white/70">
        <span>Чисел: {items.length}</span>
        {invalidCount > 0 && (
          <span className="text-amber-300">
            некорректных токенов: {invalidCount}
          </span>
        )}
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        className="w-full resize-none bg-transparent outline-none px-3 pb-3 text-sm text-white/90"
        spellCheck={false}
      />
    </div>
  );
}
