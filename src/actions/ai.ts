'use server';
import {GoogleGenerativeAI, SchemaType} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash","generationConfig":{
  responseMimeType: "application/json",
  responseSchema:{
    description: "Return: list[str]",
    type: SchemaType.ARRAY,
    items:{
      type: SchemaType.OBJECT,
      properties:{
        topic: {type: SchemaType.STRING},
        words: {type: SchemaType.ARRAY, items:{type: SchemaType.STRING}}
      }
    }
  }
} 
});

export async function Gemini(pagesCount:number, wordsPerPage:number, topic:string): Promise<{data:{topic:string;words:string[]}[], error:null}| {data:null, error:string}> {
  try {

  const prompt = 
  `Generate ${pagesCount} popular subtopics about this topic: ${topic} and generate ${wordsPerPage} random words for each subtopic.
  For example, if the topic is "Islam", the subtopics could be "Quran", "Prophet Muhammad", "Five Pillars of Islam", etc.
  - Each word should be a single word, not a phrase.
  - In a subtopic, the words should be unique.
  
  Return a valid JSON array of objects following this schema:  
  [{topic:string; words:string[]}]
  `;

  const result = await model.generateContent(prompt);

  return {data:JSON.parse(result.response.text()), error:null};
  } catch (err){
    console.log("error while generating random words from gemini", err)
    return {data:null, error: (err as Error).message};
  }
}
