import { useState } from "react"
import { useLocation } from "react-router-dom"


export const InvoiceDetail = () => {
    const location = useLocation()
    // console.log(location.state)

    const [data, setData] = useState(location.state || {});



    return (
        <>
            <div className=" h-[41rem] bg-slate-100 w-full p-2">

                <div className="md:w-2/3 border-1 border-black mx-auto h-[40rem] bg-white">

                    <div className="flex justify-between">
                        <div>
                            <img className="w-28 h-28 object-cover rounded-full mt-4 border-2 border-grey-100 ml-2 shadow-md" src={localStorage.getItem('Photo')} alt="logo" />
                            <p> {localStorage.getItem('CompanyN')} </p>
                        </div>

                        <div className="mt-4 mr-2">
                            <p className="font-bold"> Invoice Detail</p>
                            {/* <p>name : {data.email}</p> */}
                            <p>To : {data.to}</p>
                            <p>Phone : {data.phone}</p>
                            <p>Adress : {data.address}</p>
                            {/* <p> Gst : </p> */}
                        </div>
                    </div>


                    <table className="mt-12 md:ml">
                        <tr className="flex  justify-between  md:space-x-28  md:border-2 border shadow ">
                            <th>S. No</th>
                            <th>Product </th>
                            <th>Price </th>
                            <th className="right-6"> Quantity</th>
                            <th>Total </th>

                        </tr>
                        <tbody>
                            {data?.product?.length > 0 ? (
                                data.product.map((product, index) => (
                                    <tr className="flex justify-between md:space-x-28 space-x-7" key={product.id}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.price * product.quantity}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No products found.</td>
                                </tr>
                            )}




                            {/* {
                                data.product.map((product, index) => (

                                    <tr className="flex  justify-between  md:space-x-28 space-x-7 " key={product.id}>

                                        <td>{index + 1}</td>
                                        <td>{product.name} </td>
                                        <td>Price </td>
                                        <td>Quantity</td>
                                        <td>Total </td>
                                    </tr>

                                ))
                            } */}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

