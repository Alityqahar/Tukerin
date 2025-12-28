import MainContent from '../MainContent/MainContent';
import SideContentLeft from '../SideContentLeft/SideContentLeft';
import SideContentRight from '../SideContentRight/SideContentRight';
import type { UserProfile } from '../../services/dashboardService';
import styles from './DashboardContainer.module.css';

interface DashboardContainerProps {
    userId: string;
    userRole: string;
}

export default function DashboardContainer({ userId, userRole }: DashboardContainerProps) {

    const userProfile: UserProfile = {
    id: userId,
    email: "",
    full_name: "",
    school_id: null,
    school_name: null,
    role: userRole as 'student' | 'teacher' | 'admin',
    eco_score: 0,
    carbon_saved: 0,
    profile_photo: null,
    created_at: new Date().toISOString()
};


    return (
        <div className={styles.container}>
            {/* Desktop: SideContentRight visible */}
            <div className={styles.item}>
                <SideContentRight userProfile={userProfile} />
            </div>
            
            <div className={styles.item}>
                <MainContent userId={userId} userRole={userRole} />
            </div>
            
            <div className={styles.item}>
                <SideContentLeft userId={userId} />
            </div>
        </div>
    );
}