import React, { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtreleme State'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tümü');

  // Yeni Kullanıcı Form State'leri
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Yönetici');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Düzenleme State'leri
  const [editingId, setEditingId] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://localhost:7258/api/users');
      if (!response.ok) throw new Error('Kullanıcılar yüklenirken hata oluştu.');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('https://localhost:7258/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      if (!response.ok) throw new Error('Kullanıcı eklenemedi.');
      
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setUsername('');
      setPassword('');
      setRole('Yönetici');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      const response = await fetch(`https://localhost:7258/api/users/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Silme işlemi başarısız.');
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const startEditing = (user) => {
    setEditingId(user.id);
    setEditUsername(user.username);
    setEditRole(user.role);
    setEditIsActive(user.isActive);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`https://localhost:7258/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: editUsername, role: editRole, isActive: editIsActive })
      });
      if (!response.ok) throw new Error('Güncelleme başarısız.');
      
      const updated = await response.json();
      setUsers(users.map(u => u.id === id ? updated : u));
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtreleme Mantığı
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'Tümü' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: '#DC2626' }}>{error}</div>;

  return (
    <div style={{ padding: '2rem', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E293B', margin: '0 0 0.5rem 0' }}>Sistem Kullanıcıları</h2>
          <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>Personel ve yönetici yetkilendirme paneli.</p>
        </div>

        {/* Ekleme Formu */}
        <form onSubmit={handleCreateUser} style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#FFF', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Kullanıcı Adı" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }} />
          <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }} />
          <select value={role} onChange={e => setRole(e.target.value)} style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem', backgroundColor: '#FFF' }}>
            <option value="Yönetici">Yönetici</option>
            <option value="Personel">Personel</option>
          </select>
          <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Ekle</button>
        </form>
      </div>

      {/* Arama ve Filtreleme Araç Çubuğu */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Kullanıcı adı ile ara..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', width: '300px', fontSize: '0.9rem', backgroundColor: '#FFF' }} 
        />
        <select 
          value={roleFilter} 
          onChange={e => setRoleFilter(e.target.value)} 
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFF' }}
        >
          <option value="Tümü">Tüm Roller</option>
          <option value="Yönetici">Yönetici</option>
          <option value="Personel">Personel</option>
        </select>
      </div>

      {/* Tablo */}
      <div style={{ backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Kullanıcı Adı</th>
              <th style={{ padding: '1rem' }}>Rol</th>
              <th style={{ padding: '1rem' }}>Durum</th>
              <th style={{ padding: '1rem' }}>Kayıt Tarihi</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id} style={{ borderBottom: index !== filteredUsers.length - 1 ? '1px solid #F1F5F9' : 'none', fontSize: '0.9rem' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#64748B' }}>#{user.id}</td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>
                    {editingId === user.id ? (
                      <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                    ) : user.username}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {editingId === user.id ? (
                      <select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: '#FFF' }}>
                        <option value="Yönetici">Yönetici</option>
                        <option value="Personel">Personel</option>
                      </select>
                    ) : (
                      <span style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>{user.role}</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {editingId === user.id ? (
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={editIsActive} onChange={e => setEditIsActive(e.target.checked)} /> Aktif
                      </label>
                    ) : (
                      <span style={{ color: user.isActive ? '#16A34A' : '#DC2626', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.85rem' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {editingId === user.id ? (
                      <>
                        <button onClick={() => handleUpdate(user.id)} style={{ backgroundColor: '#16A34A', color: '#FFF', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', marginRight: '0.4rem', cursor: 'pointer', fontWeight: '600' }}>Kaydet</button>
                        <button onClick={() => setEditingId(null)} style={{ backgroundColor: '#64748B', color: '#FFF', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>İptal</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(user)} style={{ backgroundColor: '#E0F2FE', color: '#0369A1', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', marginRight: '0.4rem', cursor: 'pointer', fontWeight: '600' }}>Düzenle</button>
                        <button onClick={() => handleDelete(user.id)} style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Sil</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Kayıt bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}