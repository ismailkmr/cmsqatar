import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { Plus, Trash2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export default function DayBook() {
  const { dayBook, addDayBookEntry, deleteDayBookEntry } = useData();
  const { hasAccess, user } = useAuth();
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Income',
    category: '',
    amount: '',
    description: '',
  });
  const [uploadText, setUploadText] = useState('Upload Photo/Bill');

  const canEdit = hasAccess([ROLES.ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]);
  // Staff can ADD, but maybe they shouldn't delete existing records or view full history without restriction,
  // but for this prototype, we'll let them add and see today's entries.

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    addDayBookEntry({
      ...formData,
      amount: parseFloat(formData.amount),
      image: uploadText !== 'Upload Photo/Bill' ? uploadText : null
    });
    
    setShowModal(false);
    setFormData({ ...formData, amount: '', description: '', category: '' });
    setUploadText('Upload Photo/Bill');
  };

  const handleMockUpload = () => {
    setUploadText('Uploading...');
    setTimeout(() => {
      setUploadText(`receipt_${Date.now()}.jpg`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Day Book</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage daily income and expenses.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-blue-600/20"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      {/* Entries Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Receipt</th>
                {canEdit && <th className="p-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {dayBook.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 text-gray-900 dark:text-gray-200">{entry.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      entry.type === 'Income' 
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800/30' 
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800/30'
                    }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{entry.category}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm max-w-[200px] truncate">{entry.description || '-'}</td>
                  <td className={`p-4 font-semibold ${entry.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {entry.type === 'Income' ? '+' : '-'}₹{entry.amount}
                  </td>
                  <td className="p-4">
                    {entry.image ? (
                      <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-800/30">
                        <ImageIcon size={12} /> View
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  {canEdit && (
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => deleteDayBookEntry(entry.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {dayBook.length === 0 && (
                <tr>
                  <td colSpan={canEdit ? 7 : 6} className="p-8 text-center text-gray-500">
                    No entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Modal for New Entry */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-800 transform p-6 transition-all">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Day Book Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" value="Income" checked={formData.type === 'Income'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="peer sr-only" />
                  <div className="p-3 rounded-lg border text-center peer-checked:bg-green-50 peer-checked:border-green-500 peer-checked:text-green-700 dark:peer-checked:bg-green-900/20 dark:peer-checked:border-green-500 dark:peer-checked:text-green-400 border-gray-200 dark:border-gray-700 dark:text-gray-400 transition-colors">
                    Income
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" value="Expense" checked={formData.type === 'Expense'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="peer sr-only" />
                  <div className="p-3 rounded-lg border text-center peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 dark:peer-checked:bg-red-900/20 dark:peer-checked:border-red-500 dark:peer-checked:text-red-400 border-gray-200 dark:border-gray-700 dark:text-gray-400 transition-colors">
                    Expense
                  </div>
                </label>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <input 
                  type="text" required
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors" 
                  placeholder="e.g. Sales, Utilities, Stock"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</label>
                <input 
                  type="number" required min="0" step="0.01"
                  value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors" 
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                <input 
                  type="text" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors" 
                />
              </div>

              {/* Mock Photo Upload */}
              <div 
                onClick={handleMockUpload}
                className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col items-center justify-center gap-2"
              >
                {uploadText.includes('receipt') ? (
                  <CheckCircle2 className="text-green-500" size={24} />
                ) : (
                  <ImageIcon className="text-gray-400" size={24} />
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{uploadText}</span>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
