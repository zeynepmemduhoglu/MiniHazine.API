import React, { useState, useEffect } from 'react';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [currencyDistribution, setCurrencyDistribution] = useState([]);
  const [customerReports, setCustomerReports] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
       
        const summaryRes = await fetch('https://localhost:7258/api/reports/summary');
        if (!summaryRes.ok) {
          const errText = await summaryRes.text();
          throw new Error(`Özet Rapor Hatası: ${errText || summaryRes.statusText}`);
        }
        const summaryData = await summaryRes.json();
        setSummary(summaryData);

        
        const distRes = await fetch('https://localhost:7258/api/reports/currency-distribution');
        if (!distRes.ok) {
          const errText = await distRes.text();
          throw new Error(`Döviz Dağılım Hatası: ${errText || distRes.statusText}`);
        }
        const distData = await distRes.json();
        setCurrencyDistribution(distData);

        
        const customerRes = await fetch('https://localhost:7258/api/reports/customer-transactions');
        if (!customerRes.ok) {
          const errText = await customerRes.text();
          throw new Error(`Müşteri Raporu Hatası: ${errText || customerRes.statusText}`);
        }
        const customerData = await customerRes.json();
        setCustomerReports(customerData);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', fontWeight: '500' }}>Raporlar yükleniyor...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: '#DC2626', fontWeight: '500', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', margin: '2rem' }}>
        <strong>Sunucu Hatası:</strong> {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E293B', margin: '0 0 0.5rem 0' }}>
          Finansal Raporlar ve Özet
        </h2>
        <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>
          Sistem genelindeki müşteri, hesap ve işlem hacmi istatistikleri.
        </p>
      </div>

      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.5rem' }}>Toplam Müşteri Sayısı</span>
          <h3 style={{ fontSize: '1.8rem', color: '#0F172A', margin: 0 }}>{summary?.totalCustomers ?? 0}</h3>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.5rem' }}>Toplam Hesap Sayısı</span>
          <h3 style={{ fontSize: '1.8rem', color: '#0F172A', margin: 0 }}>{summary?.totalAccounts ?? 0}</h3>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.5rem' }}>Toplam Varlık / Bakiye</span>
          <h3 style={{ fontSize: '1.8rem', color: '#0F172A', margin: 0 }}>
            {summary?.totalBalance ? summary.totalBalance.toLocaleString('tr-TR') : '0'} ₺
          </h3>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.5rem' }}>Toplam İşlem Adedi</span>
          <h3 style={{ fontSize: '1.8rem', color: '#0F172A', margin: 0 }}>{summary?.totalTransactions ?? 0}</h3>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Toplam Alış Hacmi (BUY)</span>
          <h3 style={{ fontSize: '1.8rem', color: '#10B981', margin: 0 }}>
            {summary?.totalBuyVolume ? summary.totalBuyVolume.toLocaleString('tr-TR') : '0'}
          </h3>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.85rem', color: '#EF4444', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Toplam Satış Hacmi (SELL)</span>
          <h3 style={{ fontSize: '1.8rem', color: '#EF4444', margin: 0 }}>
            {summary?.totalSellVolume ? summary.totalSellVolume.toLocaleString('tr-TR') : '0'}
          </h3>
        </div>
      </div>

      
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '1rem' }}>
          Döviz Cinsine Göre Bakiye ve Hesap Dağılımı
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {currencyDistribution.length > 0 ? (
            currencyDistribution.map((item, index) => (
              <div key={index} style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Para Birimi</span>
                  <h4 style={{ fontSize: '1.2rem', color: '#0F172A', margin: 0, fontWeight: 'bold' }}>{item.currencyCode}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginTop: '0.25rem' }}>Hesap Adedi: {item.accountCount}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Toplam Bakiye</span>
                  <h4 style={{ fontSize: '1.2rem', color: '#0F172A', margin: 0, fontWeight: 'bold' }}>
                    {item.totalBalance.toLocaleString('tr-TR')}
                  </h4>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: '#64748B', fontSize: '0.95rem' }}>Henüz döviz dağılımı verisi bulunmuyor.</div>
          )}
        </div>
      </div>

      
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '1rem' }}>
          Müşteri Bazlı İşlem ve Hesap Raporu
        </h3>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.85rem' }}>
                <th style={{ padding: '1rem' }}>Müşteri Adı</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Hesap Sayısı</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>İşlem Adedi</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Toplam Alış (BUY)</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Toplam Satış (SELL)</th>
              </tr>
            </thead>
            <tbody>
              {customerReports.length > 0 ? (
                customerReports.map((cust, index) => (
                  <tr key={index} style={{ borderBottom: index !== customerReports.length - 1 ? '1px solid #F1F5F9' : 'none', fontSize: '0.9rem', color: '#1E293B' }}>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{cust.customerName}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{cust.totalAccountCount}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{cust.totalTransactionCount}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: '#10B981', fontWeight: '600' }}>
                      {cust.totalBuyAmount.toLocaleString('tr-TR')}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: '#EF4444', fontWeight: '600' }}>
                      {cust.totalSellAmount.toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                    Listelenecek müşteri raporu verisi bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}