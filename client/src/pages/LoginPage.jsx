import React from 'react';
import styles from './LoginPage.module.css';

const LoginPage = ({ onLogin }) => {


  
  const handleSubmit = (e) => {
    e.preventDefault(); 
    onLogin(); 
  };


  
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        
        
        <div className={styles.brandSection}>
          
          <div className={styles.starsContainer}>
            <span className={styles.star}></span>
            <span className={styles.star}></span>
            <span className={styles.star}></span>
            <span className={styles.star}></span>
            <span className={styles.star}></span>
            <span className={styles.star}></span>
          </div>

          <div className={styles.brandContent}>
            
            <div className={styles.topContent}>
              <h1 className={styles.brandTitle}>FinCore</h1>
              <p className={styles.brandSlogan}>
                Finance Administration Platform ile finansal operasyonlarınızı güvenle yönetin.
              </p>
            </div>

                        <div className={styles.logoWrapper}>
              <svg className={styles.finLogo} viewBox="0 0 160 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="22" cy="22.5" r="15" stroke="url(#coreGradient)" strokeWidth="3" strokeDasharray="4 2" />
                <circle cx="22" cy="22.5" r="7" fill="#FF6B6B" />
                <path d="M15 22.5H29" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M22 15V30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <text x="48" y="28" fill="#F8FAFC" fontSize="20" fontWeight="800" fontFamily="Inter, sans-serif">FinCore</text>
                <defs>
                  <linearGradient id="coreGradient" x1="7" y1="7.5" x2="37" y2="37.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38BDF8" />
                    <stop offset="1" stopColor="#FF6B6B" />
                  </linearGradient>
                </defs>
              </svg>
              <span className={styles.logoSubtext}>Secure Financial Ecosystem</span>
            </div>
          </div>
        </div>

        
        <div className={styles.formSection}>
          <div className={styles.loginCard}>
            
            <div className={styles.cardTopAccent}></div>
            
            <div className={styles.headerGroup}>
              <div className={styles.welcomeBadge}>Kurumsal Portal</div>
              <h2 className={styles.loginTitle}>Hoş geldiniz</h2>
              <p className={styles.loginSubtitle}>Lütfen hesabınıza giriş yapın</p>
            </div>

            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.formLabel}>Kullanıcı Adı</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={styles.inputField} 
                  placeholder="kullanici.adi"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.formLabel}>Şifre</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={styles.inputField} 
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className={styles.loginButton}>
                GİRİŞ YAP
              </button>

              <button type="button" className={styles.ssoButton}>
                Kurumsal Giriş (SSO)
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;