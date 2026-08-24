import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactionService';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const result = await getTransactions();
      if (result.success) {
        setTransactions(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.message);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: '#64748B', fontSize: '1rem' }}>
        İşlem geçmişi yükleniyor...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E293B', margin: '0 0 0.5rem 0' }}>
          İşlem Geçmişi
        </h2>
        <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>
          Geçmiş tüm döviz alım ve satım hareketlerini buradan takip edebilirsiniz.
        </p>
      </div>

      {error && (
        <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px' }}>
          Hata: {error}
        </div>
      )}

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto', border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B', backgroundColor: '#F8FAFC' }}>
              <th style={{ padding: '14px 16px' }}>İşlem Türü</th>
              <th style={{ padding: '14px 16px' }}>Hesap Sahibi ve Türü</th>
              <th style={{ padding: '14px 16px' }}>Miktar</th>
              <th style={{ padding: '14px 16px' }}>Kur / Fiyat</th>
              <th style={{ padding: '14px 16px' }}>Toplam Tutar</th>
              <th style={{ padding: '14px 16px' }}>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                  Henüz gerçekleştirilmiş bir işlem bulunmuyor.
                </td>
              </tr>
            ) : (
              transactions.map((tx, index) => {
                const type = tx.transactionType || tx.TransactionType;
                const isBuy = type === 'BUY';
                const amount = tx.amount !== undefined ? tx.amount : tx.Amount;
                const rate = tx.totalRate !== undefined ? tx.totalRate : tx.TotalRate;
                const dateVal = tx.transactionDate || tx.TransactionDate;
                
                
                const customerName = tx.customerName || tx.CustomerName || 'Bilinmeyen Müşteri';
                const accountType = tx.accountType || tx.AccountType || 'Hesap';
                const currencyCode = tx.currencyCode || tx.CurrencyCode || '';

                const totalAmount = (amount * rate).toFixed(2);

                return (
                  <tr key={tx.id || tx.Id || index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold', color: isBuy ? '#10B981' : '#EF4444' }}>
                      {isBuy ? 'ALIŞ (BUY)' : 'SATIŞ (SELL)'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#1E293B' }}>
                      <div style={{ fontWeight: '600' }}>{customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{accountType}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#1E293B', fontWeight: '600' }}>
                      {amount} {currencyCode}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>{rate} ₺</td>
                    <td style={{ padding: '14px 16px', color: '#1E293B', fontWeight: 'bold' }}>
                      {totalAmount} ₺
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748B' }}>
                      {dateVal ? new Date(dateVal).toLocaleString('tr-TR') : '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}