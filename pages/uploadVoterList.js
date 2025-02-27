import { useState } from "react";
import * as XLSX from "xlsx";  // For Excel files
import pdfParse from "pdf-parse"; // For PDF files

const UploadVoterList = ({ setVoterList }) => {
  const [file, setFile] = useState(null);

  // Function to read file and extract data
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);

      if (uploadedFile.name.endsWith(".xlsx") || uploadedFile.name.endsWith(".xls")) {
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setVoterList(json);  // Save voter list in state/context
      } else if (uploadedFile.name.endsWith(".pdf")) {
        const pdfData = await pdfParse(data);
        const pdfText = pdfData.text.split("\n").map((line) => line.trim());
        setVoterList(pdfText);  // Save PDF data (modify parsing as needed)
      }
    };

    if (uploadedFile.name.endsWith(".pdf")) {
      reader.readAsArrayBuffer(uploadedFile);
    } else {
      reader.readAsArrayBuffer(uploadedFile);
    }
  };

  return (
    <div>
      <h2>Upload Voter List (Excel/PDF)</h2>
      <input type="file" accept=".xlsx, .xls, .pdf" onChange={handleFileUpload} />
    </div>
  );
};

export default UploadVoterList;
