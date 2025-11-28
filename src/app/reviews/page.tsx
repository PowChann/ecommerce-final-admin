
import React from 'react';

const ReviewListPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Review & Rating Management</h1>
      <p>This is the review listing page. Here will be a table of product reviews with moderation tools.</p>
      {/* Placeholder for Review Table */}
      <div className="bg-white dark:bg-boxdark rounded-md shadow-sm p-4 mt-6">
        <h2 className="text-xl font-semibold mb-3">Product Reviews</h2>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-boxdark divide-y divide-gray-200 dark:divide-gray-700">
            {/* Example Row */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Product X</td>
              <td className="px-6 py-4 whitespace-nowrap">Alice Smith</td>
              <td className="px-6 py-4 whitespace-nowrap">5 Stars</td>
              <td className="px-6 py-4 whitespace-nowrap">Great product, highly recommend!</td>
              <td className="px-6 py-4 whitespace-nowrap">Pending</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200">Approve</a>
                <span className="text-gray-400 dark:text-gray-600 mx-2">|</span>
                <a href="#" className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-200">Reject</a>
                <span className="text-gray-400 dark:text-gray-600 mx-2">|</span>
                <a href="#" className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</a>
              </td>
            </tr>
            {/* More rows will go here */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewListPage;
