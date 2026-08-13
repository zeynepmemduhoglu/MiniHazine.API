import React, { useState } from 'react';
import styles from './Accounts.module.css';



const Accounts = () => {
  const [accounts, setAccounts] = useState([]);



  return (
    <div className={styles.accountsPage}>
      
      


      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Hesap Yönetimi</h2>
          <p className={styles.pageSubtitle}>Sistemdeki tüm banka ve cari hesapları listeleyin ve yönetin.</p>
        </div>
        <button className={styles.primaryBtn}>+ Yeni Hesap Aç</button>
      </div>



      
      <div className={styles.contentCard}>
        
        
        <div className={styles.tableToolbar}>        {/* arama çubuğu */}
          <input 
            type="text" 
            placeholder="Hesap adı, no veya türü ara..." 
            className={styles.searchBox} 
          />
        </div>




        
        {accounts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <h3>Henüz Hesap Açılmamış</h3>
            <p>Sistemde kayıtlı aktif hesap bulunmuyor. Yeni bir hesap açmak için yukarıdaki butonu kullanabilirsiniz.</p>
          </div>
        ) : (
          <table className={styles.accountTable}>
           
          </table>
        )}

      </div>
    </div>
  );
};





export default Accounts;