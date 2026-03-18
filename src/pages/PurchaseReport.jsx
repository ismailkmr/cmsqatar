import React, { useState } from 'react';
import { Download, FileText, Eye, Building2 } from 'lucide-react';

const MOCK_PURCHASES = [
  { id: 'INV-2026-001', date: '2026-03-01', supplier: 'Tech Corp Supply', items: 'Laptops, Monitors', amount: 15400.00, status: 'Completed' },
  { id: 'INV-2026-002', date: '2026-03-05', supplier: 'Office Essentials', items: 'Printers, Ink', amount: 2350.50, status: 'Pending' },
  { id: 'INV-2026-003', date: '2026-03-10', supplier: 'Gulf Equipment Co', items: 'Servers, Racks', amount: 45000.00, status: 'Completed' },
  { id: 'INV-2026-004', date: '2026-03-12', supplier: 'Daily Stationery', items: 'Paper, Pens, Folders', amount: 450.00, status: 'Completed' },
  { id: 'INV-2026-005', date: '2026-03-15', supplier: 'NetWorks Inc', items: 'Routers, Switches', amount: 8900.00, status: 'Processing' },
  { id: 'INV-2026-006', date: '2026-03-16', supplier: 'Cloud Services Ltd', items: 'Cloud Hosting Annual', amount: 12000.00, status: 'Completed' },
  { id: 'INV-2026-007', date: '2026-03-17', supplier: 'Furnishings Pro', items: 'Ergonomic Chairs, Desks', amount: 7800.00, status: 'Pending' }
];

export default function PurchaseReport() {
  const [purchases] = useState(MOCK_PURCHASES);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Purchase Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Create table
    const tableColumn = ["Invoice Number", "Date", "Supplier", "Items", "Amount (XYZ)", "Status"];
    const tableRows = [];

    purchases.forEach(purchase => {
      const purchaseData = [
        purchase.id,
        purchase.date,
        purchase.supplier,
        purchase.items,
        purchase.amount.toFixed(2),
        purchase.status
      ];
      tableRows.push(purchaseData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    const totalAmount = purchases.reduce((sum, p) => sum + p.amount, 0);
    const finalY = doc.lastAutoTable.finalY || 40;
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Purchase Amount: ${totalAmount.toFixed(2)}`, 14, finalY + 10);

    doc.save('purchase-report.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="text-blue-600" />
            Purchase Report
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of all company purchases and expenses.</p>
        </div>
        
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-transform hover:scale-105 font-medium shadow-sm"
        >
          <Download size={18} />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Main Table View */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                <th className="px-6 py-4 font-semibold">Invoice Number</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Supplier</th>
                <th className="px-6 py-4 font-semibold max-w-xs">Items</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {purchase.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {purchase.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-300">
                    {purchase.supplier}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {purchase.items}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white text-right">
                    ${purchase.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
                      purchase.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' :
                      purchase.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                    }`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedPurchase(purchase)}
                      className="p-2 bg-gray-100 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-blue-600 dark:text-blue-400 transition-colors shadow-sm"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-white/20 dark:border-gray-700/50 overflow-hidden transform transition-all">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="text-blue-500" size={22} />
                Invoice Details
              </h3>
              <button 
                onClick={() => setSelectedPurchase(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800/50">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-1">Invoice Number</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedPurchase.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-1">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedPurchase.date}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-1">Supplier</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedPurchase.supplier}</p>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-1">Items Included</p>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-300 border border-gray-100 dark:border-gray-800 shadow-inner">
                  {selectedPurchase.items}
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-gray-100 dark:border-gray-800/50">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                    selectedPurchase.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' :
                    selectedPurchase.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                  }`}>
                    {selectedPurchase.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-1">Total Amount</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ${selectedPurchase.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setSelectedPurchase(null)}
                className="px-6 py-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border border-transparent rounded-lg text-sm font-bold text-gray-800 dark:text-white hover:brightness-95 transition-all outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
