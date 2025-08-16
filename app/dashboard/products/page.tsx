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

// Define product type
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

const Products: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Fetch products
  const productsResponse = useProducts();
  const products: Product[] = productsResponse?.data || [];

  // Calculate stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + product.price, 0);
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

  // Handlers
  const handleEdit = (id: number) => {
    setSelectedProductId(id);
    setUpdateModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setSelectedProductId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Page Header */}
      <div className="text-center mb-6 sm:mb-8 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Product Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg px-4 sm:px-0">Manage your product catalog and inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
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
          value={`$${totalValue.toFixed(2)}`}
          icon={<Icons.dollarSign className="h-8 w-8" />}
          fromColor="purple-500"
          toColor="purple-600"
          textColor="text-purple-100"
        />

        <StatCard
          title="Average Price"
          value={`$${avgPrice.toFixed(2)}`}
          icon={<Icons.trendingUp className="h-8 w-8" />}
          fromColor="green-500"
          toColor="green-600"
          textColor="text-green-100"
          colSpan="sm:col-span-2 lg:col-span-1"
        />
      </div>
      {/* Create Button */}
      <div className="flex justify-end px-4 sm:px-0">
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-animate flex items-center space-x-2 w-full sm:w-auto"
        >
          <Icons.plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Create Product</span>
        </Button>
      </div>

      {/* Modals */}
      <CreateProductModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      {selectedProductId && <UpdateProductModal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} productId={selectedProductId} />}
      {selectedProductId && <DeleteProductModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} productId={selectedProductId} />}

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mx-4 sm:mx-0">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">Product List</h3>
        </div>
        <div className="overflow-x-auto">
          <CustomTable<Product>
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Description", accessor: "description" },
              {
                header: "Price",
                accessor: "price",
                render: (row) => (
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    ${row.price.toFixed(2)}
                  </span>
                ),
              },
              {
                header: "Actions",
                accessor: "id",
                render: (row) => (
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(row.id)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 btn-animate p-1 sm:p-2"
                    >
                      <Icons.edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(row.id)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transition-all duration-200 btn-animate p-1 sm:p-2"
                    >
                      <Icons.trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
