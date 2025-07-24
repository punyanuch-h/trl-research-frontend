import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";

export default function ProfessorDashboard() {
  const navigate = useNavigate();

  const researchProjects = [
    {
      id: 1,
      name: "AI-Powered Medical Diagnosis System",
      type: "TRL medical devices",
      status: "In process"
    },
    {
      id: 2,
      name: "Quantum Computing Algorithm",
      type: "TRL software",
      status: "Todo"
    },
    {
      id: 3,
      name: "Cancer Treatment Protocol",
      type: "TRL medicines vaccines stem cells",
      status: "Done"
    },
    {
      id: 4,
      name: "Drought Resistant Wheat Variety",
      type: "TRL plant/animal breeds",
      status: "In process"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done": return "bg-green-100 text-green-800";
      case "In process": return "bg-yellow-100 text-yellow-800";
      case "Todo": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleResearchClick = (id: number, name: string, type: string) => {
    navigate(`/trl-1?research=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`);
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
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {researchProjects.map((project, index) => (
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
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
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