import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import styles from './AuthCallback.module.css'; // Ganti ke CSS module khusus
import Swal from 'sweetalert2';
import SuccessModal from './SuccessModal'; // Tambahkan komponen modal sukses

/**
 * Komponen AuthCallback
 * Menangani proses verifikasi email setelah redirect dari link email.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Memverifikasi email Anda...');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { success, error } = await authService.handleEmailVerification();

        if (success) {
          setStatus('success');
          setMessage('Email berhasil diverifikasi! Anda akan dialihkan ke halaman login...');
          setShowSuccess(true);

          setTimeout(() => {
            setShowSuccess(false);
            navigate('/login');
          }, 1800);
        } else {
          setStatus('error');
          setMessage(error || 'Verifikasi gagal. Silakan coba lagi.');
          // SweetAlert untuk error verifikasi
          Swal.fire({
            icon: 'error',
            title: 'Verifikasi Gagal',
            text: error || 'Verifikasi gagal. Silakan coba lagi.',
            timer: 2200,
            showConfirmButton: false,
          });
        }
      } catch{
        setStatus('error');
        setMessage('Terjadi kesalahan saat verifikasi.');
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: 'Terjadi kesalahan saat verifikasi.',
          timer: 2200,
          showConfirmButton: false,
        });
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <>
      <section className={styles.loginSection}>
        <div className={styles.bgDecor}>
          <div className={styles.circle1} />
          <div className={styles.circle2} />
          <div className={styles.circle3} />
        </div>

        <div className={styles.loginContainer} style={{ maxWidth: '600px', gridTemplateColumns: '1fr' }}>
          <div className={styles.rightPanel}>
            <div className={styles.formContainer}>
              <div className={styles.centeredBox}>
                {status === 'loading' && (
                  <>
                    <div className={styles.spinner} />
                    <h2 className={styles.title}>Memverifikasi Email</h2>
                    <p className={styles.subtitle}>{message}</p>
                  </>
                )}

                {status === 'success' && (
                  <>
                    <div className={styles.successIcon}>
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <h2 className={styles.titleSuccess}>Email Terverifikasi!</h2>
                    <p className={styles.subtitle}>{message}</p>
                    <a
                      href="/login"
                      className={styles.loginBtn}
                    >
                      <i className="bi bi-box-arrow-in-right"></i>
                      Login Sekarang
                    </a>
                  </>
                )}

                {status === 'error' && (
                  <>
                    <div className={styles.errorIcon}>
                      <i className="bi bi-x-circle-fill"></i>
                    </div>
                    <h2 className={styles.titleError}>Verifikasi Gagal</h2>
                    <p className={styles.subtitle}>{message}</p>
                    <div className={styles.actionRow}>
                      <a
                        href="/register"
                        className={styles.retryBtn}
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                        Daftar Ulang
                      </a>
                      <a
                        href="/"
                        className={styles.homeBtn}
                      >
                        <i className="bi bi-house"></i>
                        Beranda
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Modal animasi sukses verifikasi email */}
      {showSuccess && (
        <SuccessModal
          title="Email Terverifikasi!"
          subtitle="Akun Anda sudah aktif. Silakan login."
        />
      )}
    </>
  );
}