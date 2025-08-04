import React from "react";
import type { TRLItem } from '../types/trl';
import mockTRL from "../mockData/mockTRL";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/TablePagination";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Download, Filter, Plus, View } from "lucide-react";
import Header from "../components/Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ResearcherDashboard() {
  const navigate = useNavigate();

  const myResearch: TRLItem[] = mockTRL;

  const [customFilters, setCustomFilters] = React.useState<{ column: string; value: string }[]>([]);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedColumn, setSelectedColumn] = React.useState("type");
  const [selectedValue, setSelectedValue] = React.useState("");

  const columns = ["type", "trlScore", "status"];

  const columnOptions: Record<string, string[]> = {
    type: [
      "TRL software",
      "TRL medical devices",
      "TRL medicines vaccines stem cells",
      "TRL plant/animal breeds",
    ],
    trlScore: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    status: ["In process", "Approve"],
  };

  const filteredResearch = myResearch.filter((research) =>
    customFilters.every(({ column, value }) => {
      if (column === "type") {
        return research.researchType === value;
      }
      if (column === "trlScore") {
        return research.trlRecommendation?.trlScore.toString() === value;
      }
      if (column === "status") {
        return research.trlRecommendation?.status === value;
      }
      return true;
    })
  );

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(filteredResearch.length / rowsPerPage);
  const paginatedResearch = filteredResearch.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approve":
        return "bg-green-100 text-green-800";
      case "In process":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewResearch = (researchId: number) => {
    const research = myResearch.find((r) => r.id === researchId);
    if (research) {
      navigate("/researcher-detail", { state: { research } });
    }
  };

  const handleDownloadResult = (filename: string) => {
    const link = document.createElement("a");
    link.href = "#";
    link.download = filename;
    link.click();
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [customFilters, rowsPerPage]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate("/researcher-form")}>
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Research</h1>
              <p className="text-muted-foreground">View your research submission status</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {customFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1 text-xs px-2 py-1"
              >
                {filter.column}: {filter.value}
                <button
                  onClick={() =>
                    setCustomFilters((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="ml-1 text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
            <Button onClick={() => setShowFilterModal(true)} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
          {/* Modal Filter */}
          <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Filter Research</DialogTitle>
              </DialogHeader>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">Column</label>
                  <select
                    value={selectedColumn}
                    onChange={(e) => {
                      setSelectedColumn(e.target.value);
                      setSelectedValue("");
                    }}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    {columns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">Value</label>
                  <select
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">Select value</option>
                    {columnOptions[selectedColumn].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    if (selectedColumn && selectedValue) {
                      setCustomFilters((prev) => [
                        ...prev.filter((f) => f.column !== selectedColumn),
                        { column: selectedColumn, value: selectedValue },
                      ]);
                      setShowFilterModal(false);
                    }
                  }}
                  disabled={!selectedValue}
                >
                  Apply Filter
                </Button>
                <Button variant="ghost" onClick={() => setShowFilterModal(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        
        

        <Card>
          <CardHeader>
            <CardTitle>Research Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>TRL Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>For Next Step</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedResearch.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No research data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedResearch.map((research, index) => (
                    <TableRow key={research.id}>
                      <TableCell>{research.id}</TableCell>
                      <TableCell>{research.researchTitle}</TableCell>
                      <TableCell>{research.researchType}</TableCell>
                      <TableCell>
                        {research.trlRecommendation.status === "Approve" ? (
                          <Badge variant="outline">TRL {research.trlRecommendation.trlScore}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`min-w-[20px] text-center whitespace-nowrap ${getStatusColor(research.trlRecommendation.status)}`}>
                          {research.trlRecommendation.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2 min-w-[160px]">
                          {research.trlRecommendation.result ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDownloadResult(
                                    research.trlRecommendation.result
                                      ? `result_${research.researchTitle}.pdf`
                                      : `result_${research.researchTitle}.txt`
                                  )
                                }
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Result
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewResearch(research.id)}
                              >
                                <View className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </>
                          ) : (
                            <div className="ml-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewResearch(research.id)}
                              >
                                <View className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>


                      <TableCell>{research.trlRecommendation.suggestion || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="mt-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                onRowsPerPageChange={(value) => setRowsPerPage(value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
