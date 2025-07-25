
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import GlobalDemoModeToggle from "./GlobalDemoModeToggle";

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-6 transition-all duration-300">
          <div className="mb-6 flex justify-end">
            <GlobalDemoModeToggle />
          </div>
          <div className="max-w-full overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
