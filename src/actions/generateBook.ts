"use server";

import { WordSearchResult } from "@/types";
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

  const topics = await Gemini(pagesCount , wordsCountPerPuzzle,topic)
  if(topics.error){
    throw new Error("Failed to generate topics from Gemini");
  }
  console.log("topics coming from gemini",topics);
  const allGeneratedPuzzles: WordSearchResult[] = [];

  topics.data?.forEach(async (topic) => {
    const words = topic.words;
    const puzzle = await generateWordSearch(topic.topic, words);
    allGeneratedPuzzles.push(puzzle);
  });

  return allGeneratedPuzzles;

}