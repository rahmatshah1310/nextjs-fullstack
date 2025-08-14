// app/components/Sidebar.tsx
import React from "react";
import { Icons } from "@/constants/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useLogoutMutation } from "@/utils/authApi";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigationItems = [
  { id: "home", name: "Dashboard", icon: Icons.home, path: "/" },
  { id: "products", name: "Product Managment", icon: Icons.settings, path: "/dashboard/products" },
  { id: "customers", name: "Customers", icon: Icons.users, path: "/dashboard/customers" },
  { id: "invoices", name: "Invoice", icon: Icons.fileText, path: "/dashboard/invoices" },
  { id: "payment", name: "Payments", icon: Icons.dollarSign, path: "/dashboard/payment" },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/auth/login");
      },
      onError: (error) => {
        console.error(error);
        alert(error?.message || "Logout failed");
      },
    });
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--sidebar-bg)] text-[var(---sidebar-text)]
        shadow-lg transform flex flex-col justify-between 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b   border-gray-200">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <Icons.close className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors cursor-pointer ${
                      isActive ? "bg-blue-900 text-white border-r-2 border-blue-700 rounded-lg" : "rounded-lg hover:bg-gray-300 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-200">
          <Button
            type="submit"
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg
                text-white hover:bg-gray-700"
          >
            <Icons.logOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </>
  );
};

export default Sidebar;
