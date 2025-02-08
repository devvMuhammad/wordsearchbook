// page.tsx
"use client";

import { Grid } from "../puzzle";
import { testPuzzle } from "../test";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';

// Types
type GridCell = {
  letter: string;
  wordIndices: number[];
};

type PuzzleGrid = GridCell[][];

type StyleTypes = {
  page: Style;
  section: Style;
  header: Style;
  instructions: Style;
  grid: Style;
  row: Style;
  cell: Style;
  wordList: Style;
  word: Style;
};

const HIGHLIGHT_COLORS = [
  '#FFCDD2', '#BBDEFB', '#C8E6C9', '#FFF9C4',
  '#E1BEE7', '#F8BBD0', '#FFE0B2', '#B2DFDB',
  '#C5CAE9', '#B2EBF2'
] as const;

// Create styles
const styles = StyleSheet.create<StyleTypes>({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 30,
  },
  header: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 25,
    height: 25,
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
  },
  wordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  word: {
    fontSize: 12,
    padding: 5,
  },
});

interface WordSearchPDFProps {
  puzzle: PuzzleGrid;
  puzzleNumber?: number;
}

// Single Puzzle Page Component
const PuzzlePage: React.FC<WordSearchPDFProps> = ({ puzzle, puzzleNumber = 1 }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.section}>
      <Text style={styles.header}>Word Search #{puzzleNumber}</Text>
      <Text style={styles.instructions}>
        Find the following words in the puzzle. The words are hidden UP, DOWN, LEFT and DIAGONAL
      </Text>

      <View style={styles.grid}>
        {puzzle.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((cell, j) => (
              <View key={j} style={styles.cell}>
                <Text>{cell.letter}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  </Page>
);

// Solution Page Component
const SolutionPage: React.FC<WordSearchPDFProps> = ({ puzzle, puzzleNumber = 1 }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.section}>
      <Text style={styles.header}>Solution #{puzzleNumber}</Text>
      <View style={styles.grid}>
        {puzzle.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((cell, j) => (
              <View
                key={j}
                style={[
                  styles.cell,
                  cell.wordIndices.length > 0 ? {
                    backgroundColor: HIGHLIGHT_COLORS[cell.wordIndices[0] % HIGHLIGHT_COLORS.length]
                  } : {}
                ]}
              >
                <Text>{cell.letter}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  </Page>
);

// Main PDF Component
const WordSearchPDF: React.FC<WordSearchPDFProps> = (props) => (
  <Document>
    <PuzzlePage {...props} />
    <SolutionPage {...props} />
  </Document>
);

const TestPage: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Word Search</h1>

      <div className="flex flex-col items-center gap-8">
        <Grid grid={testPuzzle} solution={true} />

        <PDFDownloadLink
          document={<WordSearchPDF puzzle={testPuzzle} />}
          fileName="wordsearch.pdf"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {({ loading, error }) => {
            if (error) {
              return 'Error generating PDF';
            }
            return loading ? 'Generating PDF...' : 'Download PDF';
          }}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default TestPage;