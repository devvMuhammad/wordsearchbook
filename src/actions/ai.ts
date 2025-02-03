'use server';
import {GoogleGenerativeAI, SchemaType} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash","generationConfig":{
  responseMimeType: "application/json",
  responseSchema:{
    description: "Return: list[str]",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.STRING
    },
  }
} 
});

export async function Gemini(wordsCount:number, topic:string): Promise<string[]> {
  const prompt = 
  `Generate exactly ${wordsCount} distinct words related to the topic: "${topic}".  
  The words must meet the following criteria:  
  - Each word must be a **single** standalone word (not a phrase or compound word).  
  - The words must be in **UPPERCASE**.  
  - Only alphabetic characters are allowed (no numbers, apostrophes, spaces, underscores, or special characters).  
  - The words should be commonly recognized and meaningful in the given topic.  

  Return a valid JSON array of strings following this schema:  
  { "words": list[str] }  
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text()) as string[];
}
