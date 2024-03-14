import {jsPDF} from 'jspdf';


export const downloadPDF = (summaries) =>{
    const doc = new jsPDF();
    let yPosition = 10;


    summaries.forEach((summary,index) => {

        if (yPosition+ 10 >= 280){
            doc.addPage();
            yPosition = 10;
        }

        doc.setFontSize(16);
        doc.text(`Page ${index + 1}:`, 10, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        const lines = doc.splitTextToSize(summary,180);

        let textHeight = doc.getTextDimensions(lines).h;

        

        if (yPosition + textHeight >= 280){
            doc.addPage();
            yPosition = 10;
        }

        doc.text(lines,10,yPosition);

        yPosition += doc.getTextDimensions(lines).h + 10;

    });

    doc.save("gptSummaries.pdf")




}