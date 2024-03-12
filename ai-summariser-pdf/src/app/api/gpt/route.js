import { NextResponse } from "next/server";
import OpenAI from 'openai';


export async function POST(req) {

  const {textPages} = await req.json();


    const openai = new OpenAI({
       apiKey:process.env.OPENAI_API_KEY
    })

    let gptResponses = [];

    try{

    for (const text of textPages){

    const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a pdf summarising bot, and I will provide you with extensive text of a pdf,\
     please summarise it in 150 words, focusing on key points with dot points. It should be very readable and intuitive." },
    {role:"user",content: text}
    ],
    model: "gpt-3.5-turbo",
  });
  console.log("Completion",completion.choices[0])

  if (completion.choices && completion.choices.length >0){
    gptResponses.push(completion.choices[0].message.content);
  }else{
    gptResponses.push("No response from OpenAI")
  }
}
  console.log("Completion",gptResponses)

} catch (error){
  console.error("Issue with OpenAi Model Completion",error);
}

  return new Response(JSON.stringify({gptResponses}),{
    status: 200,
    headers: {
      "Content-Type": "application/json"
    },

  });
}