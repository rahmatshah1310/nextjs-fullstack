"use client";

import React, { useState } from "react";
import CreateProductModal from "./CreateProductModel";
import UpdateProductModal from "./UpdateProductModal";
import DeleteProductModal from "./DeleteProductModal";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useProducts } from "@/utils/productApi";
import { CustomTable } from "@/components/common/CommonTable";

const Products = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const { data: products } = useProducts();

  const handleEdit = (id: number) => {
    setSelectedProductId(id);
    setUpdateModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setSelectedProductId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-end">
        <Button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 rounded hover:bg-blue-900">
          Create Product
        </Button>
      </div>

      {/* Modals */}
      <CreateProductModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      {selectedProductId && <UpdateProductModal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} productId={selectedProductId} />}
      {selectedProductId && <DeleteProductModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} productId={selectedProductId} />}

      {/* Table */}
      <CustomTable
        columns={[
          { header: "Name", accessor: "name" },
          { header: "Description", accessor: "description" },
          { header: "Price", accessor: "price", render: (row: any) => `$${row.price.toFixed(2)}` },
          {
            header: "Actions",
            accessor: "id",
            render: (row: any) => (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(row.id)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleDelete(row.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ),
          },
        ]}
        data={products || []}
      />
    </div>
  );
};

export default Products;
