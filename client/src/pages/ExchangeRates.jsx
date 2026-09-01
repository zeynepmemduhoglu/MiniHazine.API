import React, { useState, useEffect } from 'react';
import styles from './ExchangeRates.module.css';

export default function ExchangeRates() {
  const [rates, setRates] = useState([]);
  const [preciousMetals, setPreciousMetals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [ratesRes, metalsRes] = await Promise.all([
          fetch('https://localhost:7258/api/exchange-rates'),
          fetch('https://localhost:7258/api/precious-metals')
        ]);

        if (!ratesRes.ok || !metalsRes.ok) {
          throw new Error('Veriler yüklenirken bir hata oluştu.');
        }

        const ratesData = await ratesRes.json();
        const metalsData = await metalsRes.json();

        setRates(ratesData);
        setPreciousMetals(metalsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.exchangePage} style={{ padding: '2rem' }}>
        <p style={{ color: '#64748B' }}>Piyasa verileri yükleniyor...</p>
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
      <h2 style={{ marginBottom: '1.5rem', color: '#1E293B' }}>Piyasa Kurları</h2>
      
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        
        <div style={{ flex: 1, minWidth: '450px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#334155', fontSize: '1.2rem' }}>Döviz Kurları</h3>
          <div className={styles.contentCard} style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
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

        
        <div style={{ flex: 1, minWidth: '450px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#334155', fontSize: '1.2rem' }}>Kıymetli Madenler</h3>
          <div className={styles.contentCard} style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '12px' }}>Maden Çifti</th>
                  <th style={{ padding: '12px' }}>Alış Fiyatı</th>
                  <th style={{ padding: '12px' }}>Satış Fiyatı</th>
                </tr>
              </thead>
              <tbody>
                {preciousMetals.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748B' }}>
                      Kayıtlı kıymetli maden bulunamadı.
                    </td>
                  </tr>
                ) : (
                  preciousMetals.map((metal, index) => {
                    const metalId = metal.id || metal.Id;
                    const metalPair = metal.pair || metal.Pair;
                    const bRate = metal.buyRate !== undefined ? metal.buyRate : metal.BuyRate;
                    const sRate = metal.sellRate !== undefined ? metal.sellRate : metal.SellRate;
                    
                    return (
                      <tr key={metalId || index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px', fontWeight: '500', color: '#1E293B' }}>{metalPair}</td>
                        <td style={{ padding: '12px', color: '#10B981' }}>{bRate}</td>
                        <td style={{ padding: '12px', color: '#EF4444' }}>{sRate}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}