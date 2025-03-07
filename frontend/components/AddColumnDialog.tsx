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
  const [newColumn, setNewColumn] = useState({ header: "", type: "text" });

  const handleCreateTable = () => {
    //@ts-ignore
    setTableData((prev) => ({
      columns: [...prev.columns, newColumn],
      rows: prev.rows.map((row: any, i: number) => ({
        ...row,
        [String.fromCharCode(65 + prev.columns.length) + (i + 1).toString()]: "",
      })),
    }));
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Column</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <Input
                required
                placeholder="Column Header"
                value={newColumn.header}
                onChange={(e) =>
                  setNewColumn({ ...newColumn, header: e.target.value })
                }
              />
              <Select
                value={newColumn.type}
                onValueChange={(value) =>
                  setNewColumn({ ...newColumn, type: value })
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTable}>Add Column</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTableDialog;
