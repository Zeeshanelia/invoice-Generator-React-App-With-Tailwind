import { NavLink } from "react-router-dom";
import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState, useCallback } from "react";
import { db } from '../../firebase';
import { getDocs, collection, query, where } from "firebase/firestore";

export const Home = () => {
  const chartRef = useRef(null);       // ref to the <canvas>
  const chartInstance = useRef(null);  // store chart instance
  const [invoices, setInvoices] = useState([]); //all invoices from Firestore
  const [totalOverAll, setTotalOverAll] = useState(0);  // total of ALL invoices
  const [monthlyCollection, setMonthlyCollection] = useState(0); // total for current month

  // Company data from localStorage (example: used for initials, etc.)
  const companyData = JSON.parse(localStorage.getItem("CompanyN") || "{}");
  const initials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "??";

  /**
   * Fetch all invoices from Firestore
   */
  const getData = useCallback(async () => {
    try {
      // Query Firestore: only get invoices belonging to the current user (uid from localStorage)
      const q = query(
        collection(db, "invoices"),
        where("uid", "==", localStorage.getItem("uid"))
      );
      const querySnapshot = await getDocs(q);

      // Convert documents into plain objects
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(data, "Fetched invoices");

      // Save invoices to state
      setInvoices(data);
     
      // Calculate totals
      getAllTotal(data);
      getMonthlyTotal(data);
      updateChart(data); // update chart with new data

    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  }, []);

  /**
   * Calculate overall total of ALL invoices
   */
  const getAllTotal = (invoices) => {
    let t = 0;
    invoices.forEach(inv => {
      t += Number(inv.total) || 0; // ensure number type
    });
    console.log("Overall Total:", t);
    setTotalOverAll(t); // update state
  };

  /**
   * Calculate monthly total (only for current month & year)
   */
  const getMonthlyTotal = (invoices) => {
    let mt = 0;
    invoices.forEach(data => {
      const invoiceDate = new Date(data.date?.seconds * 1000); // convert Firestore timestamp

      // Only include invoices from current month and year
      if (
        invoiceDate.getMonth() === new Date().getMonth() &&
        invoiceDate.getFullYear() === new Date().getFullYear()
      ) {
        mt += Number(data.total) || 0;
      }
    });

    console.log("Monthly Total:", mt);
    setMonthlyCollection(mt); // update state
  };

  /**
   * Build chart dataset using invoices
   * Each bar = one month (Jan–Dec)
   */
  const updateChart = (invoices) => {
    // Create an array for 12 months, all starting at 0
    const monthlyTotals = new Array(12).fill(0);

    // Add each invoice to the correct month
    invoices.forEach(inv => {
      const date = new Date(inv.date?.seconds * 1000);
      const month = date.getMonth(); // 0 = Jan, 11 = Dec
      monthlyTotals[month] += Number(inv.total) || 0;
    });

    // If old chart exists → destroy it (avoid duplicate canvas errors)
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart with real monthly totals
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
          {
            label: "# Monthly Collection",
            data: monthlyTotals, // ✅ real totals, not static
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  };

  /**
   * Run when component first mounts
   */
  useEffect(() => {
    getData(); // fetch invoices + build chart

    // Cleanup: destroy chart on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [getData]);

  return (
    <div className="flex justify-center md:ml-20 bg-gray-100 ">
      <div className=" bg-white rounded shadow-xl max-w-3xl overflow-hidden">

        {/* ======= Stats Section ======= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-1 ">

          {/* Overall Value */}
          <div className="rounded-lg shadow-md text-center p-6 text-white font-bold bg-gradient-to-r from-gray-800 to-blue-600">
            <h2 className="text-xl">{totalOverAll}</h2>
            <p className="text-sm font-normal">Overall Value</p>
          </div>

          {/* Total Invoices Count */}
          <div className="rounded-lg shadow-md text-center p-6 text-white font-bold bg-gradient-to-r from-purple-900 to-pink-600">
            <h2 className="text-xl">{invoices.length}</h2>
            <p className="text-sm font-normal">Invoices in Record</p>
          </div>

          {/* Current Month Collection */}
          <div className="rounded-lg shadow-md text-center p-6 text-white font-bold bg-gradient-to-r from-gray-800 to-gray-500">
            <h2 className="text-xl">{monthlyCollection}</h2>
            <p className="text-sm font-normal">In This Month</p>
          </div>
        </div>

        {/* ======= Chart & Recent List ======= */}
        <div className="p-2 grid grid-cols-2 gap-4">

          {/* Chart Section */}
          <NavLink
            to="/new-invoice"
            className="bg-gray-200 hover:bg-gray-300 text-white py-1 rounded-lg shadow md:w-[36rem] md:h-80 "
          >
            <canvas ref={chartRef} id="myChart" />
          </NavLink>

          {/* Placeholder for Recent Invoices (make dynamic later) */}
          <NavLink
            className="bg-blue-500 hover:bg-blue-600 text-white  md:ml-[13rem] md:w-42 md:h-54 rounded-lg shadow text-center "
          >
            <h1 className="text-center text-small rounded shadow-xl bg-black text-white">
              Recent Invoice List
            </h1>


           {
  invoices.slice(0, 6).map((data) => (
    <div key={data.id} className="py-4 flex justify-center gap-6">
      <p>{data.to}</p>
      <p>
        {data.date?.seconds
          ? new Date(data.date.seconds * 1000).toLocaleDateString()
          : "No Date"}
      </p>
    </div>
  ))
}

            
            <footer className="px-4"> Good to see you </footer>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

