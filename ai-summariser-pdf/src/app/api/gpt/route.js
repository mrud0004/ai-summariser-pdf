import { NextResponse } from "next/server";
import OpenAI from 'openai';


export async function POST(request) {

    console.log(process.env.OPENAI_API_KEY)
    const openai = new OpenAI({
       apiKey:process.env.OPENAI_API_KEY
    })


   const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a pdf summarising bot, and I will provide you with extensive text of a pdf,\
     please summarise it in 200 words, focusing on key points with dot points. It should be very readable and intuitive." },
    {role:"user",content: "what is the meaning of life?"}
],
    model: "gpt-3.5-turbo",
  });

  console.log("Completion",completion.choices[0])

  return NextResponse.json(completion.choices[0]);
}