import { useState, useEffect } from 'react';
import { managementService } from '../../services/managementService';
import type { ManagementStats, SchoolPerformance, UserActivity } from '../../services/managementService';
import styles from './ManagementDashboard.module.css';
import Swal from 'sweetalert2';

export default function ManagementDashboard() {
  const [stats, setStats] = useState<ManagementStats | null>(null);
  const [schools, setSchools] = useState<SchoolPerformance[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'schools' | 'activities'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsData, schoolsData, activitiesData] = await Promise.all([
        managementService.getManagementStats(),
        managementService.getSchoolPerformance(10),
        managementService.getAllActivities(20)
      ]);

      setStats(statsData);
      setSchools(schoolsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Load dashboard error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: 'Terjadi kesalahan saat memuat dashboard',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Broadcast Notifikasi',
      html: `
        <style>
          .swal2-input, .swal2-textarea, .swal2-select {
            width: 90% !important;
            margin: 10px auto !important;
            padding: 12px !important;
            font-size: 1rem !important;
          }
          .swal2-textarea {
            min-height: 100px !important;
          }
        </style>
        <input id="swal-title" class="swal2-input" placeholder="Judul Notifikasi">
        <textarea id="swal-message" class="swal2-textarea" placeholder="Pesan Notifikasi"></textarea>
        <select id="swal-role" class="swal2-select">
          <option value="">Semua Pengguna</option>
          <option value="student">Siswa</option>
          <option value="teacher">Guru</option>
          <option value="admin">Admin</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#4a7c23',
      confirmButtonText: 'Kirim',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement)?.value;
        const message = (document.getElementById('swal-message') as HTMLTextAreaElement)?.value;
        const role = (document.getElementById('swal-role') as HTMLSelectElement)?.value;

        if (!title || !message) {
          Swal.showValidationMessage('Judul dan pesan harus diisi');
          return null;
        }

        return { title, message, role: role ? [role] : undefined };
      }
    });

    if (formValues) {
      await managementService.broadcastNotification(
        formValues.title,
        formValues.message,
        formValues.role
      );
      await loadDashboardData(); // Refresh data
    }
  };

  const handleExport = async (dataType: 'users' | 'activities' | 'schools') => {
    await managementService.exportData(dataType);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Memuat dashboard manajemen...</p>
      </div>
    );
  }

  return (
    <div className={styles.managementDashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <i className="bi bi-shield-check"></i>
            Dashboard Manajemen
          </h1>
          <p className={styles.subtitle}>Man IC OKI - Administrator Panel</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleBroadcast} className={styles.btnPrimary} type="button">
            <i className="bi bi-megaphone"></i>
            Broadcast
          </button>
          <button onClick={() => handleExport('users')} className={styles.btnSecondary} type="button">
            <i className="bi bi-download"></i>
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #2196f3, #1976d2)' }}>
              <i className="bi bi-people"></i>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.total_users.toLocaleString('id-ID')}</span>
              <span className={styles.statLabel}>Total Pengguna</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #4a7c23, #8bc34a)' }}>
              <i className="bi bi-building"></i>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.total_schools.toLocaleString('id-ID')}</span>
              <span className={styles.statLabel}>Sekolah Terdaftar</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ff9800, #f57c00)' }}>
              <i className="bi bi-arrow-repeat"></i>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.total_transactions.toLocaleString('id-ID')}</span>
              <span className={styles.statLabel}>Total Transaksi</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)' }}>
              <i className="bi bi-trophy"></i>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.total_eco_score.toLocaleString('id-ID')}</span>
              <span className={styles.statLabel}>Total Eco-Score</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #00bcd4, #0097a7)' }}>
              <i className="bi bi-tree"></i>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.total_carbon_saved.toFixed(1)} kg</span>
              <span className={styles.statLabel}>CO₂ Dikurangi</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #4caf50, #388e3c)' }}>
              <i className="bi bi-person-check"></i>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.active_users_today.toLocaleString('id-ID')}</span>
              <span className={styles.statLabel}>Aktif Hari Ini</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="bi bi-grid"></i>
          Overview
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'schools' ? styles.active : ''}`}
          onClick={() => setActiveTab('schools')}
        >
          <i className="bi bi-building"></i>
          Performa Sekolah
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'activities' ? styles.active : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          <i className="bi bi-activity"></i>
          Aktivitas Terkini
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewContent}>
            <h3>Quick Actions</h3>
            <div className={styles.quickActions}>
              <button onClick={handleBroadcast} className={styles.actionCard} type="button">
                <i className="bi bi-megaphone"></i>
                <span>Broadcast Message</span>
              </button>
              <button onClick={() => handleExport('users')} className={styles.actionCard} type="button">
                <i className="bi bi-people"></i>
                <span>Export Users</span>
              </button>
              <button onClick={() => handleExport('activities')} className={styles.actionCard} type="button">
                <i className="bi bi-activity"></i>
                <span>Export Activities</span>
              </button>
              <button onClick={() => handleExport('schools')} className={styles.actionCard} type="button">
                <i className="bi bi-building"></i>
                <span>Export Schools</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'schools' && (
          <div className={styles.schoolsList}>
            <h3>Top 10 Sekolah Berdasarkan Eco-Score</h3>
            {schools.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>
                Tidak ada data sekolah
              </p>
            ) : (
              schools.map((school, index) => (
                <div key={school.school_id} className={styles.schoolCard}>
                  <div className={styles.rank}>#{index + 1}</div>
                  <div className={styles.schoolInfo}>
                    <h4>{school.school_name}</h4>
                    <div className={styles.schoolStats}>
                      <span><i className="bi bi-trophy"></i> {school.eco_score.toLocaleString('id-ID')} points</span>
                      <span><i className="bi bi-tree"></i> {school.carbon_saved.toFixed(1)} kg CO₂</span>
                      <span><i className="bi bi-people"></i> {school.active_users} pengguna</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className={styles.activitiesList}>
            <h3>20 Aktivitas Terkini</h3>
            {activities.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>
                Tidak ada aktivitas
              </p>
            ) : (
              activities.map((activity, index) => (
                <div key={`${activity.user_id}-${index}`} className={styles.activityCard}>
                  <div className={styles.activityIcon}>
                    {activity.activity_type === 'pesanan' && <i className="bi bi-cart"></i>}
                    {activity.activity_type === 'pengiriman' && <i className="bi bi-truck"></i>}
                    {activity.activity_type === 'diterima' && <i className="bi bi-check-circle"></i>}
                    {activity.activity_type === 'batal' && <i className="bi bi-x-circle"></i>}
                  </div>
                  <div className={styles.activityInfo}>
                    <h4>{activity.description}</h4>
                    <p>
                      <span className={styles.userName}>{activity.user_name}</span>
                      <span className={styles.separator}>•</span>
                      <span className={styles.schoolName}>{activity.school_name}</span>
                      <span className={styles.separator}>•</span>
                      <span className={styles.activityTime}>
                        {new Date(activity.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}