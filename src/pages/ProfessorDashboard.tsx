import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Download } from "lucide-react";

export default function ProfessorDashboard() {
  const navigate = useNavigate();

  const researchProjects = [
    {
      id: 1,
      name: "AI-Powered Medical Diagnosis System",
      type: "TRL medical devices",
      trlScore: "TRL3",
      status: "In process",
      result: null
    },
    {
      id: 2,
      name: "Quantum Computing Algorithm",
      type: "TRL software",
      trlScore: "TRL2",
      status: "Todo",
      result: null
    },
    {
      id: 3,
      name: "Cancer Treatment Protocol",
      type: "TRL medicines vaccines stem cells",
      trlScore: "TRL7",
      status: "Approve",
      result: "resultReport.pdf"
    },
    {
      id: 4,
      name: "Drought Resistant Wheat Variety",
      type: "TRL plant/animal breeds",
      trlScore: "TRL4",
      status: "In process",
      result: null
    }
  ];

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
            <div className="flex gap-4 mt-4">
              <div>
                <label className="text-sm font-medium">Filter by Type:</label>
                <select 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  <option value="all">All Types</option>
                  <option value="TRL software">TRL software</option>
                  <option value="TRL medical devices">TRL medical devices</option>
                  <option value="TRL medicines vaccines stem cells">TRL medicines vaccines stem cells</option>
                  <option value="TRL plant/animal breeds">TRL plant/animal breeds</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Filter by TRL Score:</label>
                <select 
                  value={trlFilter} 
                  onChange={(e) => setTrlFilter(e.target.value)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  <option value="all">All TRL</option>
                  {[1,2,3,4,5,6,7,8,9].map(num => (
                    <option key={num} value={`TRL${num}`}>TRL{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Filter by Status:</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  <option value="all">All Status</option>
                  <option value="Todo">Todo</option>
                  <option value="In process">In process</option>
                  <option value="Approve">Approve</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>TRL Score</TableHead>
                  <TableHead>Status</TableHead>
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
                      <Badge variant="outline">{project.trlScore}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
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