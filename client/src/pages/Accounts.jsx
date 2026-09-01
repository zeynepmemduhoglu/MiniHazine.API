import React, { useState, useEffect } from 'react';
import styles from './Accounts.module.css';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
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
        setFormData({ accountName: '', balance: '', currencyId: '1', customerId: '' });
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

  const handleDelete = async (id) => {
    if (!window.confirm('Bu hesabı silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`https://localhost:7258/api/accounts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAccounts();
      } else {
        alert('Hesap silinirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const handleOpenEditModal = (acc) => {
    setSelectedAccount(acc);
    let currId = '1';
    const cCode = (acc.currency || acc.Currency || '').toUpperCase();
    if (cCode === 'USD') currId = '2';
    else if (cCode === 'EUR') currId = '3';

    const custId = acc.customerId || acc.CustomerId || '';

    setFormData({
      accountName: acc.accountName || acc.AccountName || '',
      balance: acc.balance !== undefined ? acc.balance : acc.Balance || '',
      currencyId: currId,
      customerId: custId
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isSubmitting || !selectedAccount) return;

    if (!formData.customerId) {
      alert('Lütfen bir müşteri seçin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const accId = selectedAccount.id || selectedAccount.Id;
      const response = await fetch(`https://localhost:7258/api/accounts/${accId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: parseInt(formData.customerId),
          currencyId: parseInt(formData.currencyId),
          balance: parseFloat(formData.balance) || 0,
          accountName: formData.accountName
        }),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        setSelectedAccount(null);
        setFormData({ accountName: '', balance: '', currencyId: '1', customerId: '' });
        fetchAccounts();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert('Hata: ' + (errorData.message || errorData.Message || 'Hesap güncellenirken hata oluştu.'));
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert('Sunucuya bağlanırken hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAccounts = accounts.filter(acc => {
    const custName = getCustomerName(acc).toLowerCase();
    const accName = (acc.accountName || acc.AccountName || '').toLowerCase();
    const accNo = (acc.accountNumber || acc.AccountNumber || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    return custName.includes(query) || accName.includes(query) || accNo.includes(query);
  });

  return (
    <div className={styles.accountsPage}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Hesap Yönetimi</h2>
          <p className={styles.pageSubtitle}>Sistemdeki tüm banka ve cari hesapları listeleyin ve yönetin.</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => {
          setFormData({ accountName: '', balance: '', currencyId: '1', customerId: '' });
          setIsModalOpen(true);
        }}>
          + Yeni Hesap Aç
        </button>
      </div>

      <div className={styles.contentCard}>
        <div className={styles.tableToolbar}>
          <input 
            type="text" 
            placeholder="Hesap adı, no veya müşteri ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchBox} 
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Yükleniyor...</p>
        ) : filteredAccounts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <h3>Kayıt Bulunamadı</h3>
            <p>Arama kriterinize uygun aktif hesap bulunmuyor.</p>
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
                <th style={{ textAlign: 'center' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc, index) => {
                const ownerName = getCustomerName(acc);
                const accName = acc.accountName || acc.AccountName;
                const accNo = acc.accountNumber || acc.AccountNumber;
                const balance = acc.balance !== undefined ? acc.balance : acc.Balance;
                const currency = acc.currency || acc.Currency;
                const accId = acc.id || acc.Id;

                return (
                  <tr key={accId || index}>
                    <td>{ownerName}</td>
                    <td>{accName}</td>
                    <td>{accNo}</td>
                    <td>{Number(balance).toLocaleString('tr-TR')}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
                        background: currency === 'USD' ? '#ECFDF5' : currency === 'EUR' ? '#FEF3C7' : '#EEF2FF',
                        color: currency === 'USD' ? '#10B981' : currency === 'EUR' ? '#D97706' : '#6366F1' 
                      }}>
                        {currency}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => handleOpenEditModal(acc)} 
                        style={{ marginRight: '8px', padding: '6px 12px', background: '#F59E0B', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Düzenle
                      </button>
                      <button 
                        onClick={() => handleDelete(accId)} 
                        style={{ padding: '6px 12px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Sil
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Yeni Hesap Açma Modalı */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h3>Yeni Hesap Aç</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <select value={formData.customerId} onChange={(e) => setFormData({...formData, customerId: e.target.value})} required style={{ padding: '8px' }}>
                <option value="">Müşteri Seçin</option>
                {customers.map((c) => (
                  <option key={c.id || c.customerId || c.Id} value={c.id || c.customerId || c.Id}>
                    {c.firstName || c.FirstName} {c.lastName || c.LastName}
                  </option>
                ))}
              </select>
              <input type="text" placeholder="Hesap Adı (örn: Vadesiz TL)" value={formData.accountName} onChange={(e) => setFormData({...formData, accountName: e.target.value})} required style={{ padding: '8px' }} />
              <input type="number" placeholder="Başlangıç Bakiyesi" value={formData.balance} onChange={(e) => setFormData({...formData, balance: e.target.value})} required style={{ padding: '8px' }} />
              <select value={formData.currencyId} onChange={(e) => setFormData({...formData, currencyId: e.target.value})} required style={{ padding: '8px' }}>
                <option value="1">TRY (Türk Lirası)</option>
                <option value="2">USD (Amerikan Doları)</option>
                <option value="3">EUR (Euro)</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 12px' }}>İptal</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '8px 12px', background: isSubmitting ? '#cccccc' : '#F59E0B', color: 'white', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Açılıyor...' : 'Hesap Aç'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hesap Düzenleme Modalı */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h3>Hesap Düzenle</h3>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <select value={formData.customerId} disabled style={{ padding: '8px', backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}>
                {customers.map((c) => (
                  <option key={c.id || c.customerId || c.Id} value={c.id || c.customerId || c.Id}>
                    {c.firstName || c.FirstName} {c.lastName || c.LastName}
                  </option>
                ))}
              </select>
              <input type="text" placeholder="Hesap Adı" value={formData.accountName} onChange={(e) => setFormData({...formData, accountName: e.target.value})} required style={{ padding: '8px' }} />
              <input type="number" placeholder="Bakiye" value={formData.balance} onChange={(e) => setFormData({...formData, balance: e.target.value})} required style={{ padding: '8px' }} />
              <select value={formData.currencyId} onChange={(e) => setFormData({...formData, currencyId: e.target.value})} required style={{ padding: '8px' }}>
                <option value="1">TRY (Türk Lirası)</option>
                <option value="2">USD (Amerikan Doları)</option>
                <option value="3">EUR (Euro)</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '8px 12px' }}>İptal</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '8px 12px', background: isSubmitting ? '#cccccc' : '#F59E0B', color: 'white', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Güncelleniyor...' : 'Kaydet'}
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