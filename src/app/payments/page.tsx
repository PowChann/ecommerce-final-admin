
import React from 'react';

const PaymentListPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Management</h1>
      <p>This is the payment transaction listing page. Here will be a table of payment transactions.</p>
      {/* Placeholder for Payment Table */}
      <div className="bg-white dark:bg-boxdark rounded-md shadow-sm p-4 mt-6">
        <h2 className="text-xl font-semibold mb-3">Payment Transactions</h2>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-boxdark divide-y divide-gray-200 dark:divide-gray-700">
            {/* Example Row */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">TXN123456</td>
              <td className="px-6 py-4 whitespace-nowrap">ORD98765</td>
              <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
              <td className="px-6 py-4 whitespace-nowrap">$199.99</td>
              <td className="px-6 py-4 whitespace-nowrap">Completed</td>
              <td className="px-6 py-4 whitespace-nowrap">2025-11-27</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200">View Details</a>
                <span className="text-gray-400 dark:text-gray-600 mx-2">|</span>
                <a href="#" className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Refund</a>
              </td>
            </tr>
            {/* More rows will go here */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentListPage;
