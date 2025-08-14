import React from "react";
import { Icons } from "@/constants/icons";
import { ModeToggle } from "../ModeToggle";
import Input from "../ui/Input";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  return (
    <header className="border-b border-white">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md ">
            {/* <Menu className="h-5 w-5" /> */}
            <Icons.menu className="h-5 w-5" />
          </button>

          <div className="ml-4 lg:ml-0">
            <div className="relative max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ModeToggle />
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Icons.user className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium  hidden sm:block">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
