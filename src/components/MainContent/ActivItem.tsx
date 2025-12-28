import styles from './MainContent.module.css'

type props = {
    desc: string;
    type?: 'pesanan' | 'pengiriman' | 'diterima' | 'batal';
}

const typeIcon: Record<string, { icon: string; color: string; title: string; bg: string }> = {
    pesanan:   { icon: "bi-cart",        color: "#4a7c23", title: "Pesanan",   bg: "linear-gradient(120deg, #e8f5e9 70%, #f1f8e9 100%)" },
    pengiriman:{ icon: "bi-truck",       color: "#1976d2", title: "Pengiriman",bg: "linear-gradient(120deg, #e3f2fd 70%, #e1f5fe 100%)" },
    diterima:  { icon: "bi-check-circle",color: "#43a047", title: "Diterima",  bg: "linear-gradient(120deg, #e8f5e9 70%, #d0f8ce 100%)" },
    batal:     { icon: "bi-x-circle",    color: "#e53935", title: "Batal",     bg: "linear-gradient(120deg, #ffebee 70%, #ffcdd2 100%)" }
};

export default function ActivItem({desc, type = 'pesanan'}: props){
    const { icon, color, title, bg } = typeIcon[type] || typeIcon.pesanan;
    return(
        <div className={styles.activItem} style={{ background: bg }}>
            <i className={`bi ${icon}`} style={{ color }}></i>
            <div className='d-flex flex-column align-items-center'>
                <span className={styles.title}>{title}</span>
                <span className={styles.desc}>{desc}</span>
            </div>
        </div>
    )
}