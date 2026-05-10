import { lazy, Suspense } from "react";

import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { ContextProvider } from "../context/ContextProvider";
import { useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();
  console.error("Route error:", error);
  return (
    <div style={{ padding: 20, fontFamily: "monospace", background: "#1a1a1a", color: "#ff6b6b", minHeight: "100vh", whiteSpace: "pre-wrap" }}>
      <h2>Error caught — check console for component stack</h2>
      <pre style={{ color: "#fff" }}>{error?.message}</pre>
      <pre style={{ color: "#aaa", fontSize: 11 }}>{error?.stack}</pre>
    </div>
  );
};

const Home = lazy(() => import("../pages/Home"));
const DashboardLayout = lazy(() => import("../layout/DashboardLayout"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const CreateSellerProfile = lazy(() =>
  import("../pages/dashboard/CreateSellerProfile")
);
const Marketplace = lazy(() => import("../pages/dashboard/Marketplace"));
const Chat = lazy(() => import("../pages/dashboard/Chat"));
const Transactions = lazy(() => import("../pages/dashboard/Transactions"));
const MarketplaceHome = lazy(() => import("../pages/MarketplaceHome"));
const MarketplaceHomeDetails = lazy(() =>
  import("../pages/MarketplaceHomeDetails")
);
const HomeLayout = lazy(() => import("../layout/HomeLayout"));
const MarketplaceDetails = lazy(() =>
  import("../pages/dashboard/MarketplaceDetails")
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomeLayout />} errorElement={<ErrorBoundary />}>
        <Route index element={<Home />} errorElement={<ErrorBoundary />} />
        <Route path="/marketplace" element={<MarketplaceHome />} errorElement={<ErrorBoundary />} />
        <Route path="/marketplace/:id" element={<MarketplaceHomeDetails />} errorElement={<ErrorBoundary />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />} errorElement={<ErrorBoundary />}>
        <Route index element={<Dashboard />} errorElement={<ErrorBoundary />} />
        <Route path="createprofile" element={<CreateSellerProfile />} errorElement={<ErrorBoundary />} />
        <Route path="market_place" element={<Marketplace />} errorElement={<ErrorBoundary />} />
        <Route path="market_place/:id" element={<MarketplaceDetails />} errorElement={<ErrorBoundary />} />
        <Route path="chat" element={<Chat />} errorElement={<ErrorBoundary />} />
        <Route path="transactions" element={<Transactions />} errorElement={<ErrorBoundary />} />
      </Route>
    </Route>
  )
);

const AllRoutes = () => {
  return (
    <div className="min-h-screen w-full bg-light font-opensans text-[#0F160F]">
      <div className="mx-auto w-full max-w-[1550px] 2xl:max-w-[1800px] 3xl:max-w-none 3xl:px-8">
        <ContextProvider>
          <Suspense fallback={<Loader />}>
            <RouterProvider router={router} />
          </Suspense>
        </ContextProvider>
      </div>
    </div>
  );
};

export default AllRoutes;
