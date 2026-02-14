import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (value: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const { t } = useTranslation();
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between border-t pt-4 mt-4 gap-4">
      {/* Rows per page selector */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-muted-foreground">{t("pagination.rowsPerPage")}</span>
        <Select
          value={rowsPerPage.toString()}
          onValueChange={(value) => onRowsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-20 h-8">
            <SelectValue placeholder={t("pagination.rowsPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 25, 50].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page navigation */}
      <div className="flex items-center space-x-3">
        <span className="text-sm text-muted-foreground">
          {t("pagination.page")} <strong>{currentPage}</strong> {t("pagination.of")} <strong>{Math.max(totalPages, 1)}</strong>
        </span>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="px-3"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            {t("pagination.previous")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="px-3"
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            {t("pagination.next")}
          </Button>
        </div>
      </div>
    </div>
  );
};