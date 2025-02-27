import React, { useEffect, useContext } from "react";
import VoterCard from "../components/voterCard/voterCard";
import Style from "../styles/voterList.module.css";
import { VotingContext } from "../context/Voter";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import autoTable for structured tables

const VoterList = () => {
  const { getAllVoterData, voterArray } = useContext(VotingContext);

  useEffect(() => {
    getAllVoterData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Election Details", 105, 15, null, null, "center");
    
    // Candidate Information (Example)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Winner Details", 30, 25); // Set the title for the winner section
    doc.setFont("helvetica", "normal");
    doc.text("Candidate Name: Modi", 20, 35);
    doc.text("Party: BJP", 20, 45);
    doc.text("Election Date: 18th Feb 2025", 20, 55);
  
    // Add space before Voter Table
    doc.setFont("helvetica", "bold");
    doc.text("Voter List", 105, 65, null, null, "center");
  
    // Voter Table Headers & Data
    const headers = [["Name", "Address", "Age", "Voting Status"]];
    const data = voterArray.map((voter) => [
      voter.name || "N/A",
      voter.address || "N/A",
      voter.age ? voter.age.toString() : "N/A",
      voter.votingStatus ? "Voted" : "Not Voted",
    ]);
  
    // Use autoTable for better formatting
    doc.autoTable({
      head: headers,
      body: data,
      startY: 70, // Start below the title
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 40 }, // Name
        1: { cellWidth: 70 }, // Address
        2: { cellWidth: 20 }, // Age
        3: { cellWidth: 40 }, // Voting Status
      },
    });
  
    // Save PDF
    doc.save("Election_Details.pdf");
  };
  

  return (
    <div className={Style.voterList}>
      <button onClick={generatePDF} className={Style.printButton}>
        Print
      </button>
      <VoterCard voterArray={voterArray} />
    </div>
  );
};

export default VoterList;
