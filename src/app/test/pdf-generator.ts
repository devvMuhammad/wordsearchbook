// pdf-generator.ts
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { WordSearchResult } from '@/actions/generateWordSearch';

// Register fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export function generateWordSearchPDF(puzzles: WordSearchResult[]) {
  const docDefinition = {
    content: [],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
        alignment: 'center'
      },
      wordList: {
        fontSize: 12,
        margin: [0, 10, 0, 20]
      },
      grid: {
        fontSize: 14,
        alignment: 'center'
      }
    }
  };

  puzzles.forEach((puzzle, index) => {
    // Add puzzle section
    docDefinition.content.push(
      { text: `Word Search #${index + 1}`, style: 'header' },
      {
        text: 'Find the following words:',
        style: 'wordList'
      },
      {
        columns: puzzle.words.map(word => ({
          text: word.toUpperCase(),
          width: 'auto',
          margin: [0, 0, 10, 5]
        })),
        columnGap: 10
      },
      {
        table: {
          body: puzzle.grid.map(row =>
            row.map(cell => ({
              text: cell.letter,
              alignment: 'center'
            }))
          ),
          widths: Array(puzzle.size).fill('*')
        },
        style: 'grid',
        margin: [0, 20, 0, 40]
      }
    );

    // Add page break between puzzles
    docDefinition.content.push({ text: '', pageBreak: 'after' });
  });

  // Add solutions section
  puzzles.forEach((puzzle, index) => {
    docDefinition.content.push(
      { text: `Solution #${index + 1}`, style: 'header' },
      {
        table: {
          body: puzzle.grid.map(row =>
            row.map(cell => ({
              text: cell.letter,
              alignment: 'center',
              fillColor: cell.wordIndices.length > 0 ? '#f0f0f0' : null
            }))
          ),
          widths: Array(puzzle.size).fill('*')
        },
        style: 'grid',
        margin: [0, 20, 0, 40]
      }
    );

    if (index < puzzles.length - 1) {
      docDefinition.content.push({ text: '', pageBreak: 'after' });
    }
  });

  return pdfMake.createPdf(docDefinition);
}

// Usage in your component: