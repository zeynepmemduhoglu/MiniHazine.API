import React, { useState, useEffect } from 'react';
import styles from './Customers.module.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isEditMode, setIsEditMode] = useState(false); 
  const [editingId, setEditingId] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); // Arama filtresi için state eklendi
  
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

  const handleDelete = async (customer) => {
    const id = customer.customerId || customer.Id || customer.id;

    if (!id) {
      alert('Müşteri ID bulunamadı!');
      return;
    }

    if (!window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`https://localhost:7258/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCustomers();
      } else {
        alert('Müşteri silinirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const handleOpenEditModal = (customer) => {
    const id = customer.customerId || customer.Id || customer.id;

    setIsEditMode(true);
    setEditingId(id);
    setFormData({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      identityNumber: customer.identityNumber || '',
      phoneNumber: customer.phoneNumber || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({ firstName: '', lastName: '', email: '', identityNumber: '', phoneNumber: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    const trimmedIdentity = formData.identityNumber.trim();
    if (trimmedIdentity.length !== 11) {
      alert('TC Kimlik Numarası 11 haneli olmalıdır.');
      return;
    }

    const trimmedPhone = formData.phoneNumber.trim();
    if (trimmedPhone.length !== 10 && trimmedPhone.length !== 11) {
      alert('Telefon numarası 10 veya 11 hane olmalıdır.');
      return;
    }

    setIsSubmitting(true); 

    try {
      let url = 'https://localhost:7258/api/customers';
      let method = 'POST';

      if (isEditMode) {
        url = `https://localhost:7258/api/customers/${editingId}`;
        method = 'PUT'; 
      }

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let errorData = null;
      try {
        errorData = await response.json();
      } catch {
        
      }

      if (response.ok) {
        setIsModalOpen(false); 
        setFormData({ firstName: '', lastName: '', email: '', identityNumber: '', phoneNumber: '' }); 
        fetchCustomers(); 
      } else {
        const errorMessage = errorData?.message || (isEditMode ? 'Müşteri güncellenirken bir hata oluştu.' : 'Müşteri eklenirken bir hata oluştu.');
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Sunucuya bağlanırken bir hata oluştu.');
    } finally {
      setIsSubmitting(false); 
    }
  };

 
  const filteredCustomers = customers.filter(c => {
    const fName = (c.firstName || c.FirstName || '').toLowerCase();
    const lName = (c.lastName || c.LastName || '').toLowerCase();
    const email = (c.email || c.Email || '').toLowerCase();
    const tcNo = (c.identityNumber || c.IdentityNumber || '').toLowerCase();
    const phone = (c.phoneNumber || c.PhoneNumber || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    return fName.includes(query) || lName.includes(query) || email.includes(query) || tcNo.includes(query) || phone.includes(query);
  });

  return (
    <div className={styles.customersPage}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Müşteri Yönetimi</h2>
          <p className={styles.pageSubtitle}>Sistemdeki tüm kurumsal ve bireysel müşterileri listeleyin ve yönetin.</p>
        </div>
        
        <button className={styles.primaryBtn} onClick={handleOpenAddModal}>
          + Yeni Müşteri Ekle
        </button>
      </div>

      <div className={styles.contentCard}>
        <div className={styles.tableToolbar}>
          <input 
            type="text" 
            placeholder="Müşteri adı, e-posta veya TC ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchBox} 
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Yükleniyor...</p>
        ) : filteredCustomers.length === 0 ? (            
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Kayıt Bulunamadı</h3>
            <p>Arama kriterinize uygun müşteri bulunmuyor.</p>
          </div>
        ) : (
          <table className={styles.customerTable}>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>E-posta</th>
                <th>TC Kimlik</th>
                <th>Telefon</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c, index) => {
                const cId = c.customerId || c.Id || c.id;
                return (
                  <tr key={cId || index}>
                    <td>{c.firstName} {c.lastName}</td>
                    <td>{c.email}</td>
                    <td>{c.identityNumber}</td>
                    <td>{c.phoneNumber}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleOpenEditModal(c)}
                          style={{
                            background: '#F59E0B',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          Düzenle
                        </button>
                        <button 
                          onClick={() => handleDelete(c)}
                          style={{
                            background: '#EF4444',
                            color: 'white',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
            <h3>{isEditMode ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}</h3>
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
                type="text" placeholder="TC Kimlik No" maxLength="11"
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
                  disabled={isSubmitting}
                  style={{ 
                    padding: '8px 12px', 
                    background: isSubmitting ? '#cccccc' : '#F59E0B', 
                    color: 'white', 
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Kaydediliyor...' : (isEditMode ? 'Güncelle' : 'Kaydet')}
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