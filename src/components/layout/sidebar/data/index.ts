import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/", // Thêm URL trực tiếp cho Dashboard
        items: [], // Xóa bỏ items con
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        title: "Products",
        url: "/products",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Orders",
        url: "/orders",
        icon: Icons.Calendar, 
        items: [],
      },
      {
        title: "Users",
        url: "/users",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Payments",
        url: "/payments",
        icon: Icons.PieChart,
        items: [],
      },
    ],
  },
  {
    label: "CATALOG",
    items: [
      {
        title: "Categories",
        url: "/categories",
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "Brands",
        url: "/brands",
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "Tags",
        url: "/tags",
        icon: Icons.Alphabet,
        items: [],
      },
    ],
  },
  {
    label: "MARKETING & OTHERS",
    items: [
      {
        title: "Discounts",
        url: "/discounts",
        icon: Icons.PieChart,
        items: [],
      },
      {
        title: "Reviews",
        url: "/reviews",
        icon: Icons.Alphabet,
        items: [],
      },
    ],
  },
];