import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css';
import { ContextProvider } from './contexts/ContextProvider';
import router from './router.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from "react-hot-toast"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          className: '',
          style: {
            background: "#198754",
            color: "#fff"
          },
        }}
      />
    </ContextProvider>
  </React.StrictMode>,
);

