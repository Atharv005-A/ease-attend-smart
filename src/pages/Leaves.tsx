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
import { mockLeaveRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Calendar, FileText, Upload, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Leaves: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'personal' as 'medical' | 'personal' | 'emergency' | 'other',
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isTeacher = user?.role === 'teacher';
  const displayedLeaves = isTeacher 
    ? mockLeaveRequests 
    : mockLeaveRequests.filter(l => l.studentId === user?.id);

  const handleApprove = (id: string) => {
    toast({
      title: "Leave Approved",
      description: "The leave request has been approved.",
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Leave Rejected",
      description: "The leave request has been rejected.",
      variant: "destructive",
    });
  };

  const handleSubmitRequest = () => {
    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval.",
    });
    setShowNewRequest(false);
    setNewRequest({ startDate: '', endDate: '', reason: '', type: 'personal' });
  };

  return (
    <Sidebar>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Leave Requests</h1>
            <p className="text-muted-foreground">
              {isTeacher ? 'Manage student leave requests' : 'Submit and track your leave requests'}
            </p>
          </div>
          {!isTeacher && (
            <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
              <DialogTrigger asChild>
                <Button variant="gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Submit Leave Request</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newRequest.startDate}
                        onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newRequest.endDate}
                        onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Leave Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['medical', 'personal', 'emergency', 'other'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewRequest({ ...newRequest, type: type as any })}
                          className={`p-3 rounded-lg border-2 transition-all capitalize ${
                            newRequest.type === type
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please provide details for your leave request..."
                      value={newRequest.reason}
                      onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                      rows={4}
                    />
                  </div>
                  {newRequest.type === 'medical' && (
                    <div className="space-y-2">
                      <Label>Medical Proof (Optional)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
                      </div>
                    </div>
                  )}
                  <Button variant="gradient" className="w-full" onClick={handleSubmitRequest}>
                    Submit Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="stat" className="bg-warning/5 border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-warning">
                    {displayedLeaves.filter(l => l.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-warning/50" />
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold text-success">
                    {displayedLeaves.filter(l => l.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-success/50" />
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-3xl font-bold text-destructive">
                    {displayedLeaves.filter(l => l.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-destructive/50" />
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="bg-info/5 border-info/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold text-info">{displayedLeaves.length}</p>
                </div>
                <FileText className="w-8 h-8 text-info/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayedLeaves.map((leave) => (
                <div key={leave.id} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        leave.type === 'medical' ? 'bg-destructive/10' :
                        leave.type === 'emergency' ? 'bg-warning/10' : 'bg-info/10'
                      }`}>
                        <FileText className={`w-5 h-5 ${
                          leave.type === 'medical' ? 'text-destructive' :
                          leave.type === 'emergency' ? 'text-warning' : 'text-info'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold">{leave.studentName}</p>
                        <p className="text-sm text-muted-foreground capitalize">{leave.type} Leave</p>
                      </div>
                    </div>
                    <Badge variant={
                      leave.status === 'approved' ? 'default' :
                      leave.status === 'rejected' ? 'destructive' : 'secondary'
                    } className="capitalize">
                      {leave.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{leave.reason}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {leave.startDate} - {leave.endDate}
                      </span>
                      {leave.proofDocument && (
                        <Badge variant="outline" className="text-xs">
                          Proof attached
                        </Badge>
                      )}
                    </div>
                    
                    {isTeacher && leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="success" onClick={() => handleApprove(leave.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReject(leave.id)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default Leaves;
