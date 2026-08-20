import React, { useState, useEffect, useRef } from 'react';
import styles from './ExchangeRates.module.css';

export default function ExchangeRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const updateAndFetchRates = async () => {
      try {
        setLoading(true);

        await fetch('https://localhost:7258/api/exchange-rates/fetch-live', {
          method: 'POST',
        });

       
        const response = await fetch('https://localhost:7258/api/exchange-rates');
        const data = await response.json();
        setRates(data);
      } catch (error) {
        console.error('Kurlar güncellenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    updateAndFetchRates();
  }, []);

  if (loading) {
    return (
      <div className={styles.exchangePage}>
        <p style={{ padding: '2rem', color: '#64748B' }}>Güncel kurlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={styles.exchangePage}>
      <div className={styles.pageHeader}>
        <div>
          <h2>Döviz Kurları</h2>
          <p>Güncel döviz alış ve satış kurlarını takip edin.</p>
        </div>
      </div>

      <div className={styles.contentCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.rateTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Döviz Çifti (Pair)</th>
                <th>Alış (TL)</th>
                <th>Satış (TL)</th>
                <th>Güncellenme Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr key={rate.id}>
                  <td>{rate.id}</td>
                  <td className={styles.codeCell}>{rate.pair || "Bilinmiyor"}</td>
                  <td>{rate.buyRate ? rate.buyRate.toFixed(2) : '0.00'}</td>
                  <td>{rate.sellRate ? rate.sellRate.toFixed(2) : '0.00'}</td>
                  <td>{rate.updatedDate ? new Date(rate.updatedDate).toLocaleTimeString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}