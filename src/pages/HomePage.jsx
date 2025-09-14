import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "/src/components/ui/Button.jsx";
import { Card } from "/src/components/ui/Card.jsx";
import { FileText, Database, BarChart2, Upload, Menu, X, Play, Wand2, Download, Star, Mail } from "lucide-react";
import { UserMenu } from "/src/components/UserMenu.jsx";
import { useAuth } from "/src/hooks/useAuth.js";
import { ThemeToggle } from "/src/components/ThemeToggle.jsx";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Datrix</span>
          </Link>

          <div className="flex items-center space-x-2">
             <div className="hidden md:flex items-center space-x-2">
                <ThemeToggle />
                {isAuthenticated ? (
                    <UserMenu />
                ) : (
                    <>
                        <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                        <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
                    </>
                )}
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto px-4 py-4 space-y-2">
               {isAuthenticated ? (
                 <UserMenu />
               ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Link to="/login"><Button variant="ghost" className="w-full justify-start">Sign In</Button></Link>
                  <Link to="/signup"><Button className="w-full">Sign Up</Button></Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section - ICONS ADDED BACK */}
        <section className="relative min-h-[calc(100vh-65px)] flex items-center py-20 px-4 text-center">
          {/* Background Icons */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-50">
            <FileText className="absolute top-[15%] left-[10%] w-20 h-20 text-accent/30 animate-float" style={{animationDelay: '0s'}} />
            <Database className="absolute top-[25%] right-[12%] w-24 h-24 text-accent/40 animate-[float_5s_ease-in-out_infinite]" style={{animationDelay: '1s'}} />
            <Mail className="absolute bottom-[20%] left-[20%] w-16 h-16 text-accent/20 animate-[float_6s_ease-in-out_infinite]" style={{animationDelay: '2s'}} />
            <Upload className="absolute bottom-[10%] right-[10%] w-20 h-20 text-accent/35 animate-[float_7s_ease-in-out_infinite]" style={{animationDelay: '3s'}} />
            <BarChart2 className="absolute top-[50%] left-[5%] w-18 h-18 text-accent/25 animate-[float_4s_ease-in-out_infinite]" style={{animationDelay: '0.5s'}} />
            <Wand2 className="absolute bottom-[35%] right-[5%] w-18 h-18 text-accent/30 animate-[float_5.5s_ease-in-out_infinite]" style={{animationDelay: '1.5s'}} />
          </div>

          <div className="container mx-auto relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span>Structure Your Data,</span>
              <br />
              <span> Unlock Insights</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let Datrix handle the chaos and surface the insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/upload">
                <Button size="lg">
                  <Upload className="w-5 h-5 mr-2" /> Try Datrix Now
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={() => setShowDemo(true)}>
                <Play className="w-5 h-5 mr-2" /> Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">A Simple, Powerful Process</h2>
            <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">In just three simple steps, Datrix turns your messy data into a clean, usable format.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border mb-4 mx-auto">
                  <Upload className="w-8 h-8 text-accent"/>
                </div>
                <h3 className="text-2xl font-semibold mb-2">1. Upload Your Data</h3>
                <p className="text-base text-muted-foreground">Drag and drop your file or paste raw text. We support CSV, JSON, TXT, and more.</p>
              </Card>
              <Card className="p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border mb-4 mx-auto">
                  <Wand2 className="w-8 h-8 text-accent"/>
                </div>
                <h3 className="text-2xl font-semibold mb-2">2. Instant Structuring</h3>
                <p className="text-base text-muted-foreground">Our smart engine instantly analyzes, cleans, and organizes your data into a structured table.</p>
              </Card>
              <Card className="p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border mb-4 mx-auto">
                  <Download className="w-8 h-8 text-accent"/>
                </div>
                <h3 className="text-2xl font-semibold mb-2">3. Gain Insights</h3>
                <p className="text-base text-muted-foreground">View, analyze, and export your newly structured data as a clean CSV file with a single click.</p>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Loved by Users Everywhere</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8">
                <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />)}</div>
                <p className="mb-4 text-base text-muted-foreground italic">"Datrix saved me hours of manual data cleaning. I was able to process my survey results in minutes instead of days!"</p>
                <p className="text-lg font-semibold">— Sarah J., Market Analyst</p>
              </Card>
              <Card className="p-8">
                <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />)}</div>
                <p className="mb-4 text-base text-muted-foreground italic">"As a developer, I constantly deal with messy logs. This tool is a lifesaver for quickly parsing and making sense of them."</p>
                <p className="text-lg font-semibold">— Mike R., Software Engineer</p>
              </Card>
              <Card className="p-8">
                <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />)}</div>
                <p className="mb-4 text-base text-muted-foreground italic">"Incredibly simple and powerful. I didn't need to sign up or learn anything complex to get my data structured."</p>
                <p className="text-lg font-semibold">— David L., Small Business Owner</p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-xl mb-2">Is my data secure?</h3>
                <p className="text-base text-muted-foreground">Absolutely. Your data is processed entirely in your browser. Nothing is ever uploaded to our servers, ensuring your information remains private and secure.</p>
              </div>
              <div className="border-t pt-8">
                <h3 className="font-semibold text-xl mb-2">What is the maximum file size?</h3>
                <p className="text-base text-muted-foreground">For this demonstration project, we recommend processing files under 5MB for the best performance. All processing happens locally on your computer.</p>
              </div>
              <div className="border-t pt-8">
                <h3 className="font-semibold text-xl mb-2">What file formats are supported?</h3>
                <p className="text-base text-muted-foreground">We currently support `.txt` (plain text), `.csv` (Comma-Separated Values), and `.json` (JavaScript Object Notation) files, in addition to any text you paste directly.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 bg-muted/30 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Datrix. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDemo(false)}>
          <Card className="w-full max-w-2xl p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Datrix Demo</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowDemo(false)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Demo video placeholder</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}