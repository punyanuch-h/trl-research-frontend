import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Filter } from "lucide-react";

export default function ResearcherDashboard() {
  const navigate = useNavigate();

  const myResearch = [
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

  const filteredResearch = myResearch.filter(research => {
    const typeMatch = typeFilter === "all" || research.type === typeFilter;
    const trlMatch = trlFilter === "all" || research.trlScore === trlFilter;
    const statusMatch = statusFilter === "all" || research.status === statusFilter;
    return typeMatch && trlMatch && statusMatch;
  });

  const handleEditResearch = (researchId: number) => {
    const research = myResearch.find(r => r.id === researchId);
    if (research?.status === "Todo") {
      navigate(`/researcher-form?edit=${researchId}`);
    }
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
              <h1 className="text-3xl font-bold text-foreground">My Research</h1>
              <p className="text-muted-foreground">View your research submission status</p>
            </div>
          </div>
          <Button onClick={() => navigate('/researcher-form')}>
            Submit New Research
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Research Submissions</CardTitle>
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
                  <TableHead>Result</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResearch.map((research, index) => (
                  <TableRow key={research.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{research.name}</TableCell>
                    <TableCell>{research.type}</TableCell>
                    <TableCell>
                      {research.status === "Approve" ? (
                        <Badge variant="outline">{research.trlScore}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(research.status)}>
                        {research.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {research.result ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadResult(research.result)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {research.status === "Todo" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditResearch(research.id)}
                        >
                          Edit
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