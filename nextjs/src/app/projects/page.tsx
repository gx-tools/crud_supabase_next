'use client';

import Projects from "@/components/projects";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Projects />
    </ProtectedRoute>
  );
}