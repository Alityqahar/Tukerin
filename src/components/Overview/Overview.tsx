import { useEffect, useRef } from 'react';
import styles from './Overview.module.css';

// Type declaration untuk Leaflet
declare global {
interface Window {
L: typeof import('leaflet');
}
}

const Overview = () => {
const mapRef = useRef<HTMLDivElement>(null);

useEffect(() => {
if (mapRef.current && typeof window !== 'undefined') {
    if (window.L) {
    delete (window.L.Icon.Default.prototype as any)._getIconUrl;
    window.L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = window.L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: false
    }).setView([-2.5, 118], 5);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    window.L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // ✅ FIX 2: Custom icon dengan CDN path (alternatif)
    const customIcon = window.L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Data sekolah
    const schools = [
        { name: 'MAN Insan Cendekia OKI', lat: -3.385, lng: 104.830, score: 5000, students: 800 },
        { name: 'SMAN 1 Jakarta', lat: -6.2, lng: 106.8, score: 4852, students: 1247 },
        { name: 'SMPN 5 Surabaya', lat: -7.3, lng: 112.7, score: 4203, students: 987 },
        { name: 'SMAN 3 Bandung', lat: -6.9, lng: 107.6, score: 3987, students: 1156 },
        { name: 'SMPN 2 Yogyakarta', lat: -7.8, lng: 110.4, score: 3654, students: 897 },
        { name: 'SMAN 1 Medan', lat: 3.6, lng: 98.7, score: 3421, students: 1089 },
        { name: 'SMPN 4 Makassar', lat: -5.1, lng: 119.4, score: 2987, students: 756 },
        { name: 'SMAN 2 Denpasar', lat: -8.7, lng: 115.2, score: 2654, students: 834 }
    ];

    // Tambahkan marker dengan custom icon
    schools.forEach(school => {
        const marker = window.L.marker([school.lat, school.lng], { 
        icon: customIcon // ✅ Gunakan custom icon
        })
        .addTo(map)
        .bindPopup(`<b>${school.name}</b><br>Eco-Score: ${school.score}`);
        
        marker.on('mouseover', () => {
        marker.openPopup();
        });
    });

    // Fix responsivitas
    setTimeout(() => map.invalidateSize(), 0);
    
    const handleResize = () => {
        setTimeout(() => map.invalidateSize(), 0);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
        map.remove();
    };
    }
}
}, []);

return (
<section className={styles.statsSection}>
    <div className={styles.container}>
    {/* Map Section */}
    <div className={styles.mapWrapper}>
        <div className={styles.mapContainer}>
        <div className={styles.mapHeader}>
            <h4 className={styles.mapTitle}>
            <i className="fas fa-map-marked-alt"></i>
            Peta Partisipasi Sekolah Se-Indonesia
            </h4>
            <p className={styles.mapSubtitle}>Real-time tracking sekolah yang berpartisipasi</p>
        </div>
        <div ref={mapRef} className={styles.map} id="mapid"></div>
        </div>
    </div>

    {/* Stats Grid */}
    <div className={styles.statsGrid}>
        <div className={styles.statCard}>
        <i className="fas fa-school"></i>
        <h3 className={styles.statNumber}>1,247</h3>
        <p className={styles.statLabel}>Sekolah Terdaftar</p>
        </div>

        <div className={styles.statCard}>
        <i className="fas fa-exchange-alt"></i>
        <h3 className={styles.statNumber}>15,832</h3>
        <p className={styles.statLabel}>Barang Ditukar</p>
        </div>

        <div className={styles.statCard}>
        <i className="fas fa-leaf"></i>
        <h3 className={styles.statNumber}>8.2 Ton</h3>
        <p className={styles.statLabel}>CO₂ Dikurangi</p>
        </div>

        <div className={styles.statCard}>
        <i className="fas fa-users"></i>
        <h3 className={styles.statNumber}>47,593</h3>
        <p className={styles.statLabel}>Siswa Aktif</p>
        </div>
    </div>
    </div>
</section>
);
};

export default Overview;