import { useState, useEffect } from "react"
import ClickSpark from "../components/ClickSpark/ClickSpark"
import DashboardContainer from "../components/Dashboard/DashboardContainer"
import ManagementDashboard from "../components/Management/ManagementDashboard"
import SideContentRight from "../components/SideContentRight/SideContentRight"
import LoadingScreen from "../components/Loading/LoadingScreen"
import { authService } from "../services/authService"
import { dashboardService } from "../services/dashboardService"
import { managementService } from "../services/managementService"
import type { UserProfile } from "../services/dashboardService"
import styles from "./Dashboard.module.css"

export default function Dashboard(){
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isManagement, setIsManagement] = useState(false);
    const [stats, setStats] = useState({
        eco_score: 0,
        carbon_saved: 0,
        total_activities: 0,
        pending_assignments: 0,
        unread_notifications: 0
    });
    const [loading, setLoading] = useState(true);

    // Animated counters
    const [displayedEcoScore, setDisplayedEcoScore] = useState(0);
    const [displayedCarbon, setDisplayedCarbon] = useState(0);

    useEffect(() => {
        loadDashboardData();
        
        // Setup real-time subscriptions
        const setupRealtimeUpdates = async () => {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                const channel = dashboardService.subscribeToUserUpdates(
                    currentUser.id,
                    () => {
                        // Reload data when updates occur
                        loadDashboardData();
                    }
                );

                return () => {
                    channel.unsubscribe();
                };
            }
        };

        setupRealtimeUpdates();
    }, []);

    // Animate counters
    useEffect(() => {
        if (stats.eco_score === 0 && stats.carbon_saved === 0) return;

        const animationDuration = 1500; // ms
        const steps = 50;
        const stepDuration = animationDuration / steps;

        const ecoIncrement = stats.eco_score / steps;
        const carbonIncrement = stats.carbon_saved / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            
            setDisplayedEcoScore(prev => {
                const next = prev + ecoIncrement;
                return currentStep >= steps ? stats.eco_score : next;
            });

            setDisplayedCarbon(prev => {
                const next = prev + carbonIncrement;
                return currentStep >= steps ? stats.carbon_saved : next;
            });

            if (currentStep >= steps) {
                clearInterval(timer);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [stats.eco_score, stats.carbon_saved]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Get current user
            const currentUser = await authService.getCurrentUser();
            if (!currentUser) {
                window.location.href = '/login';
                return;
            }

            // Check if management user
            const hasManagementAccess = await managementService.hasManagementAccess(currentUser.id);
            setIsManagement(hasManagementAccess);

            // Load user profile
            const profile = await dashboardService.getUserProfile(currentUser.id);
            setUserProfile(profile);

            // Load statistics
            const userStats = await dashboardService.getUserStats(currentUser.id);
            setStats(userStats);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (!userProfile) {
        return (
            <section className={styles.dashboardSection}>
                <div className={styles.dashboardWrapper}>
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <h2>Gagal memuat profil pengguna</h2>
                        <p>Silakan refresh halaman atau login kembali</p>
                        <a href="/login" style={{
                            display: 'inline-block',
                            marginTop: '20px',
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #4a7c23, #8bc34a)',
                            color: 'white',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}>
                            Login Kembali
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    // Render Management Dashboard if user has management access
    if (isManagement) {
        return (
            <section className={styles.dashboardSection}>
                <div className={styles.bgDecor}>
                    <span className={`${styles.decorCircle} ${styles.circle1}`} />
                    <span className={`${styles.decorCircle} ${styles.circle2}`} />
                    <span className={`${styles.decorCircle} ${styles.circle3}`} />
                </div>

                <div className={styles.dashboardWrapper}>
                    <ClickSpark
                        sparkColor='#4a7c23'
                        sparkSize={10}
                        sparkRadius={15}
                        sparkCount={8}
                        duration={400}
                    >
                        <ManagementDashboard />
                    </ClickSpark>
                </div>
            </section>
        );
    }

    // Render Regular Dashboard for non-management users
    return(
        <section className={styles.dashboardSection}>
            {/* Decorative Background Elements */}
            <div className={styles.bgDecor}>
                <span className={`${styles.decorCircle} ${styles.circle1}`} />
                <span className={`${styles.decorCircle} ${styles.circle2}`} />
                <span className={`${styles.decorCircle} ${styles.circle3}`} />
            </div>

            <div className={styles.dashboardWrapper}>
                {/* Mobile: SideContentRight & Header in row */}
                <div className={styles.mobileTopRow}>
                    {/* Side Content - Left on Mobile */}
                    <div className={styles.mobileSideContent}>
                        <SideContentRight userProfile={userProfile} />
                    </div>
                    
                    {/* Header Section - Right on Mobile */}
                    <div className={styles.dashboardHeader}>
                        <div className={styles.headerContent}>
                            <div className={styles.welcomeSection}>
                                <h1 className={styles.welcomeTitle}>
                                    <i className="bi bi-grid-fill"></i>
                                    Dashboard
                                </h1>
                                <p className={styles.welcomeSubtitle}>
                                    Selamat datang kembali, {userProfile.full_name}!
                                </p>
                            </div>
                            
                            {/* Quick Stats */}
                            <div className={styles.quickStats}>
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <i className="bi bi-trophy-fill"></i>
                                    </div>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statValue}>
                                            {Math.round(displayedEcoScore).toLocaleString('id-ID')}
                                        </span>
                                        <span className={styles.statLabel}>Eco-Score</span>
                                    </div>
                                </div>
                                
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <i className="bi bi-tree-fill"></i>
                                    </div>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statValue}>
                                            {displayedCarbon.toFixed(1)} kg
                                        </span>
                                        <span className={styles.statLabel}>CO₂ Dikurangi</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <ClickSpark
                    sparkColor='#4a7c23'
                    sparkSize={10}
                    sparkRadius={15}
                    sparkCount={8}
                    duration={400}
                >
                    <DashboardContainer 
                        userId={userProfile.id}
                        userRole={userProfile.role}
                    />
                </ClickSpark>
            </div>
        </section>
    )
}