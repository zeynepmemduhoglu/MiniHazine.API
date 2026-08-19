import React, { useState, useEffect } from 'react';
import styles from './ExchangeRates.module.css';

export default function ExchangeRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
     fetch('https://localhost:7258/api/exchange-rates') 
      .then((response) => response.json())
      .then((data) => {
        setRates(data);    
        setLoading(false);  
      })
      .catch((error) => {
        console.error('Veri çekme hatası:', error);
        setLoading(false);
      });
  }, []); 

  if (loading) {
    return (
      <div className={styles.exchangePage}>
        <p style={{ padding: '2rem', color: '#64748B' }}>Yükleniyor...</p>
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