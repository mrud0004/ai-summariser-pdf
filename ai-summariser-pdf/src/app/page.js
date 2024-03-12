'use client';
import styles from "./page.module.css";
import { useState } from "react";
import {downloadPDF} from './pdfHandler';

export default function Home(){
    const [text, setText] = useState('');
    const [summaries, setSummaries] = useState('');

    function onFileChange(event){
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = onLoadFile;
      fileReader.readAsArrayBuffer(file);

    }

      async function onLoadFile(event){
        const typedarray = new Uint8Array(event.target.result);

        try{
        const pdf = await pdfjsLib.getDocument({data: typedarray }).promise;

        const numPages = pdf.numPages;
        const pageText = new Array(numPages);


          let i  = 0;

          for (let pageNum = 1; pageNum <= numPages; pageNum++){
          const page = await pdf.getPage(pageNum)
          const content = await page.getTextContent();
          let outputText = content.items.map(item => item.str).join(' ');   

          pageText[i] = outputText;
          i++;
          }
         
          setText(pageText);
        }catch (error){
          console.error("Issue with processing PDF",error);
        }  
    }
      

    return (
      <main className={styles.main} >

      <h1>AI PDF Summariser Tool</h1>

      <label className = {styles.customFileUpload}> 
      <input type="file"
       id="file" 
       onChange={onFileChange}
       name = 'file'

        accept = ".pdf"/>
        Choose a PDF file
        </label>



      <button className = {styles.button}
      
     onClick={async() => {

      if (!text || !Array.isArray(text) || text.length === 0){
        console.error("No Text to send")
        return;


      }

      console.log(text)
      

      const response = await fetch("/api/gpt",{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          textPages: text
        }),
      });
      const gptResponse = await response.json();

      console.log(gptResponse.gptResponses)

      setSummaries(gptResponse.gptResponses);
      
     }}
      >
        Summarise PDF

      </button>

      <button onClick={() => downloadPDF(summaries)}>Download Summarised PDF</button>
      
      
      </main>
    )
}

