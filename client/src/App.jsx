import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header'; 
import LoginPage from './pages/LoginPage';
import Customers from './pages/Customers';
import Accounts from './pages/Accounts';
import DashboardHome from './pages/DashboardHome'; 
import ExchangeRates from './pages/ExchangeRates';
import ExchangeTransactions from './pages/ExchangeTransactions'; 
import TransactionHistory from './pages/TransactionHistory'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoggedIn) {
    return (
      <div style={{ display: 'flex', backgroundColor: '#F8FAFC', minHeight: '100vh', width: '100%' }}>
        
        <Sidebar 
          onLogout={() => setIsLoggedIn(false)} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <Header activeTab={activeTab} />

          <div style={{ padding: '2rem' }}>
            {activeTab === 'dashboard' && <DashboardHome />}
            {activeTab === 'customers' && <Customers />}
            {activeTab === 'accounts' && <Accounts />}
            {activeTab === 'exchangeRates' && <ExchangeRates />}
            {(activeTab === 'exchangeTransactions' || activeTab === 'transactions' || activeTab === 'exchange-transactions') && <ExchangeTransactions />} 
            
            
            {activeTab === 'transactionHistory' && <TransactionHistory />}
          </div>

        </div>

      </div>
    );
  }

  return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
}

export default App;