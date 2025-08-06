import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export const Dashboard = () => {


    return (
        <>



            <div >
                <aside className="w-[200px] flex flex-col items-center fixed h-full bg-blue-300 shadow-lg rounded-md py-4">
                    <img
                        src={
                            JSON.parse(localStorage.getItem("CompanyN") || "{}")?.profilePicture ||
                            "/img/default-profile.png"}
                        alt="Profile"
                        className="w-24 h-24 object-cover mb-4 rounded-full border-2 border-white shadow-md" />
                    <h1 className="text-2xl text-white text-center">
                        {JSON.parse(localStorage.getItem("CompanyN") || "{}")?.companyName || "No Company"}
                    </h1>
                    <p className="text-white text-sm mb-4">
                        {JSON.parse(localStorage.getItem("CompanyN") || "{}")?.email || "No Email"}
                    </p>
                    <button className="text-white" onClick={() => {
                        localStorage.removeItem("CompanyN");
                        window.location.reload();
                    }}> LogOut </button>
                </aside>



                <div className="flex items-center justify-between bg-yellow-50 shadow-md p-4">
                    <h1 className="text-xl font-bold">Dashboard Header</h1>
                    <div className="flex items-center space-x-12">



                        <Link to="home" className="text-slate-400 rounded hover:text-gray-900">
                            Home
                        </Link>

                        <Link to="new-invoice" className="text-slate-400 rounded hover:text-gray-900">
                            New Invoice
                        </Link>

                        <Link to="invoices" className="text-slate-400 rounded hover:text-gray-900">
                            Invoices Record
                        </Link>

                        <Link to="settings" className="text-slate-400 rounded hover:text-gray-900">
                            Settings
                        </Link>

                    </div>
                </div>

                <main className="ml-[270px] p-8">
                    {/* <h1 className="text-2xl font-bold mb-4"></h1> */}
                 
                <div className=" "> <Outlet /> </div>
                </main>
                
            </div>


        </>);
}

