import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './NotFound.module.css';

export default function NotFound(){
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className={styles.notFoundSection} aria-labelledby="nf-title">
            {/* Animated Background */}
            <div className={styles.bgAnimation}>
                <div className={styles.bgCircle1}></div>
                <div className={styles.bgCircle2}></div>
                <div className={styles.bgCircle3}></div>
            </div>

            {/* Parallax Effect */}
            <div 
                className={styles.parallaxLayer}
                style={{
                    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
                }}
            >
                <div className={styles.floatingLeaf1}>🍃</div>
                <div className={styles.floatingLeaf2}>🌿</div>
                <div className={styles.floatingLeaf3}>🍀</div>
            </div>

            <div className={styles.notFoundCard} role="main">
                {/* Animated 404 */}
                <div className={styles.errorCodeWrapper}>
                    <h1 id="nf-title" className={styles.nfTitle}>
                        <span className={styles.digit}>4</span>
                        <span className={`${styles.digit} ${styles.middle}`}>
                            <i className="bi bi-emoji-frown"></i>
                        </span>
                        <span className={styles.digit}>4</span>
                    </h1>
                </div>

                <h2 className={styles.nfSubtitle}>Oops! Halaman Tidak Ditemukan</h2>

                <p className={styles.nfText}>
                    Sepertinya Anda tersesat di hutan digital kami. 🌳<br/>
                    Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
                </p>

                {/* Search Suggestion */}

                <div className={styles.nfActions}>
                    <Link to="/" className={styles.nfBtnPrimary} aria-label="Kembali ke Beranda">
                        <i className="bi bi-house-door"></i>
                        <span>Kembali ke Beranda</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className={styles.nfBtnGhost}
                        aria-label="Kembali ke Halaman Sebelumnya"
                    >
                        <i className="bi bi-arrow-left"></i>
                        <span>Halaman Sebelumnya</span>
                    </button>
                </div>

                {/* Popular Links */}
                <div className={styles.popularLinks}>
                    <p className={styles.popularTitle}>Mungkin Anda mencari:</p>
                    <div className={styles.linkGrid}>
                        <Link to="/" className={styles.quickLink}>
                            <i className="bi bi-house"></i>
                            <span>Home</span>
                        </Link>
                        <Link to="/dashboard" className={styles.quickLink}>
                            <i className="bi bi-grid"></i>
                            <span>Dashboard</span>
                        </Link>
                        <a href="/#fitur" className={styles.quickLink}>
                            <i className="bi bi-star"></i>
                            <span>Fitur</span>
                        </a>
                        <a href="/#products" className={styles.quickLink}>
                            <i className="bi bi-bag"></i>
                            <span>Produk</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}