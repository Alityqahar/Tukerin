import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import styles from './Login.module.css'; // Reuse login styles
import successStyles from './RegisterSuccess.module.css'; // CSS khusus tampilan sukses
import Swal from 'sweetalert2';

/**
 * Komponen Register
 * Menangani proses registrasi user baru.
 */
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    school_id: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handler perubahan input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handler submit form registrasi
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi input
    if (!formData.email.trim()) {
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Email harus diisi',
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }
    if (!formData.full_name.trim()) {
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Nama lengkap harus diisi',
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }
    if (!formData.password) {
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Password harus diisi',
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }
    if (formData.password.length < 6) {
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Password minimal 6 karakter',
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Password dan konfirmasi password tidak cocok',
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const { user, error: registerError } = await authService.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        school_id: formData.school_id || undefined
      });

      if (registerError || !user) {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Registrasi gagal',
          text: registerError || 'Registrasi gagal',
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      // Success
      setSuccess(true);
      setLoading(false);
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

  // Tampilan sukses registrasi (semua style dipindah ke RegisterSuccess.module.css)
  if (success) {
    // Modal instruksi verifikasi akun yang hanya bisa ditutup dengan tombol konfirmasi
    return (
      <section className={styles.loginSection}>
        <div className={styles.bgDecor}>
          <div className={styles.circle1} />
          <div className={styles.circle2} />
          <div className={styles.circle3} />
        </div>
        <div className={styles.loginContainer} style={{ maxWidth: '600px', gridTemplateColumns: '1fr' }}>
          <div className={styles.rightPanel}>
            <div className={styles.formContainer}>
              {/* Modal instruksi verifikasi akun */}
              <div
                className={successStyles.successBox}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0,0,0,0.18)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  margin: 0,
                }}
              >
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 18,
                    boxShadow: '0 8px 32px rgba(74,124,35,0.13)',
                    maxWidth: 420,
                    width: '95vw',
                    padding: '36px 28px 28px 28px',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                  onClick={e => e.stopPropagation()}
                  tabIndex={0}
                  aria-modal="true"
                  role="dialog"
                >
                  <div className={successStyles.successIcon}>
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <h2 className={successStyles.successTitle}>
                    Registrasi Berhasil!
                  </h2>
                  <p className={successStyles.successSubtitle}>
                    Kami telah mengirim email verifikasi ke <strong>{formData.email}</strong>
                  </p>
                  <div className={successStyles.nextStepBox}>
                    <p className={successStyles.nextStepTitle}>
                      <i className="bi bi-info-circle-fill"></i>
                      Langkah Selanjutnya:
                    </p>
                    <ol className={successStyles.nextStepList}>
                      <li>Buka inbox email Anda</li>
                      <li>Klik link verifikasi yang kami kirim</li>
                      <li>Login dengan akun Anda</li>
                    </ol>
                  </div>
                  <p className={successStyles.redirectInfo}>
                    Setelah menekan tombol di bawah, Anda akan dialihkan ke halaman login.
                  </p>
                  {/* Tombol konfirmasi, satu-satunya cara menutup modal */}
                  <button
                    className={successStyles.loginBtn}
                    style={{
                      marginTop: 18,
                      minWidth: 180,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      border: 'none',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #4a7c23, #8bc34a)',
                      color: '#fff',
                      padding: '12px 0',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                    onClick={() => {
                      // Redirect ke login setelah user menekan tombol
                      navigate('/login');
                    }}
                    autoFocus
                  >
                    <i className="bi bi-box-arrow-in-right"></i>
                    Saya Paham
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Tampilan form registrasi
  return (
    <section className={styles.loginSection}>
      <div className={styles.bgDecor}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.circle3} />
      </div>
      <div className={styles.loginContainer}>
        {/* Left Panel - Branding */}
        <div className={styles.leftPanel}>
          <div className={styles.brandingContent}>
            <div className={styles.logoWrapper}>
              <img src="/nav-logo.webp" alt="Tukerin Logo" className={styles.logo} />
            </div>
            <h1 className={styles.brandTitle}>
              Bergabung dengan <span className={styles.highlight}>Tukerin</span>
            </h1>
            <p className={styles.brandSubtitle}>
              Daftar sekarang dan mulai kontribusi untuk lingkungan yang lebih hijau
            </p>
            
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Gratis selamanya</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Akses ke semua fitur</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Komunitas eco-friendly</span>
              </div>
            </div>

            <div className={styles.statsPreview}>
              <div className={styles.statItem}>
                <i className="bi bi-people-fill"></i>
                <div>
                  <strong>47,593+</strong>
                  <span>Pengguna Aktif</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <i className="bi bi-arrow-repeat"></i>
                <div>
                  <strong>15,832+</strong>
                  <span>Barang Ditukar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Register Form */}
        <div className={styles.rightPanel}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Buat Akun Baru</h2>
              <p className={styles.formSubtitle}>
                Isi form di bawah untuk memulai perjalanan eco-friendly Anda
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
                <label htmlFor="full_name" className={styles.label}>
                  <i className="bi bi-person"></i>
                  Nama Lengkap
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  className={styles.input}
                  placeholder="Nama lengkap Anda"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  <i className="bi bi-envelope"></i>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  placeholder="nama@sekolah.sch.id"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="school_id" className={styles.label}>
                  <i className="bi bi-building"></i>
                  ID Sekolah (Opsional)
                </label>
                <input
                  id="school_id"
                  name="school_id"
                  type="text"
                  className={styles.input}
                  placeholder="Contoh: 954040"
                  value={formData.school_id}
                  onChange={handleChange}
                  disabled={loading}
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={styles.input}
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
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

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  <i className="bi bi-lock-fill"></i>
                  Konfirmasi Password
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={styles.input}
                    placeholder="Ketik ulang password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
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
                    <i className="bi bi-person-plus"></i>
                    <span>Daftar Sekarang</span>
                  </>
                )}
              </button>
            </form>

            <div className={styles.formFooter}>
              <p>
                Sudah punya akun?{' '}
                <a href="/login" className={styles.registerLink}>
                  Login di sini
                </a>
              </p>
            </div>

            <div className={styles.divider}>
              <span>atau daftar dengan</span>
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