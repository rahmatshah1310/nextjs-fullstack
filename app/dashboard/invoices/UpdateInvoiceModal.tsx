"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/common/Model";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomers } from "@/utils/customerApi";
import { useProducts } from "@/utils/productApi";
import { useInvoiceById, useUpdateInvoice } from "@/utils/invoiceApi";
import { Icons } from "@/constants/icons";

type Props = {
  open: boolean;
  onClose: (open: boolean) => void;
  invoiceId?: string;
};

type LineItemDraft = {
  id?: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number; // per unit
};

export default function UpdateInvoiceModal({ open, onClose, invoiceId }: Props) {
  const { data: customers = [] } = useCustomers();
  const { data: products = [] } = useProducts() as any;
  const { data: invoice } = useInvoiceById(invoiceId || "");
  const updateMutation = useUpdateInvoice(invoiceId);

  const [customerId, setCustomerId] = useState<string>("");
  const [issueDate, setIssueDate] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [taxRate, setTaxRate] = useState<number>(10);
  const [notes, setNotes] = useState<string>("");
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([]);

  useEffect(() => {
    if (invoice) {
      setCustomerId(invoice.customerId);
      setIssueDate(new Date(invoice.issueDate).toISOString().slice(0, 10));
      setDueDate(new Date(invoice.dueDate).toISOString().slice(0, 10));
      setNotes(invoice.notes || "");
      const impliedTaxRate = invoice.subtotal ? (invoice.tax / invoice.subtotal) * 100 : 0;
      setTaxRate(Number(impliedTaxRate.toFixed(2)));
      setLineItems(
        invoice.lineItems.map((li) => ({ id: li.id, productId: li.productId, quantity: li.quantity, unitPrice: li.unitPrice, discount: li.discount || 0 }))
      );
    }
  }, [invoice]);

  const productMap = useMemo(() => {
    const map: Record<string, any> = {};
    products.forEach((p: any) => (map[p.id] = p));
    return map;
  }, [products]);

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((s, li) => s + (li.unitPrice - (li.discount || 0)) * (li.quantity || 0), 0);
    const tax = (subtotal * Number(taxRate || 0)) / 100;
    const discount = 0;
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  }, [lineItems, taxRate]);

  const updateLine = (id?: string, patch?: Partial<LineItemDraft>) => {
    setLineItems((prev) => prev.map((li) => (li.id === id ? { ...li, ...patch } : li)));
  };

  const addLine = () => {
    setLineItems((prev) => [...prev, { id: crypto.randomUUID(), productId: "", quantity: 1, unitPrice: 0, discount: 0 }]);
  };

  const removeLine = (id?: string) => {
    setLineItems((prev) => prev.filter((li) => li.id !== id));
  };

  const resetAndClose = () => {
    onClose(false);
  };

  const save = async () => {
    if (!invoiceId) return;
    const payload = {
      customerId,
      issueDate: new Date(issueDate).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      notes,
      taxRate: Number(taxRate),
      lineItems: lineItems
        .filter((li) => li.productId && li.quantity > 0)
        .map((li) => ({
          productId: li.productId,
          quantity: Number(li.quantity),
          unitPrice: Number(li.unitPrice),
          discount: Number(li.discount || 0),
        })),
    } as any;
    await updateMutation.mutateAsync(payload);
    resetAndClose();
  };

  return (
    <Modal title={`Edit Invoice ${invoice?.invoiceNumber ?? ""}`} open={open} onClose={onClose} className="sm:max-w-2xl">
      {!invoice ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Customer</label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input type="date" label="Issue Date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </div>
            <div>
              <Input type="date" label="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Line Items</h4>
              <Button variant="outline" size="sm" onClick={addLine}>
                <Icons.plus className="w-4 h-4" /> Add Item
              </Button>
            </div>

            <div className="rounded-xl border overflow-hidden">
              <div className="grid grid-cols-12 gap-0 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-medium">
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2">Discount</div>
                <div className="col-span-1 text-right">Total</div>
                <div className="col-span-1" />
              </div>
              <div className="divide-y">
                {lineItems.map((li) => {
                  const product = productMap[li.productId];
                  return (
                    <div key={li.id} className="grid grid-cols-12 gap-2 items-center px-3 py-3">
                      <div className="col-span-4">
                        <Select
                          value={li.productId}
                          onValueChange={(val) => {
                            const p = productMap[val];
                            updateLine(li.id, { productId: val, unitPrice: p ? Number(p.price) : 0 });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p: any) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          className="w-full border rounded px-2 py-2"
                          min={1}
                          value={li.quantity}
                          onChange={(e) => updateLine(li.id, { quantity: Number(e.target.value) })}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          className="w-full border rounded px-2 py-2"
                          step="0.01"
                          value={li.unitPrice}
                          onChange={(e) => updateLine(li.id, { unitPrice: Number(e.target.value) })}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          className="w-full border rounded px-2 py-2"
                          step="0.01"
                          value={li.discount}
                          onChange={(e) => updateLine(li.id, { discount: Number(e.target.value) })}
                        />
                      </div>
                      <div className="col-span-1 text-right font-medium">${((li.unitPrice - (li.discount || 0)) * (li.quantity || 0)).toFixed(2)}</div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="destructive" size="sm" onClick={() => removeLine(li.id)}>
                          <Icons.trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
              <div>
                <label className="block text-sm mb-1">Tax Rate (%)</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>${totals.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => resetAndClose()}>
              Cancel
            </Button>
            <Button onClick={save}>Save Changes</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
