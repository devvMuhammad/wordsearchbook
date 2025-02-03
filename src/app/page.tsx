'use client';

import { useRef, useState } from 'react';
import { generatePDF } from '@/actions/generatePdf';
import { generateWordSearch, WordSearchResult } from '@/actions/generateWordSearch';
import Puzzle from "@/app/puzzle"
import { generateBook } from '@/actions/generateBook';
import PuzzleForm from './form/page';
import { BookInputsType } from '@/types';

// Common styles as objects
const buttonStyle = {
  marginBottom: '1rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '0.375rem',
  cursor: 'pointer'
};


export default function WordSearchGamePDF() {
  const puzzleRef = useRef<HTMLDivElement>(null);
  const [puzzles, setPuzzles] = useState<WordSearchResult[] | null>(null)

  async function handleGenerate(args: BookInputsType) {
    const puzzles = await generateBook(args);
    setPuzzles(puzzles);
  }
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    if (!puzzleRef.current) return;

    try {
      setIsGenerating(true);

      // Get the HTML content of the puzzle
      const htmlContent = puzzleRef.current.innerHTML;
      if (!htmlContent) {
        throw new Error('Failed to get HTML content');
      }
      console.log("this is the html content to be sent", htmlContent)
      // Call the server action
      const pdfBase64 = await generatePDF(htmlContent);

      // Create a download link
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${pdfBase64}`;
      link.download = 'wordsearch.pdf';
      link.click();

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4">

      <PuzzleForm onGenerate={handleGenerate} />
      <button
        onClick={handleGeneratePDF}
        disabled={isGenerating}
        className="mb-4 mr-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
      >
        {isGenerating ? 'Generating PDF...' : 'Download as PDF'}
      </button>
      {/* <button
        onClick={handleGenerate}
        style={buttonStyle}
      >
        Generate Puzzle
      </button> */}
      <div ref={puzzleRef}>
        {/* Display the unsolved versions and then the unsolved versions  */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", margin: "2rem", fontFamily: "monospace" }}>
          {puzzles && puzzles.map((puzzle, index) => (
            <Puzzle key={index} puzzle={puzzle} number={index + 1} solved={false} />
          ))}

          {puzzles && puzzles.map((puzzle, index) => (
            <Puzzle key={index} puzzle={puzzle} number={index + 1} solved={true} />
          ))}

        </div>
      </div>
    </div>
  );
}