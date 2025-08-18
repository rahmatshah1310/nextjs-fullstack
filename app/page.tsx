import StatCard from "@/components/common/StateCard";
import AppLayout from "./dashboard/layout";
import { Icons } from "@/constants/icons";
import Link from "next/link";

export default function Home() {
  const quickActions = [
    {
      label: "Add Product",
      icon: Icons.package,
      href: "/dashboard/products",
      gradient: "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
    },
    {
      label: "Add Customer",
      icon: Icons.users,
      href: "/dashboard/customers",
      gradient: "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
    },
    {
      label: "Create Invoice",
      icon: Icons.fileText,
      href: "/dashboard/invoices",
      gradient: "from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600",
    },
    {
      label: "Schedule Meeting",
      icon: Icons.calendar,
      href: "/meetings/schedule",
      gradient: "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
    },
  ];
  const recentActivity = [
    { id: 1, action: "New order received", customer: "John Smith", amount: "$299.00", time: "2 minutes ago", status: "pending" },
    { id: 2, action: "Payment completed", customer: "Sarah Johnson", amount: "$599.00", time: "1 hour ago", status: "completed" },
    { id: 3, action: "New customer registered", customer: "Mike Davis", amount: "", time: "3 hours ago", status: "new" },
    { id: 4, action: "Product updated", customer: "Product Team", amount: "", time: "5 hours ago", status: "updated" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="text-center mb-6 sm:mb-8 px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Welcome back, John!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg px-4 sm:px-0">Here is what happening with your business today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            icon={<Icons.dollarSign className="h-6 w-6 sm:h-8 sm:w-8" />}
            fromColor="green-500"
            toColor="emerald-600"
          />

          <StatCard title="Total Orders" value="2,350" icon={<Icons.fileText className="h-6 w-6 sm:h-8 sm:w-8" />} fromColor="blue-500" toColor="indigo-600" />

          <StatCard
            title="Total Customers"
            value="1,234"
            icon={<Icons.users className="h-6 w-6 sm:h-8 sm:w-8" />}
            fromColor="purple-500"
            toColor="violet-600"
          />

          <StatCard title="Total Products" value="156" icon={<Icons.package className="h-6 w-6 sm:h-8 sm:w-8" />} fromColor="orange-500" toColor="red-600" />
        </div>
        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
          {/* Revenue Chart Placeholder */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Revenue Overview</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Last 7 days</span>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div className="h-48 sm:h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400 px-4">
                <Icons.trendingUp className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-blue-400" />
                <p className="text-base sm:text-lg font-medium">Revenue Chart</p>
                <p className="text-sm">Chart visualization would go here</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6">Recent Activity</h3>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.status === "completed"
                        ? "bg-green-500"
                        : activity.status === "pending"
                        ? "bg-yellow-500"
                        : activity.status === "new"
                        ? "bg-blue-500"
                        : "bg-purple-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.customer}</p>
                    {activity.amount && <p className="text-xs font-medium text-green-600 dark:text-green-400">{activity.amount}</p>}
                    <p className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 px-4 sm:px-0">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 pl-0 sm:pl-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r ${action.gradient} text-white transition-all duration-300 btn-animate text-center`}
              >
                <action.icon className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
                <span className="text-xs sm:text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
