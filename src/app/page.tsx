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
  downloadFormat: z.enum(["PDF", "DOCX", "PNG"]),
  wordsPerPuzzle: z.number().min(1).max(50),
  colorMode: z.enum(["colored", "bw"]),
  paperFormat: z.enum(["A4", "A5"]),
  pageSize: z.object({
    width: z.number().min(1).max(50),
    height: z.number().min(1).max(50)
  }),
  uploadedImage: z.string().optional(),
});



type FormData = z.infer<typeof formSchema>;

export default function WordSearchGamePDF() {
  const puzzleRef = useRef<HTMLDivElement>(null);
  const [puzzles, setPuzzles] = useState<WordSearchResult[] | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pagesPerPuzzle: 1,
      downloadFormat: "PDF",
      wordsPerPuzzle: 10,
      colorMode: "bw",
      paperFormat: "A4",
      pageSize: {
        width: 8.27, // A4 width in inches
        height: 11.69 // A4 height in inches
      },
    },
  });

  console.log(form.getValues());


  async function handleGenerate(data: FormData) {
    setIsGenerating(true);
    try {
      const bookInput: BookInputsType = {
        pagesCount: data.pagesPerPuzzle,
        wordsCountPerPuzzle: data.wordsPerPuzzle,
        topic: data.topic,
        pageSize: data.pageSize,
        paperFormat: data.paperFormat,
      };
      const puzzles = await generateBook(bookInput);
      setPuzzles(puzzles);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        form.setValue('uploadedImage', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePDF = async () => {
    if (!puzzleRef.current) return;
    const start = performance.now()
    setIsDownloading(true);
    try {
      setIsGenerating(true);
      const htmlContent = puzzleRef.current.innerHTML;
      if (!htmlContent) {
        throw new Error('Failed to get HTML content');
      }
      const pdfBase64 = await generatePDF(htmlContent);
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
      setIsDownloading(false);
      setGenerationTime(parseFloat(((end - start) / 1000).toFixed(2)));
    }
  };

  return (
    <div className="p-4">
      <FormFields
        form={form}
        onSubmit={form.handleSubmit(handleGenerate)}
        isGenerating={isGenerating}
        onImageUpload={handleImageUpload}
      />

      <button
        onClick={handleGeneratePDF}
        disabled={isDownloading || !puzzles}
        className="mb-4 mr-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
      >
        {isDownloading ? 'Downloading PDF...' : 'Download as PDF'}
      </button>
      {generationTime !== null && (
        <p className="text-gray-600 mb-4">
          Download time: {generationTime} seconds
        </p>
      )}

      <div ref={puzzleRef}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", margin: "2rem", fontFamily: "monospace" }}>
          {puzzles && puzzles.map((puzzle, index) => (
            <Puzzle
              key={index}
              puzzle={puzzle}
              number={index + 1}
              solved={false}
              paperFormat={form.watch("paperFormat")}
              // pageSize={form.watch("pageSize")}
              colorMode={form.watch("colorMode")}
              uploadedImage={form.watch("uploadedImage")}
            />
          ))}
          {puzzles && puzzles.map((puzzle, index) => (
            <Puzzle
              key={index}
              puzzle={puzzle}
              number={index + 1}
              solved={true}
              // pageSize={form.watch("pageSize")}
              paperFormat={form.watch("paperFormat")}
              colorMode={form.watch("colorMode")}
              uploadedImage={form.watch("uploadedImage")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}