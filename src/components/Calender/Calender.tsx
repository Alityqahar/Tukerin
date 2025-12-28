import styles from './Calender.module.css'
import { useState } from 'react'

const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

export default function Calender() {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay(); // 0: Minggu

    const handlePrev = () => {
        if (month === 0) {
            setMonth(11);
            setYear(y => y - 1);
        } else {
            setMonth(m => m - 1);
        }
    };

    const handleNext = () => {
        if (month === 11) {
            setMonth(0);
            setYear(y => y + 1);
        } else {
            setMonth(m => m + 1);
        }
    };

    // Buat array tanggal dengan padding di awal jika perlu
    const daysArray = [];
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        daysArray.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        daysArray.push(d);
    }

    return (
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <i className="bi bi-calendar-check"></i>
                <h2>Calender</h2>
            </div>
            <div className={styles.calender}>
                <div className={styles.header}>
                    <button className={styles.navBtn} onClick={handlePrev}>&lt;</button>
                    <span className={styles.monthYear}>
                        {monthNames[month]} {year}
                    </span>
                    <button className={styles.navBtn} onClick={handleNext}>&gt;</button>
                </div>
                <div className={styles.daysHeader}>
                    <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                </div>
                <div className={styles.daysGrid}>
                    {daysArray.map((d, i) =>
                        d ? (
                            <span
                                key={i}
                                className={
                                    d === today.getDate() &&
                                    month === today.getMonth() &&
                                    year === today.getFullYear()
                                        ? styles.today
                                        : styles.day
                                }
                            >
                                {d}
                            </span>
                        ) : (
                            <span key={i} className={styles.dayEmpty}></span>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}