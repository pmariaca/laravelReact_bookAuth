import { Navigate, createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import NotFound from "./views/NotFound";
import Dashboard from "./views/Dashboard"
import Books from "./views/Books";
import BookForm from "./views/BookForm";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/books" />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/books',
        element: <Books />
      },
      {
        path: '/books/new',
        element:<BookForm key="bookCreate" />
      },
      {
        path: '/books/:id',
        element:<BookForm key="bookUpdate" />
      },
    ],
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/home" />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  },
])
export default router
