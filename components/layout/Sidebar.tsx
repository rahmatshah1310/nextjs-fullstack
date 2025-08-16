// app/components/Sidebar.tsx
import React from "react";
import { Icons } from "@/constants/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useLogoutMutation } from "@/utils/authApi";
import { toast } from "react-toastify";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigationItems = [
  { id: "home", name: "Dashboard", icon: Icons.home, path: "/", color: "from-blue-500 to-blue-600" },
  { id: "products", name: "Products", icon: Icons.settings, path: "/dashboard/products", color: "from-purple-500 to-purple-600" },
  { id: "customers", name: "Customers", icon: Icons.users, path: "/dashboard/customers", color: "from-green-500 to-green-600" },
  { id: "invoices", name: "Invoice", icon: Icons.fileText, path: "/dashboard/invoices", color: "from-orange-500 to-orange-600" },
  { id: "payment", name: "Payments", icon: Icons.dollarSign, path: "/dashboard/payment", color: "from-pink-500 to-pink-600" },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logout Successfully");
        router.push("/auth/login");
      },
      onError: (error) => {
        console.error(error);
        toast.error(error?.message || "Logout failed");
      },
    });
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white
        shadow-2xl transform flex flex-col justify-between 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        style={{
          background: "var(--sidebar-bg)",
        }}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 border-b border-white/20 bg-white/10 backdrop-blur-sm">
            <h1 className="text-xl sm:text-2xl font-bold gradient-text bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              InvoicePro
            </h1>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <Icons.close className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6 sm:mt-8 px-3 sm:px-4">
            <div className="space-y-2 sm:space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`w-full flex items-center px-3 sm:px-4 py-3 sm:py-4 text-left rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer group ${
                      isActive 
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30" 
                        : "text-white/80 hover:bg-white/10 hover:text-white rounded-lg sm:rounded-xl hover:shadow-md"
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 transition-all duration-300 ${
                      isActive 
                        ? "bg-white/20 backdrop-blur-sm" 
                        : "group-hover:bg-white/10"
                    }`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span className="font-medium text-sm sm:text-base">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Logout */}
        <div className="px-3 sm:px-4 py-4 sm:py-6 border-t border-white/20">
          <Button
            type="submit"
            onClick={handleLogout}
            className="w-full flex items-center px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl
                bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 
                shadow-lg hover:shadow-xl transition-all duration-300 btn-animate text-sm sm:text-base"
          >
            <Icons.logOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </>
  );
};

export default Sidebar;
