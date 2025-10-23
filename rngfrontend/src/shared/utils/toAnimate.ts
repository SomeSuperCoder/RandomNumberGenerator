import type { FinalDataWithResults } from "../interafaces/interfaces";
export function toAnimateProps(d: FinalDataWithResults) {
  const hashesStrings = (d.hashes ?? []).map((h) => {
    const hex = h.modified_hash ?? h.original_hash ?? "";
    return `${h.source_name}: ${hex}`;
  });

  return {
    hashes: hashesStrings,
    split: d.split ?? [],
    pick: d.pick ?? [],
    convert: d.convert ?? [],
    sum: Number(d.sum ?? 0),
    result: Number(d.result ?? 0),
    xFactor: Number(d.x_factor ?? 0),
  };
}
