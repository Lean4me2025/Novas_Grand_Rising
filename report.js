// PDF download of the report content
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("download-pdf");
  const target = document.getElementById("report-content");
  if(!btn || !target) return;

  btn.addEventListener("click", async () => {
    try{
      // Ensure fonts/layout settle
      await new Promise(r => setTimeout(r, 150));
      const canvas = await html2canvas(target, {scale: 2, useCORS: true});
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jspdf.jsPDF({orientation: "p", unit: "pt", format: "a4"});
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      // Fit image within page keeping aspect
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const w = canvas.width * ratio;
      const h = canvas.height * ratio;
      const x = (pageWidth - w) / 2;
      const y = 36;
      pdf.addImage(imgData, "PNG", x, y, w, h, undefined, "FAST");
      pdf.save("NOVA_Report.pdf");
    }catch(err){
      console.error(err);
      alert("Could not generate PDF. Try printing to PDF using your browser.");
    }
  });
});
