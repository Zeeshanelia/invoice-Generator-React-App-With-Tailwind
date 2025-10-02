import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export const InvoiceDetail = () => {
  const location = useLocation();
  const [data] = useState(location.state);
  const [photoUrl] = useState("/profile/guest_default.jpg");

  // ✅ safer than getElementById
  const invoiceRef = useRef(null);

  const printInvoice = () => {
    if (!invoiceRef.current) {
      console.error("Invoice section not found!");
      return;
    }

    html2canvas(invoiceRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [612, 792], // Letter size
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice_" + new Date().toISOString() + ".pdf");
    });
  };

  return (


    <div className="h-auto bg-slate-100 w-full p-2">



      {/* Print button */}
      <button
        onClick={printInvoice}
        className="bg-blue-400 hover:bg-slate-800 p-1 text-white rounded md:p-2 md:m-2 md:ml-10 mb-3  rounded font-semibold border-black shadow"
      >
        Print invoice
      </button>

      {/*  Wrap whole invoice with ref */}
      <div
        ref={invoiceRef}
        className="md:w-3/4 border-l border-r border-t border-black mx-auto md:h-auto bg-white"
      >
        <div className="flex justify-between">
          <div>
            <img
              className="w-28 h-28 object-cover rounded-full mt-4 border-2 border-gray-200 ml-2 shadow-md"
              src="/img/logoInvoice.png"
            />
          </div>

          <div className="mt-4 mr-2">
            <p className="font-bold">Invoice Detail</p>
            <p>To : {data?.to || "N/A"}</p>
            <p>Phone : {data?.phone || "N/A"}</p>
            <p>Address : {data?.address || "N/A"}</p>
            <p>Name : {data?.fullname || "____________"}</p>
          </div>
        </div>

        <table className="mt-12 w-full border-collapse">
          <thead>
            <tr className="border shadow border-black bg-gray-400 ">
              <th className="px-4 py-2 text-left">S. No</th>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left ">Quantity</th>
              <th className="px-4 py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {data?.products?.length > 0 ? (
              data.products.map((product, index) => (
                <tr key={product.id || index} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.price}</td>
                  <td className="px-4  py-2">{product.quantity}</td>
                  <td className="px-4 py-2">
                    {product.price * product.quantity}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className=" ">
            <tr className="bg-gray-400 ">
              <td colSpan={5} className="relative p-1 ">
                <h3 className="ml-2 top-0 font-bold">Grand Total:</h3>
                <p className="absolute top-0 mr-10 right-14 font-bold">
                  {data?.total}
                </p>
              </td>
            </tr>
          </tfoot>
        </table>

        <footer>
          <div className="mx-auto h-auto border-black p-8 mt-48 text-gray-800">
            {/* Thank You */}
            <div className="text-center border-b pb-4 ">
              <h2 className="font-semibold tracking-wide uppercase">
                Thank You For Your Business
              </h2>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Terms & Conditions
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                diam nonummy nibh euismod tincidunt.
              </p>
            </div>

            {/* Signature */}
            <div className="flex justify-end mb-4">
              <div className="text-center">
                <div className="border-t border-gray-400 mx-auto"></div>
                <p className="text-sm text-gray-600">Signature</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-2 text-sm mb-0 text-gray-600 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p>📞 +040 456 7890</p>
                <p>📞 +92 300 512 5485</p>
              </div>
              <div>
                <p>📩 ZeeshanElia@fb.com</p>
                <p>📩 ZeeshanElia@ig.com</p>
              </div>
              <div>
                <p>📍 Your Address</p>
                <p>Lorem ipsum - 40</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
