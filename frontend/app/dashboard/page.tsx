"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Plus, Table, X, Trash } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddTableDialog from "@/components/AddTableDialog";
import AddColumnDialog from "@/components/AddColumnDialog";
import { useSocket } from "@/hooks/useSocket";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { processSpreadsheetData } from "@/utils/helper";
import { useDebounce } from "use-debounce";

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
  const { user, logout } = useAuth();
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const socket = useSocket();
  const { toast } = useToast();
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("taskToken") || ""
      : "";
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [debouncedTableData] = useDebounce(tableData, 1000);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("taskToken");
    router.push("/login");
  };

  const handleAddRow = () => {
    if (tableData) {
      let newRow: Record<string, string> = {};
      tableData.columns.forEach((col: Column, i: number) => {
        newRow[getObjectKey(i, tableData.rows.length)] = "";
      });

      setTableData((prev: any) => ({
        ...prev,
        rows: [...prev.rows, newRow],
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
        rows: prev?.rows.map((row: any, idx: number) =>
          idx === rowIndex
            ? {
                ...row,
                [getObjectKey(colIndex, rowIndex)]: value,
              }
            : row
        ),
      }));
    }
  };

  async function fetchSheetData() {
    try {
      setIsFetching(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sheets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status !== 200) {
        console.error("some error");
      }
      setTableData(processSpreadsheetData(res.data.sheetData));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sheet data",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  }

  async function createTable(columns: any[], rows: any[]) {
    try {
      setIsCreating(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tables/create`,
        {
          columns,
          rows,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to create table",
          variant: "destructive",
        });
      }
      toast({
        title: "Success",
        description: "Table created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create table",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  }

  async function fetchTableData() {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tables/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: (status) => status < 500,
        }
      );
      if (res.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to fetch table data",
          variant: "destructive",
        });
      }
      setTableData({
        columns: res.data.tableData[0].columns,
        rows: res.data.tableData[0].rows,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch table data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function updateTableData() {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tables/update`,
        {
          columns: debouncedTableData?.columns,
          rows: debouncedTableData?.rows,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to update table data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update table data",
        variant: "destructive",
      });
    }
  }

  async function deleteTableData() {
    try {
      setIsDeleting(true);
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tables/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to delete table data",
          variant: "destructive",
        });
      }
      toast({
        title: "Success",
        description: "Table data deleted successfully",
      });
      setTableData(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete table data",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  //? socket connection and live updates from google sheet
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("sheetDataUpdated", (data: any) => {
      setTableData((prev: any) => {
        if (!prev || !prev.rows) {
          console.warn("tableData or rows is null, skipping update");
          return prev;
        }

        const rowIndex = parseInt(data.updatedRange.charAt(1));
        const colIndex = data.updatedRange.charAt(0);
        const value = data.data[0][0];

        let updatedRows = [...prev.rows];

        // If the rowIndex is greater than current rows length, add new rows
        if (rowIndex > updatedRows.length) {
          let newRow: Record<string, string> = {};
          for (let i = updatedRows.length; i < rowIndex; i++) {
            prev.columns.forEach((col: Column, idx: number) => {
              newRow[getObjectKey(idx, i)] = "";
            });
            updatedRows.push(newRow);
          }
        }

        // update the specific cell in the row
        if (updatedRows[rowIndex - 1]) {
          updatedRows[rowIndex - 1] = {
            ...updatedRows[rowIndex - 1],
            [colIndex + rowIndex.toString()]: value,
          };
        }

        return {
          ...prev,
          rows: updatedRows,
        };
      });
    });

    // Clean on unmount
    return () => {
      socket.off("sheetDataUpdated");
    };
  }, [socket]);

  useEffect(() => {
    const token = localStorage.getItem("taskToken");
    if (!token) {
      router.push("/login"); // Redirect if no token
    } else {
      fetchTableData();
    }
  }, []);

  useEffect(() => {
    if (debouncedTableData) {
      updateTableData();
    }
  }, [debouncedTableData]);

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
        <div className="mb-6 flex justify-end items-center gap-6">
          {tableData === null && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Table className="h-4 w-4" />
              <span>Create Table</span>
            </Button>
          )}

          <Button
            onClick={() => fetchSheetData()}
            className="flex items-center space-x-2 w-[170px]"
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Table className="h-4 w-4" />
                <span>Fetch Sheet Data</span>
              </>
            )}
          </Button>

          {/* // dialog for creating a table */}
          <AddTableDialog
            setTableData={setTableData}
            open={isModalOpen}
            setOpen={setIsModalOpen}
            createTable={createTable}
            isCreating={isCreating}
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

          {tableData !== null && (
            <Button
              onClick={() => deleteTableData()}
              disabled={isDeleting}
              className="flex items-center space-x-2 bg-red-500"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash className="h-4 w-4" />
                  <span>Delete Table</span>
                </>
              )}
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
                    {tableData?.columns?.map((column, index) => (
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
                  {tableData?.rows?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {tableData?.columns?.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          <Input
                            type={column.type}
                            value={row[getObjectKey(colIndex, rowIndex)] || ""}
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
