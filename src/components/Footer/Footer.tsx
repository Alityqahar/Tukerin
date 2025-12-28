import styles from './Footer.module.css';

const Footer = () => {
return (
    <footer className={styles.footer}>
    <div className={styles.container}>
        <div className={styles.row}>
        {/* About Section */}
        <div className={styles.col}>
            <img src="footer-logo.png" className={styles.logo}/>
            <p className={styles.text}>
            Platform pertukaran barang bekas sekolah yang mendukung ekonomi sirkular dan keberlanjutan lingkungan.
            </p>
            <p className={styles.text}>
            <i className="fas fa-map-marker-alt"></i> Jl. Lintas Timur Desa Seriguna Kec. Teluk Gelam Prov. Sumsel, Indonesia
            </p>
            <p className={styles.text}>
            <i className="fas fa-envelope"></i> info@tukerin.com
            </p>
            <p className={styles.text}>
            <i className="fas fa-phone"></i> (021) 123-4567
            </p>
        </div>

        {/* Information Section */}
        <div className={styles.col}>
            <h5 className={styles.heading}>Informasi</h5>
            <ul className={styles.list}>
            <li>
                <a href="#about" className={styles.link}>
                Tentang Kami
                </a>
            </li>
            <li>
                <a href="#terms" className={styles.link}>
                Syarat & Ketentuan
                </a>
            </li>
            <li>
                <a href="#policy" className={styles.link}>
                Kebijakan Privasi
                </a>
            </li>
            <li>
                <a href="#faq" className={styles.link}>
                FAQ
                </a>
            </li>
            </ul>
        </div>

        {/* Contact Section */}
        <div className={styles.col}>
            <h5 className={styles.heading}>Kontak</h5>
            <p className={styles.text}>
            <i className="fas fa-envelope"></i> info@tukerin.com
            <br />
            <i className="fas fa-phone"></i> (021) 123-4567
            <br />
            <i className="fas fa-map-marker-alt"></i> Palembang, Indonesia
            </p>
        </div>

        {/* Social Media Section */}
        <div className={styles.col}>
            <h5 className={styles.heading}>Ikuti Kami</h5>
            <div className={styles.socialLinks}>
            <a href="#Facebok" className={styles.socialIcon} aria-label="Facebook">
                <i className="fab fa-facebook"></i>
            </a>
            <a href="#Twitter" className={styles.socialIcon} aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
            </a>
            <a href="#Instagram" className={styles.socialIcon} aria-label="Instagram">
                <i className="fab fa-instagram"></i>
            </a>
            <a href="#Linkedin" className={styles.socialIcon} aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
            </a>
            </div>
        </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.copyright}>
        <small>&copy; 2025 Tukerin. All rights reserved.</small>
        </div>
    </div>
    </footer>
);
};

export default Footer;