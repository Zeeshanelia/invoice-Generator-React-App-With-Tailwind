import { Link, Outlet } from 'react-router-dom';
import { useState } from "react";

export const Dashboard = () => {
  const [size, setSize] = useState(170); // Sidebar width

  const companyData = JSON.parse(localStorage.getItem("CompanyN") || "{}");

  const toggleSidebar = () => {
    setSize(size === 170 ? 0 : 170);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className="flex flex-col items-center fixed top-0 left-0 h-full bg-blue-300 shadow-lg rounded-md py-4 transition-all duration-300 z-40"
        style={{ width: size }}
      >
        {/* Toggle Button */}
        <nav className={`w-full flex justify-end mt-2 ml-[6rem]`}>
          <button onClick={toggleSidebar}>
            <i className="text-2xl ri-menu-unfold-2-line border border-2"></i>
          </button>
        </nav>

        {/* Sidebar Content */}
        {size > 0 && (
          <>
            <img
              src={companyData.profilePicture || "/img/default-profile.png"}
              alt="Profile"
              className="w-24 h-24 object-cover mt-10 rounded-full border-2 border-white shadow-md"
            />
            <h1 className="text-2xl text-white text-center mt-2">
              {companyData.companyName || "No Company"}
            </h1>
            <p className="text-white text-sm mb-4">{companyData.email || "No Email"}</p>

            

            {/* Navigation Links */}
            <div className="flex flex-col space-y-4 mt-4">
              <Link to="home" className="text-white hover:text-gray-900">
                Home
              </Link>
              <Link to="new-invoice" className="text-white hover:text-gray-900">
                New Invoice
              </Link>
              <Link to="invoices" className="text-white hover:text-gray-900">
                Invoices Record
              </Link>
              <Link to="settings" className="text-white hover:text-gray-900">
                Settings
              </Link>
            </div>

            {/* Logout Button */}
            <button
              className="text-white hover:text-gray-900 mt-20 border px-4 py-2 rounded"
              onClick={() => {
                localStorage.removeItem("CompanyN");
                window.location.reload();
              }}
            >
              LogOut
            </button>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ml-[${size}px]  p-4`}
        style={{ marginLeft: size }}
      >
        <Outlet />
      </main>
    </div>
  );
};
