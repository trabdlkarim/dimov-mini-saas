/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Project } from "@/types/projects";
import { Button } from "./ui/button";

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
  },
  {
    accessorKey: "budget",
    header: "Budget($)",
  },
  {
    accessorKey: "team_member",
    header: "Team member",
    cell: ({ row, table }) => {
      const memberMap = (table.options.meta as any)?.teamMemberMap;

      const userId = row.original.team_member;

      return userId ? (memberMap?.get(userId) ?? "—") : "—";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const project = row.original;

      
      const meta = table.options.meta as any;

      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => meta?.onEdit(project)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => meta?.onDelete(project)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
