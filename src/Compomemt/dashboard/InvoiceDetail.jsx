import { useState } from "react"
import { useLocation } from "react-router-dom"


export const InvoiceDetail = () => {
    const location = useLocation()
    // console.log(location.state)

    const [data, setData] = useState(location.state)


    return (
        <>

            <div className="mt-4 ml-12">
                <p className="md:text-2xl md:ml-2 font-bold">    InvoiceDetail  </p>


            </div>
        </>
    )
}

