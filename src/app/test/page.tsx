"use client";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';
import WordSearchGame from '../page';
import Test from './Test';
import html2pdf from "html2pdf.js"

export default function WordSearchGamePDF() {
  const puzzleRef = useRef<HTMLDivElement>(null);

  // const generatePDF = async () => {
  //   if (!puzzleRef.current) return;

  //   // Capture the element at a higher resolution
  //   // const canvas = await html2canvas(puzzleRef.current); // Increase scale for better clarity
  //   const canvas = await html2canvas(puzzleRef.current, {
  //     scale: 1, // Increase this value for better quality
  //     useCORS: true,
  //     logging: true,
  //     backgroundColor: null
  //   });
  //   const imgData = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF("p", "mm", "a4");

  //   const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width in mm
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio

  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save("wordsearch.pdf");
  // };
  const generatePDF = () => {
    if (!puzzleRef.current) return;

    const opt = {
      margin: 1,
      filename: 'wordsearch.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(puzzleRef.current).save();
  };

  return (
    <div className="p-4">
      <button
        onClick={generatePDF}
        className="mb-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
      >
        Download as PDF
      </button>

      {/* Wrap the content to be captured */}
      <div ref={puzzleRef}>
        <Test />
        {/* Your existing WordSearchGame component can be placed here */}
        <WordSearchGame />
      </div>
    </div>
  );
}
