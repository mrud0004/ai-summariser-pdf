'use client';
import styles from "./page.module.css";
import { useState } from "react";

export default function Home(){
    const [text, setText] = useState('');
    const [gptContent, setGptContent] = useState('');

    function onFileChange(event){
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = onLoadFile;
      fileReader.readAsArrayBuffer(file);

    }

      function onLoadFile(event){
        const typedarray = new Uint8Array(event.target.result);
        pdfjsLib.getDocument({
          data: typedarray
        }).promise.then((pdf) => {
          console.log("PDF loaded");
          pdf.getPage(1).then((page) =>{
            page.getTextContent().then((Content) =>{
              let outputText = '';
              Content.items.forEach((item) =>{
                outputText += item.str + ' ';
              });
              setText(outputText);
          });
        });
      });
    }
      

    return (
      <main className={styles.main} >

      <h1>AI Summariser</h1>
      <input type="file"
       id="file" 
       onChange={onFileChange}
       name = 'file'

        accept = ".pdf"/>



      <button
      
     onClick={async() => {

      const response = await fetch("/api/gpt",{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text
        }),
      });
      const gptResponse = await response.json();
      setGptContent(gptResponse.message.content);
     }}
      >

        Summarise PDF

      </button>
      <p>{gptContent}</p>
      </main>
    )
}

