"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookInputsType } from "@/types";

const formSchema = z.object({
  topic: z.string().nonempty(),
  pagesPerPuzzle: z.number().min(1).max(100),
  paperSize: z.enum(["A4", "A5"]),
  downloadFormat: z.enum(["PDF", "DOCX", "PNG"]),
  wordsPerPuzzle: z.number().min(1).max(50),
});

type FormData = z.infer<typeof formSchema>;

export default function PuzzleForm({ onGenerate }: { onGenerate: (data: BookInputsType) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pagesPerPuzzle: 1,
      paperSize: "A4",
      downloadFormat: "PDF",
      wordsPerPuzzle: 10,
    },
  });

  const onSubmit = (data: FormData) => {
    onGenerate({ "pagesCount": data.pagesPerPuzzle, "paperFormat": data.paperSize, "wordsCountPerPuzzle": data.wordsPerPuzzle, "topic": data.topic });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-w-xl">
      <h1 className="text-xl font-bold">Enter the Details</h1>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Topic
        </label>
        <input
          type="text"
          placeholder="Enter a topic to generate words ..."
          {...register("topic")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.topic && (
          <p className="text-red-500 text-sm">{errors.topic?.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Number of Puzzles
        </label>
        <input
          type="number"
          {...register("pagesPerPuzzle", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.pagesPerPuzzle && (
          <p className="text-red-500 text-sm">{errors.pagesPerPuzzle.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Paper Size</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="A4"
              {...register("paperSize")}
              className="mr-2"
            />
            A4
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="A5"
              {...register("paperSize")}
              className="mr-2"
            />
            A5
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Download Format
        </label>
        <select
          {...register("downloadFormat")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="PDF">PDF</option>
          <option value="DOCX">DOCX</option>
          <option value="PNG">PNG</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Words per puzzle
        </label>
        <input
          type="number"
          {...register("wordsPerPuzzle", { valueAsNumber: true })}
          min={1}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.wordsPerPuzzle && (
          <p className="text-red-500 text-sm">{errors.wordsPerPuzzle.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Generate Puzzle
      </button>
    </form>
  );
}