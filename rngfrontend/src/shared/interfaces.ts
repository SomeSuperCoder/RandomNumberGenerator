export interface IFormulaInSteps {
  hashes: string[];
  splitedHashes: [string[], string[], string[]];
  selectedParts: [string, string, string];
  selectedPartsDec: [number, number, number];
  sum: number;
  result: Float64Array;
}
