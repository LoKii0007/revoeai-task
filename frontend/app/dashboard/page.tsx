"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Table, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddTableDialog from "@/components/AddTableDialog";
import AddColumnDialog from "@/components/AddColumnDialog";
import { useSocket } from "@/hooks/useSocket";

interface Column {
  header: string;
  type: "text" | "date";
}

interface TableData {
  columns: Column[];
  rows: Record<string, string>[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const socket = useSocket();
  const [sheetData, setSheetData] = useState<any>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleAddRow = () => {
    if (tableData) {
      const newRow = [tableData.columns.map((col, i) => ({
        [getObjectKey(i, tableData.rows.length)]: "",
      }))];

      setTableData((prev: any) => ({
        ...prev,
        rows: [...prev.rows, ...newRow],
      }));
    }
  };

  function getObjectKey(colIndex: number, rowIndex: number) {
    return String.fromCharCode(65 + colIndex) + (rowIndex + 1).toString();
  }

  const handleInputChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    if (tableData) {
      setTableData((prev: any) => ({
        ...prev,
        rows: prev?.rows.map((row: any, idx: number) => (idx === rowIndex ? {
          ...row,
          [getObjectKey(colIndex, rowIndex)]: value,
        } : row)),
      }));
    }
  };

  if (!isAuthenticated) {
    return null;
  }


  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);


  useEffect(() => {
    socket.on("sheetDataUpdated", (data: any) => {
      console.log(data);
      const rowIndex = data.range.charAt(1);
      const colIndex = data.range.charAt(0);
      const value = data.values[0][0];
      setTableData((prev: any) => ({
        ...prev,
        rows: prev?.rows.map((row: any, idx: number) => (idx === rowIndex ? {
          ...row,
          [colIndex]: value,
        } : row)),
      }));
    });

    return () => {
      socket.off("sheetDataUpdated");
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Dynamic Table Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-end items-center">
          {tableData === null && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Table className="h-4 w-4" />
              <span>Create Table</span>
            </Button>
          )}

          {/* // dialog for creating a table */}
          <AddTableDialog
            setTableData={setTableData}
            open={isModalOpen}
            setOpen={setIsModalOpen}
          />

          {tableData !== null && (
            <Button
              onClick={() => setIsColumnModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Column</span>
            </Button>
          )}

          {/* // dialog for adding a column */}
          <AddColumnDialog
            setTableData={setTableData}
            open={isColumnModalOpen}
            setOpen={setIsColumnModalOpen}
          />
        </div>

        {tableData && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {tableData.columns.map((column, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {tableData.columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          <Input
                            type={column.type}
                            value={
                              row[String.fromCharCode(65 + colIndex) + (rowIndex + 1).toString()] || ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                colIndex,
                                e.target.value
                              )
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t">
              <Button
                onClick={handleAddRow}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Row</span>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
