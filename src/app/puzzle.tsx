import { WordSearchResult } from "@/actions/generateWordSearch";

// Predefined colors for words
const HIGHLIGHT_COLORS = [
  'rgba(252, 165, 165, 0.5)', // red
  'rgba(147, 197, 253, 0.5)', // blue
  'rgba(134, 239, 172, 0.5)', // green
  'rgba(250, 204, 21, 0.5)',  // yellow
  'rgba(192, 132, 252, 0.5)', // purple
  'rgba(251, 207, 232, 0.5)', // pink
  'rgba(251, 146, 60, 0.5)',  // orange
  'rgba(94, 234, 212, 0.5)',  // teal
  'rgba(165, 180, 252, 0.5)', // indigo
  'rgba(103, 232, 249, 0.5)', // cyan
  'rgba(163, 230, 53, 0.5)',  // lime
  'rgba(251, 113, 133, 0.5)', // rose
];

const gridContainerStyle = {
  display: 'flex',
  gap: '2rem',
  marginBottom: '2rem'
};

const cellStyle = {
  width: '2.5rem',
  height: '2.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #ccc',
  fontSize: '1.5rem',
  fontFamily: 'monospace'
};


function Words({ words }: { words: string[] }) {
  return <div style={{ marginTop: '1rem' }}>
    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
      Words to find:
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {words.map((word) => (
        <span key={word}>
          {word}
        </span>
      ))}
    </div>
  </div>
}

function Grid({ grid, solution }: { grid: WordSearchResult['grid'], solution: boolean }) {
  function getCellBackground(wordIndices: number[], showAll: boolean) {
    if (showAll && wordIndices.length > 0) {
      return HIGHLIGHT_COLORS[wordIndices[0] % HIGHLIGHT_COLORS.length];
    }
    return '';
  }
  return (
    <div style={{ display: 'grid' }}>
      {grid.map((row, i) => (
        <div key={i} style={{ display: 'flex' }}>
          {row.map((cell, j) => (
            <div key={j} style={{
              ...cellStyle,
              backgroundColor: solution ? getCellBackground(cell.wordIndices, true) : 'transparent'
            }}>
              {cell.letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// export default function Puzzle({ puzzle, number }: { puzzle: WordSearchResult, number: number }) {
//   return <div style={{ display: "flex", flexDirection: "column", gap: "20px", margin: "2rem", fontFamily: "monospace" }}>
//     {/* Unsolved One */}
//     <div style={{ display: 'flex', gap: '2.5rem', pageBreakAfter: "always" }} >
//       <div>
//         <h2 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
//           Puzzle # {number}
//         </h2>
//         <Grid grid={puzzle.grid} solution={false} />
//       </div>
//       <Words words={puzzle.words} />
//     </div>
//     {/* Solved One */}
//     < div style={{ display: 'flex', gap: '2.5rem', pageBreakAfter: "always" }
//     }>
//       <div>
//         <h2 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
//           Solution # {number}
//         </h2>
//         <Grid grid={puzzle?.grid} solution={true} />
//       </div>
//       <Words words={puzzle?.words} />
//     </div >
//   </div>
// }

export default function Puzzle({ number, puzzle, solved }: { number: number; puzzle: WordSearchResult; solved: boolean }) {
  return <div style={{ display: 'flex', gap: '2.5rem', pageBreakAfter: "always" }} >
    <div>
      <h2 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
        {solved ? "Solution" : "Puzzle"} # {number}
      </h2>
      <Grid grid={puzzle.grid} solution={solved} />
    </div>
    <Words words={puzzle.words} />
  </div>
}