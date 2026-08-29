/**
 * Export Utility for Republic Insurance Reports
 * Supports Excel (.csv download) and Printable PDF Export
 */

export function exportToExcel(columns = [], rows = [], filename = "republic_insurance_report") {
  if (!rows || !rows.length) {
    if (typeof window !== "undefined") {
      alert("No data available to export.");
    }
    return;
  }

  const csvRows = [];

  // Header row
  if (columns && columns.length) {
    csvRows.push(columns.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","));
  }

  // Data rows
  rows.forEach((row) => {
    const values = Array.isArray(row) ? row : Object.values(row);
    csvRows.push(values.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const cleanFilename = `${filename.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", cleanFilename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(reportTitle, columns = [], rows = [], summary = {}) {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    alert("Please allow popups to generate the PDF report.");
    return;
  }

  const summaryHtml = Object.entries(summary)
    .map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`)
    .join("");

  const columnsHtml = columns.map((col) => `<th style="padding: 10px; border: 1px solid #CBD5E1; background: #F1F5F9; font-size: 12px; font-weight: bold; text-align: left;">${col}</th>`).join("");

  const rowsHtml = rows
    .map((row) => {
      const values = Array.isArray(row) ? row : Object.values(row);
      const cells = values.map((val) => `<td style="padding: 8px 10px; border: 1px solid #E2E8F0; font-size: 12px;">${val ?? "-"}</td>`).join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle} - Republic Insurance Limited</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #0F172A; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1E3A8A; padding-bottom: 15px; margin-bottom: 20px; }
          .company-title { font-size: 22px; font-weight: bold; color: #1E3A8A; }
          .report-title { font-size: 16px; font-weight: bold; color: #334155; margin-top: 5px; }
          .meta { font-size: 12px; color: #64748B; text-align: right; }
          .summary-box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px; margin-bottom: 20px; display: flex; gap: 20px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          tr:nth-child(even) { background-color: #F8FAFC; }
          .footer { margin-top: 40px; font-size: 10px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 10px; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="company-title">REPUBLIC INSURANCE LIMITED</div>
            <div class="report-title">${reportTitle}</div>
          </div>
          <div class="meta">
            <div>Generated: ${dateStr}</div>
            <div>Confidential Management Report</div>
          </div>
        </div>

        ${summaryHtml ? `<div class="summary-box">${summaryHtml}</div>` : ""}

        <table>
          <thead>
            <tr>${columnsHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          Republic Insurance Limited • Official Executive Management Report
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
