import { getLowStockProductsData } from "@/services/dashboard/api";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export async function LowStockProducts() {
  const lowStockProducts = await getLowStockProductsData();

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Low Stock Products
      </h4>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-gray-2 dark:bg-meta-4 [&>th]:py-4 [&>th]:px-5 [&>th]:text-base [&>th]:text-black [&>th]:dark:text-white sm:[&>th]:px-7.5">
              <TableHead className="min-w-[100px] text-left">Image</TableHead>
              <TableHead className="min-w-[150px] text-left">Product Name</TableHead>
              <TableHead className="min-w-[120px] text-left">Category</TableHead>
              <TableHead className="min-w-[100px] text-left">Price</TableHead>
              <TableHead className="min-w-[100px] text-left">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-5">No low stock products found.</TableCell>
              </TableRow>
            ) : (
              lowStockProducts.map((product, key) => (
                <TableRow
                  className={`border-stroke dark:border-strokedark ${key === lowStockProducts.length - 1 ? "border-none" : "border-b"} hover:bg-gray-50 dark:hover:bg-meta-4`}
                  key={key}
                >
                  <TableCell className="min-w-[100px]">
                    <div className="h-12.5 w-15 rounded-md flex-shrink-0 overflow-hidden">
                      <Image
                        src={product.image || "/images/placeholder.png"}
                        width={60}
                        height={50}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <p className="text-black dark:text-white line-clamp-2">{product.name}</p>
                  </TableCell>
                  <TableCell className="min-w-[120px]">
                    <p className="text-black dark:text-white">{product.category}</p>
                  </TableCell>
                  <TableCell className="min-w-[100px]">
                    <p className="text-black dark:text-white">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                  </TableCell>
                  <TableCell className="min-w-[100px]">
                    <p className="text-meta-1 font-medium">{product.stock}</p>
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