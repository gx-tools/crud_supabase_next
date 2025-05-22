'use client';

import Courses from "@/components/courses";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Courses />
    </ProtectedRoute>
  );
}