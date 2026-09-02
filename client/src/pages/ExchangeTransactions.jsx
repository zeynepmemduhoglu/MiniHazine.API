import React, { useState, useEffect } from 'react';
import { buyCurrency, sellCurrency } from '../services/transactionService';

export default function ExchangeTransactions() {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);
  
  const [formData, setFormData] = useState({
    accountId: '',
    targetAccountId: '',
    currencyId: '',
    amount: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

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
    const fetchData = async () => {
      try {
        const accResponse = await fetch('https://localhost:7258/api/accounts');
        const accData = await accResponse.json();
        setAccounts(extractArray(accData));

        const custResponse = await fetch('https://localhost:7258/api/customers');
        const custData = await custResponse.json();
        setCustomers(extractArray(custData));

        const rateResponse = await fetch('https://localhost:7258/api/exchange-rates');
        const rateData = await rateResponse.json();
        setExchangeRates(extractArray(rateData));
      } catch (err) {
        console.error('Veriler yüklenirken hata oluştu:', err);
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

  const getCustomerId = (acc) => {
    return acc.customerId || acc.CustomerId || (acc.customer ? (acc.customer.id || acc.customer.Id) : null);
  };

  const getAccountType = (acc) => {
    return String(acc.accountType || acc.AccountType || acc.accountName || acc.AccountName || '').toLowerCase();
  };

  const isTlAccount = (acc) => {
    const currency = String(acc.currency || acc.Currency || acc.currencyCode || acc.CurrencyCode || '').toLowerCase();
    return currency === 'try';
  };

  const isForeignAccount = (acc) => {
    return !isTlAccount(acc); 
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!formData.accountId || !formData.targetAccountId || !formData.currencyId || !formData.amount) {
        setMessage({ text: 'Lütfen tüm alanları doldurun.', type: 'error' });
        return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });

    const result = await buyCurrency({
      accountId: Number(formData.accountId),
      targetAccountId: Number(formData.targetAccountId),
      currencyId: Number(formData.currencyId),
      amount: Number(formData.amount)
    });

    if (result.success) {
      setMessage({ text: result.data.message || 'Döviz alış işlemi başarıyla gerçekleştirildi!', type: 'success' });
      setFormData({ accountId: '', targetAccountId: '', currencyId: '', amount: '' });
    } else {
      setMessage({ text: result.message || 'Alış işlemi başarısız oldu.', type: 'error' });
    }
    setLoading(false);
  };

  const handleSell = async (e) => {
    e.preventDefault();
    if (!formData.accountId || !formData.targetAccountId || !formData.currencyId || !formData.amount) {
        setMessage({ text: 'Lütfen tüm alanları doldurun.', type: 'error' });
        return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });

    const result = await sellCurrency({
      accountId: Number(formData.accountId),
      targetAccountId: Number(formData.targetAccountId),
      currencyId: Number(formData.currencyId),
      amount: Number(formData.amount)
    });

    if (result.success) {
      setMessage({ text: result.data.message || 'Döviz satış işlemi başarıyla gerçekleştirildi!', type: 'success' });
      setFormData({ accountId: '', targetAccountId: '', currencyId: '', amount: '' });
    } else {
      setMessage({ text: result.message || 'Satış işlemi başarısız oldu.', type: 'error' });
    }
    setLoading(false);
  };

  const getRateDetails = (rate) => {
    if (!rate) return { id: '', code: '', buy: 0, sell: 0 };
    const id = rate.id || rate.Id || rate.currencyId || rate.CurrencyId;
    
    let rawCode = rate.pair || rate.Pair || rate.currencyCode || rate.CurrencyCode || rate.code || rate.Code || 'Döviz';
    let code = String(rawCode).split('/')[0].split('(')[0].trim();

    const buy = rate.buyRate ?? rate.BuyRate ?? rate.buy ?? rate.Buy ?? 0;
    const sell = rate.sellRate ?? rate.SellRate ?? rate.sell ?? rate.Sell ?? 0;
    return { id, code, buy, sell };
  };

  const selectedAccount = accounts.find(a => String(a.id || a.Id) === String(formData.accountId));
  const selectedTargetAccount = accounts.find(a => String(a.id || a.Id) === String(formData.targetAccountId));
  const selectedRateObj = exchangeRates.find(r => String(getRateDetails(r).id) === String(formData.currencyId));
  const selectedRate = getRateDetails(selectedRateObj);
  const amountValue = Number(formData.amount) || 0;

  const filteredSourceAccounts = accounts;

  const filteredTargetAccounts = accounts.filter(acc => {
    if (!selectedAccount) return false;
    
    const mainCustId = getCustomerId(selectedAccount);
    const targetCustId = getCustomerId(acc);

    if (String(mainCustId) !== String(targetCustId)) return false;
    if (String(acc.id || acc.Id) === String(selectedAccount.id || selectedAccount.Id)) return false;

    if (isTlAccount(selectedAccount)) {
      return isForeignAccount(acc);
    } else {
      return isTlAccount(acc);
    }
  });

  return (
    <div style={{ padding: '2rem', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E293B', margin: '0 0 0.5rem 0' }}>
          Döviz Alım / Satım İşlemleri
        </h2>
        <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>
          Müşteri hesaplarınız arasında güvenli çoklu hesap döviz transferi yapın.
        </p>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
          color: message.type === 'success' ? '#065F46' : '#DC2626',
          borderRadius: '8px',
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        <div style={{ flex: '2', minWidth: '350px', backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1E293B', fontSize: '0.9rem' }}>
                Ana Hesap (Kaynak)
              </label>
              <select
                name="accountId"
                value={formData.accountId}
                onChange={(e) => {
                  handleChange(e);
                  setFormData(prev => ({ ...prev, targetAccountId: '' }));
                }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none' }}
                required
              >
                <option value="">-- Kaynak Hesap Seçiniz --</option>
                {filteredSourceAccounts.map((acc) => {
                  const owner = getOwnerName(acc);
                  const accId = acc.id || acc.Id;
                  const accType = acc.accountType || acc.AccountType || acc.accountName || acc.AccountName || 'Hesap';
                  const balance = acc.balance !== undefined ? acc.balance : acc.Balance;
                  return (
                    <option key={accId} value={accId}>
                      {owner} - {accType} (Bakiye: {balance})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1E293B', fontSize: '0.9rem' }}>
                Döviz Hesabı
              </label>
              <select
                name="targetAccountId"
                value={formData.targetAccountId}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none' }}
                required
                disabled={!formData.accountId}
              >
                <option value="">{formData.accountId ? '-- Hedef Hesap Seçiniz --' : 'Önce Ana Hesap Seçiniz'}</option>
                {filteredTargetAccounts.map((acc) => {
                  const owner = getOwnerName(acc);
                  const accId = acc.id || acc.Id;
                  const accType = acc.accountType || acc.AccountType || acc.accountName || acc.AccountName || 'Hesap';
                  const balance = acc.balance !== undefined ? acc.balance : acc.Balance;
                  return (
                    <option key={accId} value={accId}>
                      {owner} - {accType} (Bakiye: {balance})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1E293B', fontSize: '0.9rem' }}>
                Döviz Kuru 
              </label>
              <select
                name="currencyId"
                value={formData.currencyId}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none' }}
                required
              >
                <option value="">-- Döviz Seçiniz --</option>
                {exchangeRates.map((rate, index) => {
                  const { id, code } = getRateDetails(rate);
                  const uniqueKey = id || index;
                  return (
                    <option key={uniqueKey} value={id}>
                      {code}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1E293B', fontSize: '0.9rem' }}>
                Miktar
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="any"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Örn: 100"
                  style={{ 
                    width: '100%', 
                    padding: '10px 70px 10px 12px', 
                    borderRadius: '8px', 
                    border: '1px solid #CBD5E1', 
                    fontSize: '0.95rem', 
                    boxSizing: 'border-box', 
                    outline: 'none' 
                  }}
                  required
                />
                {selectedRate.code && selectedRate.code !== 'Döviz' && (
                  <span style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#F1F5F9',
                    color: '#1E293B',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: '1px solid #CBD5E1',
                    pointerEvents: 'none'
                  }}>
                    {selectedRate.code}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={handleBuy}
                disabled={loading}
                style={{ flex: 1, padding: '12px', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Bekleyiniz...' : 'Alış Yap (BUY)'}
              </button>

              <button
                type="button"
                onClick={handleSell}
                disabled={loading}
                style={{ flex: 1, padding: '12px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Bekleyiniz...' : 'Satış Yap (SELL)'}
              </button>
            </div>
          </form>
        </div>

        <div style={{ flex: '1', minWidth: '280px', backgroundColor: '#F8FAFC', padding: '2rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '1.2rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>İşlem Özeti</h3>
          
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'block' }}>Kaynak Hesap</span>
            <strong style={{ color: '#1E293B', fontSize: '0.95rem' }}>
              {selectedAccount ? `${getOwnerName(selectedAccount)} (${selectedAccount.balance !== undefined ? selectedAccount.balance : selectedAccount.Balance})` : 'Seçilmedi'}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'block' }}>Hedef Hesap</span>
            <strong style={{ color: '#1E293B', fontSize: '0.95rem' }}>
              {selectedTargetAccount ? `${getOwnerName(selectedTargetAccount)} (${selectedTargetAccount.balance !== undefined ? selectedTargetAccount.balance : selectedTargetAccount.Balance})` : 'Seçilmedi'}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'block' }}>Seçilen Döviz & Miktar</span>
            <strong style={{ color: '#1E293B', fontSize: '1rem' }}>
              {selectedRate.code ? `${amountValue} ${selectedRate.code}` : 'Döviz seçilmedi'}
            </strong>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#10B981', fontWeight: '600', fontSize: '0.85rem' }}>Alış Kuru / Tutar:</span>
              <strong style={{ color: '#10B981', fontSize: '0.9rem' }}>{selectedRate.code ? `${selectedRate.buy} ₺ (${(amountValue * selectedRate.buy).toFixed(2)} ₺)` : '0.00 ₺'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#EF4444', fontWeight: '600', fontSize: '0.85rem' }}>Satış Kuru / Tutar:</span>
              <strong style={{ color: '#EF4444', fontSize: '0.9rem' }}>{selectedRate.code ? `${selectedRate.sell} ₺ (${(amountValue * selectedRate.sell).toFixed(2)} ₺)` : '0.00 ₺'}</strong>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}