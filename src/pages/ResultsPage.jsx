import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "/src/components/ui/Button.jsx";
import { Card } from "/src/components/ui/Card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/Table.jsx";
import { Database, Download, ArrowLeft, FileText, Loader2 } from "lucide-react";

export default function ResultsPage() {
  const [resultsData, setResultsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedResults = sessionStorage.getItem("datrixResults");
      if (storedResults) {
        setResultsData(JSON.parse(storedResults));
      } else {
        navigate('/upload');
      }
    } catch (error) {
      console.error("Failed to parse results", error);
      navigate('/upload');
    }
    setIsLoading(false);
  }, [navigate]);

  // ENHANCED function to create a professionally formatted CSV
  const downloadInsightsCSV = () => {
    if (!resultsData?.insights || resultsData.insights.length === 0) return;

    // Helper function to safely format a cell for CSV
    const escapeCell = (cell) => {
      const cellStr = String(cell ?? '');
      // If the cell contains a comma, double quote, or newline, wrap it in double quotes.
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        // Escape existing double quotes by doubling them up
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    };

    let csvContent = "";

    resultsData.insights.forEach(insight => {
      // Add the title, spanning across the first column
      csvContent += `"${insight.title}"\n`;
      
      // Add the table headers
      csvContent += insight.headers.map(escapeCell).join(",") + "\n";
      
      // Add the table rows
      csvContent += insight.rows.map(row => 
        row.map(escapeCell).join(",")
      ).join("\n");
      
      // Add two blank lines for clear separation
      csvContent += "\n\n";
    });

    // Added BOM for better Excel compatibility with special characters
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" }); 
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "datrix-insights-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Also updating the structure download function for consistency
  const downloadStructureCSV = () => {
    if (!resultsData?.structure) return;
    const { headers, rows } = resultsData.structure;

    const escapeCell = (cell) => {
        const cellStr = String(cell ?? '');
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
    };

    const headerRow = headers.map(escapeCell).join(",");
    const rowData = rows.map(row => row.map(escapeCell).join(",")).join("\n");
    const csvContent = `${headerRow}\n${rowData}`;
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "datrix-structure.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || !resultsData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }

  const { structure, insights } = resultsData;

  const renderStructure = () => (
    <Card className="mt-4 p-0 overflow-hidden">
      <Table>
        <TableHeader><TableRow>{structure.headers.map((h, i) => <TableHead key={i}>{h}</TableHead>)}</TableRow></TableHeader>
        <TableBody>{structure.rows.map((row, i) => (<TableRow key={i}>{row.map((cell, j) => <TableCell key={j}>{String(cell ?? '')}</TableCell>)}</TableRow>))}</TableBody>
      </Table>
    </Card>
  );

  const renderInsights = () => (
    <div className="space-y-8 mt-4">
      {insights.map((insight, index) => (
        <div key={index}>
          <h3 className="text-xl font-semibold mb-2">{insight.title}</h3>
          <p className="text-muted-foreground text-sm mb-4"> - {insight.summary}</p>
          <Card className="p-0 overflow-hidden">
            <Table>
              <TableHeader><TableRow>{insight.headers.map((h, i) => <TableHead key={i}>{h}</TableHead>)}</TableRow></TableHeader>
              <TableBody>{insight.rows.map((row, i) => (<TableRow key={i}>{row.map((cell, j) => <TableCell key={j}>{String(cell ?? '')}</TableCell>)}</TableRow>))}</TableBody>
            </Table>
          </Card>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center"><Database className="w-5 h-5 text-accent-foreground" /></div>
            <span className="text-xl font-bold">Datrix</span>
          </Link>
          <div className="flex items-center space-x-2">
            {structure ? (
              <Button onClick={downloadStructureCSV} size="sm"><Download className="w-4 h-4 mr-2" /> Export Structure</Button>
            ) : (
              <Button onClick={downloadInsightsCSV} size="sm"><Download className="w-4 h-4 mr-2" /> Export Insights</Button>
            )}
            <Link to="/upload"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Process More</Button></Link>
          </div>
        </div>
      </header>

      <main className="py-8 px-4 container mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-3">
            <FileText className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-2xl font-bold">Processing Complete</h1>
              <p className="text-muted-foreground">{structure ? 'Data has been structured.' : 'Insights have been generated.'}</p>
            </div>
          </div>
        </div>
        
        {structure ? renderStructure() : renderInsights()}
      </main>
    </div>
  );
}