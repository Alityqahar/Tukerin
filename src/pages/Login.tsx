
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import styles from './Login.module.css';
import Swal from 'sweetalert2'; 

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi input
    if (!email.trim()) {
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Email harus diisi',
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }

    if (!password) {
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Password harus diisi',
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Password minimal 6 karakter',
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const { user, error: loginError } = await authService.login({
        email,
        password
      });

      if (loginError || !user) {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Login gagal',
          text: loginError || 'Login gagal',
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      // Success - redirect to dashboard
      navigate('/dashboard');
    } catch {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi kesalahan',
        text: 'Terjadi kesalahan. Silakan coba lagi.',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <section className={styles.loginSection}>
      {/* Background Decoration */}
      <div className={styles.bgDecor}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.circle3} />
      </div>

      <div className={styles.loginContainer}>
        {/* Left Side - Visual/Branding */}
        <div className={styles.leftPanel}>
          <div className={styles.brandingContent}>
            <div className={styles.logoWrapper}>
              <img src="/nav-logo.webp" alt="Tukerin Logo" className={styles.logo} />
            </div>
            <h1 className={styles.brandTitle}>
              Selamat Datang di <span className={styles.highlight}>Tukerin</span>
            </h1>
            <p className={styles.brandSubtitle}>
              Platform Pertukaran Barang Bekas Berbasis Sekolah untuk Ekonomi Sirkular yang Berkelanjutan
            </p>
            
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Pantau Eco-Score Real-time</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Tukar Barang Berkualitas</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Kontribusi untuk Lingkungan</span>
              </div>
            </div>

            {/* Visual Elements */}
            <div className={styles.statsPreview}>
              <div className={styles.statItem}>
                <i className="bi bi-tree-fill"></i>
                <div>
                  <strong>247+</strong>
                  <span>Pohon Terselamatkan</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <i className="bi bi-people-fill"></i>
                <div>
                  <strong>1,247+</strong>
                  <span>Sekolah Terdaftar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.rightPanel}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Masuk ke Akun</h2>
              <p className={styles.formSubtitle}>
                Kelola aktivitas eco-friendly Anda dan pantau progres
              </p>
            </div>

            {error && (
              <div className={styles.errorAlert}>
                <i className="bi bi-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  <i className="bi bi-envelope"></i>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="nama@sekolah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  <i className="bi bi-lock"></i>
                  Password
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={styles.input}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className={styles.formOptions}>
                <label className={styles.rememberMe}>
                  <input type="checkbox" />
                  <span>Ingat saya</span>
                </label>
                <a href="#forgot" className={styles.forgotLink}>
                  Lupa password?
                </a>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span>Masuk</span>
                  </>
                )}
              </button>
            </form>

            <div className={styles.formFooter}>
              <p>
                Belum punya akun?{' '}
                <a href="/register" className={styles.registerLink}>
                  Daftar sekarang
                </a>
              </p>
            </div>

            <div className={styles.divider}>
              <span>atau masuk dengan</span>
            </div>

            <div className={styles.socialLogin}>
              <button type="button" className={styles.socialBtn}>
                <i className="bi bi-google"></i>
                <span>Google</span>
              </button>
              <button type="button" className={styles.socialBtn}>
                <i className="bi bi-microsoft"></i>
                <span>Microsoft</span>
              </button>
            </div>

            <div className={styles.backToHome}>
              <a href="/" className={styles.homeLink}>
                <i className="bi bi-arrow-left"></i>
                <span>Kembali ke Beranda</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}