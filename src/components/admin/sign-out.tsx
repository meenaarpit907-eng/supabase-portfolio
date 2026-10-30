"use client";

import { SignOutButton, UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Clerk sign-out, styled like the rest of the admin UI. */
export function AdminSignOut({ size = "sm" }: { size?: "sm" | "default" }) {
  return (
    <SignOutButton redirectUrl="/">
      <Button type="button" variant="outline" size={size}>
        <LogOut /> Sign out
      </Button>
    </SignOutButton>
  );
}

/** Clerk's account menu (profile, security, sign out). */
export function AdminUserButton() {
  return <UserButton />;
}
