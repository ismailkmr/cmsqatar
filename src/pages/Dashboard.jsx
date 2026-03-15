import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Users, 
  AlertTriangle 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { getDashboardMetrics, dayBook, licenses } = useData();
  const { user } = useAuth();
  
  const metrics = getDashboardMetrics();

  // Prepare data for line chart (last 7 days simulation)
  const lineData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
    datasets: [
      {
        label: 'Income',
        data: [1200, 1900, 3000, 5000, 2000, 3000, metrics.totalIncome],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      },
      {
        label: 'Expense',
        data: [1000, 1200, 2500, 3000, 1500, 2000, metrics.totalExpense],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    maintainAspectRatio: false
  };

  const doughnutData = {
    labels: ['Valid Licenses', 'Expiring/Expired'],
    datasets: [{
      data: [licenses.length - metrics.expiredLicensesCount, metrics.expiredLicensesCount],
      backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      borderWidth: 0,
    }]
  };

  const doughnutOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    cutout: '70%',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Role: <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.role}</span>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Income" 
          amount={`₹${metrics.totalIncome}`} 
          icon={<TrendingUp size={24} className="text-green-500" />} 
          trend="+12.5%" trendUp={true}
        />
        <MetricCard 
          title="Total Expenses" 
          amount={`₹${metrics.totalExpense}`} 
          icon={<TrendingDown size={24} className="text-red-500" />} 
          trend="-2.4%" trendUp={false}
        />
        <MetricCard 
          title="Net Balance" 
          amount={`₹${metrics.balance}`} 
          icon={<Wallet size={24} className="text-blue-500" />} 
          trend="+14.2%" trendUp={true}
        />
        {user?.role !== ROLES.ACCOUNTANT && (
          <MetricCard 
            title="Active Employees" 
            amount={metrics.activeEmployeesCount} 
            icon={<Users size={24} className="text-purple-500" />} 
            subtitle="2 expiring IDs"
          />
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 shadow-sm border border-gray-100 dark:border-gray-800 h-[400px]">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Cash Flow Overview</h3>
          <div className="h-full pb-8">
            <Line options={lineOptions} data={lineData} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Compliance Status</h3>
          <div className="flex-1 flex justify-center items-center pb-4">
             <div className="w-full max-w-[200px]">
               <Doughnut options={doughnutOptions} data={doughnutData} />
             </div>
          </div>
          {metrics.expiredLicensesCount > 0 && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg flex items-start gap-3">
               <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
               <div className="text-sm text-red-800 dark:text-red-300">
                 <p className="font-semibold">Action Required</p>
                 <p>{metrics.expiredLicensesCount} license(s) expired or expiring soon.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, amount, icon, trend, trendUp, subtitle }) {
  return (
    <div className="glass p-6 rounded-2xl flex flex-col hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-100 dark:border-gray-700">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{amount}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    </div>
  );
}
