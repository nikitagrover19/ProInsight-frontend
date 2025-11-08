import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, FileText, Type, FolderOpen, Play, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeProjectInsights } from "@/api/api";

const Upload = () => {
  const [projectName, setProjectName] = useState("");
  const [textInput, setTextInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) uploaded successfully.`,
    });
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalysis = async () => {
    // Validate that project_name is provided (required by backend)
    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please provide a project name to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!textInput && uploadedFiles.length === 0) {
      toast({
        title: "Additional input required",
        description: "Please provide text content or upload files for analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Prepare form data for FastAPI endpoint (multipart/form-data)
      const formData = new FormData();
      
      // Required field - must not be empty
      formData.append('project_name', projectName.trim());
      
      // Optional field - send empty string if not provided
      formData.append('text_content', textInput.trim());
      
      // Add all files with the same field name 'files' (FastAPI expects List[UploadFile])
      uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });

      console.log('Sending request to backend with:', {
        project_name: projectName.trim(),
        text_length: textInput.trim().length,
        files_count: uploadedFiles.length
      });

      // Send to FastAPI backend using centralized API service
      // Do NOT set Content-Type header - browser sets it automatically for FormData
      const result = await analyzeProjectInsights(formData);
      
      console.log('Analysis result:', result);
      
      toast({
        title: "Analysis complete",
        description: `Project "${result.project_name}" analyzed successfully!`,
      });
      
      // Navigate to dashboard with analysis data and project_id
      navigate("/dashboard", { 
        state: { 
          analysisData: result,
          projectId: result.project_id 
        } 
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Unable to process your request. Please check your backend connection.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasContent = projectName || textInput || uploadedFiles.length > 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Upload Your Project Data</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your preferred input method below. You can combine multiple sources for more comprehensive analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Project Name */}
              <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FolderOpen className="w-5 h-5 text-primary" />
                    <span>Project Name</span>
                  </CardTitle>
                  <CardDescription>
                    Give your project a descriptive name for easy identification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="e.g., Q4 Marketing Campaign Analysis"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              {/* Text Input */}
              <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Type className="w-5 h-5 text-primary" />
                    <span>Text Input</span>
                  </CardTitle>
                  <CardDescription>
                    Paste email content, meeting notes, or any project-related text.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="text-input">Text Content</Label>
                  <Textarea
                    id="text-input"
                    placeholder="Paste your email content, meeting notes, or project documents here..."
                    className="mt-2 min-h-32"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* File Upload */}
              <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UploadIcon className="w-5 h-5 text-primary" />
                    <span>File Upload</span>
                  </CardTitle>
                  <CardDescription>
                    Upload CSV, TXT, EML files, or other document formats.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".csv,.txt,.eml,.docx,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Click to upload files or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Supports CSV, TXT, EML, DOCX, PDF
                        </p>
                      </label>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Files</Label>
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-muted rounded-lg p-3"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <span className="text-sm text-foreground">{file.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-destructive hover:text-destructive/80 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-primary" />
                    <span>Input Preview</span>
                  </CardTitle>
                  <CardDescription>
                    Review your inputs before running the analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!hasContent ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No content added yet.</p>
                      <p className="text-sm mt-2">Start by filling in the fields on the left.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projectName && (
                        <div>
                          <Label className="text-xs text-muted-foreground">PROJECT NAME</Label>
                          <p className="font-medium text-foreground">{projectName}</p>
                        </div>
                      )}
                      
                       {textInput && (
                         <div>
                           <Label className="text-xs text-muted-foreground">TEXT CONTENT ({textInput.length} characters)</Label>
                           <p className="text-sm text-foreground bg-muted rounded-lg p-3 max-h-32 overflow-auto">
                             {textInput.slice(0, 200)}
                             {textInput.length > 200 && "..."}
                           </p>
                         </div>
                       )}
                      
                      {uploadedFiles.length > 0 && (
                        <div>
                          <Label className="text-xs text-muted-foreground">FILES ({uploadedFiles.length})</Label>
                          <div className="space-y-1">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="text-sm text-foreground flex items-center space-x-2">
                                <FileText className="w-3 h-3" />
                                <span>{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analysis Button */}
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <Button
                    onClick={handleAnalysis}
                    disabled={!hasContent || isAnalyzing}
                    className="w-full bg-gradient-hero hover:shadow-hero transition-all duration-300 text-lg py-6 rounded-2xl"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Run Analysis
                      </>
                    )}
                  </Button>
                  {!hasContent && (
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      Add content above to enable analysis
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
