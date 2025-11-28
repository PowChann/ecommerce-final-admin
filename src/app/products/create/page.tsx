
import React from 'react';

const CreateProductPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
      <p>This page will provide a form to create a new product.</p>
      {/* Placeholder for Create Product Form */}
      <div className="bg-white dark:bg-boxdark rounded-md shadow-sm p-4 mt-6">
        <h2 className="text-xl font-semibold mb-3">Product Details</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Product Name</label>
            <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Example Product" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
            <textarea id="description" name="description" rows={3} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Product description..."></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Price</label>
            <input type="number" id="price" name="price" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="0.00" step="0.01" />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Stock</label>
            <input type="number" id="stock" name="stock" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="0" />
          </div>
          {/* Add fields for images, associated categories, brands, and tags here */}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Create Product</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
