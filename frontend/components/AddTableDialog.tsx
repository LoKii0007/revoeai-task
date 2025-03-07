"use client";

import { Dialog } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";


const AddTableDialog = ({
  setTableData,
  open,
  setOpen,
}: {
  setTableData: (data: { columns: any[]; rows: any[] }) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [columnCount, setColumnCount] = useState(1);
  const [columns, setColumns] = useState([{ header: "", type: "text" }]);

  const handleColumnCountChange = (value: string) => {
    const count = parseInt(value, 10);
    setColumnCount(count);
    setColumns(Array(count).fill({ header: "", type: "text" }));
  };

  const handleColumnChange = (
    index: number,
    field: "header" | "type",
    value: string
  ) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      [field]: value,
    };
    setColumns(newColumns);
  };

  const handleCreateTable = () => {
    setTableData({
      columns: columns,
      rows: [columns.map((col, i)=> ({
        [String.fromCharCode(65 + i)+ '1']: ""
      }))],
    });
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Table</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Columns</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={columnCount}
                onChange={(e) => handleColumnCountChange(e.target.value)}
              />
            </div>
            {columns.map((column, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Input
                  required
                  placeholder="Column Header"
                  value={column.header}
                  onChange={(e) =>
                    handleColumnChange(index, "header", e.target.value)
                  }
                />
                <Select
                  value={column.type}
                  onValueChange={(value) =>
                    handleColumnChange(index, "type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTable}>Create Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTableDialog;
