import React, { useState, useEffect } from 'react';

const MonthlyRevenue = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with your actual API call
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data for the selected month
        const monthData = {
          totalRevenue: Math.floor(Math.random() * 100000) + 50000,
          completedTests: Math.floor(Math.random() * 100) + 50,
          pendingPayments: Math.floor(Math.random() * 20000) + 5000,
          cashPayments: Math.floor(Math.random() * 40000) + 20000,
          onlinePayments: Math.floor(Math.random() * 60000) + 30000,
        };
        
        setRevenueData(monthData);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Generate month options for the past 12 months
  const getMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      options.unshift({ value, label });
    }
    
    return options;
  };

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Monthly Revenue</h2>
        <p>Loading revenue data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2E7D32', margin: 0 }}>Monthly Revenue</h2>
        <select 
          value={selectedMonth} 
          onChange={handleMonthChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          {getMonthOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#E8F5E9', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#388E3C' }}>Total Revenue</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Rs. {revenueData.totalRevenue?.toLocaleString()}</p>
        </div>
        
        <div style={{ backgroundColor: '#E3F2FD', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>Completed Tests</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{revenueData.completedTests}</p>
        </div>
        
        <div style={{ backgroundColor: '#FFF8E1', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#F57C00' }}>Pending Payments</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Rs. {revenueData.pendingPayments?.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Payment Breakdown</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ width: '120px', fontWeight: 'bold' }}>Cash Payments:</div>
          <div style={{ flex: 1, height: '20px', backgroundColor: '#E0E0E0', borderRadius: '10px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                backgroundColor: '#4CAF50', 
                width: `${(revenueData.cashPayments / revenueData.totalRevenue) * 100}%` 
              }} 
            />
          </div>
          <div style={{ width: '100px', textAlign: 'right', marginLeft: '10px' }}>
            Rs. {revenueData.cashPayments?.toLocaleString()}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ width: '120px', fontWeight: 'bold' }}>Online Payments:</div>
          <div style={{ flex: 1, height: '20px', backgroundColor: '#E0E0E0', borderRadius: '10px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                backgroundColor: '#2196F3', 
                width: `${(revenueData.onlinePayments / revenueData.totalRevenue) * 100}%` 
              }} 
            />
          </div>
          <div style={{ width: '100px', textAlign: 'right', marginLeft: '10px' }}>
            Rs. {revenueData.onlinePayments?.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '20px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Revenue History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Month</th>
              <th style={{ textAlign: 'right', padding: '10px' }}>Revenue</th>
              <th style={{ textAlign: 'right', padding: '10px' }}>Tests</th>
              <th style={{ textAlign: 'right', padding: '10px' }}>Pending</th>
            </tr>
          </thead>
          <tbody>
            {getMonthOptions().slice(-6).map(month => (
              <tr key={month.value} style={{ borderBottom: '1px solid #EEEEEE' }}>
                <td style={{ padding: '10px' }}>{month.label}</td>
                <td style={{ textAlign: 'right', padding: '10px' }}>
                  Rs. {Math.floor(Math.random() * 100000 + 20000).toLocaleString()}
                </td>
                <td style={{ textAlign: 'right', padding: '10px' }}>
                  {Math.floor(Math.random() * 100 + 20)}
                </td>
                <td style={{ textAlign: 'right', padding: '10px' }}>
                  Rs. {Math.floor(Math.random() * 15000 + 5000).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyRevenue;