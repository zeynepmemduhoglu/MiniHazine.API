import React from 'react';
import styles from './DashboardHome.module.css';


const DashboardHome = () => {
  return (
    <div className={styles.dashboardContainer}>
      


      
      <div className={styles.welcomeBanner}>
        <div className={styles.bannerText}>
          <h2>Finansal Genel Bakış</h2>
          <p>FinCore yönetim sistemine hoş geldiniz. Güncel veriler ve operasyonel özetler aşağıdadır.</p>
        </div>
        <button className={styles.actionBtn}>+ Yeni İşlem</button>
      </div>






      
      <div className={styles.metricsGrid}>
        
        

        <div className={styles.metricCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardTitle}>Toplam Müşteri</span>
            <h3 className={styles.cardValue}>0</h3>
            <span className={styles.cardTrendPositive}>Veri bekleniyor</span>
          </div>
          <div className={`${styles.cardIcon} ${styles.blueIcon}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>



        
        <div className={styles.metricCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardTitle}>Aktif Hesaplar</span>
            <h3 className={styles.cardValue}>0</h3>
            <span className={styles.cardTrendPositive}>Veri bekleniyor</span>
          </div>
          <div className={`${styles.cardIcon} ${styles.greenIcon}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
        </div>



        <div className={styles.metricCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardTitle}>Günlük İşlem Hacmi</span>
            <h3 className={styles.cardValue}>₺0</h3>
            <span className={styles.cardTrendPositive}>İşlem yok</span>
          </div>
          <div className={`${styles.cardIcon} ${styles.purpleIcon}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
        </div>

        

        
        <div className={styles.metricCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardTitle}>Bekleyen İşlemler</span>
            <h3 className={styles.cardValue}>0</h3>
            <span className={styles.cardTrendWarning}>Onay bekleyen yok</span>
          </div>
          <div className={`${styles.cardIcon} ${styles.orangeIcon}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardHome;