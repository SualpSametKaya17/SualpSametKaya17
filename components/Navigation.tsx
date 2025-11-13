"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Database } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              AI Report Generator
            </Link>

            <div className="flex space-x-4">
              <Link
                href="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <MessageSquare size={18} />
                <span>Chat</span>
              </Link>

              <Link
                href="/database"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/database")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Database size={18} />
                <span>Veritabanı Ayarları</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
