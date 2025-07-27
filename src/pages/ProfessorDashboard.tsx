import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Download, Filter, Sparkles } from "lucide-react";

export default function ProfessorDashboard() {
  const navigate = useNavigate();

  const [researchProjects, setResearchProjects] = React.useState([
    {
      id: 1,
      name: "AI-Powered Medical Diagnosis System",
      type: "TRL medical devices",
      trlScore: "TRL3",
      status: "In process",
      result: null,
      aiEstimate: null
    },
    {
      id: 2,
      name: "Quantum Computing Algorithm",
      type: "TRL software",
      trlScore: "TRL2",
      status: "Todo",
      result: null,
      aiEstimate: null
    },
    {
      id: 3,
      name: "Cancer Treatment Protocol",
      type: "TRL medicines vaccines stem cells",
      trlScore: "TRL7",
      status: "Approve",
      result: "resultReport.pdf",
      aiEstimate: null
    },
    {
      id: 4,
      name: "Drought Resistant Wheat Variety",
      type: "TRL plant/animal breeds",
      trlScore: "TRL4",
      status: "In process",
      result: null,
      aiEstimate: null
    }
  ]);

  const [typeFilter, setTypeFilter] = React.useState("all");
  const [trlFilter, setTrlFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approve": return "bg-green-100 text-green-800";
      case "In process": return "bg-cyan-100 text-cyan-800";
      case "Todo": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProjects = researchProjects.filter(project => {
    const typeMatch = typeFilter === "all" || project.type === typeFilter;
    const trlMatch = trlFilter === "all" || project.trlScore === trlFilter;
    const statusMatch = statusFilter === "all" || project.status === statusFilter;
    return typeMatch && trlMatch && statusMatch;
  });

  const handleResearchClick = (id: number, name: string, type: string) => {
    navigate(`/trl-1?research=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`);
  };

  const handleDownloadResult = (filename: string) => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = filename;
    link.click();
  };

  const handleAIEstimate = (project: any) => {
    // AI estimation logic based on project type and details
    const aiEstimates = {
      "TRL software": ["TRL3", "TRL4", "TRL5"],
      "TRL medical devices": ["TRL2", "TRL3", "TRL4"],
      "TRL medicines vaccines stem cells": ["TRL6", "TRL7", "TRL8"],
      "TRL plant/animal breeds": ["TRL3", "TRL4", "TRL5"]
    };
    
    const estimates = aiEstimates[project.type] || ["TRL3", "TRL4"];
    const randomEstimate = estimates[Math.floor(Math.random() * estimates.length)];
    
    // Update the project with AI estimate
    setResearchProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === project.id ? { ...p, aiEstimate: randomEstimate } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Research Dashboard</h1>
              <p className="text-muted-foreground">Manage your TRL assessment projects</p>
            </div>
          </div>
          <Button onClick={() => navigate('/researcher-form')}>
            <Plus className="w-4 h-4 mr-2" />
            New Research
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Research Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Type
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Filter className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-2">
                          <select 
                            value={typeFilter} 
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full border rounded px-2 py-1 text-sm"
                          >
                            <option value="all">All Types</option>
                            <option value="TRL software">Software</option>
                            <option value="TRL medical devices">Medical</option>
                            <option value="TRL medicines vaccines stem cells">Medicine</option>
                            <option value="TRL plant/animal breeds">Biology</option>
                          </select>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      TRL Score
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Filter className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-32 p-2">
                          <select 
                            value={trlFilter} 
                            onChange={(e) => setTrlFilter(e.target.value)}
                            className="w-full border rounded px-2 py-1 text-sm"
                          >
                            <option value="all">All TRL</option>
                            {[1,2,3,4,5,6,7,8,9].map(num => (
                              <option key={num} value={`TRL${num}`}>TRL{num}</option>
                            ))}
                          </select>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Status
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Filter className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-32 p-2">
                          <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full border rounded px-2 py-1 text-sm"
                          >
                            <option value="all">All Status</option>
                            <option value="Todo">Todo</option>
                            <option value="In process">In process</option>
                            <option value="Approve">Approve</option>
                          </select>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                  <TableHead>Generate by AI</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project, index) => (
                  <TableRow 
                    key={project.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleResearchClick(project.id, project.name, project.type)}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium text-primary hover:underline">
                      {project.name}
                    </TableCell>
                    <TableCell>{project.type}</TableCell>
                    <TableCell>
                      {project.status === "Approve" ? (
                        <Badge variant="outline">{project.trlScore}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {project.aiEstimate ? (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {project.aiEstimate}
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAIEstimate(project);
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI Estimate
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {project.result ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadResult(project.result)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}