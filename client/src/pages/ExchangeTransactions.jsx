import React, { useState, useEffect } from 'react';
import { buyCurrency, sellCurrency } from '../services/transactionService';
import styles from './ExchangeRates.module.css';

export default function ExchangeTransactions() {
  const [formData, setFormData] = useState({
    accountId: '',
    currencyId: '',
    amount: ''
  });

  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const accountsRes = await fetch('https://localhost:7258/api/accounts');
        const accountsData = await accountsRes.json();
        setAccounts(Array.isArray(accountsData) ? accountsData : []);

        const customersRes = await fetch('https://localhost:7258/api/customers');
        const customersData = await customersRes.json();
        setCustomers(Array.isArray(customersData) ? customersData : []);

        const ratesRes = await fetch('https://localhost:7258/api/exchange-rates');
        const ratesData = await ratesRes.json();
        setRates(Array.isArray(ratesData) ? ratesData : []);

      } catch (error) {
        console.error('Veriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const selectedAccount = accounts.find(a => String(a.id || a.Id) === String(formData.accountId));
  const selectedRate = rates.find(r => String(r.currencyId || r.CurrencyId || r.id || r.Id) === String(formData.currencyId));

  const ownerFullName = selectedAccount ? getOwnerName(selectedAccount) : '-';
  const currentBalance = selectedAccount ? (selectedAccount.balance !== undefined ? selectedAccount.balance : selectedAccount.Balance) : 0;
  const accountCurrency = selectedAccount ? (selectedAccount.currency || selectedAccount.Currency || 'TRY') : 'TRY';

  const buyRate = selectedRate ? (selectedRate.buyRate !== undefined ? selectedRate.buyRate : selectedRate.BuyRate) : 0;
  const sellRate = selectedRate ? (selectedRate.sellRate !== undefined ? selectedRate.sellRate : selectedRate.SellRate) : 0;
  
  const pairText = selectedRate ? (selectedRate.pair || selectedRate.Pair || '') : '';
  const currencySymbol = pairText.includes('/') ? pairText.split('/')[0] : '';

  const estimatedBuyTotal = formData.amount && buyRate ? (parseFloat(formData.amount) * parseFloat(buyRate)).toFixed(2) : 0;
  const estimatedSellTotal = formData.amount && sellRate ? (parseFloat(formData.amount) * parseFloat(sellRate)).toFixed(2) : 0;

  
  const handleTransaction = async (type) => {
    setFeedback({ message: '', type: '' });

    if (!formData.accountId || !formData.currencyId || !formData.amount) {
      setFeedback({ message: 'Lütfen tüm alanları eksiksiz doldurun!', type: 'error' });
      return;
    }

    
    const resolvedCustomerId = selectedAccount?.customerId || selectedAccount?.CustomerId || 1;

    const transactionData = {
      customerId: parseInt(resolvedCustomerId),
      accountId: parseInt(formData.accountId),
      currencyId: parseInt(formData.currencyId),
      amount: parseFloat(formData.amount)
    };

    console.log("Backend'e Gönderilen Paket:", transactionData);

    const result = type === 'buy' 
      ? await buyCurrency(transactionData) 
      : await sellCurrency(transactionData);

    if (result.success) {
      setFeedback({ message: `İşlem Başarılı: ${result.data?.message || 'İşlem tamamlandı.'}`, type: 'success' });
      setFormData({ accountId: '', currencyId: '', amount: '' });
    } else {
      setFeedback({ message: `Hata: ${result.message || 'İşlem gerçekleştirilemedi.'}`, type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className={styles.exchangePage} style={{ padding: '2rem' }}>
        <p style={{ color: '#64748B' }}>Form yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={styles.exchangePage}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Döviz İşlemleri Terminali</h2>
          <p className={styles.pageSubtitle}>Hazine hesapları üzerinden anlık kur oranlarıyla döviz alım ve satım işlemlerini yönetin.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', maxWidth: '1050px', alignItems: 'start' }}>
        
        
        <div className={styles.contentCard} style={{ margin: 0 }}>
          
          {feedback.message && (
            <div style={{ padding: '12px 15px', borderRadius: '6px', marginBottom: '1.5rem', backgroundColor: feedback.type === 'success' ? '#DEF7EC' : '#FDE8E8', color: feedback.type === 'success' ? '#03543F' : '#9B1C1C', fontSize: '0.9rem', fontWeight: '500', border: `1px solid ${feedback.type === 'success' ? '#BCF0DA' : '#F8B4B4'}` }}>
              {feedback.message}
            </div>
          )}

          
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1E293B', fontSize: '0.9rem' }}>İşlem Yapılacak Hesap:</label>
            <select 
              name="accountId" 
              value={formData.accountId} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', fontSize: '0.95rem' }}
            >
              <option value="">-- Bir Hesap Seçiniz --</option>
              {accounts && accounts.map((acc, index) => {
                const id = acc.id || acc.Id || index;
                const ownerName = getOwnerName(acc);
                const name = acc.accountName || acc.AccountName || `Hesap #${id}`;
                const balance = acc.balance !== undefined ? acc.balance : (acc.Balance !== undefined ? acc.Balance : 0);
                const currency = acc.currency || acc.Currency || 'TRY';
                
                return (
                  <option key={id} value={id}>
                    {ownerName} — {name} ({balance} {currency})
                  </option>
                );
              })}
            </select>
          </div>

          
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1E293B', fontSize: '0.9rem' }}>Döviz Çifti (Parite):</label>
            <select 
              name="currencyId" 
              value={formData.currencyId} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', fontSize: '0.95rem' }}
            >
              <option value="">-- Bir Döviz Seçiniz --</option>
              {rates && rates.map((rate) => {
                const rateId = rate.currencyId || rate.CurrencyId || rate.id || rate.Id;
                const pair = rate.pair || rate.Pair;
                const bRate = rate.buyRate !== undefined ? rate.buyRate : rate.BuyRate;
                const sRate = rate.sellRate !== undefined ? rate.sellRate : rate.SellRate;
                return (
                  <option key={rateId} value={rateId}>
                    {pair} (Alış: {bRate} ₺ | Satış: {sRate} ₺)
                  </option>
                );
              })}
            </select>
          </div>


          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1E293B', fontSize: '0.9rem' }}>İşlem Miktarı:</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                name="amount" 
                type="number" 
                placeholder="Örn: 100"
                value={formData.amount}
                onChange={handleChange} 
                style={{ width: '100%', padding: '10px', paddingRight: '55px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box', fontSize: '0.95rem' }}
              />
              {currencySymbol && (
                <span style={{ position: 'absolute', right: '14px', color: '#64748B', fontWeight: '600', fontSize: '0.9rem', pointerEvents: 'none' }}>
                  {currencySymbol}
                </span>
              )}
            </div>
          </div>


          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => handleTransaction('buy')} style={{ backgroundColor: '#10B981', color: 'white', padding: '12px', flex: 1, border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Döviz Al</button>
            <button onClick={() => handleTransaction('sell')} style={{ backgroundColor: '#EF4444', color: 'white', padding: '12px', flex: 1, border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Döviz Sat</button>
          </div>

        </div>

        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          
          <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#1E293B', marginBottom: '1rem', borderBottom: '2px solid #F1F5F9', paddingBottom: '8px', fontWeight: '600' }}>Seçili Hesap Bilgileri</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Hesap Sahibi:</span>
                <strong style={{ color: '#1E293B' }}>{ownerFullName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Mevcut Bakiye:</span>
                <strong style={{ color: '#059669' }}>{currentBalance} {accountCurrency}</strong>
              </div>
            </div>
          </div>

          
          <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#1E293B', marginBottom: '1rem', borderBottom: '2px solid #F1F5F9', paddingBottom: '8px', fontWeight: '600' }}>Canlı İşlem Özeti</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Seçilen Parite:</span>
                <strong style={{ color: '#1E293B' }}>{pairText || 'Seçilmedi'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Alış Kuru:</span>
                <strong style={{ color: '#10B981' }}>{buyRate ? `${buyRate} ₺` : '-'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Satış Kuru:</span>
                <strong style={{ color: '#EF4444' }}>{sellRate ? `${sellRate} ₺` : '-'}</strong>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span>Tahmini Maliyet (Alış):</span>
                <strong style={{ color: '#0284C7' }}>{estimatedBuyTotal} ₺</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span>Tahmini Gelir (Satış):</span>
                <strong style={{ color: '#D97706' }}>{estimatedSellTotal} ₺</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}