import React, { useState } from "react";


export const NewInvoice = () => {

    const [to, setTo] = useState("");
    const [product, setProduct] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    // const [invoice, setInvoice] = useState([]);
    // const [ error, setError ] = useState("");
    // const [ loading, setLoading ] = useState(false);

    const [ ProDetails, setProDetails ] = useState([
       { to: "abc@example.com"},
       { product: "Sample Product"},
       { phone: "123-456-7890"},
       { address: "123 Sample St, Sample City, SC 12345"},
       { price: "100"},
       { quantity: "1"}
  ]);

    const handleSubmit = (e) => {
        e.preventDefault(); 
        // Here you would typically handle the form submission,
        // such as sending the data to a server or updating state.  
        // For now, we will just log the values to the console.
        console.log({
            to,
            product,
            phone,
            address,
            price,
            quantity
        });
        // Reset the form fields after submission
        setTo("");
        setProduct("");
        setPhone("");
        setAddress("");
        setPrice("");
        setQuantity("");
    }

    return (<>
<div className="flex  p-4">
       <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold ml-12">New Invoice</h1>
        
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        type="email"
        name="email"
        placeholder="To"
        className="p-1 border border-gray-300 rounded md:w-[15rem]"
      />
      <input
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        type="text"
        name="product"
        placeholder="Product"
        className="p-1 border border-gray-300 rounded md:w-[15rem]"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        type="text"
        name="phone"
        placeholder="Phone"
        className="p-1 border border-gray-300 rounded md:w-[15rem]"
      />
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        type="text"
        name="address"
        placeholder="Address"
        className="p-1 border border-gray-300 rounded md:w-[15rem]"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        name="price"
        placeholder="Price"
        className="p-1 border border-gray-300 rounded md:w-[15rem]"
      />
      <input
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        type="number"
        name="quantity"
        placeholder="Quantity"
        className="p-1 border border-gray-300 rounded md:w-[15rem]"
      />

      <button className="p-1 border border-gray-500 rounded-md md:w-[15rem]">
        Enter Invoice
      </button>
    </form>

    <div>
        <div className="flex ml-8 mt-4 flex-col gap-4 mt-4">
      <h2 className="text-xl font-semibold">Invoice Details</h2>
      { ProDetails.map((detail, index) => (
        <div key={index} className="border p-2 rounded-md">
            <p><strong>To:</strong> {detail.to}</p>
            <p><strong>Product:</strong> {detail.product}</p>
            <p><strong>Phone:</strong> {detail.phone}</p>
            <p><strong>Address:</strong> {detail.address}</p>
            <p><strong>Price:</strong> ${detail.price}</p>
            <p><strong>Quantity:</strong> {detail.quantity}</p>
        </div>
      ))}
      {/* {ProDetails.length === 0 && <p>No invoice details available.</p>} */}
    </div>
    
    </div>
</div>
  </>)
}
