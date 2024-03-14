'use client';
import styles from "./page.module.css";
import { useState } from "react";
import {downloadPDF} from './pdfHandler';
import Head from 'next/head';

export default function Home(){
    const [text, setText] = useState('');
    const [summaries, setSummaries] = useState('');
    const [keyValue, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false)

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

      



      <div className={styles.formWrapper}>
      <label className = {styles.customFileUpload}> 
      <input type="file"
       id="file" 
       onChange={onFileChange}
       name = 'file'
       

        accept = ".pdf"/>
        
        </label>


      <div className={styles.inputGroup}>
      <input
      type="text"
      value={keyValue}
      onChange={(e) => setKey(e.target.value)}
      placeholder="Enter your API key"
      className={styles.apiKeyInput}
      />  
      <a href="https://www.maisieai.com/help/how-to-get-an-openai-api-key-for-chatgpt" target="_blank" rel="noopener noreferrer" className={styles.APILink}>
      How to get your OpenAiKey
        </a>
      </div>




      <button className = {styles.button}
      
     onClick={async() => {

      if (!text || !Array.isArray(text) || text.length === 0){
        alert("Please upload a file first.")
        return;


      }

      if (!keyValue.trim()){
        alert("Please enter your API key")
        return;

      }

      if (keyValue.slice(0,3) !== "sk-"){ 
        alert("Please enter a valid API key")
        return;
      }

      setIsLoading(true);

      const response = await fetch("/api/gpt",{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          textPages: text,
          apiKeyUser: keyValue
        }),
      });
      const gptResponse = await response.json();

      setSummaries(gptResponse.gptResponses);
      setIsLoading(false);
      
     }}
      >
        Summarise PDF

      </button>

      {isLoading ? (
       <div className={styles.loader}></div>  
      ) : (
        summaries && (
          <button className={styles.downloadButton} onClick={() => downloadPDF(summaries)}>
            Download Summarised PDF
          </button>
        )
      )}

      </div>
      
      
      </main>
    )
}

