import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Receipt, Search, Filter, Upload, FileImageIcon } from 'lucide-react';

export default function Bills() {
  const { dayBook } = useData();
  
  // Find all daybook entries that have an image attached
  const bills = dayBook.filter(entry => entry.image);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bills Storage</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Day-wise categorized receipts and invoices.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg shadow-sm">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search bills..." 
              className="bg-transparent border-none outline-none ml-2 text-sm w-full dark:text-white"
            />
          </div>
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Upload Card */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors min-h-[200px]">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full mb-4">
            <Upload size={24} />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Direct Upload</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Drop files here or click to browse</p>
        </div>

        {/* Mapped Bills */}
        {bills.map((bill) => (
          <div key={bill.id} className="glass-panel p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col group relative">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-md shadow-sm text-gray-500 hover:text-blue-600">
                <FileImageIcon size={16} />
              </button>
            </div>
            
            <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4 flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden">
               {/* Simulating an image thumbnail */}
               <Receipt size={40} className="text-gray-300 dark:text-gray-600" />
            </div>
            
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate pr-2">{bill.category}</h3>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-200">₹{bill.amount}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">{bill.description || 'No description'}</p>
            
            <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
              <span className="text-gray-500 dark:text-gray-400">{bill.date}</span>
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md font-medium">#{bill.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
