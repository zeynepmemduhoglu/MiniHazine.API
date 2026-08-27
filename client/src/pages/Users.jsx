import React, { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://localhost:7258/api/users');
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Kullanıcılar yüklenirken hata oluştu: ${errText || response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', fontWeight: '500' }}>Kullanıcılar yükleniyor...</div>;
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
          Sistem Kullanıcıları
        </h2>
        <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>
          FinCore yönetim sistemine erişim yetkisi olan personel ve yöneticilerin listesi.
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Kullanıcı Adı</th>
              <th style={{ padding: '1rem' }}>Rol / Yetki</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} style={{ borderBottom: index !== users.length - 1 ? '1px solid #F1F5F9' : 'none', fontSize: '0.9rem', color: '#1E293B' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#64748B' }}>#{user.id}</td>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#0F172A' }}>{user.username}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                  Sistemde kayıtlı kullanıcı bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}