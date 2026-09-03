import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';

const Header = ({ activeTab }) => {
  const [userName, setUserName] = useState('Kayıtlı olmayan müşteri');

  useEffect(() => {
    
    const storedName = localStorage.getItem('userName') || 'Kayıtlı olmayan müşteri';
    setUserName(storedName);
  }, []);

  const titles = {
    dashboard: "Dashboard",
    customers: "Müşteriler",
    accounts: "Hesaplar",
    exchangeRates: "Döviz Kurları",
    exchangeTransactions: "Döviz İşlemleri", 
    transactions: "Döviz İşlemleri",
    "exchange-transactions": "Döviz İşlemleri", 
    transactionHistory: "İşlem Geçmişi",    
    history: "İşlem Geçmişi",
    reports: "Raporlar",
    users: "Kullanıcılar",
    kullanicilar: "Kullanıcılar", 
    settings: "Ayarlar",
    ayarlar: "Ayarlar"
  };

  const pageTitle = titles[activeTab] || "Dashboard";
  
  
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'K';

  return (
    <header className={styles.header}>
      <h2 className={styles.headerTitle}>{pageTitle}</h2>

      <div className={styles.userInfo}>
        <span>Hoşgeldiniz, <strong>{userName}</strong></span>
        <div className={styles.userAvatar}>{userInitial}</div>
      </div>
    </header>
  );
};

export default Header;