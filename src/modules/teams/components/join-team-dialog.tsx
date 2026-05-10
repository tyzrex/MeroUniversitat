"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinTeamByCodeAction } from "@/modules/teams/actions/team.actions";
import { KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function JoinTeamDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);
    const res = await joinTeamByCodeAction({ code });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (res.data.alreadyMember) {
      setInfo("You’re already in this team.");
    } else {
      setInfo("Joined successfully.");
    }
    setCode("");
    setOpen(false);
    router.refresh();
    router.push(`/dashboard/teams/${res.data.teamId}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 bg-white hover:bg-slate-50"
          >
            <KeyRound className="size-4" strokeWidth={1.8} />
            Join team
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a team</DialogTitle>
          <DialogDescription>
            Paste an invite code shared by the owner (case-insensitive).
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="invite-code">Invite code</Label>
            <Input
              id="invite-code"
              required
              minLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste code here"
              autoComplete="off"
            />
          </div>

          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          {info ? (
            <p className="text-emerald-700 text-sm font-medium">{info}</p>
          ) : null}

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
                  Joining…
                </span>
              ) : (
                "Join team"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

