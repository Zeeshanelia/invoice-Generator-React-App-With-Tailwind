import React, { useState } from "react";


export const NewInvoice = () => {

  const [to, setTo] = useState("");
  const [product, setProduct] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [total, setTotal] = useState('$25.99');
  // const [ error, setError ] = useState("");
  const [proDetails, setProDetails] = useState([])

  const addProduct = () => {
  if (to === "" || product === "" || phone === "" || address === "" || price === "" || quantity === "") {
    alert("Please fill all the fields");
    return;
  }

  const newProduct = {
    id: product,
    name: product,
    price: price,
    quantity: quantity
  };

  setProDetails((prevDetails) => [...prevDetails, newProduct]);

  const newTotal = (
    [...proDetails, newProduct].reduce((acc, item) => {
      return acc + Number(item.price) * Number(item.quantity);
    }, 0)
  ).toFixed(2);

  setTotal(`$${newTotal}`);

  // Reset form fields
  setTo("");
  setProduct("");
  setPhone("");
  setAddress("");
  setPrice("");
  setQuantity("");

  console.log("Product added to invoice list");
};


  const handleSubmit = (e) => {
    e.preventDefault();
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
    addProduct(); // Add product to invoice list

  }

  return (<>
    <h1 className="text-2xl font-bold">New Invoice</h1>
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <div className="grid grid-cols-3 gap-1 justify-between " >
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          type="email"
          name="email"
          placeholder="To"
          className="p-1 border border-gray-300 rounded md:w-[17rem]"
        />
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          type="text"
          name="product"
          placeholder="Product"
          className="p-1 border border-gray-300 rounded md:w-[17rem]"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="text"
          name="phone"
          placeholder="Phone"
          className="p-1 border border-gray-300 rounded md:w-[17rem]"
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="address"
          placeholder="Address"
          className="p-1 border border-gray-300 rounded md:w-[17rem]"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          name="price"
          placeholder="Price"
          className="p-1 border border-gray-300 rounded md:w-[17rem]"
        />
        <input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
          name="quantity"
          placeholder="Quantity"
          className="p-1 border border-gray-300 rounded md:w-[17rem]"
        />
      </div>

      <div className="flex  justify-end mt-4 mr-22 md:mt-6">
        <button
          type="submit"
          // onClick={addProduct} // Once indirectly via handleSubmit, which also calls addProduct() inside it. A <form> with a type="submit" button will call the onSubmit handler automatically.
          className=" md:mr-[3.8rem] px-4 py-2 border border-gray-900 hover:bg-blue-500 hover:text-white rounded-md bg-gray-100 transition duration-200 ease-in-out md:w-[17rem] "
        >
          🧾 Submit Invoice
        </button>
      </div>

    </form>




    <div>
      <h2 className="text-xl font-semibold mt-8">Invoice Details</h2>
      <div className="flex md:gap-32 font-semibold justify-center  bg-slate-100 shadow-md text-bold">
        <p>Serial no</p>
        <p>Product name</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total price </p>
      </div>


      <div className="mt-2 grid grid-cols-5 text-center ">
        {proDetails.map((detail, index) => (
          <React.Fragment key={index}>
            <p>{index + 1}</p>
            <p>{detail.name}</p>
            <p>{detail.price}</p>
            <p>{detail.quantity}</p>
            <p>{Number(detail.price) * Number(detail.quantity)}</p>
          </React.Fragment>
        ))}



        {proDetails.length === 0 && <p className="col-span-5">No invoice details available.</p>}
      </div>



<hr />
      <div className="flex justify-end mt-4 md:mt-8 mr-12"> 

        <p className="text-xl font-semibold text-pink-500 ">Total: {total}</p>
      </div>

    </div>
  </>)
}
