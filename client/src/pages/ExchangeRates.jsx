import React, { useState, useEffect } from 'react';
import styles from './ExchangeRates.module.css';

export default function ExchangeRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://localhost:7258/api/exchange-rates');
        
        if (!response.ok) {
          throw new Error('Döviz kurları yüklenirken bir hata oluştu.');
        }
        
        const data = await response.json();
        setRates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) {
    return (
      <div className={styles.exchangePage} style={{ padding: '2rem' }}>
        <p style={{ color: '#64748B' }}>Döviz kurları yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.exchangePage} style={{ padding: '2rem' }}>
        <p style={{ color: '#EF4444' }}>Hata: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.exchangePage} style={{ padding: '2rem' }}>
      <h2>Döviz Kurları</h2>
      <div className={styles.contentCard} style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '600px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '12px' }}>Döviz Çifti</th>
              <th style={{ padding: '12px' }}>Alış Fiyatı</th>
              <th style={{ padding: '12px' }}>Satış Fiyatı</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate, index) => {
              const rateId = rate.id || rate.Id;
              const ratePair = rate.pair || rate.Pair;
              const bRate = rate.buyRate !== undefined ? rate.buyRate : rate.BuyRate;
              const sRate = rate.sellRate !== undefined ? rate.sellRate : rate.SellRate;
              
              return (
                <tr key={rateId || index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px', fontWeight: '500', color: '#1E293B' }}>{ratePair}</td>
                  <td style={{ padding: '12px', color: '#10B981' }}>{bRate}</td>
                  <td style={{ padding: '12px', color: '#EF4444' }}>{sRate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}