import React, { useState, useEffect } from 'react';
import styles from './ExchangeRates.module.css';

export default function ExchangeRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true); 


  
  useEffect(() => {
     fetch('https://localhost:7258/api/exchangerates') 
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
                <th>Birim</th>
                <th>Para Birimi</th>
                <th>Alış (TL)</th>
                <th>Satış (TL)</th>
                <th>Değişim</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr key={rate.id}>
                  <td className={styles.codeCell}>{rate.code}</td>
                  <td>{rate.name}</td>
                  <td>{rate.buying ? rate.buying.toFixed(2) : '0.00'}</td>
                  <td>{rate.selling ? rate.selling.toFixed(2) : '0.00'}</td>
                  <td className={rate.change && rate.change.startsWith('+') ? styles.positive : styles.negative}>
                    {rate.change || '%0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}