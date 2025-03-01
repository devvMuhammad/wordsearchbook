export type BookInputsType = {
  pagesCount: number;
  wordsCountPerPuzzle: number;
  paperFormat: "A4" | "A5";
  topic: string;
  pageSize?: PageSize;
  uploadedImage?: string;
}

export type GridCell = {
  letter: string;
  wordIndices: number[];  // Store indices of words this cell belongs to
}

export type WordSearchResult = {
  grid: GridCell[][];
  words: string[];
  size: number;
  topic: string;
  format?: "A4" | "A5";
}

export type PageSize = {
  width: number;
  height: number;
};