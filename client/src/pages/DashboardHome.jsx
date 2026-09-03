import React, { useState, useEffect } from 'react';
import styles from './DashboardHome.module.css';

const DashboardHome = () => {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [selectedCurrencyModal, setSelectedCurrencyModal] = useState(null);

  const extractArray = (resData) => {
    if (Array.isArray(resData)) return resData;
    if (resData && Array.isArray(resData.data)) return resData.data;
    if (resData && Array.isArray(resData.$values)) return resData.$values;
    if (resData && typeof resData === 'object') {
      const found = Object.values(resData).find(Array.isArray);
      if (found) return found;
    }
    return [];
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const custRes = await fetch('https://localhost:7258/api/customers');
        const custData = await custRes.json();
        setCustomers(extractArray(custData));

        const accRes = await fetch('https://localhost:7258/api/accounts');
        const accData = await accRes.json();
        setAccounts(extractArray(accData));

        const rateRes = await fetch('https://localhost:7258/api/exchange-rates');
        const rateData = await rateRes.json();
        setExchangeRates(extractArray(rateData));
      } catch (err) {
        console.error('Dashboard verileri yüklenirken hata oluştu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalCustomers = customers.length;
  const totalAccounts = accounts.length;

  const activeAccountsCount = accounts.filter(acc => {
    const status = acc.status ?? acc.Status ?? acc.isClosed ?? acc.IsClosed;
    if (status === false || status === 'Passive' || status === 'Closed') return false;
    return true;
  }).length;

  const passiveAccountsCount = totalAccounts - activeAccountsCount;

  const totalBalance = accounts.reduce((sum, acc) => {
    const bal = acc.balance !== undefined ? acc.balance : (acc.Balance || 0);
    return sum + Number(bal);
  }, 0);

  // Para birimi gruplaması
  const currencyGroups = accounts.reduce((acc, curr) => {
    const cur = String(curr.currency || curr.Currency || curr.currencyCode || curr.CurrencyCode || 'TRY').toUpperCase();
    if (!acc[cur]) acc[cur] = [];
    acc[cur].push(curr);
    return acc;
  }, {});

  // Müşteri adını güvenli bulma fonksiyonu
  const getOwnerName = (acc) => {
    if (acc.customerName || acc.CustomerName) {
      return acc.customerName || acc.CustomerName;
    }
    const custId = acc.customerId || acc.CustomerId;
    if (!custId) return 'Bilinmeyen Müşteri';
    const cust = customers.find(c => String(c.id || c.Id || c.customerId || c.CustomerId) === String(custId));
    if (!cust) return 'Bilinmeyen Müşteri';
    const name = cust.firstName || cust.FirstName || cust.name || cust.Name || '';
    const surname = cust.lastName || cust.LastName || cust.surname || cust.Surname || '';
    return `${name} ${surname}`.trim();
  };

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Karşılama Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.bannerText} style={{ width: '100%' }}>
          <h2>Finansal Genel Bakış</h2>
          <p>FinCore yönetim sistemine hoş geldiniz. Güncel portföy verileri ve piyasa özetleri aşağıdadır.</p>
        </div>
      </div>

      {/* Metrik Kartları */}
      <div className={styles.metricsGrid}>
        
        {/* Toplam Müşteri */}
        <div className={styles.metricCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardTitle}>Toplam Müşteri</span>
            <h3 className={styles.cardValue}>{loading ? '...' : totalCustomers}</h3>
            <span className={styles.cardTrendPositive}>Kayıtlı müşteri portföyü</span>
          </div>
          <div className={`${styles.cardIcon} ${styles.blueIcon}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>

        {/* Aktif Hesaplar */}
        <div className={styles.metricCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardTitle}>Aktif Hesaplar</span>
            <h3 className={styles.cardValue}>{loading ? '...' : activeAccountsCount}</h3>
            <span className={styles.cardTrendPositive}>Kullanımda olan hesaplar</span>
          </div>
          <div className={`${styles.cardIcon} ${styles.greenIcon}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
        </div>

        {/* Toplam Sistem Bakiyesi */}
        <div className={styles.metricCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardTitle}>Toplam Sistem Bakiyesi</span>
            <h3 className={styles.cardValue}>{loading ? '...' : `₺${totalBalance.toLocaleString('tr-TR')}`}</h3>
            <span className={styles.cardTrendPositive}>Tüm hesapların toplamı</span>
          </div>
          <div className={`${styles.cardIcon} ${styles.purpleIcon}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
        </div>

      </div>

      {/* Alt Bölüm: Canlı Kurlar ve Tıklanabilir Para Birimi Dağılımı */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        
        {/* Canlı Döviz Kurları */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '1rem' }}>
            Piyasa Özeti (Canlı Kurlar)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {exchangeRates.slice(0, 4).map((rate, index) => {
              const pair = rate.pair || rate.Pair || rate.currencyCode || rate.CurrencyCode || 'Döviz';
              const buy = rate.buyRate ?? rate.BuyRate ?? rate.buy ?? rate.Buy ?? 0;
              const sell = rate.sellRate ?? rate.SellRate ?? rate.sell ?? rate.Sell ?? 0;
              return (
                <div key={index} style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <strong style={{ display: 'block', color: '#0F172A', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{pair}</strong>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B' }}>
                    <span>Alış: <strong style={{ color: '#10B981' }}>{buy} ₺</strong></span>
                    <span>Satış: <strong style={{ color: '#EF4444' }}>{sell} ₺</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Para Birimi Dağılımı (Tıklanabilir Kartlar) */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '1rem' }}>
            Para Birimi Dağılımı <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 'normal' }}>(Detay için tıklayın)</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.keys(currencyGroups).length > 0 ? Object.entries(currencyGroups).map(([cur, accList], idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedCurrencyModal({ currency: cur, accounts: accList })}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 14px', 
                  backgroundColor: '#F8FAFC', 
                  borderRadius: '8px', 
                  border: '1px solid #E2E8F0', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#0EA5E9'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
              >
                <span style={{ fontWeight: '600', color: '#1E293B', fontSize: '0.95rem' }}>{cur} Hesapları</span>
                <span style={{ backgroundColor: '#E2E8F0', padding: '2px 10px', borderRadius: '12px', fontWeight: 'bold', color: '#0F172A', fontSize: '0.85rem' }}>
                  {accList.length} Adet ➔
                </span>
              </div>
            )) : (
              <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Veri bulunmuyor.</span>
            )}
          </div>
        </div>

      </div>

      {/* Hesap Detay Modal Alanı */}
      {selectedCurrencyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#1E293B', fontSize: '1.2rem' }}>
                {selectedCurrencyModal.currency} Hesapları ({selectedCurrencyModal.accounts.length} Adet)
              </h3>
              <button 
                onClick={() => setSelectedCurrencyModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748B', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedCurrencyModal.accounts.map((acc, i) => {
                const owner = getOwnerName(acc);
                const accType = acc.accountType || acc.AccountType || acc.accountName || acc.AccountName || 'Hesap';
                const accNo = acc.accountNumber || acc.AccountNumber || 'ACC-***';
                const balance = acc.balance !== undefined ? acc.balance : (acc.Balance || 0);

                return (
                  <div key={i} style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ display: 'block', color: '#0F172A', fontSize: '0.95rem' }}>{owner}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{accType} ({accNo})</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#10B981', fontSize: '1rem' }}>
                      {Number(balance).toLocaleString('tr-TR')} {selectedCurrencyModal.currency}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button 
                onClick={() => setSelectedCurrencyModal(null)}
                style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardHome;