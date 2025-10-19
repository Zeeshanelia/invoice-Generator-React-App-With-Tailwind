import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem("sidebar") === "closed" ? false : true;
  });

  const navigate = useNavigate();

  const [companyData, setCompanyData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("CompanyN") || "{}");
    } catch {
      return {};
    }
  });

  const [imgUrl, setImgUrl] = useState("");
  const objectUrlRef = useRef(null);
  const BUCKET = "profile-images";
  const FOLDER = "profile";

  const toggleSidebar = () => {
    const next = !isOpen;
    setIsOpen(next);
    localStorage.setItem("sidebar", next ? "open" : "closed");
  };

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);



  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  useEffect(() => {
    const imagePath = companyData?.image;
    if (!imagePath) {
      revokeObjectUrl();
      setImgUrl("");
      return;
    }


    let isMounted = true;
    const load = async () => {
      try {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(imagePath);
        if (isMounted) setImgUrl(data?.publicUrl ?? "");
      } catch {
        setImgUrl("");
      }
    };
    load();

    return () => {
      isMounted = false;
    };
  }, [companyData?.image]);


  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const userId = companyData?.id ?? "guest";
    const filename = `${userId}_${Date.now()}_${file.name}`;
    const path = `${FOLDER}/${filename}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (!error) {
      const updated = { ...companyData, image: path };
      localStorage.setItem("CompanyN", JSON.stringify(updated));
      setCompanyData(updated);

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setImgUrl(data?.publicUrl ?? "");
    }
  };



  const initials = (name) =>
    name
      ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
      : "??";

  


  const logout = () => {
    revokeObjectUrl();
    navigate("/Login");
    localStorage.removeItem("CompanyN");
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-black text-white shadow-lg flex flex-col
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
        `}
      >
        {/* Close button */}
        <div className="flex justify-end p-1 border-b border-gray-800">
          <button
            onClick={toggleSidebar}
            aria-label="Close sidebar"
            className="hover:scale-110 transition-transform"
          >
            <i className="ri-close-line text-2xl text-amber-400"></i>
          </button>
        </div>

        {/* Profile section */}
        <div className="flex flex-col items-center mt-6 space-y-2">
          {imgUrl ? (
            <img
              className="w-16 h-16 lg:w-28 lg:h-28 rounded-full border-2 border-white shadow-md object-cover"
              src={imgUrl}
              alt="Uploaded"
            />
          ) : (
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-2 border-white flex items-center justify-center bg-slate-600 text-lg lg:text-xl">
              {initials(companyData?.companyName)}
            </div>
          )}

          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            Upload
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <h5 className="text-base lg:text-lg mt-1 text-center truncate w-40">
            {companyData?.companyName || "No Company"}
          </h5>
          <p className="text-xs lg:text-sm text-center truncate w-40">
            {companyData?.email || "No Email"}
          </p>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col space-y-2 mt-6 px-2 lg:px-3">
          {[
            { to: "home", icon: "ri-home-line", label: "Home" },
            { to: "new-invoice", icon: "ri-file-add-line", label: "New Invoice" },
            { to: "invoices", icon: "ri-file-list-3-line", label: "Invoices Record" },
            { to: "settings", icon: "ri-settings-3-line", label: "Settings" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-2 py-2 rounded transition 
                 ${isActive ? "bg-green-400 text-black" : "hover:bg-green-200 hover:text-black"}`
              }
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout button */}
        <div className="mt-auto px-2 lg:px-3 pb-6">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-2 mt-1 rounded transition"
          >
            <i className="ri-logout-box-r-line"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay with smooth fade */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 ${isOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
          }`}
        onClick={toggleSidebar}
      />

      {/* Main content area */}
      <main className="flex-1 transition-all duration-300 ease-in-out">
        {/* Top bar */}
        <div className="p-3 bg-white shadow flex justify-between items-center">
          <button onClick={toggleSidebar}>
            {isOpen ? (
              <i className="ri-close-line text-2xl text-amber-400"></i>
            ) : (
              <i className="ri-menu-line text-2xl text-amber-400"></i>
            )}
          </button>


          <button
            onClick={() => navigate('/dashboard/home')}
            className="bg-blue-400 hover:bg-slate-800 p-1 text-white rounded"
          >
            Dashboard
          </button>
          {/* <h1 className="font-semibold text-gray-700">Dashboard </h1> */}
        </div>

        {/* Child routes content */}
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
