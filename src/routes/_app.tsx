import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { isAuthed } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    // Client-only guard (localStorage token). SSR renders, then the client redirects if signed out.
    if (typeof window !== "undefined" && !isAuthed()) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <AppShell />,
});
