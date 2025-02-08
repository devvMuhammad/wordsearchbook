import { WordSearchResult } from "@/types";
import { Icons } from "@/icons";

// Predefined colors for words
const BW_HIGHLIGHT_COLORS = [
  'rgba(0, 0, 0, 0.08)',      // Almost white
  'rgba(0, 0, 0, 0.20)',      // Very light gray
  'rgba(0, 0, 0, 0.32)',      // Light gray
  'rgba(0, 0, 0, 0.44)',      // Medium-light gray
  'rgba(0, 0, 0, 0.56)',      // Medium gray
  'rgba(0, 0, 0, 0.68)',      // Medium-dark gray
  'rgba(0, 0, 0, 0.12)',      // Another very light
  'rgba(0, 0, 0, 0.24)',      // Another light
  'rgba(0, 0, 0, 0.36)',      // Another medium-light
  'rgba(0, 0, 0, 0.48)',      // Another medium
  'rgba(0, 0, 0, 0.60)',      // Another medium-dark
  'rgba(0, 0, 0, 0.72)',      // Dark gray
];

const COLORED_HIGHLIGHTS = [
  'rgba(255, 99, 132, 0.3)',  // Red
  'rgba(54, 162, 235, 0.3)',  // Blue
  'rgba(255, 206, 86, 0.3)',  // Yellow
  'rgba(75, 192, 192, 0.3)',  // Teal
  'rgba(153, 102, 255, 0.3)', // Purple
  'rgba(255, 159, 64, 0.3)',  // Orange
  'rgba(199, 199, 199, 0.3)', // Gray
  'rgba(83, 102, 255, 0.3)',  // Indigo
  'rgba(255, 99, 255, 0.3)',  // Pink
  'rgba(99, 255, 132, 0.3)',  // Green
];


const gridContainerStyle = {
  border: '2px solid black',
  marginBottom: '2rem',
  width: 'fit-content',
};

const wordListStyle = {
  textAlign: 'center' as const,
  width: '100%',
};

const wordGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '0.5rem',
};

const getCellStyle = (paperFormat: 'A4' | 'A5' = 'A4') => ({
  backgroundColor: paperFormat === 'A4' ? 'white' : 'red',
  width: paperFormat === 'A4' ? '2.8rem' : '1.5rem',
  height: paperFormat === 'A4' ? '2.8rem' : '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: paperFormat === 'A4' ? '1.4rem' : '1rem',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
});

const getContainerStyle = (paperFormat: 'A4' | 'A5' = 'A4') => ({
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  width: '100%',
  maxWidth: paperFormat === 'A4' ? '800px' : '600px',
  margin: '0 auto',
  padding: paperFormat === 'A4' ? '1rem' : '0.5rem',
  pageBreakAfter: 'always' as const,
  fontFamily: 'Arial, sans-serif',
});

function Words({ words, paperFormat = 'A4' }: { words: string[], paperFormat?: 'A4' | 'A5' }) {
  const wordStyle = {
    fontWeight: "bold",
    textAlign: "left" as const,
    textTransform: 'uppercase' as const,
    fontSize: paperFormat === 'A4' ? "1.2rem" : "0.9rem",
    display: 'flex',
    alignItems: 'center',
    gap: paperFormat === 'A4' ? '15px' : '8px'
  };

  const checkboxStyle = {
    fontSize: paperFormat === 'A4' ? "1.2rem" : "0.9rem",
    fontWeight: "bold"
  };


  return (
    <div style={wordListStyle}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={wordGridStyle}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            alignItems: 'center',
            justifyContent: "center",
            gap: paperFormat === 'A4' ? '0.5rem' : '0.3rem',
            gridColumn: 'span 2',
          }}>
            {words.map((word) => (
              <span key={word} style={wordStyle}>
                <span style={checkboxStyle}>▢</span>
                {word}
              </span>
            ))}
          </div>
          <Icons.flowers
            width={paperFormat === 'A4' ? 200 : 120}
            height={paperFormat === 'A4' ? 200 : 120}
            style={{
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function Grid({
  grid,
  solution,
  paperFormat,
  colorMode = 'bw'
}: {
  grid: WordSearchResult['grid'],
  solution: boolean,
  paperFormat: 'A4' | 'A5',
  colorMode: 'colored' | 'bw'
}) {
  function getCellBackground(wordIndices: number[], showAll: boolean) {
    if (showAll && wordIndices.length > 0) {
      const colors = colorMode === 'colored' ? COLORED_HIGHLIGHTS : BW_HIGHLIGHT_COLORS;
      return colors[wordIndices[0] % colors.length];
    }
    return '';
  }

  return (
    <div style={gridContainerStyle}>
      {grid.map((row, i) => (
        <div key={i} style={{ display: 'flex' }}>
          {row.map((cell, j) => (
            <div
              key={j}
              style={{
                ...getCellStyle(paperFormat),
                backgroundColor: solution ? getCellBackground(cell.wordIndices, true) : 'transparent',
                border: solution ? '1px solid black' : 'none',
              }}
            >
              {cell.letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Puzzle({
  number,
  puzzle,
  solved,
  paperFormat = 'A4',
  colorMode = "bw"
}: {
  number: number;
  puzzle: WordSearchResult;
  solved: boolean;
  paperFormat?: 'A4' | 'A5';
  colorMode?: 'colored' | 'bw';
}) {
  return (
    <div style={getContainerStyle(paperFormat)}>
      <h2 style={{
        fontWeight: 'bold',
        fontSize: paperFormat === 'A4' ? '2rem' : '1.5rem',
        marginBottom: paperFormat === 'A4' ? '1.5rem' : '1rem',
        textAlign: 'center' as const,
      }}>
        {number}. {puzzle.topic}
      </h2>
      <Grid grid={puzzle.grid} solution={solved} paperFormat={paperFormat} colorMode={colorMode} />
      <Words words={puzzle.words} paperFormat={paperFormat} />
    </div>
  );
}