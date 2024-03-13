'use client';
import styles from "./page.module.css";
import { useState } from "react";
import {downloadPDF} from './pdfHandler';
import Head from 'next/head';

export default function Home(){
    const [text, setText] = useState('');
    const [summaries, setSummaries] = useState('');
    const [key, setKey] = useState('');

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

      <Head>
      <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>AI PDF Summariser Tool</h1>

      <label className = {styles.customFileUpload}> 
      <input type="file"
       id="file" 
       onChange={onFileChange}
       name = 'file'
       

        accept = ".pdf"/>
        
        </label>

      <input
      type="text"
      value={key}
      onChange={(e) => setKey(e.target.value)}
      placeholder="Enter your API key"
      className={styles.apiKeyInput}
      />  



      <button className = {styles.button}
      
     onClick={async() => {

      if (!text || !Array.isArray(text) || text.length === 0){
        alert("Please upload a file first.")
        return;


      }

      if (!key.trim()){
        alert("Please enter your API key")
        return;

      }

      

      

      
      

      const response = await fetch("/api/gpt",{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          textPages: text,
          apiKeyUser: key
        }),
      });
      const gptResponse = await response.json();

      setSummaries(gptResponse.gptResponses);
      
     }}
      >
        Summarise PDF

      </button>

      <button className = {styles.downloadButton} onClick={() => downloadPDF(summaries)}>Download Summarised PDF</button>
      
      
      </main>
    )
}

