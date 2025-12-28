import Profil from "../Profil/Profil";
import { authService } from "../../services/authService";
import type { UserProfile } from "../../services/dashboardService";
import styles from "./SideContentRight.module.css";

interface SideContentRightProps {
    userProfile: UserProfile;
}

export default function SideContentRight({ userProfile }: SideContentRightProps) {
    if (!userProfile) return null; // Guard against undefined

    const handleLogout = async () => {
        const confirmed = window.confirm('Apakah Anda yakin ingin keluar?');
        if (confirmed) {
            await authService.logout();
            window.location.href = '/login';
        }
    };

    return (
        <aside className={`${styles.sidebarContainer} w-full md:w-80 bg-white rounded-xl shadow-md p-6 flex flex-column items-center gap-6`}>
            <Profil 
                noid={parseInt(userProfile.school_id || '0') || 0}
                name={userProfile.school_name || userProfile.full_name}
                photoUrl={userProfile.profile_photo || "foto-profil.webp"}
                role={userProfile.role}
            />
            <div className={`${styles.navListWrapper} w-full mt-3`}>
                <ul className={styles.navList}>
                    <li>
                        <a href="/" className={styles.navItem}>
                            <i className="bi bi-house-door"></i>
                            <span className={styles.navText}>Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="/dashboard" className={styles.navItem}>
                            <i className="bi bi-grid"></i>
                            <span className={styles.navText}>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="/profile" className={styles.navItem}>
                            <i className="bi bi-person-circle"></i>
                            <span className={styles.navText}>Profile</span>
                        </a>
                    </li>
                    <li>
                        <a href="/settings" className={styles.navItem}>
                            <i className="bi bi-gear"></i>
                            <span className={styles.navText}>Settings</span>
                        </a>
                    </li>
                    <li>
                        <button 
                            onClick={handleLogout}
                            className={`${styles.navItem} ${styles.logoutBtn}`}
                            style={{
                                border: 'none',
                                background: 'none',
                                width: '100%',
                                cursor: 'pointer'
                            }}
                        >
                            <i className="bi bi-box-arrow-right"></i>
                            <span className={styles.navText}>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
}