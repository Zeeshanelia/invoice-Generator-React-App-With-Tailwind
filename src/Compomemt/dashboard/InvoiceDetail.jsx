import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export const InvoiceDetail = () => {
  const location = useLocation();
  const [data] = useState(location.state);
  const [photoUrl] = useState("/profile/guest_default.jpg");
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
        className="bg-blue-400 hover:bg-slate-800 p-1 text-white rounded md:p-2 md:m-2 md:ml-10 mb-3 font-semibold border-black shadow"
      >
        PDF invoice
      </button>

      {/* Invoice container */}
      <div
        ref={invoiceRef}
        className="w-full md:w-3/4 border border-black mx-auto bg-white p-2 sm:p-4 text-[12px] sm:text-[14px]"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
          <div>
            <img
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full mt-4 border-2 border-gray-200 ml-2 shadow-md"
              src="/img/logoInvoice.png"
              alt="Logo"
            />
          </div>

          <div className="mt-4 sm:mt-4 sm:mr-2 text-center sm:text-right">
            <p className="font-bold text-lg">Invoice Detail</p>
            <p>To : {data?.to || "N/A"}</p>
            <p>Phone : {data?.phone || "N/A"}</p>
            <p>Address : {data?.address || "N/A"}</p>
            <p>Name : {data?.fullname || "____________"}</p>
          </div>
        </div>

        {/* Table wrapper for mobile scroll */}
        <div className="overflow-x-auto mt-8">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border shadow border-black bg-gray-400">
                <th className="px-2 sm:px-4 py-2 text-left">S. No</th>
                <th className="px-2 sm:px-4 py-2 text-left">Product</th>
                <th className="px-2 sm:px-4 py-2 text-left">Price</th>
                <th className="px-2 sm:px-4 py-2 text-left">Quantity</th>
                <th className="px-2 sm:px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.length > 0 ? (
                data.products.map((product, index) => (
                  <tr key={product.id || index} className="border-b">
                    <td className="px-2 sm:px-4 py-2">{index + 1}</td>
                    <td className="px-2 sm:px-4 py-2">{product.name}</td>
                    <td className="px-2 sm:px-4 py-2">{product.price}</td>
                    <td className="px-2 sm:px-4 py-2">{product.quantity}</td>
                    <td className="px-2 sm:px-4 py-2">
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

            <tfoot>
              <tr className="bg-gray-400">
                <td colSpan={5} className="relative p-1">
                  <h3 className="ml-2 top-0 font-bold">Grand Total:</h3>
                  <p className="absolute top-0 right-6 font-bold">
                    {data?.total}
                  </p>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <footer className="mt-52 text-gray-800">
          <div className="text-center border-b pb-4">
            <h2 className="font-semibold tracking-wide uppercase">
              Thank You For Your Business
            </h2>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              Terms & Conditions
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt.
            </p>
          </div>

          <div className="flex justify-end mb-4 mt-8">
            <div className="text-center">
              <div className="border-t border-gray-400 mx-auto w-32"></div>
              <p className="text-sm text-gray-600 mt-1">Signature</p>
            </div>
          </div>

          <div className="border-t pt-2 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
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
        </footer>
      </div>
    </div>
  );
};
