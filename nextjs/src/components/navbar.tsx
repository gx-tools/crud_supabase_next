"use client";

import { RouteConstants } from "@/helpers/string_const";

import Link from "next/link";

const courseLinks = [
  { name: "Courses", path: RouteConstants.COURSES },
  { name: "Projects", path: RouteConstants.PROJECTS },
];

export default function Navbar() {
  
  
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
