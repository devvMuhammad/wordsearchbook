"use client";
import { UseFormReturn } from "react-hook-form";

type FormFieldsProps = {
  form: UseFormReturn<{
    topic: string;
    pagesPerPuzzle: number;
    downloadFormat: "PDF" | "DOCX" | "PNG";
    wordsPerPuzzle: number;
    colorMode: "colored" | "bw";
    paperFormat: "A4" | "A5";
    pageSize: {
      width: number;
      height: number;
    };
    showSolutions: boolean;
  }>;
  isGenerating: boolean;
  onSubmit: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FormFields({ form, onSubmit, isGenerating, onImageUpload }: FormFieldsProps) {
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-6 max-w-xl">
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
        <label className="block text-sm font-medium text-gray-700">Color Mode</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="bw"
              {...register("colorMode")}
              className="mr-2"
            />
            Black & White
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="colored"
              {...register("colorMode")}
              className="mr-2"
            />
            Colored
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paper Format
        </label>
        <select
          className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={form.watch("paperFormat")}
          onChange={(e) => form.setValue("paperFormat", e.target.value as "A4" | "A5")}
        >
          <option value="A4">A4</option>
          <option value="A5">A5</option>
        </select>
      </div>

      {/* <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Page Width (inches)</label>
          <input
            type="number"
            step="0.1"
            {...register("pageSize.width", {
              valueAsNumber: true,
              min: 1,
              max: 50
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.pageSize?.width && (
            <p className="text-red-500 text-sm">{errors.pageSize.width.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Page Height (inches)</label>
          <input
            type="number"
            step="0.1"
            {...register("pageSize.height", {
              valueAsNumber: true,
              min: 1,
              max: 50
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.pageSize?.height && (
            <p className="text-red-500 text-sm">{errors.pageSize.height.message}</p>
          )}
        </div>
      </div> */}

      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("showSolutions")}
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-md font-medium text-gray-700">Include Solutions</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="mt-1 block w-full"
        />
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating words...' : 'Generate Puzzle'}
      </button>
    </form>
  );
}