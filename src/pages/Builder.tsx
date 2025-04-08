
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FileText, CheckCircle, User, Building, Book, Award, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResumeFormSection, { SectionItem } from "@/components/ResumeFormSection";
import DomainSelector from "@/components/DomainSelector";
import { useToast } from "@/hooks/use-toast";

const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(500, "Summary must be less than 500 characters"),
});

const educationSchema = z.object({
  education: z.array(
    z.object({
      degree: z.string().min(2, "Degree must be at least 2 characters"),
      institution: z.string().min(2, "Institution must be at least 2 characters"),
      location: z.string().optional(),
      startDate: z.string().min(4, "Start date must be at least 4 characters"),
      endDate: z.string().min(4, "End date must be at least 4 characters"),
      description: z.string().optional(),
    })
  ).default([]),
});

const experienceSchema = z.object({
  experience: z.array(
    z.object({
      title: z.string().min(2, "Job title must be at least 2 characters"),
      company: z.string().min(2, "Company must be at least 2 characters"),
      location: z.string().optional(),
      startDate: z.string().min(4, "Start date must be at least 4 characters"),
      endDate: z.string().min(4, "End date must be at least 4 characters"),
      description: z.string().min(10, "Description must be at least 10 characters"),
    })
  ).default([]),
});

const skillsSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(2, "Skill name must be at least 2 characters"),
      level: z.string().optional(),
    })
  ).default([]),
});

