import React, { useState } from 'react';
import styles from './Customers.module.css';



const Customers = () => {
  const [customers, setCustomers] = useState([]);   



  return (
    <div className={styles.customersPage}>
      
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Müşteri Yönetimi</h2>
          <p className={styles.pageSubtitle}>Sistemdeki tüm kurumsal ve bireysel müşterileri listeleyin ve yönetin.</p>
        </div>
        <button className={styles.primaryBtn}>+ Yeni Müşteri Ekle</button>
      </div>





      <div className={styles.contentCard}>
        
        <div className={styles.tableToolbar}>
          <input 
            type="text" 
            placeholder="Müşteri adı veya şirket ara..." 
            className={styles.searchBox} 
          />
        </div>



        {customers.length === 0 ? (                
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Henüz Müşteri Eklenmemiş</h3>
            <p>Sistemde kayıtlı müşteri bulunmuyor. Yeni müşteri kaydı oluşturmak için yukarıdaki butonu kullanabilirsiniz.</p>
          </div>
        ) : (
          <table className={styles.customerTable}>
            
          </table>
        )}

      </div>
    </div>
  );
};

export default Customers;