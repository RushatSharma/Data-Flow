import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Textarea } from "../components/ui/TextArea.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Label } from "../components/ui/Label.jsx";
import { Upload, FileText, Database, ArrowLeft, Loader2, Zap, XCircle } from "lucide-react";
import { getStructuredDataFromGemini, getInsightsFromGemini } from "../lib/geminiService.js";
import { useAuth } from "../hooks/useAuth.js";
import { db } from "../lib/firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { useUpload } from "../contexts/UploadContext.jsx";

export default function UploadPage() {
  const {
    selectedFile,
    textInput,
    handleSetFile,
    handleSetText,
    clearUpload,
    hasData
  } = useUpload();

  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [processingMode, setProcessingMode] = useState('structure');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleSetFile(file);
  };

  const handleTextInputChange = (e) => {
    handleSetText(e.target.value);
  }

  const saveHistoryRecord = async (recordData) => {
    if (!user) return;
    const historyCollectionRef = collection(db, "users", user.uid, "history");
    await addDoc(historyCollectionRef, recordData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasData) {
      alert("Please upload a file or enter text.");
      return;
    }
    setIsProcessing(true);

    try {
      const content = selectedFile ? await selectedFile.text() : textInput;
      let results;
      let recordToSave;

      if (processingMode === 'structure') {
        const structuredData = await getStructuredDataFromGemini(content);
        results = {
            structure: { ...structuredData, processedRows: structuredData.rows.length, type: 'ai-structured' },
            insights: null
        };
        recordToSave = {
            type: selectedFile ? 'file' : 'text',
            fileName: selectedFile?.name || null,
            size: selectedFile?.size || null,
            preview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            rowCount: structuredData.rows.length,
            processedAt: new Date().toISOString()
        };
      } else {
        const insightsData = await getInsightsFromGemini(content);
        results = { structure: null, insights: insightsData };
         recordToSave = {
            type: selectedFile ? 'file' : 'text',
            fileName: selectedFile?.name || null,
            size: selectedFile?.size || null,
            preview: `Generated ${insightsData.length} insight(s)`,
            rowCount: insightsData.reduce((acc, insight) => acc + insight.rows.length, 0),
            processedAt: new Date().toISOString()
        };
      }

      await saveHistoryRecord(recordToSave);
      sessionStorage.setItem("dataFlowResults", JSON.stringify(results));
      navigate("/results");

    } catch (error) {
      console.error("Processing error:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); else if (e.type === "dragleave") setDragActive(false); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) handleSetFile(e.dataTransfer.files[0]); };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
  <img src="/data_15198758.png" alt="Data Flow Logo" className="w-8 h-8" />
  <span className="text-xl font-bold">Data Flow</span>
</Link>
          <div className="flex items-center space-x-2">
            <Link to="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
          </div>
        </div>
      </header>
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">Upload Your Data</h1>
            <p className="text-lg text-muted-foreground">The same data will be used until you clear it or upload something new.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <Card className="p-6 flex-1 flex flex-col">
                <Label className="text-lg font-semibold block mb-4">Upload File</Label>
                <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-8 text-center flex-1 flex flex-col justify-center items-center transition-colors ${dragActive || selectedFile ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}>
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="w-12 h-12 text-accent mx-auto" />
                      <p className="text-base font-medium break-all">{selectedFile.name}</p>
                      <p className="text-base text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-lg font-medium">Drop files here or click to browse</p>
                      <p className="text-base text-muted-foreground">Supports .txt, .csv, .json</p>
                      <Input type="file" accept=".txt,.csv,.json" onChange={handleFileChange} className="hidden" id="file-upload" />
                      <Button type="button" variant="outline" asChild><Label htmlFor="file-upload" className="cursor-pointer text-base">Choose File</Label></Button>
                    </div>
                  )}
                </div>
              </Card>
              <Card className="p-6 flex-1 flex flex-col">
                <Label htmlFor="text-input" className="text-lg font-semibold block mb-4">Or Paste Text</Label>
                <Textarea id="text-input" placeholder="Paste unstructured data, logs, emails, or any text here..." value={textInput} onChange={handleTextInputChange} className="min-h-[80px] flex-1 resize-y" />
              </Card>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isProcessing || !hasData} onClick={() => setProcessingMode('structure')}>
                {isProcessing && processingMode === 'structure' ? <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Structuring...</> : <><Database className="w-6 h-6 mr-2" /> Structure Data</>}
              </Button>
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isProcessing || !hasData} onClick={() => setProcessingMode('insights')}>
                {isProcessing && processingMode === 'insights' ? <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Analyzing...</> : <><Zap className="w-6 h-6 mr-2" /> Generate Insights</>}
              </Button>
              
              {hasData && (
                <div className="w-full flex justify-center">
                  <Button type="button" variant="destructive" size="sm" onClick={clearUpload}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Clear Input
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}