import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />,
  },
  {
    path: "/directory/:dirID",
    element: <DirectoryView />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
