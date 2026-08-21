import React, { useState, useEffect } from 'react';
import styles from './Accounts.module.css';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    accountName: '',
    balance: '',
    currencyId: '1', 
    customerId: ''
  });

  const fetchAccounts = async () => {
    try {
      const response = await fetch('https://localhost:7258/api/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Hesaplar çekilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('https://localhost:7258/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Müşteriler çekilirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchCustomers();
  }, []);

  
  const getCustomerName = (acc) => {
   
    if (acc.customerName || acc.CustomerName) {
      return acc.customerName || acc.CustomerName;
    }

   
    const custId = acc.customerId || acc.CustomerId;
    const cust = customers.find(c => (c.id || c.Id || c.customerId || c.CustomerId) == custId);
    
    if (!cust) return 'Bilinmeyen Müşteri';
    
    const name = cust.firstName || cust.FirstName || cust.name || cust.Name || '';
    const surname = cust.lastName || cust.LastName || cust.surname || cust.Surname || '';
    return `${name} ${surname}`.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.customerId) {
      alert('Lütfen bir müşteri seçin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://localhost:7258/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: parseInt(formData.customerId),
          currencyId: parseInt(formData.currencyId),
          balance: parseFloat(formData.balance) || 0,
          accountName: formData.accountName
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          accountName: '',
          balance: '',
          currencyId: '1',
          customerId: ''
        });
        fetchAccounts();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert('Hata: ' + (errorData.message || errorData.Message || 'Hesap oluşturulurken bir hata oluştu.'));
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Sunucuya bağlanırken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.accountsPage}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Hesap Yönetimi</h2>
          <p className={styles.pageSubtitle}>Sistemdeki tüm banka ve cari hesapları listeleyin ve yönetin.</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
          + Yeni Hesap Aç
        </button>
      </div>

      <div className={styles.contentCard}>
        <div className={styles.tableToolbar}>
          <input 
            type="text" 
            placeholder="Hesap adı, no veya türü ara..." 
            className={styles.searchBox} 
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Yükleniyor...</p>
        ) : accounts.length === 0 ? (
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
            <thead>
              <tr>
                <th>Müşteri Adı</th>
                <th>Hesap Adı</th>
                <th>Hesap No</th>
                <th>Bakiye</th>
                <th>Para Birimi</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, index) => {
                const ownerName = getCustomerName(acc);
                const accName = acc.accountName || acc.AccountName;
                const accNo = acc.accountNumber || acc.AccountNumber;
                const balance = acc.balance !== undefined ? acc.balance : acc.Balance;
                const currency = acc.currency || acc.Currency;

                return (
                  <tr key={index}>
                    <td>{ownerName}</td>
                    <td>{accName}</td>
                    <td>{accNo}</td>
                    <td>{balance}</td>
                    <td>{currency}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h3>Yeni Hesap Aç</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              
              <select 
                value={formData.customerId} 
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                required 
                style={{ padding: '8px' }}
              >
                <option value="">Müşteri Seçin</option>
                {customers.map((c) => (
                  <option key={c.id || c.customerId || c.Id} value={c.id || c.customerId || c.Id}>
                    {c.firstName || c.FirstName} {c.lastName || c.LastName}
                  </option>
                ))}
              </select>

              <input 
                type="text" 
                placeholder="Hesap Adı (örn: Vadesiz TL)" 
                value={formData.accountName} 
                onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                required 
                style={{ padding: '8px' }}
              />

              <input 
                type="number" 
                placeholder="Başlangıç Bakiyesi" 
                value={formData.balance} 
                onChange={(e) => setFormData({...formData, balance: e.target.value})}
                required 
                style={{ padding: '8px' }}
              />

              <select 
                value={formData.currencyId} 
                onChange={(e) => setFormData({...formData, currencyId: e.target.value})}
                required 
                style={{ padding: '8px' }}
              >
                <option value="1">TRY (Türk Lirası)</option>
                <option value="2">USD (Amerikan Doları)</option>
                <option value="3">EUR (Euro)</option>
              </select>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 12px' }}>İptal</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ 
                    padding: '8px 12px', 
                    background: isSubmitting ? '#cccccc' : '#0056b3', 
                    color: 'white', 
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Açılıyor...' : 'Hesap Aç'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;