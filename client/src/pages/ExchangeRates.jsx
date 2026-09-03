import React, { useState, useEffect } from 'react';

export default function ExchangeRates() {
  const [rates, setRates] = useState([]);
  const [preciousMetals, setPreciousMetals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Çevirici için state'ler
  const [amount, setAmount] = useState('100');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

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
        
        if (ratesData.length > 0) {
          setSelectedCurrency(ratesData[0].pair || ratesData[0].Pair || 'USD');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Seçilen kurun satış fiyatını bulma hesaplaması
  const currentRateObj = rates.find(r => (r.pair || r.Pair) === selectedCurrency);
  const sellRateValue = currentRateObj ? (currentRateObj.sellRate !== undefined ? currentRateObj.sellRate : currentRateObj.SellRate) : 0;
  const calculatedResult = (parseFloat(amount) || 0) * (parseFloat(sellRateValue) || 0);

  if (loading) {
    return (
      <div style={{ padding: '2.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <p style={{ color: '#64748B' }}>Piyasa verileri yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <p style={{ color: '#EF4444' }}>Hata: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.25rem' }}>Piyasa Kurları</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Anlık döviz kurları ve kıymetli maden piyasa verileri</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Sol Taraf: Döviz Kurları Kartı */}
        <div style={{ background: '#0f172a', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)', padding: '1.75rem', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>Döviz Kurları</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Döviz Çifti</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Alış Fiyatı</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Satış Fiyatı</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate, index) => {
                  const rateId = rate.id || rate.Id;
                  const ratePair = rate.pair || rate.Pair;
                  const bRate = rate.buyRate !== undefined ? rate.buyRate : rate.BuyRate;
                  const sRate = rate.sellRate !== undefined ? rate.sellRate : rate.SellRate;
                  
                  return (
                    <tr key={rateId || index} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#ffffff' }}>{ratePair}</td>
                      <td style={{ padding: '1.0rem', color: '#34d399', fontWeight: 600 }}>{bRate}</td>
                      <td style={{ padding: '1.0rem', color: '#f87171', fontWeight: 600 }}>{sRate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sağ Taraf: Üstte Kıymetli Madenler, Altta Hızlı Çevirici */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Kıymetli Madenler Kartı */}
          <div style={{ background: '#0f172a', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)', padding: '1.75rem', border: '1px solid #1e293b' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>Kıymetli Madenler</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Maden Çifti</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Alış Fiyatı</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Satış Fiyatı</th>
                  </tr>
                </thead>
                <tbody>
                  {preciousMetals.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>
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
                        <tr key={metalId || index} style={{ borderBottom: '1px solid #1e293b' }}>
                          <td style={{ padding: '1rem', fontWeight: 600, color: '#ffffff' }}>{metalPair}</td>
                          <td style={{ padding: '1.0rem', color: '#34d399', fontWeight: 600 }}>{bRate}</td>
                          <td style={{ padding: '1.0rem', color: '#f87171', fontWeight: 600 }}>{sRate}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sağ Alt: Hızlı Döviz Çevirici Widget'ı */}
          <div style={{ background: '#0f172a', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)', padding: '1.75rem', border: '1px solid #1e293b' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>Hızlı Çevirici</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Miktar</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  style={{ width: '100%', padding: '0.65rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Döviz Seçimi</label>
                <select 
                  value={selectedCurrency} 
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                >
                  {rates.map((r, i) => {
                    const pair = r.pair || r.Pair;
                    return <option key={i} value={pair}>{pair}</option>;
                  })}
                </select>
              </div>
              <div style={{ marginTop: '0.5rem', padding: '0.85rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Karşılığı (TL):</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#34d399' }}>
                  {calculatedResult.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}