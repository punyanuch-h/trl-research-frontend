import React from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, ChartArea, List, CalendarRange } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FilterPopup from "@/components/modal/filtter/filtter";
import Header from "@/components/Header";

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
  selectedColumn: _selectedColumn, setSelectedColumn: _setSelectedColumn,
  selectedValue: _selectedValue, setSelectedValue: _setSelectedValue,
  columns: _columns, columnOptions
}: AdminNavbarProps) {
  const { t } = useTranslation();
  const filterBtnRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("admin.researchManagement")}</h1>
              <p className="text-muted-foreground">{t("admin.researchManagementDesc")}</p>
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
              <div ref={filterBtnRef} className="inline-block">
                <Button onClick={() => setShowFilterModal(true)} variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {t("home.filter")}
                </Button>
              </div>
            </div>
          )}
          {/* Modal Filter */}
          <FilterPopup
            open={showFilterModal}
            onOpenChange={setShowFilterModal}
            anchorRef={filterBtnRef}
            customFilters={customFilters}
            setCustomFilters={setCustomFilters}
            columns={Object.keys(columnOptions)}
            columnOptions={columnOptions}
          />
        </div>
        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={activeView === 'management' ? 'default' : 'outline'}
            onClick={() => onViewChange('management')}
            className="flex items-center space-x-2"
          >
            <List className="w-4 h-4" />
            <span>{t("admin.manageResearch")}</span>
          </Button>
          <Button
            variant={activeView === 'dashboard' ? 'default' : 'outline'}
            onClick={() => onViewChange('dashboard')}
            className="flex items-center space-x-2"
          >
            <ChartArea className="w-4 h-4" />
            <span>{t("admin.researchOverview")}</span>
          </Button>
          <Button
            variant={activeView === 'appointments' ? 'default' : 'outline'}
            onClick={() => onViewChange('appointments')}
            className="flex items-center space-x-2"
          >
            <CalendarRange className="w-4 h-4" />
            <span>{t("home.appointment")}</span>
          </Button>
        </div>
        {/* Content */}
        {children}
      </div>
    </div>
  );
}