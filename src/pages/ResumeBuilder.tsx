import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  CheckCircle,
  Sparkles,
  ArrowRight,
  Star,
  Users,
  Target,
  Zap,
  Shield,
  Palette,
  FileUp,
  Copy,
  Share2,
  TrendingUp,
  Mic,
  MicOff,
  Square
} from "lucide-react";
import { useState, useRef } from "react";
import { motion } from 'framer-motion';
import Footer from "@/components/Footer";
import { Navbar } from "@/components/ui/navbar-menu";
import './OutlinedText.css';

const ResumeBuilder = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [activeField, setActiveField] = useState<string | null>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const buildingRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToTemplates = () => {
    templatesRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToBuilding = () => {
    buildingRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const startVoiceRecording = (fieldName: string) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setIsListening(true);
      setActiveField(fieldName);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setIsListening(false);
      setActiveField(null);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setIsListening(false);
      setActiveField(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const applyTranscript = (fieldName: string) => {
    // This function will be used to apply the transcript to the specific field
    console.log(`Applying transcript to ${fieldName}:`, transcript);
    setTranscript("");
  };

  // Voice Input Component
  const VoiceInput = ({ fieldName, placeholder, type = "input", rows = 4 }: { 
    fieldName: string; 
    placeholder: string; 
    type?: "input" | "textarea";
    rows?: number;
  }) => {
    const isActive = activeField === fieldName;
    
    return (
      <div className="relative">
        {type === "textarea" ? (
          <Textarea 
            placeholder={placeholder}
            rows={rows}
            className="pr-12"
          />
        ) : (
          <Input 
            placeholder={placeholder}
            className="pr-12"
          />
        )}
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {isActive && isRecording ? (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <Button
                size="sm"
                variant="outline"
                onClick={stopVoiceRecording}
                className="h-8 w-8 p-0"
              >
                <Square className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => startVoiceRecording(fieldName)}
              className="h-8 w-8 p-0"
              title="Voice input"
            >
              <Mic className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {isActive && transcript && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Voice: {transcript}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyTranscript(fieldName)}
                className="h-6 px-2 text-xs"
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const templates = [
    {
      id: 1,
      name: "Professional",
      category: "Corporate",
      image: "/Images/resume-template-1.jpg",
      popular: true
    },
    {
      id: 2,
      name: "Creative",
      category: "Design",
      image: "/Images/resume-template-2.jpg",
      popular: false
    },
    {
      id: 3,
      name: "Minimal",
      category: "Tech",
      image: "/Images/resume-template-3.jpg",
      popular: false
    },
    {
      id: 4,
      name: "Executive",
      category: "Leadership",
      image: "/Images/resume-template-4.jpg",
      popular: true
    }
  ];

  const features = [
    {
      icon: Target,
      title: "ATS Optimized",
      description: "Built to pass Applicant Tracking Systems and reach human recruiters"
    },
    {
      icon: Palette,
      title: "Professional Templates",
      description: "Choose from 20+ industry-specific templates designed by experts"
    },
    {
      icon: Zap,
      title: "AI Content Suggestions",
      description: "Get intelligent suggestions to improve your resume content and impact"
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your data is secure and never shared with third parties"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Choose Template",
      description: "Select from our professional templates"
    },
    {
      number: 2,
      title: "Add Information",
      description: "Fill in your details and experience"
    },
    {
      number: 3,
      title: "AI Enhancement",
      description: "Get AI-powered suggestions and improvements"
    },
    {
      number: 4,
      title: "Download & Share",
      description: "Export in multiple formats and share"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      quote: "The ATS optimization feature helped me get past screening systems. I received 3x more interview calls!",
      improvement: "+300%"
    },
    {
      name: "Michael Rodriguez",
      role: "Marketing Manager",
      company: "Microsoft",
      quote: "The AI suggestions made my resume much more impactful. I landed my dream job within 2 weeks.",
      improvement: "+150%"
    },
    {
      name: "Priya Sharma",
      role: "Data Analyst",
      company: "Amazon",
      quote: "Professional templates and easy customization. My resume now stands out from the crowd.",
      improvement: "+200%"
    }
  ];

  return (
    <div className="min-h-screen bg-[#031527]">
      <Navbar />
      <div className="relative w-full animate-fade-in">
        
        {/* Hero Section */}
        <section className="relative z-40 lg:min-h-screen max-w-screen-2xl mx-auto flex items-center bg-gradient-to-b from-cyan-100 to-white overflow-hidden pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">ATS-Optimized Resumes</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-normal mb-6 leading-tight animate-fade-in text-[#2D3253]">
              Resume <span className="bg-gradient-primary bg-clip-text text-transparent">Builder</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Create professional, ATS-optimized resumes that stand out to hiring managers. Get AI-powered suggestions and industry-specific templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={scrollToBuilding}>
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={scrollToTemplates}>
                View Templates
              </Button>
            </div>
          </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative w-full py-20 bg-gradient-to-b from-white to-cyan-100 overflow-hidden">
          <div className="text-center pt-14 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="p-6 text-center border-primary/10">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section ref={templatesRef} className="relative w-full py-20 bg-gradient-to-b from-cyan-100 to-white overflow-hidden">
          <div className="text-center pt-14 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl mb-6 sm:text-4xl md:text-6xl lg:text-4xl font-normal leading-tight text-[#2D3253] z-50">
              Professional <span className="bg-gradient-primary bg-clip-text text-transparent">Templates</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow border-primary/10 group cursor-pointer">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-primary/50" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{template.name}</h3>
                      {template.popular && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{template.category}</p>
                    <Button className="w-full" variant="outline">
                      Use Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative w-full py-20 bg-gradient-to-b from-white to-cyan-100 overflow-hidden">
          <div className="text-center pt-14 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl mb-6 sm:text-4xl md:text-6xl lg:text-4xl font-normal leading-tight text-[#2D3253] z-50">
              How It <span className="bg-gradient-primary bg-clip-text text-transparent">Works</span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step) => (
                <Card key={step.number} className="p-6 text-center border-primary/10">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Resume Builder Interface Section */}
        <section ref={buildingRef} className="relative w-full py-20 bg-gradient-to-b from-cyan-100 to-white overflow-hidden">
          <div className="text-center pt-14 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl mb-6 sm:text-4xl md:text-6xl lg:text-4xl font-normal leading-tight text-[#2D3253] z-50">
              Start Building Your <span className="bg-gradient-primary bg-clip-text text-transparent">Resume</span>
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form */}
              <Card className="p-6 border-primary/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl">Personal Information</h3>
                  {isRecording && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-red-700 font-medium">Recording...</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">First Name</label>
                      <VoiceInput fieldName="firstName" placeholder="John" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Last Name</label>
                      <VoiceInput fieldName="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <VoiceInput fieldName="email" placeholder="john.doe@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <VoiceInput fieldName="phone" placeholder="+1 (555) 123-4567" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <VoiceInput fieldName="location" placeholder="San Francisco, CA" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Professional Summary</label>
                    <VoiceInput 
                      fieldName="summary" 
                      placeholder="Brief overview of your professional background and career objectives..."
                      type="textarea"
                      rows={4}
                    />
                  </div>
                  <Button className="w-full">
                    Continue to Experience
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>

              {/* Preview */}
              <Card className="p-6 border-primary/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl">Resume Preview</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="aspect-[3/4] bg-white border rounded-lg p-6 shadow-sm">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">John Doe</h2>
                    <p className="text-gray-600">Software Engineer</p>
                    <p className="text-sm text-gray-500">john.doe@email.com • +1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">San Francisco, CA</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Professional Summary</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Experienced software engineer with 5+ years developing scalable web applications...
                    </p>
                    <div className="text-center text-gray-400 text-sm">
                      Continue building to see more sections
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

        </section>

        {/* Testimonials Section */}
        <section className="relative w-full py-20 bg-gradient-to-b from-white to-cyan-100 overflow-hidden">
          <div className="text-center pt-14 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl mb-6 sm:text-4xl md:text-6xl lg:text-4xl font-normal leading-tight text-[#2D3253] z-50">
              Success <span className="bg-gradient-primary bg-clip-text text-transparent">Stories</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500 font-medium">{testimonial.improvement} more interviews</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default ResumeBuilder;                                                                                                               