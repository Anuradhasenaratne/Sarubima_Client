const downloadReport = async (request, userData) => {
  try {
    // Dynamically import jsPDF and any plugins
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    // Create document with better dimensions
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Set margins and initial position
    const margin = 15;
    let y = margin;

    // ---------- Header with Gradient Background ----------
    doc.setFillColor(34, 139, 34);  // Forest green
    doc.rect(0, 0, 210, 30, "F");
    
    // Add a subtle pattern to header
    doc.setDrawColor(46, 160, 46);
    for (let i = 0; i < 210; i += 5) {
      doc.line(i, 0, i, 30);
    }

    // Logo/Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("SARUBIMA.LK", 105, 15, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("Soil Test Analysis Report", 105, 25, { align: "center" });

    y = 40;

    // ---------- Summary Box ----------
    doc.setFillColor(240, 255, 240);  // Very light green
    doc.roundedRect(margin, y, 180, 30, 3, 3, "F");
    doc.setDrawColor(200, 230, 200);
    doc.roundedRect(margin, y, 180, 30, 3, 3, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 100, 0);
    doc.text("REPORT SUMMARY", margin + 5, y + 8);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Request ID: ST-${request._id?.slice(-4).toUpperCase() || "N/A"}`, margin + 10, y + 16);
    doc.text(`Date: ${request.createdAt ? formatDate(request.createdAt) : "N/A"}`, margin + 10, y + 22);
    doc.text(`District: ${request.district || "N/A"}`, 105, y + 16);
    doc.text(`Land Size: ${request.landSize || "N/A"} ${request.landUnit || ""}`, 105, y + 22);

    y += 40;

    // ---------- Farmer Information ----------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 0);
    doc.text("FARMER INFORMATION", margin, y);
    y += 8;

    doc.setDrawColor(200, 230, 200);
    doc.line(margin, y, 195, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Name: ${userData?.name || "N/A"}`, margin, y);
    y += 6;
    doc.text(`Contact: ${userData?.phone || userData?.email || "N/A"}`, margin, y);
    y += 6;
    
    if (userData?.address) {
      const addressLines = doc.splitTextToSize(`Address: ${userData.address}`, 170);
      doc.text(addressLines, margin, y);
      y += (addressLines.length * 5) + 5;
    } else {
      y += 5;
    }

    // ---------- Soil Parameters Table ----------
    if (request.soilTestResult) {
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 100, 0);
      doc.text("SOIL ANALYSIS RESULTS", margin, y);
      y += 8;
      
      doc.setDrawColor(200, 230, 200);
      doc.line(margin, y, 195, y);
      y += 10;

      // Create soil parameters table
      const soilData = [
        ["Parameter", "Value", "Status"],
        ["pH Level", request.soilTestResult.ph || "N/A", getStatus(request.soilTestResult.ph, 6.0, 7.5)],
        ["Moisture", request.soilTestResult.moisture ? `${request.soilTestResult.moisture}%` : "N/A", getStatus(request.soilTestResult.moisture, 25, 60)],
        ["Conductivity", request.soilTestResult.conductivity || "N/A", "N/A"],
        ["Organic Matter", request.soilTestResult.woil ? `${request.soilTestResult.woil}%` : "N/A", getStatus(request.soilTestResult.woil, 3, 6)],
        ["Sunlight Exposure", request.soilTestResult.sunlight || "N/A", "N/A"],
      ];

      doc.autoTable({
        startY: y,
        head: [soilData[0]],
        body: soilData.slice(1),
        theme: 'grid',
        headStyles: {
          fillColor: [34, 139, 34],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 255, 240]
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        margin: { left: margin, right: margin }
      });

      y = doc.lastAutoTable.finalY + 10;

      // ---------- Recommended Crops ----------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 100, 0);
      doc.text("RECOMMENDED CROPS", margin, y);
      y += 8;
      
      doc.setDrawColor(200, 230, 200);
      doc.line(margin, y, 195, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      if (Array.isArray(request.soilTestResult.recommendedCrops) && request.soilTestResult.recommendedCrops.length > 0) {
        // Create a visually appealing list of crops
        const cropsPerRow = 2;
        const boxWidth = 85;
        const boxHeight = 25;
        const spacing = 10;
        
        request.soilTestResult.recommendedCrops.forEach((crop, index) => {
          const row = Math.floor(index / cropsPerRow);
          const col = index % cropsPerRow;
          
          const x = margin + (col * (boxWidth + spacing));
          const currentY = y + (row * (boxHeight + 5));
          
          if (currentY + boxHeight > 270) {
            doc.addPage();
            y = margin;
            // Redraw on new page if needed
          }
          
          // Draw crop box with subtle background
          doc.setFillColor(245, 255, 245);
          doc.roundedRect(x, currentY, boxWidth, boxHeight, 3, 3, "F");
          doc.setDrawColor(200, 230, 200);
          doc.roundedRect(x, currentY, boxWidth, boxHeight, 3, 3, "S");
          
          // Add crop icon (using text as icon placeholder)
          doc.setFontSize(12);
          doc.setTextColor(0, 100, 0);
          doc.text("🌱", x + 5, currentY + 8);
          
          // Add crop name
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          const cropName = doc.splitTextToSize(crop, boxWidth - 15);
          doc.text(cropName, x + 15, currentY + 8);
        });
        
        y = doc.lastAutoTable.finalY + (Math.ceil(request.soilTestResult.recommendedCrops.length / cropsPerRow) * (boxHeight + 5)) + 10;
      } else {
        doc.text("No specific crop recommendations available based on soil analysis.", margin, y);
        y += 10;
      }

      // ---------- Additional Notes ----------
      if (request.soilTestResult.notes) {
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(0, 100, 0);
        doc.text("ADDITIONAL NOTES", margin, y);
        y += 8;
        
        doc.setDrawColor(200, 230, 200);
        doc.line(margin, y, 195, y);
        y += 10;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);

        // Notes in a bordered box
        doc.setFillColor(252, 252, 252);
        doc.setDrawColor(200, 230, 200);
        doc.roundedRect(margin, y, 180, 40, 3, 3, "FD");
        
        const splitNotes = doc.splitTextToSize(request.soilTestResult.notes, 170);
        doc.text(splitNotes, margin + 5, y + 7);
        y += 50;
      }
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(120, 0, 0);
      doc.text("Soil test results are not available yet.", margin, y);
      y += 10;
    }

    // ---------- Footer ----------
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer line
      doc.setDrawColor(150, 150, 150);
      doc.line(margin, 275, 195, 275);
      
      // Footer text
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 105, 280, { align: "center" });
      doc.text("Generated by Sarubima.lk - Soil Health Management System", 105, 285, { align: "center" });
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 290, { align: "center" });
    }

    // ---------- Save PDF ----------
    doc.save(`Soil_Test_Report_${userData?.name || "Farmer"}_${request._id?.slice(-4).toUpperCase() || "N/A"}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF report. Please try again.");
  }
};

// Helper function to format dates
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to determine status based on value range
function getStatus(value, min, max) {
  if (value === undefined || value === null) return "N/A";
  if (value < min) return "Low";
  if (value > max) return "High";
  return "Optimal";
}