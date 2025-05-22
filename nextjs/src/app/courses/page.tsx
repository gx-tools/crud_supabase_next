'use client';

import StudentDashboard from "@/components/student-dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <StudentDashboard />
    </ProtectedRoute>
  );
}