"use client";

import React, { useState } from "react";
import CreateProductModal from "./CreateProductModel";
import UpdateProductModal from "./UpdateProductModal";
import DeleteProductModal from "./DeleteProductModal";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/utils/productApi";
import { CustomTable } from "@/components/common/CommonTable";
import { Icons } from "@/constants/icons";
import StatCard from "@/components/common/StateCard";
import Image from "next/image";

// Define product type
export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
  discount?: number;
  sizes: string[];
  colors: string[];
  isActive: boolean;
  imageUrl?: string;
};

const Products: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const productsResponse = useProducts();
  const products: Product[] = productsResponse?.data || [];
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + Number(product.price || 0), 0);
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

  const handleEdit = (id: string) => {
    setSelectedProductId(id);
    setUpdateModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedProductId(id);
    setDeleteModalOpen(true);
  };
  return (
    <div className="space-y-6 sm:space-y-8 w-full p-4">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Product Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your product catalog and inventory</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Icons.package className="h-8 w-8" />}
          fromColor="blue-500"
          toColor="blue-600"
          textColor="text-blue-100"
        />

        <StatCard
          title="Total Value"
          value={`$${Number(totalValue).toFixed(2)}`}
          icon={<Icons.dollarSign className="h-8 w-8" />}
          fromColor="purple-500"
          toColor="purple-600"
          textColor="text-purple-100"
        />

        <StatCard
          title="Average Price"
          value={`$${Number(avgPrice).toFixed(2)}`}
          icon={<Icons.trendingUp className="h-8 w-8" />}
          fromColor="green-500"
          toColor="green-600"
          textColor="text-green-100"
        />
      </div>

      {/* Create Button */}
      <div className="flex justify-end">
        <Button onClick={() => setCreateModalOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <Icons.plus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </div>

      {/* Modals */}
      <CreateProductModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      {selectedProductId && <UpdateProductModal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} productId={selectedProductId.toString()} />}
      {selectedProductId && <DeleteProductModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} productId={selectedProductId.toString()} />}

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden sm:mx-0">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Product List</h3>
        </div>
        <div className="overflow-x-auto">
          <CustomTable<Product>
            columns={[
              {
                header: "Product",
                accessor: "name",
                render: (row) => (
                  <div className="flex items-center gap-3">
                    {row.imageUrl ? (
                      <Image src={row.imageUrl} alt={row.name} width={10} height={10} className="h-10 w-10 rounded-md object-cover border" />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                        <Icons.image className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{row.name}</p>
                      <p className="text-sm text-gray-500">{row.description}</p>
                    </div>
                  </div>
                ),
              },
              {
                header: "Price",
                accessor: "price",
                render: (row) => <span className="text-green-600 font-semibold">${Number(row.price).toFixed(2)}</span>,
              },
              { header: "Qty", accessor: "quantity" },
              {
                header: "Discount",
                accessor: "discount",
                render: (row) => (row.discount ? `${row.discount}%` : <span className="text-gray-400">—</span>),
              },
              {
                header: "Sizes",
                accessor: "sizes",
                render: (row) => (
                  <div className="flex gap-x-1">
                    {row.sizes.map((size, i) => [<span key={i}>{size}</span>, i < row.sizes.length - 1 && <span key={`comma-${i}`}>,</span>])}
                  </div>
                ),
              },
              {
                header: "Colors",
                accessor: "colors",
                render: (row) => (
                  <div className="flex gap-1">
                    {row.colors.map((color, i) => (
                      <span key={i} className="w-5 h-5 rounded-full border" style={{ backgroundColor: color.toLowerCase() }} title={color} />
                    ))}
                  </div>
                ),
              },
              {
                header: "Category",
                accessor: "category",
                render: (row) => row.category,
              },
              {
                header: "Status",
                accessor: "isActive",
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {row.isActive ? "Active" : "Inactive"}
                  </span>
                ),
              },
              {
                header: "Actions",
                accessor: "id",
                render: (row) => (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(row.id)}>
                      <Icons.edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(row.id)} className="bg-red-500 text-white" size="sm">
                      <Icons.trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={products}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
