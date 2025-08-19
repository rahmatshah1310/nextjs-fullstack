"use client";

import React, { useMemo } from "react";
import { Modal } from "@/components/common/Model";
import { Button } from "@/components/ui/button";
import { useInvoiceById, useUpdateInvoice } from "@/utils/invoiceApi";
import { useCustomers } from "@/utils/customerApi";

type Props = { open: boolean; onClose: (open: boolean) => void; invoiceId?: string };

export default function ViewInvoiceModal({ open, onClose, invoiceId }: Props) {
  const { data: invoice } = useInvoiceById(invoiceId || "");
  const { data: customers = [] } = useCustomers();
  const updateMutation = useUpdateInvoice(invoiceId);

  const customerName = useMemo(() => customers.find((c: any) => c.id === invoice?.customerId)?.name || "—", [customers, invoice]);
  const displayStatus = useMemo(() => {
    if (!invoice) return "DRAFT";
    const isOverdue = invoice.status !== "PAID" && new Date(invoice.dueDate) < new Date();
    return isOverdue ? "OVERDUE" : invoice.status;
  }, [invoice]);

  const markAsPaid = async () => {
    if (!invoiceId || !invoice) return;
    await updateMutation.mutateAsync({ status: "PAID", paidAmount: invoice.totalAmount });
    onClose(false);
  };

  return (
    <Modal title={`Invoice ${invoice?.invoiceNumber || ""}`} open={open} onClose={onClose} className="sm:max-w-2xl">
      {!invoice ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Customer</div>
              <div className="font-medium">{customerName}</div>
            </div>
            <div>
              <div className="text-gray-500">Issue Date</div>
              <div>{new Date(invoice.issueDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-gray-500">Due Date</div>
              <div>{new Date(invoice.dueDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-gray-500">Status</div>
              <div className="font-medium">{displayStatus}</div>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="grid grid-cols-12 gap-0 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-medium">
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Unit</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            <div className="divide-y">
              {invoice.lineItems.map((li) => (
                <div key={li.id} className="grid grid-cols-12 gap-2 items-center px-3 py-3 text-sm">
                  <div className="col-span-2 text-right">{li.quantity}</div>
                  <div className="col-span-2 text-right">${Number(li.unitPrice).toFixed(2)}</div>
                  <div className="col-span-2 text-right font-medium">${Number(li.total).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-sm">
            <div className="flex justify-between gap-10 w-full md:w-1/2">
              <span>Subtotal</span>
              <span>${Number(invoice.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-10 w-full md:w-1/2">
              <span>Tax</span>
              <span>${Number(invoice.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-10 w-full md:w-1/2">
              <span>Discount</span>
              <span>${Number(invoice.discount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-10 w-full md:w-1/2 text-base font-semibold">
              <span>Total</span>
              <span>${Number(invoice.totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-10 w-full md:w-1/2">
              <span>Paid</span>
              <span>${Number(invoice.paidAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-10 w-full md:w-1/2">
              <span>Balance</span>
              <span>${(Number(invoice.totalAmount) - Number(invoice.paidAmount)).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              Print
            </Button>
            {displayStatus !== "PAID" && <Button onClick={markAsPaid}>Mark as Paid</Button>}
            <Button variant="outline" onClick={() => onClose(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
