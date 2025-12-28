import { useEffect, useState } from 'react';
import styles from './Notif.module.css';
import NotifItem from './NotifItem';
import { dashboardService } from '../../services/dashboardService';
import type { Notification } from '../../services/dashboardService';
import Swal from 'sweetalert2';

interface NotifProps {
    userId: string;
}

export default function Notif({ userId }: NotifProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
        
        // Setup real-time subscription for new notifications
        const channel = dashboardService.subscribeToUserUpdates(
            userId,
            (payload) => {
                // Reload notifications when new one is inserted
                if (payload.table === 'notifications' && payload.eventType === 'INSERT') {
                    loadNotifications();
                }
            }
        );

        return () => {
            channel.unsubscribe();
        };
    }, [userId]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getUserNotifications(userId, 5);
            setNotifications(data);
        } catch (error) {
            // Ganti error notification dengan SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memuat Notifikasi',
                text: 'Terjadi kesalahan saat memuat notifikasi.',
                timer: 2000,
                showConfirmButton: false,
            });
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        const success = await dashboardService.markNotificationAsRead(notificationId);
        if (success) {
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, is_read: true }
                        : notif
                )
            );
        } else {
            // SweetAlert untuk error update
            Swal.fire({
                icon: 'error',
                title: 'Gagal Update',
                text: 'Tidak dapat menandai notifikasi sebagai sudah dibaca.',
                timer: 1800,
                showConfirmButton: false,
            });
        }
    };

    const formatDeadline = (deadline: string | null) => {
        if (!deadline) return '';
        const date = new Date(deadline);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <i className="bi bi-bell"></i>
                <h2>Notifications</h2>
                {notifications.filter(n => !n.is_read).length > 0 && (
                    <span style={{
                        background: '#ef5350',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        marginLeft: 'auto'
                    }}>
                        {notifications.filter(n => !n.is_read).length}
                    </span>
                )}
            </div>
            
            <div className={styles.notifContainer}>
                {loading ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '40px 20px',
                        color: '#5a7c3c'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #e0e7ef',
                            borderTopColor: '#4a7c23',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            margin: '0 auto 12px'
                        }} />
                        <p>Memuat notifikasi...</p>
                        <style>{`
                            @keyframes spin {
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                ) : notifications.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#999'
                    }}>
                        <i className="bi bi-bell-slash" style={{ 
                            fontSize: '3rem', 
                            display: 'block', 
                            marginBottom: '12px',
                            color: '#ccc'
                        }}></i>
                        <p style={{ margin: 0, fontSize: '1rem' }}>Tidak ada notifikasi</p>
                        <small style={{ color: '#bbb' }}>Notifikasi baru akan muncul di sini</small>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {notifications.map((notif) => (
                            <NotifItem 
                                key={notif.id}
                                title={notif.title}
                                deadline={notif.deadline ? formatDeadline(notif.deadline) : ''}
                                isRead={notif.is_read}
                                onClick={() => handleMarkAsRead(notif.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}