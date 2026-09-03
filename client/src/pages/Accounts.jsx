import React, { useState, useEffect } from 'react';
import styles from './Accounts.module.css';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [expandedCustomers, setExpandedCustomers] = useState({});

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

  const getCustomerId = (acc) => {
    return acc.customerId || acc.CustomerId;
  };

  const toggleCustomerAccordion = (custId) => {
    setExpandedCustomers(prev => ({
      ...prev,
      [custId]: !prev[custId]
    }));
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

  const groupedByCustomer = {};
  filteredAccounts.forEach(acc => {
    const custId = getCustomerId(acc) || 'unknown';
    const custName = getCustomerName(acc);
    if (!groupedByCustomer[custId]) {
      groupedByCustomer[custId] = {
        customerName: custName,
        accounts: []
      };
    }
    groupedByCustomer[custId].accounts.push(acc);
  });

  const customerGroups = Object.keys(groupedByCustomer).map(custId => ({
    customerId: custId,
    customerName: groupedByCustomer[custId].customerName,
    accounts: groupedByCustomer[custId].accounts
  }));

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
        <div className={styles.tableToolbar} style={{ marginBottom: '20px' }}>
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
        ) : customerGroups.length === 0 ? (
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
          /* Modern Kart Listesi Yapısı */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {customerGroups.map((group) => {
              const isExpanded = !!expandedCustomers[group.customerId];

              return (
                <div key={group.customerId} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', overflow: 'hidden', transition: 'all 0.2s ease' }}>
                  {/* Müşteri Satır Kartı */}
                  <div 
                    onClick={() => toggleCustomerAccordion(group.customerId)}
                    style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: isExpanded ? '#f8fafc' : '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {group.customerName.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>{group.customerName}</h4>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{group.accounts.length} Adet Hesap</span>
                      </div>
                    </div>
                    <button 
                      style={{ padding: '6px 14px', background: isExpanded ? '#E2E8F0' : '#EEF2FF', color: isExpanded ? '#475569' : '#4F46E5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>
                      {isExpanded ? 'Hesapları Gizle ▲' : 'Hesapları Göster ▼'}
                    </button>
                  </div>

                  {/* Açılır Kapanır Hesap Detay Alanı */}
                  {isExpanded && (
                    <div style={{ padding: '0 20px 20px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ marginTop: '15px', background: '#ffffff', borderRadius: '8px', padding: '10px 15px', border: '1px solid #e2e8f0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              <th style={{ padding: '10px 8px' }}>Hesap Adı</th>
                              <th style={{ padding: '10px 8px' }}>Hesap No</th>
                              <th style={{ padding: '10px 8px' }}>Bakiye</th>
                              <th style={{ padding: '10px 8px' }}>Para Birimi</th>
                              <th style={{ padding: '10px 8px', textAlign: 'center' }}>İşlemler</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.accounts.map((acc, idx) => {
                              const accName = acc.accountName || acc.AccountName;
                              const accNo = acc.accountNumber || acc.AccountNumber;
                              const balance = acc.balance !== undefined ? acc.balance : acc.Balance;
                              const currency = acc.currency || acc.Currency;
                              const accId = acc.id || acc.Id;

                              return (
                                <tr key={accId || idx} style={{ borderBottom: idx === group.accounts.length - 1 ? 'none' : '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                                  <td style={{ padding: '12px 8px', fontWeight: '500', color: '#334155' }}>{accName}</td>
                                  <td style={{ padding: '12px 8px', color: '#64748b' }}>{accNo}</td>
                                  <td style={{ padding: '12px 8px', fontWeight: '600', color: '#0f172a' }}>{Number(balance).toLocaleString('tr-TR')}</td>
                                  <td style={{ padding: '12px 8px' }}>
                                    <span style={{ 
                                      padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600',
                                      background: currency === 'USD' ? '#ECFDF5' : currency === 'EUR' ? '#FEF3C7' : '#EEF2FF',
                                      color: currency === 'USD' ? '#10B981' : currency === 'EUR' ? '#D97706' : '#6366F1' 
                                    }}>
                                      {currency}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleOpenEditModal(acc); }} 
                                      style={{ marginRight: '6px', padding: '5px 10px', background: '#FEF3C7', color: '#D97706', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>
                                      Düzenle
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleDelete(accId); }} 
                                      style={{ padding: '5px 10px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>
                                      Sil
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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