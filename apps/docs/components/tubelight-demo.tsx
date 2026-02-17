"use client";

import { NavBar } from "@bank-kit/registry/tubelight-navbar/tubelight-navbar";
import { Home, User, Settings } from "lucide-react";

/**
 * TubelightDemo renders a live demo of the Tubelight Navbar component with sample items.
 */
export function NavBarDemo() {
  return (
    <div className="w-full h-full">
    <NavBar
      items={[
        { name: "Home", url: "/", icon: Home },
        { name: "Profile", url: "/profile", icon: User },
        { name: "Settings", url: "/settings", icon: Settings },
      ]}
    />
</div>
  );
} 