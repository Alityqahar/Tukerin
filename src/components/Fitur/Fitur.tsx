import styles from './Fitur.module.css';

const Fitur = () => {
const features = [
{
    icon: 'fas fa-school',
    title: 'Sekolah Kontributor',
    description: 'Setiap 1.000 point eco-score bernilai satu bibit pohon untuk penghijauan lingkungan sekitar sekolah, menciptakan dampak nyata bagi bumi.'
},
{
    icon: 'fas fa-leaf',
    title: 'Eco-Score & Carbon Tracker',
    description: 'Pantau dampak lingkungan setiap transaksi dengan perhitungan CO₂ yang dikurangi dan setara pohon terselamatkan secara real-time.'
},
{
    icon: 'fas fa-robot',
    title: 'EcoBuddy AI',
    description: 'Asisten digital yang membantu pengguna mencari informasi barang, berkonsultasi tentang ekonomi sirkular, dan memandu penggunaan platform.'
},
{
    icon: 'fas fa-chart-bar',
    title: 'Dashboard Interaktif',
    description: 'Visualisasi data yang menarik dengan pohon virtual, peta partisipasi, dan statistik dampak lingkungan yang mudah dipahami.'
},
{
    icon: 'fas fa-medal',
    title: 'Sistem Reputasi',
    description: 'Sertifikat digital partisipasi siswa dan badge "Sekolah Hijau" untuk memotivasi partisipasi berkelanjutan.'
},
{
    icon: 'fas fa-truck',
    title: 'Logistik Terintegrasi',
    description: 'Sistem distribusi melalui titik kumpul sekolah seperti koperasi dan perpustakaan untuk kemudahan akses.'
}
];

return (
<section className={styles.fiturSection}>
    <div className={styles.container}>
    <div className={styles.header}>
        <h2 className={styles.title}>Fitur Utama Tukerin</h2>
        <p className={styles.subtitle}>Platform lengkap untuk mendukung ekonomi sirkular di sekolah</p>
    </div>

    <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
        <div key={index} className={styles.featureCard}>
            <div className={styles.featureIcon}>
            <i className={feature.icon}></i>
            </div>
            <h4 className={styles.featureTitle}>{feature.title}</h4>
            <p className={styles.featureDescription}>{feature.description}</p>
        </div>
        ))}
    </div>
    </div>
</section>
);
};

export default Fitur;