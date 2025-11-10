import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, ChartArea, List, CalendarRange } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import Header from '../Header';

interface AdminNavbarProps {
  activeView: 'management' | 'dashboard' | 'appointments';
  onViewChange: (view: 'management' | 'dashboard' | 'appointments') => void;
  children: React.ReactNode;
  // props for filter
  customFilters: { column: string; value: string }[];
  setCustomFilters: React.Dispatch<React.SetStateAction<{ column: string; value: string }[]>>;
  showFilterModal: boolean;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedColumn: string;
  setSelectedColumn: React.Dispatch<React.SetStateAction<string>>;
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  columns: string[];
  columnOptions: Record<string, string[]>;
}

export default function AdminNavbar({
  activeView, onViewChange, children,
  customFilters, setCustomFilters,
  showFilterModal, setShowFilterModal,
  selectedColumn, setSelectedColumn,
  selectedValue, setSelectedValue,
  columns, columnOptions
}: AdminNavbarProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Research Management</h1>
              <p className="text-muted-foreground">Manage your TRL assessment projects</p>
            </div>
          </div>
          {activeView !== 'dashboard' && (
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
          )}
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
                    {(columnOptions[selectedColumn] || []).map((v) => (
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
        </div>
        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={activeView === 'management' ? 'default' : 'outline'}
            onClick={() => onViewChange('management')}
            className="flex items-center space-x-2"
          >
            <List className="w-4 h-4" />
            <span>Management</span>
          </Button>
          <Button
            variant={activeView === 'dashboard' ? 'default' : 'outline'}
            onClick={() => onViewChange('dashboard')}
            className="flex items-center space-x-2"
          >
            <ChartArea className="w-4 h-4" />
            <span>Dashboard</span>
          </Button>
          <Button
            variant={activeView === 'appointments' ? 'default' : 'outline'}
            onClick={() => onViewChange('appointments')}
            className="flex items-center space-x-2"
          >
            <CalendarRange className="w-4 h-4" />
            <span>Appointments</span>
          </Button>
        </div>
        {/* Content */}
        {children}
      </div>
    </div>
  );
}