import React from 'react';
import styles from './Header.module.css';

const Header = ({ activeTab }) => {

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
  
  return (
    <header className={styles.header}>
      <h2 className={styles.headerTitle}>{pageTitle}</h2>


      <div className={styles.userInfo}>
        <span>Hoşgeldiniz, <strong>admin</strong></span>
        <div className={styles.userAvatar}>Z</div>
      </div>
    </header>
  );
};

export default Header;