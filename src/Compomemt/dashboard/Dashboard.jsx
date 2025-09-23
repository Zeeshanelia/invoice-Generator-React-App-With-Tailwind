




 import { Link, Outlet } from 'react-router-dom';
 import { useState, useEffect } from "react";
import { supabase } from '../../supabaseClient';


export const Dashboard = () => {
  const [size, setSize] = useState(170); // Sidebar width
  const [imgUrl, setImgUrl] = useState('');


  const companyData = JSON.parse(localStorage.getItem("CompanyN") || "{}");

  const toggleSidebar = () => {
    setSize(size === 170 ? 0 : 170);
  };

  const getImageUrl = async () => {
    try {
      const { data, error } = supabase
        .storage
        .from('profile-images')
        .getPublicUrl('profile/qwerty_1758625950767.jpg');

      if (error) {
        console.error('Error getting public URL:', error.message);
        return;
      }

      console.log('Image URL:', data.publicUrl); // Check if this prints correctly
      setImgUrl(data.publicUrl);     } catch (err) {
      console.error("Error fetching image URL:", err.message);
    }
  };

  useEffect(() => {
    getImageUrl();

  }, []);
  return (
    <div className=" ">
//       {/*/////////////// Sidebar //////////*/}
      <aside
        className="flex flex-col items-center fixed top-0 left-0 h-full bg-black  shadow-lg rounded-md py-4 transition-all duration-300 z-40"
        style={{ width: size }}
      >

//         {  /*///////////   Toggle Button ///////////// */}

        <nav className={` flex justify-end  ml-[4rem]`}>
          <button onClick={toggleSidebar}>
            <i className="text-xl text-amber-400 ri-menu-unfold-2-line  border"></i>
          </button>
        </nav>

        {/* Sidebar Content */}
        {size > 0 && (
          <>

            {imgUrl && <img className="w-24 h-24 object-cover mt-4 rounded-full border-2 border-white shadow-md" src={imgUrl} alt="Uploaded"  />}
            

            <h5 className="text-2xl text-white text-center mt-2">
              {companyData.companyName || "No Company"}
            </h5>
            <p className="text-white text-sm mb-4">{companyData.email || "No Email"}</p>



            {/* Navigation Links */}
            <div className="flex flex-col space-y-4 mt-2">
              <Link to="home" className="text-white hover:text-blue-900 hover:bg-green-200 rounded">
                Home
              </Link>
              <Link to="new-invoice" className="text-white hover:text-blue-900 hover:bg-green-200 rounded">
                New Invoice
              </Link>
              <Link to="invoices" className="text-white hover:text-blue-900 hover:bg-green-200 rounded">
                Invoices Record
              </Link>
              <Link to="settings" className="text-white hover:text-blue-900 hover:bg-green-200 rounded">
                Settings
              </Link>
            </div>

            {/* Logout Button */}
            <button
              className="text-white hover:text-blue-950 hover:bg-green-200  mt-20 border px-4 py-2 rounded"
              onClick={() => {
                localStorage.removeItem("CompanyN");
                window.location.reload();
              }}>  LogOut </button>
 {/* Logout Button */}
            
          </>
        )}
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ml-[${size}px]`}
        style={{ marginLeft: size }}>

        <Outlet />
      </main>

    </div>
  );
};
