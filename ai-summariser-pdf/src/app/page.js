'use client';
import styles from "./page.module.css";

export default function Home(){
    return (
      <main className={styles.main} >

      <button
     onClick={async() => {
      const response = await fetch("/api/gpt",{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          someData: true
        }),
      });
      console.log("Response",response)
     }}
      >

        Hit API

      </button>
      </main>
    )
}

