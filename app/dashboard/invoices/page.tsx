"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/common/CommonTable";
import { Icons } from "@/constants/icons";
import StatCard from "@/components/common/StateCard";
import CreateInvoiceModal from "./CreateInvoiceModal";
import DeleteInvoiceModal from "./DeleteInvoiceModal";
import ViewInvoiceModal from "./ViewInvoiceModal";
import UpdateInvoiceModal from "./UpdateInvoiceModal";
import { useInvoices } from "@/utils/invoiceApi";
import { useCustomers } from "@/utils/customerApi";

type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  status: "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  totalAmount: number;
};

const statusClass = (status: InvoiceRow["status"]) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";
    case "OVERDUE":
      return "bg-red-100 text-red-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "CANCELLED":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Invoices: React.FC = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const { data: invoices = [] } = useInvoices() as any;
  const { data: customers = [] } = useCustomers();
  const customerMap = useMemo(() => Object.fromEntries(customers.map((c: any) => [c.id, c.name])), [customers]);

  const stats = useMemo(() => {
    const total = invoices.length;
    const revenue = invoices.reduce((s: number, inv: any) => s + Number(inv.totalAmount || 0), 0);
    const paid = invoices.filter((i: any) => i.status === "PAID").length;
    return { total, revenue, paid };
  }, [invoices]);

  const rows: InvoiceRow[] = useMemo(
    () =>
      invoices.map((i: any) => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        customerName: customerMap[i.customerId] || "—",
        issueDate: new Date(i.issueDate).toLocaleDateString(),
        dueDate: new Date(i.dueDate).toLocaleDateString(),
        status: (() => {
          const isOverdue = i.status !== "PAID" && new Date(i.dueDate) < new Date();
          return isOverdue ? "OVERDUE" : i.status;
        })(),
        totalAmount: Number(i.totalAmount || 0),
      })),
    [invoices, customerMap]
  );

  const onDelete = (id: string) => {
    setSelectedId(id);
    setDeleteOpen(true);
  };
  const onView = (id: string) => {
    setSelectedId(id);
    setViewOpen(true);
  };
  const onEdit = (id: string) => {
    setSelectedId(id);
    setEditOpen(true);
  };

  return (
    <div className="space-y-6 w-full p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Invoices
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Create, send and manage invoices</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Invoices" value={stats.total} icon={<Icons.fileText className="h-8 w-8" />} fromColor="blue-500" toColor="blue-600" textColor="text-blue-100" />
        <StatCard title="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} icon={<Icons.dollarSign className="h-8 w-8" />} fromColor="purple-500" toColor="purple-600" textColor="text-purple-100" />
        <StatCard title="Paid Invoices" value={stats.paid} icon={<Icons.trendingUp className="h-8 w-8" />} fromColor="green-500" toColor="green-600" textColor="text-green-100" />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <Icons.plus className="h-4 w-4 mr-1" /> New Invoice
        </Button>
      </div>

      <CreateInvoiceModal open={createOpen} onClose={setCreateOpen} />
      <DeleteInvoiceModal open={deleteOpen} onClose={setDeleteOpen} invoiceId={selectedId} />
      <ViewInvoiceModal open={viewOpen} onClose={setViewOpen} invoiceId={selectedId} />
      <UpdateInvoiceModal open={editOpen} onClose={setEditOpen} invoiceId={selectedId} />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Invoice List</h3>
        </div>
        <div className="overflow-x-auto">
          <CustomTable<InvoiceRow>
            columns={[
              { header: "Invoice #", accessor: "invoiceNumber" },
              { header: "Customer", accessor: "customerName" },
              { header: "Issue Date", accessor: "issueDate" },
              { header: "Due Date", accessor: "dueDate" },
              {
                header: "Status",
                accessor: "status",
                render: (row) => <span className={`px-2 py-1 rounded-full text-xs ${statusClass(row.status)}`}>{row.status.toLowerCase()}</span>,
              },
              { header: "Total", accessor: "totalAmount", render: (row) => `$${row.totalAmount.toFixed(2)}` },
              {
                header: "Actions",
                accessor: "id",
                render: (row) => (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onView(row.id)}>
                      <Icons.eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEdit(row.id)}>
                      <Icons.edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(row.id)}>
                      <Icons.trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={rows}
          />
        </div>
      </div>
    </div>
  );
};

export default Invoices;
