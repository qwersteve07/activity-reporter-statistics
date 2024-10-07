import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AppPage from './App.tsx'
import UploadPage from './upload.tsx';
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <UploadPage />
    ,
  }, {
    path: '/app',
    element: <AppPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
