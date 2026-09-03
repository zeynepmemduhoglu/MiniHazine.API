import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [defaultCurrency, setDefaultCurrency] = useState('TRY');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loadingPrefs, setLoadingPrefs] = useState(false);

  const userId = localStorage.getItem('userId') || 1;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://localhost:7258/api/users/${userId}`);
        if (response.ok) {
          const currentUser = await response.json();
          setUsername(currentUser.username || '');
          setEmail(currentUser.email || '');
          setPhoneNumber(currentUser.phoneNumber || '');
          setDefaultCurrency(currentUser.defaultCurrency || 'TRY');
          setNotificationsEnabled(currentUser.notificationsEnabled || false);
          setAutoRefresh(currentUser.autoRefresh || false);
        }
      } catch (err) {
        console.error("Kullanıcı bilgileri yüklenemedi:", err);
      }
    };

    fetchUserData();
  }, [userId]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoadingPass(true);

    try {
      const response = await fetch(`https://localhost:7258/api/users/${userId}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Şifre değiştirilemedi.');

      alert('Şifre başarıyla güncellendi!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingPass(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Frontend tarafında 11 hane kontrolü
    if (phoneNumber.length !== 11) {
      alert('Telefon numarası tam olarak 11 haneli olmalıdır!');
      return;
    }

    setLoadingProfile(true);

    try {
      const response = await fetch(`https://localhost:7258/api/users/${userId}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phoneNumber })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Profil güncellenemedi.');

      alert('Profil bilgileri başarıyla güncellendi!');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setLoadingPrefs(true);

    try {
      const response = await fetch(`https://localhost:7258/api/users/${userId}/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultCurrency, notificationsEnabled, autoRefresh })
      });

      // Backend boolean veya boş dönebileceği için güvenli kontrol ekledik
      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      }

      if (!response.ok) throw new Error(data.message || 'Tercihler kaydedilemedi.');

      alert('Uygulama tercihleri başarıyla kaydedildi!');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingPrefs(false);
    }
  };

  return (
    <div style={{ padding: '2rem', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E293B', margin: '0 0 0.5rem 0' }}>Sistem Ayarları</h2>
        <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>Hesap bilgilerinizi, güvenliğinizi ve uygulama tercihlerinizi yönetin.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Profil Bilgileri */}
        <div style={{ backgroundColor: '#FFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1E293B', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>Profil Bilgileri</h3>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>Kullanıcı Adı</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} 
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>E-posta Adresi</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} 
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>Telefon Numarası (11 Hane)</label>
              <input 
                type="text" 
                value={phoneNumber} 
                maxLength={11}
                onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))} // Sadece rakam girilmesini sağlar
                placeholder="05XXXXXXXXX"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} 
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loadingProfile}
              style={{ backgroundColor: '#0F172A', color: '#FFF', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '0.5rem' }}
            >
              {loadingProfile ? 'Güncelleniyor...' : 'Bilgileri Güncelle'}
            </button>
          </form>
        </div>

        {/* Şifre Değiştir */}
        <div style={{ backgroundColor: '#FFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1E293B', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>Şifre Değiştir</h3>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>Mevcut Şifre</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                placeholder="••••••" 
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} 
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>Yeni Şifre</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="••••••" 
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loadingPass} 
              style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '0.5rem' }}
            >
              {loadingPass ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </button>
          </form>
        </div>
        
        {/* Uygulama Tercihleri */}
        <div style={{ backgroundColor: '#FFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
          <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1E293B', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>Uygulama Tercihleri</h3>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>Varsayılan Baz Para Birimi</label>
              <select 
                value={defaultCurrency} 
                onChange={e => setDefaultCurrency(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box', backgroundColor: '#FFF' }}
              >
                <option value="TRY">TRY - Türk Lirası</option>
                <option value="USD">USD - Amerikan Doları</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.3rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={notificationsEnabled} 
                  onChange={e => setNotificationsEnabled(e.target.checked)} 
                />
                İşlem ve kur değişim bildirimlerini aç
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={autoRefresh} 
                  onChange={e => setAutoRefresh(e.target.checked)} 
                />
                Döviz kurlarını otomatik yenile (Canlı Akış)
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loadingPrefs}
              style={{ backgroundColor: '#0F172A', color: '#FFF', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '1rem' }}
            >
              {loadingPrefs ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}