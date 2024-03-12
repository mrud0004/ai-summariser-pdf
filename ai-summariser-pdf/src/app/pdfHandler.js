import {jsPDF} from 'jspdf';


export const downloadPDF = (summaries) =>{
    const doc = new jsPDF();


    summaries.forEach((summary,index) => {

        doc.setFontSize(16);
        doc.text(`Page ${index+1}`,10,10) + (index * 10);
        doc.setFontSize(12);
        doc.text(summary,10,20+(index*10));

        if (index < summaries.length -1){
            doc.addPage();
        }

    });

    doc.save("gptSummaries.pdf")




}