const projectsSchema = z.object({
  projects: z.array(
    z.object({
      name: z.string().min(2, "Project name must be at least 2 characters"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      technologies: z.string().optional(),
      link: z.string().url("Invalid URL").optional().or(z.literal("")),
    })
  ).default([]),
});

const formSchema = z.object({
  ...personalInfoSchema.shape,
  ...educationSchema.shape,
  ...experienceSchema.shape,
  ...skillsSchema.shape,
  ...projectsSchema.shape,
  domain: z.string().min(1, "Please select a domain"),
});

type FormValues = z.infer<typeof formSchema>;

const Builder = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [domain, setDomain] = useState("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      education: [{ degree: "", institution: "", location: "", startDate: "", endDate: "", description: "" }],
      experience: [{ title: "", company: "", location: "", startDate: "", endDate: "", description: "" }],
      skills: [{ name: "", level: "" }],
      projects: [{ name: "", description: "", technologies: "", link: "" }],
      domain: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast({
      title: "Resume created!",
      description: "Your resume has been successfully created.",
    });
    // In a real application, we would:
    // 1. Send the data to the backend for processing
    // 2. Generate the resume document
    // 3. Analyze the resume for the selected domain
    // 4. Redirect to the results page
  };

  // Helper functions for managing form arrays
  const addEducation = () => {
    const education = form.getValues("education");
    form.setValue("education", [
      ...education,
      { degree: "", institution: "", location: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    const education = form.getValues("education");
    form.setValue("education", education.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    const experience = form.getValues("experience");
    form.setValue("experience", [
      ...experience,
      { title: "", company: "", location: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeExperience = (index: number) => {
    const experience = form.getValues("experience");
    form.setValue("experience", experience.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    const skills = form.getValues("skills");
    form.setValue("skills", [...skills, { name: "", level: "" }]);
  };

  const removeSkill = (index: number) => {
    const skills = form.getValues("skills");
    form.setValue("skills", skills.filter((_, i) => i !== index));
  };

  const addProject = () => {
    const projects = form.getValues("projects");
    form.setValue("projects", [...projects, { name: "", description: "", technologies: "", link: "" }]);
  };

  const removeProject = (index: number) => {
    const projects = form.getValues("projects");
    form.setValue("projects", projects.filter((_, i) => i !== index));
  };

  const handleDomainChange = (selectedDomain: string) => {
    setDomain(selectedDomain);
    form.setValue("domain", selectedDomain);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">Resume Builder</h1>
        </div>

        <p className="text-muted-foreground mb-8">
          Fill in the details below to create your professional resume. Navigate through different sections using the tabs.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  <span className="hidden md:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden md:inline">Experience</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden md:inline">Skills</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="hidden md:inline">Projects</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6 animate-slide-up">
                <ResumeFormSection title="Personal Information" description="Your basic contact details and professional summary">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="New York, NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Experienced software developer with 5+ years of experience in web development..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A brief overview of your professional background, skills, and career goals.
                        </FormDescription>
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
                          Select the industry or domain you're targeting for better resume optimization.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </ResumeFormSection>
                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("education")}>
                    Next: Education
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="education" className="animate-slide-up">
                <ResumeFormSection 
                  title="Education" 
                  description="Your academic background and qualifications"
                  onAdd={addEducation}
                  addButtonText="Add Education"
                >
                  {form.getValues("education").map((_, index) => (
                    <SectionItem 
                      key={index} 
                      onRemove={form.getValues("education").length > 1 ? () => removeEducation(index) : undefined}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree/Certification</FormLabel>
                              <FormControl>
                                <Input placeholder="Bachelor of Computer Applications" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.institution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input placeholder="University of Technology" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="New Delhi, India" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`education.${index}.startDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="2020" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`education.${index}.endDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="2023" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name={`education.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Relevant coursework, achievements, or projects..." 
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </SectionItem>
                  ))}
                </ResumeFormSection>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
                    Previous: Personal
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("experience")}>
                    Next: Experience
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="animate-slide-up">
                <ResumeFormSection 
                  title="Work Experience" 
                  description="Your professional experience and roles"
                  onAdd={addExperience}
                  addButtonText="Add Experience"
                >
                  {form.getValues("experience").map((_, index) => (
                    <SectionItem 
                      key={index} 
                      onRemove={form.getValues("experience").length > 1 ? () => removeExperience(index) : undefined}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`experience.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Software Developer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`experience.${index}.company`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Tech Solutions Inc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`experience.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Bangalore, India" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`experience.${index}.startDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jan 2021" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`experience.${index}.endDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="Present" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name={`experience.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Developed and maintained web applications using React and Node.js..." 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Describe your responsibilities, achievements, and the technologies you used.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </SectionItem>
                  ))}
                </ResumeFormSection>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("education")}>
                    Previous: Education
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("skills")}>
                    Next: Skills
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="animate-slide-up">
                <ResumeFormSection 
                  title="Skills" 
                  description="Your technical and soft skills"
                  onAdd={addSkill}
                  addButtonText="Add Skill"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {form.getValues("skills").map((_, index) => (
                      <SectionItem 
                        key={index} 
                        onRemove={form.getValues("skills").length > 1 ? () => removeSkill(index) : undefined}
                        className="h-full"
                      >
                        <FormField
                          control={form.control}
                          name={`skills.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skill</FormLabel>
                              <FormControl>
                                <Input placeholder="React.js" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`skills.${index}.level`}
                          render={({ field }) => (
                            <FormItem className="mt-2">
                              <FormLabel>Level (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Advanced" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </SectionItem>
                    ))}
                  </div>
                </ResumeFormSection>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("experience")}>
                    Previous: Experience
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("projects")}>
                    Next: Projects
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="animate-slide-up">
                <ResumeFormSection 
                  title="Projects" 
                  description="Your personal or professional projects"
                  onAdd={addProject}
                  addButtonText="Add Project"
                >
                  {form.getValues("projects").map((_, index) => (
                    <SectionItem 
                      key={index} 
                      onRemove={form.getValues("projects").length > 1 ? () => removeProject(index) : undefined}
                    >
                      <FormField
                        control={form.control}
                        name={`projects.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                              <Input placeholder="E-commerce Website" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`projects.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Developed a full-stack e-commerce website with user authentication, product management..." 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`projects.${index}.technologies`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Technologies Used (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="React, Node.js, MongoDB" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`projects.${index}.link`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Link (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://github.com/username/project" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </SectionItem>
                  ))}
                </ResumeFormSection>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("skills")}>
                    Previous: Skills
                  </Button>
                  <Button type="submit">
                    Create Resume
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </main>

      <Footer />
    </div>
  );
};

export default Builder;
