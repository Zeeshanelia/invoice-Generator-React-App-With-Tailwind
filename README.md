# invoice-Generator-React-App

A React-based invoice generator application provides a web-based solution for creating and managing invoices, often including the ability to export them as PDF documents.


User Interface:
A React app offers a dynamic and interactive user interface for entering invoice details.


Data Input:
Users can input information such as:
Client details (name, address, contact information)
Company details (name, logo, address, tax ID)
Invoice details (invoice number, issue date, due date)
Itemized list of products or services (description, quantity, unit price)



Integration:
Advanced versions integrate with backend systems (e.g.,Firebase DataBase) for data persistence and potentially with payment gateways or email services for sending invoices directly.


Invoice Management:



UI Enhancements ideas:
Validation Feedback: Show inline validation or toast messages near the button.
Loading State: Add a spinner or "Submitting..." text when clicked.
Disabled State: Disable the button until all required fields are filled.





  const addProduct = () => {
    // if (to === "" || product === "" || phone === "" || address === "" || price === "" || quantity === "") {
    //   alert("Please fill all the fields");
    //   return;
    // }
    
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

    setTotal(`${newTotal}`);

    // Reset form fields
    setTo("");
    setProduct("");
    setPhone("");
    setAddress("");
    setPrice("");
    setQuantity("");
    // console.log("Product added to invoice list");
  };
