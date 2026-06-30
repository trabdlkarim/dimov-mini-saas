/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/api/projects";
import { DataTable } from "./data-table";
import { columns } from "./project-columns";
import { ProjectDialog } from "./project-dialog";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Project } from "@/types/projects";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getUsers } from "@/lib/api/users";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function ProjectTable() {
  const { data: session } = useSession();
  const token = session?.token;

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [status, setStatus] = useState<string | undefined>();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(token!),
    enabled: !!token,
  });

  const users = usersQuery.data ?? [];

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects", debouncedSearch, status],
    enabled: !!token,
    staleTime: 1000 * 10, // reduces refetch flicker,
    placeholderData: (prev) => prev,
    queryFn: () =>
      getProjects(token!, {
        search: debouncedSearch,
        status: status === "all" ? undefined : status,
        // page,
        //limit: 10,
      }),
  });

  const teamMemberMap = React.useMemo(() => {
    return new Map(users.map((u) => [u.id, u.name]));
  }, [users]);

  const createMutation = useMutation({
    mutationFn: (data: any) => createProject(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      toast.success("Project successfully created.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create project.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateProject(editingProject.id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      setEditingProject(null);
      toast.success("Project successfully updated.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update project.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProject(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project successfully deleted.");
      setProjectToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete project.");
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <p>Loading projects...</p>;
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <p>{error.message}</p>

        <button
          onClick={() => refetch()}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button
          onClick={() => {
            setEditingProject(null);
            setOpen(true);
          }}
        >
          Add project
        </Button>

        <Select
          value={status ?? "all"}
          onValueChange={(value) => {
            setStatus(value === "all" ? undefined : value);
            //setPage(1); // reset pagination
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on hold">On hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Input
        placeholder="Search projects..."
        value={search}
        onChange={(e) => {
            setSearch(e.target.value);
            //setPage(1);
        }}
      />

      <DataTable
        columns={columns}
        data={data}
        meta={{
          teamMemberMap,
          onEdit: (project: any) => {
            setEditingProject(project);
            setOpen(true);
          },
          onDelete: (project: any) => {
            // Open confirmation dialog before deletion
            //deleteMutation.mutate(project.id);
            setProjectToDelete(project);
          },
        }}
      />

      <ProjectDialog
        open={open}
        onOpenChange={setOpen}
        initialData={editingProject}
        isSaving={isSaving}
        users={users}
        onSave={(form) => {
          if (editingProject) {
            updateMutation.mutate(form);
          } else {
            createMutation.mutate(form);
          }
        }}
      />

      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete{" "}
              <strong>{projectToDelete?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() =>
                projectToDelete && deleteMutation.mutate(projectToDelete.id)
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
