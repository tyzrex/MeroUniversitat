"use client";

import { dashboardPrimaryActionClass } from "@/modules/dashboard/lib/dashboard-header-actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTeamAction } from "@/modules/teams/actions/team.actions";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateTeamDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await createTeamAction({ name, description });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setName("");
    setDescription("");
    setOpen(false);
    router.refresh();
    router.push(`/dashboard/teams/${res.data.teamId}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            className={cn(dashboardPrimaryActionClass(), "gap-2 shadow-none")}
          >
            <Plus className="size-4" strokeWidth={1.8} />
            Create new team
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new team</DialogTitle>
          <DialogDescription>
            Invite teammates with a code and share applications on the same Kanban.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="team-name">Team name</Label>
            <Input
              id="team-name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Code to Germany"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-desc">Description (optional)</Label>
            <Input
              id="team-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short purpose or focus area"
            />
          </div>

          {error ? <p className="text-destructive text-sm">{error}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-xl bg-[#0d2145] text-white hover:bg-[#1a3461]"
              disabled={pending}
            >
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Creating…
                </span>
              ) : (
                "Create team"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

