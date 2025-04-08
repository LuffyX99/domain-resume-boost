
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, FileUp, CheckCircle, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DomainSelector from "@/components/DomainSelector";
import AnalysisResult from "@/components/AnalysisResult";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  resumeText: z.string().min(50, "Resume content must be at least 50 characters long"),
  domain: z.string().min(1, "Please select a domain"),
});

type FormValues = z.infer<typeof formSchema>;

const Analyzer = () => {
  const [domain, setDomain] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: "",
      domain: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsAnalyzing(true);
    
    try {
      // In a real application, this would be an API call to the Python backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result for demonstration
      const mockResult = {
        score: 75,
        domainMatch: 68,
        keywords: ["React", "Python", "API", "Machine Learning", "JavaScript", "Node.js"],
        suggestions: [
          { 
            text: "Strong technical skills with relevant technologies for web development.", 
            type: "strength" 
          },
          { 
            text: "Good project experience showcasing practical implementation.", 
            type: "strength" 
          },
          { 
            text: "Consider adding more domain-specific keywords like 'React hooks' and 'state management'.", 
            type: "improvement" 
          },
          { 
            text: "Quantify your achievements with specific metrics or results.", 
            type: "improvement" 
          },
          { 
            text: "Include more details about your education and relevant coursework.", 
            type: "improvement" 
          },
        ],
        shortlisted: true,
      };
      
      setAnalysisResult(mockResult);
      toast({
        title: "Analysis complete!",
        description: "Your resume has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDomainChange = (selectedDomain: string) => {
    setDomain(selectedDomain);
    form.setValue("domain", selectedDomain);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real application, this would use a library like pdfjs or docx-parser
    // For this demo, we'll just show a toast notification
    toast({
      title: "File uploaded",
      description: "File content would be extracted in a real application.",
    });

    // Mock resume text
    const mockResumeText = `JOHN DOE
johndoe@example.com | (555) 123-4567 | New York, NY | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Dedicated web developer with 3+ years of experience in building responsive websites and applications. Proficient in React, JavaScript, and Node.js. Strong problem-solving skills and ability to work in fast-paced environments.

WORK EXPERIENCE
Frontend Developer
Tech Solutions Inc. | Jan 2022 - Present
- Developed and maintained responsive web applications using React.js
- Implemented new features and optimized existing code for better performance
- Collaborated with UX/UI designers to implement visually appealing interfaces
- Integrated REST APIs and third-party services

Junior Web Developer
Digital Creations | June 2020 - Dec 2021
- Assisted in developing and maintaining client websites
- Created responsive layouts using HTML, CSS, and JavaScript
- Fixed bugs and improved website functionality

EDUCATION
Bachelor of Computer Applications
University of Technology | 2017 - 2020
- GPA: 3.8/4.0
- Relevant coursework: Web Development, Database Management, Data Structures

SKILLS
- JavaScript, React.js, Node.js
- HTML5, CSS3, Tailwind CSS
- Git, GitHub
- RESTful APIs
- Python (basic)
- UI/UX principles

PROJECTS
E-commerce Website
- Built a full-stack e-commerce platform with user authentication, product management
- Technologies: React, Node.js, MongoDB, Express

Personal Portfolio
- Designed and developed a responsive portfolio website
- Technologies: HTML, CSS, JavaScript`;

    form.setValue("resumeText", mockResumeText);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">Resume Analyzer</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
                <CardDescription>
                  Upload your resume or paste the content to analyze it for your target domain.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto mb-6">
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
                          <FileUp className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">
                            Click to upload your resume
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Supports PDF, DOCX, or TXT files
                          </p>
                        </div>
                        <input
                          id="resume-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.docx,.txt"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mb-2">Or paste your resume content</p>

                    <FormField
                      control={form.control}
                      name="resumeText"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Paste your resume content here..." 
                              className="min-h-[300px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Domain</FormLabel>
                          <FormControl>
                            <DomainSelector 
                              selectedDomain={domain} 
                              onSelect={handleDomainChange} 
                            />
                          </FormControl>
                          <FormDescription>
                            Select the domain you're targeting for your job application.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>Analyzing Resume...</>
                      ) : (
                        <>Analyze Resume</>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Get insights on how well your resume matches your target domain.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResult ? (
                  <AnalysisResult analysis={analysisResult} domain={domain} />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Upload your resume and select a domain to see AI-powered analysis and improvement suggestions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analyzer;
