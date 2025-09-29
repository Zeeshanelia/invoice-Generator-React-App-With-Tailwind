import { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export const NewInvoice = () => {
  const [to, setTo] = useState("");
  const [product, setProduct] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [total, setTotal] = useState('');
  const [proDetails, setProDetails] = useState([])


  const navigate = useNavigate()
  const savingData = async () => {
    console.log({ to, phone, address, proDetails, total });

    try {
      const colRef = collection(db, 'invoices');
      // collection(firestoreInstance, collectionPath)  Only 2 arguments
      const docRef = await addDoc(colRef, {
        to: to,
        phone: phone ,
        address: address,
        products: proDetails, //  Save full product list
        total: total,
        date: Timestamp.fromDate(new Date())
      });

      // console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    navigate('/dashboard/invoices')
  };




  const addProduct = () => {
    if (
      to === "" ||
      product === "" ||
      phone === "" ||
      address === "" ||
      price === "" ||
      quantity === ""
    ) {
      alert("Please fill all the fields");
      return false; // Return false if validation fails
    }

    const newProduct = {
      id: product,
      name: product,
      price,
      quantity
    };

    const updatedList = [...proDetails, newProduct];
    setProDetails(updatedList);

    const newTotal = updatedList.reduce((acc, item) => {
      return acc + Number(item.price) * Number(item.quantity);
    }, 0).toFixed(1);
    setTotal(newTotal
    );

    return true; // Product added successfully
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct(); //  Adds product and updates total


    //  Reset only product-related fields
    setProduct("");
    setPrice("");
    setQuantity("");

    //  Do NOT reset customer info fields. Keep customer info after adding product like , phone, address (customer info) after submit. 
    //  setTo("");
    //  setPhone("");
    //  setAddress("");
  };


  return (<>
    <div
      className="flex justify-between  mr-22 ">
      <h1 className="md:text-2xl mt-2 ml-14 font-bold">New Invoice</h1>


      <button onClick={savingData}
        type="button"
        className="md:mr-[3.8rem] border hover:bg-blue-500 hover:text-white rounded-md bg-gray-100 transition mt-2 duration-200 ease-in-out md:w-[9rem]">🔄 Saving Data
      </button>

    </div>


    <form onSubmit={handleSubmit} className="mt-4 space-y-6">
      <div className="grid md:grid-cols-3 grid-cols-2 md:ml-14 gap-2 md:w-[60rem] justify-between " >
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          type="email"
          name="email"
          placeholder="To"
          className="p-1 border border-gray-300  rounded md:w-[16rem]"
        />
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          type="text"
          name="product"
          placeholder="Product"
          className="p-1 border border-gray-300 rounded md:w-[16rem]"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="text"
          name="phone"
          placeholder="Phone"
          className="p-1 border border-gray-300 rounded md:w-[16rem]"
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="address"
          placeholder="Address"
          className="p-1 border border-gray-300  rounded md:w-[16rem]"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          name="price"
          placeholder="Price"
          className="p-1 border border-gray-300 rounded md:w-[16rem]"
        />
        <input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
          name="quantity"
          placeholder="Quantity"
          className="p-1 border border-gray-300 rounded md:w-[16rem]"
        />
      </div>

      <div className="flex ">
        <button
          type="submit"
          className=" md:ml-[3.5rem] w-full md:w-[16rem] py-2 border border-gray-900 hover:bg-blue-500 hover:text-white rounded-md bg-gray-100 transition duration-200 ease-in-out    "
        >🧾 GENERATE INVOICE
        </button>
      </div>
    </form>


    <div className="md:ml-14 md:w-[900px]">
      <h2 className="text-xl font-semibold mt-6 ">Invoice Details</h2>

      {/* Table Headers */}
      <div className="hidden md:grid md:grid-cols-5 font-semibold bg-slate-100 shadow-md md:py-2 text-center md:space-x-2">
        <p>Serial No</p>
        <p>Product Name</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total Price</p>
      </div>

      {/* Table Body */}
      <div className="mt-2 ">
        {proDetails.map((detail, index) => (
          <div
            key={index}
            className="grid grid-cols-5 md:text-center bg-white md:p-3 shadow-lg border-b rounded-md"
          >
            {/* Mobile Labels */}
            <div className="md:hidden">
              <p className="font-semibold">Serial No:</p>
              <p>{index + 1}</p>
            </div>
            <div className="md:hidden">
              <p className="font-semibold">Product Name:</p>
              <p>{detail.name}</p>
            </div>
            <div className="md:hidden">
              <p className="font-semibold">Price:</p>
              <p>{detail.price}</p>
            </div>
            <div className="md:hidden">
              <p className="font-semibold">Quantity:</p>
              <p>{detail.quantity}</p>
            </div>
            <div className="md:hidden">
              <p className="font-semibold">Total Price:</p>
              <p>{Number(detail.price) * Number(detail.quantity)}</p>
            </div>

            {/* Desktop cells (only visible on md and above) */}
            <p className="hidden md:block">{index + 1}</p>
            <p className="hidden md:block">{detail.name}</p>
            <p className="hidden md:block">{detail.price}</p>
            <p className="hidden md:block">{detail.quantity}</p>
            <p className="hidden md:block">
              {Number(detail.price) * Number(detail.quantity)}
            </p>
          </div>
        ))}
      </div>


      {proDetails.length === 0 && <p className="col-span-5 border-b">No invoice details available.</p>}
    </div>


    <div className="flex justify-end mt-4 md:mt-12 md:mr-[5rem]">
      <p className="text-xl font-semibold text-pink-500 ">Total : {total}</p>
    </div>



  </>)
}