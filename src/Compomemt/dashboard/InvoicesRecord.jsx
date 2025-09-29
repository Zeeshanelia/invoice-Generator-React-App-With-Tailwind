
import { useEffect, useState, useCallback } from "react";
import { db } from '../../firebase';
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export const InvoicesRecord = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const getData = useCallback(async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "invoices"));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log(data , "get id detail")
            setInvoices(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError('Failed to fetch invoices');
            setLoading(false);
        }
    }, []);

    const dltInvoice = async (id) => {
        try {
            await deleteDoc(doc(db, "invoices", id));
            setInvoices(prev => prev.filter(invoice => invoice.id !== id));
        } catch (err) {
            console.error('Error deleting invoice:', err);
        }
    };

    useEffect(() => {
       
        getData();
    }, [getData]);




    
    return (
        <div className="md:mt-4 md:ml-12">
            <h2 className="md:text-2xl md:ml-2 font-bold">Invoices Record</h2>

            {loading && <p>Loading invoices...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && invoices.length === 0 && <p>No invoices found.</p>}

            {invoices.map(data => (
                <div
                    className="md:flex md:text-center md:m-4 p-2 bg-green-200 md:gap-4 md:items-center justify-between shadow-lg rounded"
                    key={data.id}
                >
                    <p>{data.to}</p>
                    <p>{data.product}</p>
                    <p>{data.date?.seconds ? new Date(data.date.seconds * 1000).toLocaleDateString() : 'No Date'}</p>
                    <p>{data.total}</p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => dltInvoice(data.id)}
                            className="bg-red-400 hover:bg-slate-800 p-1 text-white rounded"
                        >
                            Delete
                        </button>

                        <button
                            onClick={() => navigate('/dashboard/Invoice-detail', { state: data })}
                            className="bg-blue-400 hover:bg-slate-800 p-1 text-white rounded"
                        >
                            View Invoice
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};








// import { useEffect, useState } from "react"
// import { db, auth } from '../../firebase'
// import { getDocs, collection, deleteDoc, doc } from "firebase/firestore"
// import { useNavigate } from "react-router-dom"
// import { query, where } from "firebase/firestore"



// export const InvoicesRecord = () => {

//     const [invoices, setInvoices] = useState([])
//     useEffect(() => {
//         // console.log("rerender component")

//         getData()
//     }, [])

   

//     const getData = async () => {
//         const querySnapshot = await getDocs(collection(db, "invoices"))
//         // querySnapshot.forEach((doc) => {
//         const data = querySnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data(),
//         }))
//         // console.log(data)
//         setInvoices(data)
//     }


//     const dltInvoice = async (id) => {
//         try {
//             await deleteDoc(doc(db, "invoices", id));
//             await getData();
//         } catch (err) {
//             console.error('Error deleting invoice:', err);
//         }
//     }

//     const navigate = useNavigate()
//     return (<>
//         <div className="mt-4 ml-12">
//             <h2 className="md:text-2xl md:ml-2 font-bold">Invoices Record</h2>

//              {invoices.map(data => (
//                 <div
//                     className="md:flex text-center m-4 p-2 bg-green-200 md:gap-4 items-center justify-between shadow-lg rounded"
//                     key={data.id}
//                 >
//                     <p>{data.to}</p>
//                     <p>{data.product}</p>
//                     <p>{data.date?.seconds ? new Date(data.date.seconds * 1000).toLocaleDateString() : 'No Date'}</p>
//                     <p>{data.total}</p>

//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => dltInvoice(data.id)}
//                             className="bg-red-400 hover:bg-slate-800 p-1 text-white rounded"
//                         >
//                             Delete
//                         </button>

//                         <button
//                             onClick={() => navigate('/dashboard/Invoice-detail', { state: data })}
//                             className="bg-blue-400 hover:bg-slate-800 p-1 text-white rounded"
//                         >
//                             View Invoice
//                         </button>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     </>)
// }

