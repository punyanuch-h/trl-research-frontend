import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";

export default function ResearcherDashboard() {
  const navigate = useNavigate();

  const myResearch = [
    {
      id: 1,
      name: "AI-Powered Medical Diagnosis System",
      type: "TRL medical devices",
      status: "In process",
      result: null
    },
    {
      id: 2,
      name: "Quantum Computing Algorithm",
      type: "TRL software",
      status: "Todo",
      result: null
    },
    {
      id: 3,
      name: "Cancer Treatment Protocol",
      type: "TRL medicines vaccines stem cells",
      status: "Done",
      result: "resultReport.pdf"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done": return "bg-green-100 text-green-800";
      case "In process": return "bg-cyan-100 text-cyan-800";
      case "Todo": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myResearch.map((research, index) => (
                  <TableRow key={research.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{research.name}</TableCell>
                    <TableCell>{research.type}</TableCell>
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