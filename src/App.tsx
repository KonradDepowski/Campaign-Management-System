import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./components/pages/RootLayout";
import Products from "./components/pages/Products";
import Campaigns from "./components/pages/Campaigns";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Navigate to="/products" />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/campaigns",
          element: <Campaigns />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
