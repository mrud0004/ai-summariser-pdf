import { NextResponse } from "next/server";
import OpenAI from 'openai';


export async function POST(request) {


    const openai = new OpenAI({
       apiKey =  
    })




  return NextResponse.json({ 
   name: "Hello, World!" 
});
}