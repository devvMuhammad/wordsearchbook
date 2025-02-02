'use server'

export type GridCell = {
  letter: string;
  wordIndices: number[];  // Store indices of words this cell belongs to
}

export type WordSearchResult = {
  grid: GridCell[][];
  words: string[];
  size: number;
}

export async function generateWordSearch(
  words: string[],
  size: number = 15
): Promise<WordSearchResult> {
  // Initialize grid with empty cells
  const grid: GridCell[][] = Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => ({
      letter: ' ',
      wordIndices: []
    }))
  );
  
  const placedWords: string[] = [];
  
  const directions: [number, number][] = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down-right
    [1, -1],  // diagonal down-left
  ];

  function addWord(word: string, wordIndex: number): boolean {
    word = word.toUpperCase();

    for (let attempt = 0; attempt < 50; attempt++) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const [dx, dy] = direction;

      let startY = dy < 0 
        ? Math.floor(Math.random() * size)
        : Math.floor(Math.random() * (size - word.length));

      let startX = dx < 0
        ? Math.floor(Math.random() * size)
        : Math.floor(Math.random() * (size - word.length));

      let x = startX;
      let y = startY;

      // Check if word fits
      let fits = true;
      const positions: { x: number; y: number }[] = [];
      
      for (const letter of word) {
        if (x >= 0 && x < size && y >= 0 && y < size &&
            (grid[x][y].letter === ' ' || grid[x][y].letter === letter)) {
          positions.push({ x, y });
          x += dx;
          y += dy;
        } else {
          fits = false;
          break;
        }
      }

      if (fits) {
        // Place the word and mark cells
        positions.forEach((pos, index) => {
          // Add this word's index to the cell's wordIndices array
          if (!grid[pos.x][pos.y].wordIndices.includes(wordIndex)) {
            grid[pos.x][pos.y].wordIndices.push(wordIndex);
          }
          grid[pos.x][pos.y].letter = word[index];
        });
        placedWords.push(word);
        return true;
      }
    }

    return false;
  }

  function fillBlanks(): void {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j].letter === ' ') {
          grid[i][j] = {
            letter: alphabet[Math.floor(Math.random() * alphabet.length)],
            wordIndices: []
          };
        }
      }
    }
  }

  // Generate the puzzle
  for (let i = 0; i < words.length; i++) {
    if (!addWord(words[i], i)) {
      console.log(`Warning: Could not place '${words[i]}'`);
    }
  }

  // Fill remaining spaces
  fillBlanks();

  return {
    grid,
    words: placedWords,
    size
  };
}