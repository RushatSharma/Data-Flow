import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Database, ArrowLeft, FileText, Trash2, Calendar, BarChart3, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { db } from "../lib/firebase.js";
import { collection, query, onSnapshot, doc, deleteDoc, writeBatch, orderBy } from "firebase/firestore";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      // Create a query to get history documents for the current user, ordered by date
      const historyCollectionRef = collection(db, "users", user.uid, "history");
      const q = query(historyCollectionRef, orderBy("processedAt", "desc"));

      // onSnapshot listens for real-time updates from Firestore
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const historyData = [];
        querySnapshot.forEach((doc) => {
          historyData.push({ id: doc.id, ...doc.data() });
        });
        setHistory(historyData);
        setLoadingHistory(false);
      }, (error) => {
        console.error("Error fetching history: ", error);
        setLoadingHistory(false);
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
    }
  }, [isAuthenticated, user, navigate]);

  const handleRemoveRecord = async (id) => {
    if (!user) return;
    const recordRef = doc(db, "users", user.uid, "history", id);
    await deleteDoc(recordRef);
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all upload history?")) {
      const historyCollectionRef = collection(db, "users", user.uid, "history");
      const batch = writeBatch(db);
      history.forEach((record) => {
        const docRef = doc(historyCollectionRef, record.id);
        batch.delete(docRef);
      });
      await batch.commit();
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  const formatFileSize = (bytes) => (bytes / 1024).toFixed(1) + " KB";

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center"><Database className="w-5 h-5 text-accent-foreground" /></div>
            <span className="text-xl font-bold">Datrix</span>
          </Link>
          <div className="flex items-center space-x-2">
            {history.length > 0 && <Button variant="outline" size="sm" onClick={handleClearAll}><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>}
            <Link to="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
          </div>
        </div>
      </header>
      <main className="py-8 px-4 container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload History</h1>
          <p className="text-muted-foreground">Your recent data processing sessions.</p>
        </div>
        {loadingHistory ? (
            <div className="flex justify-center items-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        ) : history.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Upload History</h2>
            <p className="text-muted-foreground mb-6">You haven't processed any data yet.</p>
            <Link to="/upload"><Button>Process Your First File</Button></Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((record) => (
              <Card key={record.id} className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0"><FileText className="w-6 h-6 text-accent" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold truncate">{record.fileName || "Text Input"}</h3>
                        <Badge variant={record.type === "file" ? "default" : "secondary"}>{record.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{record.preview}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(record.processedAt)}</span>
                        <span className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4" />{record.rowCount} rows</span>
                        {record.type === 'file' && <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" />{formatFileSize(record.size)}</span>}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveRecord(record.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}