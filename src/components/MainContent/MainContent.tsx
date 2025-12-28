import { useEffect, useState } from 'react';
import ActivItem from './ActivItem';
import AssignItem from './AssignItem';
import { dashboardService } from '../../services/dashboardService';
import type { Activity, Assignment } from '../../services/dashboardService';
import styles from './MainContent.module.css';

interface MainContentProps {
    userId: string;
    userRole: string;
}

export default function MainContent({ userId, userRole }: MainContentProps) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [loadingAssignments, setLoadingAssignments] = useState(true);

    useEffect(() => {
        loadActivities();
        loadAssignments();
    }, [userId, userRole]);

    const loadActivities = async () => {
        try {
            setLoadingActivities(true);
            const data = await dashboardService.getUserActivities(userId, 4);
            setActivities(data);
        } catch (error) {
            console.error('Error loading activities:', error);
        } finally {
            setLoadingActivities(false);
        }
    };

    const loadAssignments = async () => {
        try {
            setLoadingAssignments(true);
            const data = await dashboardService.getUserAssignments(userId, userRole);
            setAssignments(data);
        } catch (error) {
            console.error('Error loading assignments:', error);
        } finally {
            setLoadingAssignments(false);
        }
    };

    const formatDeadline = (deadline: string) => {
        const date = new Date(deadline);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.container}>
            {/* My Activity Section */}
            <div className={styles.sectionHeader}>
                <i className="bi bi-activity"></i>
                <h2>My Activity</h2>
            </div>
            
            <div className={styles.activContainer}>
                {loadingActivities ? (
                    <div style={{ 
                        gridColumn: '1 / -1',
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
                        <p>Memuat aktivitas...</p>
                        <style>{`
                            @keyframes spin {
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                ) : activities.length === 0 ? (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#999'
                    }}>
                        <i className="bi bi-inbox" style={{ 
                            fontSize: '3rem', 
                            display: 'block', 
                            marginBottom: '12px',
                            color: '#ccc'
                        }}></i>
                        <p style={{ margin: 0, fontSize: '1rem' }}>Belum ada aktivitas</p>
                        <small style={{ color: '#bbb' }}>Mulai bertransaksi untuk melihat aktivitas Anda</small>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <ActivItem 
                            key={activity.id}
                            type={activity.type} 
                            desc={activity.school_name}
                        />
                    ))
                )}
            </div>

            {/* Assignments Section */}
            <div className={styles.sectionHeader}>
                <i className="bi bi-clipboard-check"></i>
                <h2>Assignments</h2>
            </div>
            
            <div className={styles.assignContainer}>
                {loadingAssignments ? (
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
                        <p>Memuat tugas...</p>
                    </div>
                ) : assignments.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#999'
                    }}>
                        <i className="bi bi-clipboard-x" style={{ 
                            fontSize: '3rem', 
                            display: 'block', 
                            marginBottom: '12px',
                            color: '#ccc'
                        }}></i>
                        <p style={{ margin: 0, fontSize: '1rem' }}>Tidak ada tugas</p>
                        <small style={{ color: '#bbb' }}>Anda tidak memiliki tugas yang pending</small>
                    </div>
                ) : (
                    assignments.map((assignment) => (
                        <AssignItem 
                            key={assignment.id}
                            title={assignment.title}
                            deadline={formatDeadline(assignment.deadline)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}