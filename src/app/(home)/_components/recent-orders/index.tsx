import { getRecentOrdersData } from "@/services/dashboard/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import dayjs from "dayjs";

export async function RecentOrders() {
  const recentOrders = await getRecentOrdersData();

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Recent Orders
      </h4>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-gray-2 dark:bg-meta-4 [&>th]:py-4 [&>th]:px-5 [&>th]:text-base [&>th]:text-black [&>th]:dark:text-white sm:[&>th]:px-7.5">
              <TableHead className="min-w-[150px] text-left">Order ID</TableHead>
              <TableHead className="min-w-[180px] text-left">Customer</TableHead>
              <TableHead className="min-w-[150px] text-left">Total Amount</TableHead>
              <TableHead className="min-w-[120px] text-left">Status</TableHead>
              <TableHead className="min-w-[150px] text-left">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-5">No recent orders found.</TableCell>
              </TableRow>
            ) : (
              recentOrders.map((order, key) => (
                <TableRow
                  className={`border-stroke dark:border-strokedark ${key === recentOrders.length - 1 ? "border-none" : "border-b"} hover:bg-gray-50 dark:hover:bg-meta-4`}
                  key={key}
                >
                  <TableCell className="min-w-[150px] text-left">
                    <p className="text-black dark:text-white">#{order.orderId.slice(0, 8)}</p>
                  </TableCell>
                  <TableCell className="min-w-[180px] text-left">
                    <p className="text-black dark:text-white">{order.customerName}</p>
                  </TableCell>
                  <TableCell className="min-w-[150px] text-left">
                    <p className="text-black dark:text-white">{order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                  </TableCell>
                  <TableCell className="min-w-[120px] text-left">
                    <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      order.status === 'Pending' ? 'bg-warning text-warning' :
                      order.status === 'Completed' ? 'bg-success text-success' :
                      'bg-danger text-danger'
                    }`}>
                      {order.status}
                    </p>
                  </TableCell>
                  <TableCell className="min-w-[150px] text-left">
                    <p className="text-black dark:text-white">{dayjs(order.orderDate).format("MMM DD, YYYY")}</p>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
