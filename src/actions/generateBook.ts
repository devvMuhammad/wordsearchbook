"use server";

import { Gemini } from "./ai";
import { generateWordSearch } from "./generateWordSearch";

export async function generateBook({
  pagesCount,wordsCountPerPuzzle,topic
}:{
  pagesCount:number;
  paperFormat?:"A4" | "A5";
  wordsCountPerPuzzle:number;
  topic:string;
}) {
  
  console.log(`Generating ${pagesCount} pages of word search puzzles with ${wordsCountPerPuzzle} words per puzzle related to the topic: ${topic}`);

  const words = await Gemini(pagesCount * wordsCountPerPuzzle,topic)
  console.log("words coming from gemini",words);
  const allGeneratedPuzzles = [];
  
  for(let i=0;i<pagesCount;i++){
    const result = await generateWordSearch(words.slice(i*wordsCountPerPuzzle, (i+1)*wordsCountPerPuzzle), 15);
    allGeneratedPuzzles.push(result);
  }

  return allGeneratedPuzzles;

}