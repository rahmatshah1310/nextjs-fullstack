import React from "react";
import { Icons } from "@/constants/icons";
import { ModeToggle } from "../ModeToggle";
import Input from "../ui/Input";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  return (
    <header className="border-b border-white/20 bg-gradient-to-r from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center flex-1 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 sm:p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 btn-animate mr-3 sm:mr-4"
          >
            <Icons.menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <div className="flex-1 min-w-0 ml-2 sm:ml-4 lg:ml-8 mt-4">
            <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Icons.search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="block w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-blue-200 rounded-lg sm:rounded-xl text-sm placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 ml-2">
          <ModeToggle />
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications - Hidden on very small screens */}
            <button className="relative p-2 sm:p-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 text-white hover:from-orange-500 hover:to-red-500 shadow-lg hover:shadow-xl transition-all duration-300 btn-animate">
              <Icons.bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute top-0 -right-0 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Profile */}
            <div className="hidden md:flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 rounded-lg sm:rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Icons.user className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">John Doe</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
