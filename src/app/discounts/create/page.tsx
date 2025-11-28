
import React from 'react';

const CreateDiscountPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Discount</h1>
      <p>This page will provide a form to create a new discount.</p>
      
      {/* Placeholder for Create Discount Form */}
      <div className="bg-white dark:bg-boxdark rounded-md shadow-sm p-4 mt-6">
        <h2 className="text-xl font-semibold mb-3">Discount Details</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Discount Code</label>
            <input type="text" id="code" name="code" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="DISCOUNTCODE" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Type</label>
            <select id="type" name="type" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option>Percentage</option>
              <option>Fixed Amount</option>
            </select>
          </div>
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Value</label>
            <input type="number" id="value" name="value" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="0.00" step="0.01" />
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Expiry Date</label>
            <input type="date" id="expiryDate" name="expiryDate" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
          {/* Add fields for usage limits, applicable products/categories here */}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Create Discount</button>
        </form>
      </div>
    </div>
  );
};

export default CreateDiscountPage;
