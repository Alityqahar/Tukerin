import { useState, useEffect } from 'react';
import styles from './Hero.module.css';
import TextType from '../TextType/TextType';

const Hero = () => {
const [ecoScore, setEcoScore] = useState(0);
const [progress, setProgress] = useState(0);

// Eco-score animation
useEffect(() => {
const targetScore = 24750;
const targetProgress = 75;

const scoreTimer = setInterval(() => {
setEcoScore(prev => {
if (prev < targetScore) {
    return Math.min(prev + Math.ceil(targetScore / 100), targetScore);
}
return prev;
});
}, 20);

const progressTimer = setInterval(() => {
setProgress(prev => {
if (prev < targetProgress) {
    return prev + 1;
}
return prev;
});
}, 20);

return () => {
clearInterval(scoreTimer);
clearInterval(progressTimer);
};
}, []);

return (
<section className={styles.heroSection}>
    {/* New animated bubbles background */}
    <div className={styles.heroBubbles} aria-hidden="true">
      <div className={`${styles.heroBubble} ${styles.b1}`}></div>
      <div className={`${styles.heroBubble} ${styles.b2}`}></div>
      <div className={`${styles.heroBubble} ${styles.b3}`}></div>
      <div className={`${styles.heroBubble} ${styles.b4}`}></div>
      <div className={`${styles.heroBubble} ${styles.b5}`}></div>
    </div>

    {/* decorative floating shapes (always behind content) */}
    <div className={styles.heroDecor} aria-hidden="true">
    <span className={`${styles.leaf} ${styles['leaf-1']}`} />
    <span className={`${styles.leaf} ${styles['leaf-2']}`} />
    <span className={`${styles.leaf} ${styles['leaf-3']}`} />
    </div>

    <div className={styles.heroContent}>
    <div className={styles.container}>
        <div className={styles.row}>
        <div className={styles.colLeft}>
            <h1 className={`${styles.heroTitle} ${styles.heroTitleReveal}`}>
            Platform Pertukaran Barang Bekas Berbasis Sekolah
            </h1>

            <div className={`${styles.typingContainer} ${styles.slideUpFade} ${styles['delay-1']}`}>
            <TextType 
                text={[
                "Tukar barang bekas sekolah dengan mudah.",
                "Dukung ekonomi sirkular di dunia pendidikan.",
                "Pantau dampak lingkungan secara real-time.",
                "Setiap transaksi = 1 bibit pohon!",
                "Aksi nyata untuk lingkungan."
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="_"
            />
            </div>

            <p className={`${styles.heroDescription} ${styles.slideUpFade} ${styles['delay-2']}`}>
            Bergabunglah dengan revolusi ekonomi sirkular di dunia pendidikan. 
            Tukar barang bekas layak pakai antar sekolah se-Indonesia dan pantau 
            dampak lingkungan secara real-time!
            </p>

            <div className={styles.heroButtons}>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href="/register">
                <i className="bi bi-building-fill"></i> Daftarkan Sekolah
            </a>

            <a className={`${styles.btn} ${styles.btnGhost}`} href="/dashboard">
                <i className="bi bi-bar-chart-fill"></i>Lihat Dashboard
            </a>
            </div>
        </div>

        <div className={styles.colRight}>
            <div className={styles.ecoScoreDisplay}>
            <div className={styles.treeVisual}>
                <i className={`fas fa-tree ${styles.treeIcon}`}></i>
            </div>
            <h3 className={styles.ecoTitle}>Eco-Score Nasional</h3>
            <h2 className={`${styles.ecoValue}`}>{ecoScore.toLocaleString('id-ID')}</h2>
            <p className={styles.ecoDescription}>Setara dengan 247 pohon terselamatkan</p>
            <div className={styles.progressEco}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            </div>
        </div>

        </div>
    </div>
    </div>
</section>
);
};

export default Hero;