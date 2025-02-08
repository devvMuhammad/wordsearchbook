// page.tsx
'use client';

import { useRef, useState } from 'react';
import { generatePDF } from '@/actions/generatePdf';
import Puzzle from "@/app/puzzle"
import { generateBook } from '@/actions/generateBook';
import { BookInputsType, WordSearchResult } from '@/types';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormFields from './form/page';

const formSchema = z.object({
  topic: z.string().nonempty(),
  pagesPerPuzzle: z.number().min(1).max(100),
  paperSize: z.enum(["A4", "A5"]),
  downloadFormat: z.enum(["PDF", "DOCX", "PNG"]),
  wordsPerPuzzle: z.number().min(1).max(50),
});

type FormData = z.infer<typeof formSchema>;

export default function WordSearchGamePDF() {
  const puzzleRef = useRef<HTMLDivElement>(null);
  const [puzzles, setPuzzles] = useState<WordSearchResult[] | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pagesPerPuzzle: 1,
      paperSize: "A4",
      downloadFormat: "PDF",
      wordsPerPuzzle: 10,
    },
  });

  console.log(form.getValues());


  async function handleGenerate(data: FormData) {
    const bookInput: BookInputsType = {
      pagesCount: data.pagesPerPuzzle,
      paperFormat: data.paperSize,
      wordsCountPerPuzzle: data.wordsPerPuzzle,
      topic: data.topic
    };
    const puzzles = await generateBook(bookInput);
    setPuzzles(puzzles);
  }

  const handleGeneratePDF = async () => {
    if (!puzzleRef.current) return;
    const start = performance.now()
    try {
      setIsGenerating(true);
      const htmlContent = puzzleRef.current.innerHTML;
      if (!htmlContent) {
        throw new Error('Failed to get HTML content');
      }
      const pdfBase64 = await generatePDF(htmlContent, form.getValues('paperSize'));
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${pdfBase64}`;
      link.download = 'wordsearch.pdf';
      link.click();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      const end = performance.now()
      setIsGenerating(false);
      setGenerationTime(parseFloat(((end - start) / 1000).toFixed(2)));
    }
  };

  return (
    <div className="p-4">
      <FormFields
        form={form}
        onSubmit={form.handleSubmit(handleGenerate)}
      />

      <button
        onClick={handleGeneratePDF}
        disabled={isGenerating}
        className="mb-4 mr-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
      >
        {isGenerating ? 'Generating PDF...' : 'Download as PDF'}
      </button>
      {generationTime !== null && (
        <p className="text-gray-600 mb-4">
          Download time: {generationTime} seconds
        </p>
      )}

      <div ref={puzzleRef}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", margin: "2rem", fontFamily: "monospace" }}>
          {puzzles && puzzles.map((puzzle, index) => (
            <Puzzle key={index} puzzle={puzzle} number={index + 1} solved={false} paperFormat={form.watch("paperSize")} />
          ))}
          {puzzles && puzzles.map((puzzle, index) => (
            <Puzzle key={index} puzzle={puzzle} number={index + 1} solved={true} paperFormat={form.watch("paperSize")} />
          ))}
        </div>
      </div>
    </div>
  );
}