import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { CalendarClock, UserPlus, Info, X, Check, Upload, Loader2 } from 'lucide-react';

export default function Employees() {
  const { employees, addEmployee, uploadBill } = useData();
  const { hasAccess } = useAuth();
  
  const canEdit = hasAccess([ROLES.ADMIN, ROLES.OWNER]);
  const currentDate = new Date();

  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    status: 'Active',
    joinDate: '',
    idExpiry: '',
    password: '' // Explicitly asked by user
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.name && formData.position && formData.joinDate && formData.idExpiry && formData.password) {
      addEmployee({
        name: formData.name,
        position: formData.position,
        status: formData.status,
        joinDate: formData.joinDate,
        idExpiry: formData.idExpiry,
        // password is saved but obviously this is heavily simplified for the prototype
      });
      setIsAdding(false);
      setFormData({
        name: '', position: '', status: 'Active', joinDate: '', idExpiry: '', password: ''
      });
    }
  };

  const handleUploadBill = async (employeeId, file) => {
    if (!file) return;
    setUploadingId(employeeId);
    
    const formData = new FormData();
    formData.append('bill', file);
    
    try {
      const response = await fetch('http://localhost:3002/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      
      if (result.success) {
        if (uploadBill) {
          uploadBill({
            employeeId,
            date: new Date().toISOString().split('T')[0],
            url: result.url,
            filename: result.filename,
            description: `Employee ${employeeId} bill upload`
          });
        }
        alert('Bill uploaded successfully!');
      } else {
        alert('Upload failed: ' + result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred during upload.');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage staff and track document expiry.</p>
        </div>
        {canEdit && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-purple-600/20"
          >
            <UserPlus size={18} />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="glass-panel p-6 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900/50 bg-white/50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Employee Details</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
              <input type="text" name="position" required value={formData.position} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="Cashier" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Join Date</label>
              <input type="date" name="joinDate" required value={formData.joinDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Expiry Date</label>
              <input type="date" name="idExpiry" required value={formData.idExpiry} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleInputChange} className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white" placeholder="Staff Login Password" />
            </div>
            <div className="lg:col-span-3 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
              <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl transition shadow-md shadow-purple-500/20">
                <Check size={18} />
                <span>Save Employee</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left bg-white dark:bg-gray-900">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Join Date</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID Expiry Status</th>
                <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {employees.map((emp) => {
                const expiryDate = new Date(emp.idExpiry);
                const isExpired = expiryDate < currentDate;
                const isExpiringSoon = !isExpired && (expiryDate - currentDate) / (1000 * 60 * 60 * 24) < 30;

                return (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 shrink-0 shadow-sm border border-white dark:border-gray-800">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-200">{emp.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{emp.position}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                        emp.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30' 
                          : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{emp.joinDate}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {isExpired && <CalendarClock size={16} className="text-red-500" />}
                        {isExpiringSoon && <CalendarClock size={16} className="text-yellow-500" />}
                        {(!isExpired && !isExpiringSoon) && <CalendarClock size={16} className="text-green-500" />}
                        
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : isExpiringSoon ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Valid'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">{emp.idExpiry}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <label 
                          title="Upload Bill"
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            uploadingId === emp.id 
                              ? 'text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                              : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                          }`}
                        >
                          {uploadingId === emp.id ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleUploadBill(emp.id, e.target.files[0])}
                            accept="image/*,.pdf"
                            disabled={uploadingId === emp.id}
                          />
                        </label>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Info size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

