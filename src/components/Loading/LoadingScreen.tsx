import React from "react";
import styles from "./LoadingScreen.module.css";

/**
 * Komponen LoadingScreen
 * Menampilkan overlay loading dengan animasi daun dan titik-titik berjalan.
 */
const LoadingScreen: React.FC = () => (
  <div className={styles.loadingOverlay} role="status" aria-label="Memuat halaman">
    <div className={styles.loaderBox}>
      {/* Ikon daun animasi */}
      <span className={styles.leafIcon}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <ellipse cx="24" cy="24" rx="20" ry="20" className={styles.leafBg} />
          <path d="M24 40c8-8 8-24 0-32-8 8-8 24 0 32z" className={styles.leafMain} />
          <path d="M24 40c-8-8-8-24 0-32" className={styles.leafStroke} />
        </svg>
      </span>
      {/* Teks loading dengan animasi titik */}
      <span className={styles.loadingText}>
        Memuat
        <span className={styles.dot} data-delay="0"></span>
        <span className={styles.dot} data-delay="0.15"></span>
        <span className={styles.dot} data-delay="0.3"></span>
      </span>
    </div>
  </div>
);

export default LoadingScreen;
