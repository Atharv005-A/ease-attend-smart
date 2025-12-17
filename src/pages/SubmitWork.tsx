import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, CheckCircle, Clock, FlaskConical, Camera, Image, X } from 'lucide-react';

const SubmitWork: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [selectedLab, setSelectedLab] = useState('');

  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/login" replace />;
  }

  const labs = [
    { id: '1', name: 'Data Structures Lab', date: '2024-01-20', deadline: '2024-01-22' },
    { id: '2', name: 'Algorithm Analysis Lab', date: '2024-01-18', deadline: '2024-01-21' },
    { id: '3', name: 'Database Lab', date: '2024-01-15', deadline: '2024-01-18' },
  ];

  const submissions = [
    { id: '1', lab: 'Computer Networks Lab', date: '2024-01-12', status: 'verified', files: 2 },
    { id: '2', lab: 'Operating Systems Lab', date: '2024-01-10', status: 'pending', files: 3 },
    { id: '3', lab: 'Software Engineering Lab', date: '2024-01-08', status: 'verified', files: 1 },
  ];

  const handleFileSelect = () => {
    // Simulate file selection
    setSelectedFiles([...selectedFiles, `lab_work_${selectedFiles.length + 1}.jpg`]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedLab) {
      toast({
        title: "Select a lab",
        description: "Please select a lab session to submit work for.",
        variant: "destructive",
      });
      return;
    }
    if (selectedFiles.length === 0) {
      toast({
        title: "Add files",
        description: "Please add at least one file to submit.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Work Submitted!",
      description: "Your lab work has been submitted for verification.",
    });
    setSelectedFiles([]);
    setDescription('');
    setSelectedLab('');
  };

  return (
    <Sidebar>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Submit Lab Work</h1>
            <p className="text-muted-foreground">Upload your practical work for attendance verification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submission Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select Lab */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-primary" />
                  Select Lab Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {labs.map((lab) => (
                    <button
                      key={lab.id}
                      onClick={() => setSelectedLab(lab.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedLab === lab.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{lab.name}</p>
                          <p className="text-sm text-muted-foreground">Date: {lab.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={new Date(lab.deadline) > new Date() ? 'default' : 'destructive'}>
                            Due: {lab.deadline}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer mb-4"
                  onClick={handleFileSelect}
                >
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                      <Image className="w-6 h-6 text-info" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                      <File className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Photos, screenshots, or documents (JPG, PNG, PDF up to 10MB)
                  </p>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Selected Files:</p>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Image className="w-5 h-5 text-primary" />
                          <span className="text-sm">{file}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any notes about your submission..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Button variant="gradient" className="w-full h-12" onClick={handleSubmit}>
              Submit Lab Work
            </Button>
          </div>

          {/* Previous Submissions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Previous Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{sub.lab}</p>
                        {sub.status === 'verified' ? (
                          <Badge variant="default" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{sub.date}</span>
                        <span>{sub.files} files</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="mt-6 bg-info/5 border-info/20">
              <CardContent className="p-4">
                <h3 className="font-semibold text-info mb-2">Tips for Submission</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Ensure your work is clearly visible in photos</li>
                  <li>• Include your student ID in the submission</li>
                  <li>• Submit before the deadline for on-time attendance</li>
                  <li>• Multiple files can be uploaded for comprehensive submission</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default SubmitWork;
