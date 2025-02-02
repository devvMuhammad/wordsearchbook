'use client'

import { generateWordSearch, WordSearchResult } from '@/actions/generateWordSearch'
import { useState } from 'react'

// Predefined colors for words (you can add more)
const HIGHLIGHT_COLORS = [
  'bg-red-300',
  'bg-blue-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-orange-400',
  'bg-teal-400',
  'bg-indigo-400',
  'bg-cyan-400',
  'bg-lime-400',
  'bg-rose-400',
];

export default function WordSearchGame() {
  const [puzzle, setPuzzle] = useState<WordSearchResult | null>(null)

  async function handleGenerate() {
    const result = await generateWordSearch([
      "SCIENCE", "ECONOMICS", "NOVEL", "STORY",
      "BIOGRAPHY", "MUHAMMAD"
    ], 15)
    setPuzzle(result)
  }

  // Function to get background color for a cell
  function getCellBackground(wordIndices: number[], showAll: boolean) {

    if (showAll && wordIndices.length > 0) {
      // Show the color of the first word this cell belongs to
      return HIGHLIGHT_COLORS[wordIndices[0] % HIGHLIGHT_COLORS.length] + " " + "bg-opacity-50";
    }

    return '';
  }

  // Function to render either solved or unsolved grid
  function renderGrid(showSolution: boolean) {
    if (!puzzle) return null;

    return (
      <div className="grid font-mono">
        {puzzle.grid.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <div
                key={j}
                className={`
                  text-3xl
                  w-10 h-10 flex items-center justify-center border
                  ${showSolution ? getCellBackground(cell.wordIndices, true) : ''}
                `}
              >
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={handleGenerate}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Generate Puzzle
      </button>

      {puzzle && (
        <div className="flex gap-8">
          {/* Unsolved puzzle */}
          <div className='flex gap-10'>
            <div>

              <h2 className="font-bold text-lg mb-2">Random Topic</h2>
              {renderGrid(false)}
            </div>
            <div className="mt-4">
              <h3 className='font-bold mb-2'>Words to find:</h3>
              <div className="flex flex-col gap-1">
                {puzzle.words.map((word) => (
                  <div
                    key={word}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
      <div className='mt-6'>
        <h2 className="font-bold mb-2">Solution</h2>
        {renderGrid(true)}
      </div>
    </div>
  )
}