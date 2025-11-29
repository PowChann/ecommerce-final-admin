import { getLowStockProductsData } from "../../fetch";
import Image from "next/image";

export async function LowStockProducts() {
  const lowStockProducts = await getLowStockProductsData();

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <h4 className="border-b border-stroke py-4 px-6 text-xl font-semibold text-black dark:border-strokedark dark:text-white">
        Low Stock Products
      </h4>

      <div className="flex flex-col">
        {/* Table Header */}
        {/* Adjusted grid-cols to better distribute space */}
        <div className="grid grid-cols-12 border-b border-stroke py-4.5 px-6 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"> {/* sm:grid-cols-8, md:grid-cols-8 */}
          <div className="col-span-6 sm:col-span-3 md:col-span-3 lg:col-span-4 flex items-center min-w-[150px]"> {/* Product Name */}
            <p className="font-medium">Product Name</p>
          </div>
          <div className="col-span-4 hidden sm:flex md:col-span-2 lg:col-span-2 items-center min-w-[100px]"> {/* Category */}
            <p className="font-medium">Category</p>
          </div>
          <div className="col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1 flex items-center min-w-[70px]"> {/* Price */}
            <p className="font-medium">Price</p>
          </div>
          <div className="col-span-0 hidden sm:flex md:col-span-2 lg:col-span-1 flex items-center min-w-[70px]"> {/* Stock */} {/* col-span-2 for stock on sm */}
            <p className="font-medium">Stock</p>
          </div>
        </div>

        {lowStockProducts.map((product, key) => (
          <div
            className="grid grid-cols-12 border-b border-stroke py-4.5 px-6 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 hover:bg-gray-50 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="col-span-6 sm:col-span-3 md:col-span-3 lg:col-span-4 flex items-center min-w-[150px]"> {/* Product Name */}
              <div className="flex flex-row items-center gap-4">
                <div className="h-12.5 w-15 rounded-md flex-shrink-0">
                  <Image
                    src={product.image || "/images/placeholder.png"}
                    width={60}
                    height={50}
                    alt={product.name}
                    className="h-full w-full object-cover rounded-sm"
                  />
                </div>
                <p className="text-sm font-medium text-black dark:text-white line-clamp-2">
                  {product.name}
                </p>
              </div>
            </div>
            <div className="col-span-4 hidden sm:flex md:col-span-2 lg:col-span-2 items-center min-w-[100px]"> {/* Category */}
              <p className="text-sm font-medium text-black dark:text-white">
                {product.category}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1 flex items-center min-w-[70px]"> {/* Price */}
              <p className="text-sm font-medium text-black dark:text-white">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <div className="col-span-0 hidden sm:flex md:col-span-2 lg:col-span-1 flex items-center min-w-[70px]"> {/* Stock */}
              <p className="text-sm font-medium text-meta-1">
                {product.stock}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
