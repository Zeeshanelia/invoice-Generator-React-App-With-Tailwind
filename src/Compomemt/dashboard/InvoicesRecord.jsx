import { useEffect, useState } from "react"
import { db } from '../../firebase'
import { getDocs, collection, deleteDoc ,doc } from "firebase/firestore"
import { Navigate, useNavigate } from "react-router-dom"


export const InvoicesRecord = () => {

    const [invoices, setInvoices] = useState([])
    useEffect(() => {
        // console.log("rerender component")
        getData()
    }, [])

    const getData = async () => {

        const querySnapshot = await getDocs(collection(db, "invoices"))
        // querySnapshot.forEach((doc) => {
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
        // console.log(data)
        setInvoices(data)
    }


    const dltInvoice = (id) => {
        deleteDoc(doc(db , "invoices" ,id))
        getData()
    }
    const navigate = useNavigate()
    return (<>
        <div className="mt-4 ml-12">
            <h2 className="md:text-2xl md:ml-2 font-bold">Invoices Record</h2>

            {
                invoices.map(data => (
                    <div className="md:flex  p-1  m-2  bg-green-200 md:gap-4 item-center justify-between shadow-lg rounded " key={data.id}>
                        <p >  {data.to} </p>
                        <p> {data.product} </p>
                        <p className="item-center">{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
                        <p> {data.total}</p>



                       <div className=" flex gap-2">
                         <button onClick={()=> {dltInvoice(data.id)}} className="bg-red-400 hover:bg-slate-800 p-1   text-white rounded"> Delete </button>

               {/* Navigate to /dashboard/Invoice-detail */}

                         <button onClick={()=> {navigate ('/dashboard/Invoice-detail' , {state:data})}} className="bg-blue-400 hover:bg-slate-800 p-1   text-white rounded"> View Invoice </button>
                       </div>
                    </div>
                ))
            }
        </div>
    </>)
}

