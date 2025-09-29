
import React, { useState, useEffect, useRef } from "react"; 
import { NavLink, Outlet } from "react-router-dom";
// Importing supabase client to interact with Supabase storage
import { supabase } from "../../supabaseClient";
export const Dashboard = () => {
  // State to track if sidebar is open or closed
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem("sidebar") === "closed" ? false : true;
  });

  // State to store company data, initializing from localStorage
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
    localStorage.removeItem("CompanyN");
    window.location.reload();
  };


  
  return (


    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      {isOpen && (
        <aside
          className={`
            fixed top-0 left-0 h-full z-50 bg-black text-white shadow-lg
            transition-all duration-300 ease-in-out flex flex-col w-64
          `}
        >
          {/* Close button */}
          <div className="flex justify-end p-3 border-b border-gray-800">
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
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-2 rounded transition"
            >
              <i className="ri-logout-box-r-line"></i>
              <span>Logout</span>
            </button>
          </div>
        </aside>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:bg-opacity-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content area */}
      <main className="flex-1 transition-all duration-300 ease-in-out">
        {/* Top bar (always visible) */}
        <div className="p-3 bg-white shadow flex justify-between items-center">
          <button onClick={toggleSidebar}>
            {isOpen ? (
              <i className="ri-close-line text-2xl text-amber-400"></i>
            ) : (
              <i className="ri-menu-line text-2xl text-amber-400"></i>
            )}
          </button>
          <h1 className="font-semibold text-gray-700">Dashboard</h1>
        </div>

        {/* Content rendered from child routes */}
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
     











































































// import { Link, Outlet } from 'react-router-dom';
// import { useState, useEffect } from "react";
// import { supabase } from '../../supabaseClient';


// export const Dashboard = () => {
//   const [size, setSize] = useState(170); // Sidebar width
//   const [imgUrl, setImgUrl] = useState('');


//   const companyData = JSON.parse(localStorage.getItem("CompanyN") || "{}");

//   const toggleSidebar = () => {
//     setSize(size === 170 ? 0 : 170);
//   };

//   const getImageUrl = async () => {
//     try {
//       const { data, error } = supabase
//         .storage
//         .from('profile-images')
//         .getPublicUrl('profile/qwerty_1758625950767.jpg');

//       if (error) {
//         console.error('Error getting public URL:', error.message);
//         return;
//       }

//       console.log('Image URL:', data.publicUrl); // Check if this prints correctly
//       setImgUrl(data.publicUrl);
//     } catch (err) {
//       console.error("Error fetching image URL:", err.message);
//     }
//   };

//   useEffect(() => {
//     getImageUrl();

//   }, []);
//   return (
//     <div className=" ">
// //       {/*/////////////// Sidebar //////////*/}
//       <aside
//         className="flex flex-col items-center fixed top-0 left-0 h-full bg-black  shadow-lg rounded-md py-4 transition-all duration-300 z-40"
//         style={{ width: size }}
//       >

// //         {  /*///////////   Toggle Button ///////////// */}

//         <nav className={` flex justify-end  ml-[4rem]`}>
//           <button onClick={toggleSidebar}>
//             <i className="text-xl text-amber-400 ri-menu-unfold-2-line  border"></i>
//           </button>
//         </nav>

//         {/* Sidebar Content */}
//         {size > 0 && (
//           <>

//             {imgUrl && <img className="w-24 h-24 object-cover mt-4 rounded-full border-2 border-white shadow-md" src={imgUrl} alt="Uploaded" />}


//             <h5 className="text-2xl text-white text-center mt-2">
//               {companyData.companyName || "No Company"}
//             </h5>
//             <p className="text-white text-sm mb-4">{companyData.email || "No Email"}</p>



//             {/* Navigation Links */}
//             <div className="flex flex-col space-y-4 mt-2">
//               <Link to="home" className="text-white hover:text-blue-900 hover:bg-green-200 rounded">
//                 Home
//               </Link>
//               <Link to="new-invoice" className="text-white hover:text-blue-900 hover:bg-green-200 rounded">
//                 New Invoice
//               </Link>
//               <Link to="invoices" className="text-white hover:text-blue-900 hover:bg-green-200 rounded">
//                 Invoices Record
//               </Link>
//               <Link to="settings" className="text-white hover:text-blue-900 hover:bg-green-200 rounded">
//                 Settings
//               </Link>
//             </div>

//             {/* Logout Button */}
//             <button
//               className="text-white hover:text-blue-950 hover:bg-green-200  mt-20 border px-4 py-2 rounded"
//               onClick={() => {
//                 localStorage.removeItem("CompanyN");
//                 window.location.reload();
//               }}>  LogOut </button>
//             {/* Logout Button */}

//           </>
//         )}
//       </aside>

//       {/* Main Content */}
//       <main
//         className={`transition-all duration-300 ml-[${size}px]`}
//         style={{ marginLeft: size }}>

//         <Outlet />
//       </main>

//     </div>
//   );
// };
