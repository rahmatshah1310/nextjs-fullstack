"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/common/StateCard";
import CreateCustomerModal from "./CreateCustomerModel";
import EditCustomerModal from "./EditCustomerModel";
import DeleteCustomerModal from "./DeleteCustomerModal";
import { useCustomers } from "@/utils/customerApi";
import { Customer } from "@prisma/client";
import { Icons } from "@/constants/icons";
import { CustomTable } from "@/components/common/CommonTable";
import Image from "next/image";

const Customers = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);

  const customerResponse = useCustomers();
  const customers: Customer[] = customerResponse?.data || [];

  // Handlers
  const handleEdit = (id: number) => {
    setCustomerId(id);
    setUpdateModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setCustomerId(id);
    setDeleteModalOpen(true);
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Page Header */}
      <div className="text-center mb-6 sm:mb-8 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Customer Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">Manage your customer relationships and data</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
        <StatCard title="Total Customers" value={totalCustomers} icon={<Icons.user className="h-8 w-8" />} fromColor="green-500" toColor="green-600" />
        <StatCard title="Active Customers" value={activeCustomers} icon={<Icons.userPlus className="h-8 w-8" />} fromColor="blue-500" toColor="blue-600" />
        <StatCard
          title="Engagement Rate"
          value={`${totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0}%`}
          icon={<span className="text-lg">📊</span>}
          fromColor="teal-500"
          toColor="teal-600"
        />
      </div>

      {/* Create Button */}
      <div className="flex justify-end px-4 sm:px-0">
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto"
        >
          <Icons.userPlus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Add Customer</span>
        </Button>
      </div>

      {/* Modals */}
      <CreateCustomerModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      {customerId && <EditCustomerModal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} customerId={customerId} />}
      {customerId && <DeleteCustomerModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} customerId={customerId} />}

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mx-4 sm:mx-0">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Customer List</h3>
        </div>
        <div className="overflow-x-auto">
          <CustomTable<Customer>
            columns={[
              {
                header: "Name",
                accessor: "name",
                render: (row) => (
                  <div className="flex items-center gap-3">
                    {row.profileImageUrl ? (
                      <Image
                        src={row.profileImageUrl}
                        alt={row.name}
                        width={15}
                        height={15}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-sm">
                        {row.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-gray-800 dark:text-gray-200">{row.name}</span>
                  </div>
                ),
              },
              { header: "Email", accessor: "email" },
              { header: "Phone", accessor: "phone" },
              { header: "Address", accessor: "address" },
              {
                header: "Status",
                accessor: "status",
                render: (row) => (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                    }`}
                  >
                    {row.status === "active" ? "Active" : "Inactive"}
                  </span>
                ),
              },
              {
                header: "Actions",
                accessor: "id",
                render: (row) => (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(row.id)} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Icons.edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(row.id)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                    >
                      <Icons.trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={customers}
          />
        </div>
      </div>
    </div>
  );
};

export default Customers;
