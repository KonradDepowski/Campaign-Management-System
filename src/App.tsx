import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/pages/RootLayout";
import Dashboard from "./components/pages/Dashboard";
import Products from "./components/pages/Products";
import Campaigns from "./components/pages/Campaigns";
import { Wallet } from "lucide-react";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/campaigns",
          element: <Campaigns />,
        },
        {
          path: "/wallet",
          element: <Wallet />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
