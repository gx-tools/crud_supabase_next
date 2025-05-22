"use client";

import { AuthRouteConstants, RouteConstants } from "@/helpers/string_const";
import { useAuth } from "@/providers/AuthProvider";
import { Link } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const courseLinks = [
  { name: "Courses", path: RouteConstants.COURSES },
];

export default function Navbar() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        router.push(RouteConstants.COURSES);
      } else {
        router.push(AuthRouteConstants.LOGIN);
      }
    }
  }, [isAuthenticated, isAuthLoading, router]);
  
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        {courseLinks.map((link) => (
          <li key={link.name}>
            <Link href={link.path} className="text-white hover:underline">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
