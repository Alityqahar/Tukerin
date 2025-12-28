import styles from './Profil.module.css';
import { useState } from 'react';

type Props = {
    noid: number;
    name: string;
    photoUrl?: string;
    role?: string;
};

export default function Profil({ noid, name, photoUrl = "foto-profil.webp", role = "student" }: Props) {
    const [copied, setCopied] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(noid.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    const getRoleBadge = () => {
        const roleMap: Record<string, { label: string; color: string }> = {
            student: { label: 'Siswa', color: '#4a7c23' },
            teacher: { label: 'Guru', color: '#2196f3' },
            admin: { label: 'Admin', color: '#ff9800' }
        };
        return roleMap[role] || roleMap.student;
    };

    const roleBadge = getRoleBadge();

    return (
        <div className={styles.container}>
            <div className={styles.avatarWrapper}>
                <img 
                    src={imageError ? "foto-profil.webp" : photoUrl} 
                    className={styles.foto} 
                    alt="Foto Profil"
                    onError={() => setImageError(true)}
                />
            </div>
            
            {role && (
                <div 
                    className={styles.roleBadge}
                    style={{ 
                        background: roleBadge.color,
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginTop: '8px'
                    }}
                >
                    {roleBadge.label}
                </div>
            )}
            
            <div className={styles.name}>{name}</div>
            
            {noid > 0 && (
                <div className={styles.id}>
                    <span className={styles.noid}>{noid}</span>
                    <button className={styles.btn} onClick={handleCopy} title="Copy ID">
                        <i className="bi bi-copy"></i>
                    </button>
                    {copied && <span className={styles.copied}>Copied!</span>}
                </div>
            )}
        </div>
    );
}