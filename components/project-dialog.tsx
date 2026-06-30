"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { Project, ProjectStatus } from "@/types/projects";
import { User } from "@/types/users";
import { Textarea } from "./ui/textarea";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Project>) => Promise<void> | void;
  initialData?: Project | null;
  isSaving: boolean;
  users: User[];
};

export function ProjectDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
  isSaving,
  users,
}: Props) {
  const [form, setForm] = useState<Partial<Project>>({});

  useEffect(() => {
    if (open) {
      setForm(initialData ?? {});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Project" : "Add Project"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Select
            value={form.status || ""}
            onValueChange={(value: ProjectStatus) =>
              setForm((prev) => ({
                ...prev,
                status: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on hold">On hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Deadline"
            value={form.deadline || ""}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />

          <Input
            placeholder="Budget"
            value={form.budget || ""}
            onChange={(e) =>
              setForm({ ...form, budget: parseInt(e.target.value) })
            }
          />

          <Select
            value={form.team_member?.toString() || ""}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                team_member: Number(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>

            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Write a description..."
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Button
            className="w-full"
            onClick={() => onSave(form)}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
