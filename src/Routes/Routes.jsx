import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import Tables from "../pages/Tables/Tables";
import TableView from "../pages/TableView/TableView";
import CreateTable from "../pages/CreateTable/CreateTable";
import Home from "../pages/Home/Home";
import PrivateRoutes from "./PrivateRoutes";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import EditTable from "../EditTable/EditTable";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import AddSingleFieldAnalytics from "../pages/AddSingleFieldAnalytics/AddSingleFieldAnalytics";
import ImportCSV from "../components/ImportCSV/ImportCSV";
import AddMultifieldAnalytics from "../pages/AddMultifieldAnalytics/AddMultifieldAnalytics";
import FormInsert from "../pages/FormInsert/FormInsert";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>
        ),
      },
      {
        path: "/Tables",
        element: (
          <PrivateRoutes>
            <Tables />
          </PrivateRoutes>
        ),
      },
      {
        path: "/TableView/:_id",
        element: (
          <PrivateRoutes>
            <TableView />
          </PrivateRoutes>
        ),
      },
      {
        path: "/ImportCSV",
        element: (
          <PrivateRoutes>
            <ImportCSV />
          </PrivateRoutes>
        ),
      },
      {
        path: "/CreateTable",
        element: (
          <PrivateRoutes>
            <CreateTable />
          </PrivateRoutes>
        ),
      },
      {
        path: "/EditTable/:_id",
        element: (
          <PrivateRoutes>
            <EditTable />
          </PrivateRoutes>
        ),
      },
      {
        path: "/AddSingleFieldAnalytics",
        element: (
          <PrivateRoutes>
            <AddSingleFieldAnalytics />
          </PrivateRoutes>
        ),
      },
      {
        path: "/AddMultiFieldAnalytics",
        element: (
          <PrivateRoutes>
            <AddMultifieldAnalytics />
          </PrivateRoutes>
        ),
      },
      {
        path: "/FormInsert/:_id",
        element: <FormInsert />,
      },
      {
        path: "/Login",
        element: <Login />,
      },
      { path: "/Signup", element: <Signup /> },
    ],
  },
]);

export default router;
