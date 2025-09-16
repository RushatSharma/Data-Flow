import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table.jsx";
import { Database, Download, ArrowLeft, FileText, Loader2 } from "lucide-react";

export default function ResultsPage() {
  const [resultsData, setResultsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedResults = sessionStorage.getItem("dataFlowResults");
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

  const downloadInsightsCSV = () => {
    if (!resultsData?.insights || resultsData.insights.length === 0) return;

    const escapeCell = (cell) => {
      const cellStr = String(cell ?? '');
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    };

    let csvContent = "";
    resultsData.insights.forEach(insight => {
      csvContent += `"${insight.title}"\n`;
      csvContent += insight.headers.map(escapeCell).join(",") + "\n";
      csvContent += insight.rows.map(row => 
        row.map(escapeCell).join(",")
      ).join("\n");
      csvContent += "\n\n";
    });

    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" }); 
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data-flow-insights-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
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
    link.download = "data-flow-structure.csv";
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
          <p className="text-muted-foreground text-sm mb-4">- {insight.summary}</p>
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
      {/* --- HEADER WITH RESPONSIVE FIXES --- */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/data_15198758.png" alt="Data Flow Logo" className="w-8 h-8" />
            <span className="text-lg sm:text-xl font-bold">Data Flow</span>
          </Link>
          <div className="flex items-center space-x-2">
            {structure ? (
              <Button onClick={downloadStructureCSV} size="sm">
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Export Structure</span>
              </Button>
            ) : (
              <Button onClick={downloadInsightsCSV} size="sm">
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Export Insights</span>
              </Button>
            )}
            <Link to="/upload">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Process More</span>
              </Button>
            </Link>
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