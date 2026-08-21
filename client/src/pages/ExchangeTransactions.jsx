import React, { useState, useEffect } from 'react';
import { buyCurrency, sellCurrency } from '../services/transactionService';
import styles from './ExchangeRates.module.css';

export default function ExchangeTransactions() {
  const [formData, setFormData] = useState({
    customerId: 1,
    accountId: '',
    currencyId: '',
    amount: ''
  });

  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!custId) return '';
    
    const cust = customers.find(c => String(c.id || c.Id || c.customerId || c.CustomerId) === String(custId));
    if (!cust) return '';
    
    const name = cust.firstName || cust.FirstName || cust.name || cust.Name || '';
    const surname = cust.lastName || cust.LastName || cust.surname || cust.Surname || '';
    return `${name} ${surname}`.trim();
  };

  const handleAccountChange = (e) => {
    const selectedId = e.target.value;
    const acc = accounts.find(a => String(a.id || a.Id) === String(selectedId));
    setFormData({
      ...formData,
      accountId: selectedId,
      customerId: acc ? (acc.customerId || acc.CustomerId || 1) : 1
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTransaction = async (type) => {
    if (!formData.accountId || !formData.currencyId || !formData.amount) {
      alert('Lütfen tüm alanları eksiksiz doldurun!');
      return;
    }

    const transactionData = {
      customerId: parseInt(formData.customerId) || 1,
      accountId: parseInt(formData.accountId),
      currencyId: parseInt(formData.currencyId),
      amount: parseFloat(formData.amount)
    };

    const result = type === 'buy' 
      ? await buyCurrency(transactionData) 
      : await sellCurrency(transactionData);

    if (result.success) {
      alert(`İşlem Başarılı: ${result.data.message}`);
    } else {
      alert(`Hata: ${result.message}`);
    }
  };

  const selectedRate = rates.find(r => String(r.currencyId || r.CurrencyId || r.id || r.Id) === String(formData.currencyId));
  const pairText = selectedRate ? (selectedRate.pair || selectedRate.Pair || '') : '';
  const currencySymbol = pairText.includes('/') ? pairText.split('/')[0] : '';

  if (loading) {
    return (
      <div className={styles.exchangePage} style={{ padding: '2rem' }}>
        <p style={{ color: '#64748B' }}>Form yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={styles.exchangePage} style={{ padding: '2rem' }}>
      <h2>Döviz İşlemleri</h2>
      <div className={styles.contentCard} style={{ maxWidth: '480px', padding: '2rem' }}>
        
        
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1E293B' }}>Hesap Seçin:</label>
          <select 
            name="accountId" 
            value={formData.accountId} 
            onChange={handleAccountChange} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF' }}
          >
            <option value="">-- Bir Hesap Seçiniz --</option>
            {accounts && accounts.length > 0 ? (
              accounts.map((acc, index) => {
                const id = acc.id || acc.Id || index;
                const ownerName = getOwnerName(acc);
                const name = acc.accountName || acc.AccountName || `Hesap #${id}`;
                const balance = acc.balance !== undefined ? acc.balance : (acc.Balance !== undefined ? acc.Balance : 0);
                
                return (
                  <option key={id} value={id}>
                    {ownerName ? `${ownerName} — ` : ''}{name} (Bakiye: {balance} TL)
                  </option>
                );
              })
            ) : (
              <option disabled value="">Kayıtlı hesap bulunamadı</option>
            )}
          </select>
        </div>

        
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1E293B' }}>Döviz Çifti Seçin:</label>
          <select 
            name="currencyId" 
            value={formData.currencyId} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF' }}
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

        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1E293B' }}>Miktar:</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              name="amount" 
              type="number" 
              placeholder="Örn: 100"
              value={formData.amount}
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', paddingRight: '55px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
            />
            {currencySymbol && (
              <span style={{ position: 'absolute', right: '14px', color: '#64748B', fontWeight: '600', fontSize: '0.9rem', pointerEvents: 'none' }}>
                {currencySymbol}
              </span>
            )}
          </div>
        </div>


        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleTransaction('buy')} style={{ backgroundColor: '#10B981', color: 'white', padding: '12px', flex: 1, border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Al</button>
          <button onClick={() => handleTransaction('sell')} style={{ backgroundColor: '#EF4444', color: 'white', padding: '12px', flex: 1, border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Sat</button>
        </div>

      </div>
    </div>
  );
}