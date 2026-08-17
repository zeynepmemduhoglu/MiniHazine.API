import React, { useState, useEffect } from 'react';
import styles from './Customers.module.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isInsertCustomer, setInsertCustomer] = useState(false); 

  
  
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    identityNumber: '', 
    phoneNumber: '' 
  }); 

  const fetchCustomers = async () => {
    try {
      const response = await fetch('https://localhost:7258/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data); 
      }
    } catch (error) {
      console.error('Müşteriler çekilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (isSubmitting) return;

    setIsSubmitting(true); 

    try {
      const response = await fetch('https://localhost:7258/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false); 
        setFormData({ firstName: '', lastName: '', email: '', identityNumber: '', phoneNumber: '' }); 
        fetchCustomers(); 
      } else {
        alert('Müşteri eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className={styles.customersPage}>
      
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Müşteri Yönetimi</h2>
          <p className={styles.pageSubtitle}>Sistemdeki tüm kurumsal ve bireysel müşterileri listeleyin ve yönetin.</p>
        </div>
        
        <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
          + Yeni Müşteri Ekle
        </button>
      </div>

      <div className={styles.contentCard}>
        
        <div className={styles.tableToolbar}>
          <input 
            type="text" 
            placeholder="Müşteri adı veya şirket ara..." 
            className={styles.searchBox} 
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Yükleniyor...</p>
        ) : customers.length === 0 ? (                
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Henüz Müşteri Eklenmemiş</h3>
            <p>Sistemde kayıtlı müşteri bulunmuyor. Yeni müşteri kaydı oluşturmak için yukarıdaki butonu kullanabilirsiniz.</p>
          </div>
        ) : (
          <table className={styles.customerTable}>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>E-posta</th>
                <th>TC Kimlik</th>
                <th>Telefon</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, index) => (
                <tr key={index}>
                  <td>{c.firstName} {c.lastName}</td>
                  <td>{c.email}</td>
                  <td>{c.identityNumber}</td>
                  <td>{c.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h3>Yeni Müşteri Ekle</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              
              <input 
                type="text" placeholder="Ad" 
                value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required style={{ padding: '8px' }}
              />
              <input 
                type="text" placeholder="Soyad" 
                value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required style={{ padding: '8px' }}
              />
              <input 
                type="email" placeholder="E-posta Adresi" 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                required style={{ padding: '8px' }}
              />
              <input 
                type="text" placeholder="TC Kimlik No" 
                value={formData.identityNumber} onChange={(e) => setFormData({...formData, identityNumber: e.target.value})}
                required style={{ padding: '8px' }}
              />
              <input 
                type="text" placeholder="Telefon Numarası" 
                value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                required style={{ padding: '8px' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 12px' }}>İptal</button>
                
                
                <button 
                  type="submit" 
                  onClick={()=> setInsertCustomer(false)}
                  disabled={isSubmitting}
                  style={{ 
                    padding: '8px 12px', 
                    background: isSubmitting ? '#cccccc' : '#0056b3', 
                    color: 'white', 
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Customers;