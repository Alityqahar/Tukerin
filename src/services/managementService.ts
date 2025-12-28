// Layanan untuk fitur manajemen (dashboard admin, statistik, notifikasi, ekspor data)
import { supabase } from '../lib/supabase';
import Swal from 'sweetalert2';

// Tipe data statistik manajemen
export interface ManagementStats {
total_users: number;
total_schools: number;
total_transactions: number;
total_eco_score: number;
total_carbon_saved: number;
active_users_today: number;
pending_approvals: number;
}

// Tipe data performa sekolah
export interface SchoolPerformance {
school_id: string;
school_name: string;
eco_score: number;
carbon_saved: number;
total_activities: number;
active_users: number;
}

// Tipe data aktivitas pengguna
export interface UserActivity {
user_id: string;
user_name: string;
school_name: string;
activity_type: string;
description: string;
created_at: string;
}

export const managementService = {
/**
 * Mengecek apakah user memiliki akses manajemen.
 * @param userId ID pengguna
 * @returns Promise<boolean>
 */
async hasManagementAccess(userId: string): Promise<boolean> {
try {
    const { data, error } = await supabase
    .from('users')
    .select('is_management')
    .eq('id', userId)
    .single();

    if (error || !data) return false;
    return data.is_management === true;
} catch (error) {
    console.error('Check management access error:', error);
    return false;
}
},

/**
 * Mengambil statistik dashboard manajemen.
 * @returns Promise<ManagementStats>
 */
async getManagementStats(): Promise<ManagementStats> {
try {
    // Hitung total pengguna
    const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

    // Hitung total sekolah
    const { count: totalSchools } = await supabase
    .from('schools')
    .select('*', { count: 'exact', head: true });

    // Hitung total aktivitas/transaksi
    const { count: totalTransactions } = await supabase
    .from('activities')
    .select('*', { count: 'exact', head: true });

    // Akumulasi eco_score dan carbon_saved dari semua user
    const { data: ecoData } = await supabase
    .from('users')
    .select('eco_score, carbon_saved');

    const totalEcoScore = ecoData?.reduce((sum, user) => sum + (user.eco_score || 0), 0) || 0;
    const totalCarbon = ecoData?.reduce((sum, user) => sum + (user.carbon_saved || 0), 0) || 0;

    // Hitung pengguna aktif hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: activeToday } = await supabase
    .from('activities')
    .select('user_id', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

    // Hitung notifikasi yang belum dibaca dan deadline di masa depan
    const { count: pendingApprovals } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)
    .gte('deadline', new Date().toISOString());

    return {
    total_users: totalUsers || 0,
    total_schools: totalSchools || 0,
    total_transactions: totalTransactions || 0,
    total_eco_score: totalEcoScore,
    total_carbon_saved: totalCarbon,
    active_users_today: activeToday || 0,
    pending_approvals: pendingApprovals || 0
    };
} catch (error) {
    console.error('Get management stats error:', error);
    return {
    total_users: 0,
    total_schools: 0,
    total_transactions: 0,
    total_eco_score: 0,
    total_carbon_saved: 0,
    active_users_today: 0,
    pending_approvals: 0
    };
}
},

/**
 * Mengambil performa sekolah (top N berdasarkan eco_score).
 * @param limit Jumlah sekolah yang diambil
 * @returns Promise<SchoolPerformance[]>
 */
async getSchoolPerformance(limit = 10): Promise<SchoolPerformance[]> {
try {
    const { data: schools, error } = await supabase
    .from('schools')
    .select(`
        id,
        name,
        users (
        eco_score,
        carbon_saved
        )
    `)
    .limit(limit);

    if (error || !schools) return [];

    const performance = schools.map(school => {
    // Akumulasi eco_score dan carbon_saved dari semua user di sekolah
    const users = school.users || [];
    const totalEcoScore = users.reduce((sum: number, u: any) => sum + (u.eco_score || 0), 0);
    const totalCarbon = users.reduce((sum: number, u: any) => sum + (u.carbon_saved || 0), 0);

    return {
        school_id: school.id,
        school_name: school.name,
        eco_score: totalEcoScore,
        carbon_saved: totalCarbon,
        total_activities: 0, // Belum diimplementasikan
        active_users: users.length
    };
    });

    // Urutkan berdasarkan eco_score tertinggi
    return performance.sort((a, b) => b.eco_score - a.eco_score);
} catch (error) {
    console.error('Get school performance error:', error);
    return [];
}
},

/**
 * Mengambil seluruh aktivitas pengguna (untuk tampilan manajemen).
 * @param limit Jumlah aktivitas yang diambil
 * @returns Promise<UserActivity[]>
 */
async getAllActivities(limit = 50): Promise<UserActivity[]> {
try {
    const { data, error } = await supabase
    .from('activities')
    .select(`
        user_id,
        type,
        description,
        created_at,
        users (
        full_name,
        schools (
            name
        )
        )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

    if (error || !data) return [];

    return data.map(activity => ({
    user_id: activity.user_id,
    user_name: activity.users?.[0]?.full_name || 'Unknown',
    school_name: activity.users?.[0]?.schools?.[0]?.name || 'N/A',
    activity_type: activity.type,
    description: activity.description,
    created_at: activity.created_at
    }));
} catch (error) {
    console.error('Get all activities error:', error);
    return [];
}
},

/**
 * Mengirim notifikasi ke user tertentu dengan konfirmasi SweetAlert.
 * @param userId ID pengguna
 * @param title Judul notifikasi
 * @param message Isi pesan
 * @param deadline Deadline opsional
 * @returns Promise<boolean>
 */
async sendNotification(
userId: string,
title: string,
message: string,
deadline?: string
): Promise<boolean> {
try {
    // Konfirmasi sebelum mengirim notifikasi
    const result = await Swal.fire({
    title: 'Kirim Notifikasi?',
    html: `
        <div style="text-align: left;">
        <p><strong>Judul:</strong> ${title}</p>
        <p><strong>Pesan:</strong> ${message}</p>
        ${deadline ? `<p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString('id-ID')}</p>` : ''}
        </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4a7c23',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, Kirim',
    cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return false;

    const { error } = await supabase
    .from('notifications')
    .insert({
        user_id: userId,
        title,
        message,
        deadline: deadline || null,
        is_read: false,
        created_at: new Date().toISOString()
    });

    if (error) {
    await Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim',
        text: 'Terjadi kesalahan saat mengirim notifikasi',
        timer: 2000,
        showConfirmButton: false
    });
    return false;
    }

    await Swal.fire({
    icon: 'success',
    title: 'Notifikasi Terkirim!',
    text: 'Notifikasi berhasil dikirim ke pengguna',
    timer: 2000,
    showConfirmButton: false
    });

    return true;
} catch (error) {
    console.error('Send notification error:', error);
    await Swal.fire({
    icon: 'error',
    title: 'Terjadi Kesalahan',
    text: 'Gagal mengirim notifikasi',
    timer: 2000,
    showConfirmButton: false
    });
    return false;
}
},

/**
 * Broadcast notifikasi ke seluruh user (atau filter role tertentu).
 * @param title Judul notifikasi
 * @param message Isi pesan
 * @param roleFilter Filter berdasarkan role (opsional)
 * @returns Promise<boolean>
 */
async broadcastNotification(
title: string,
message: string,
roleFilter?: string[]
): Promise<boolean> {
try {
    const result = await Swal.fire({
    title: 'Kirim Broadcast?',
    html: `
        <div style="text-align: left;">
        <p><strong>Judul:</strong> ${title}</p>
        <p><strong>Pesan:</strong> ${message}</p>
        <p><strong>Target:</strong> ${roleFilter?.join(', ') || 'Semua pengguna'}</p>
        </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4a7c23',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, Broadcast',
    cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return false;

    // Ambil daftar user target
    let query = supabase.from('users').select('id');
    if (roleFilter && roleFilter.length > 0) {
    query = query.in('role', roleFilter);
    }

    const { data: users, error: fetchError } = await query;

    if (fetchError || !users) {
    await Swal.fire({
        icon: 'error',
        title: 'Gagal Broadcast',
        text: 'Tidak dapat mengambil daftar pengguna',
        timer: 2000,
        showConfirmButton: false
    });
    return false;
    }

    // Siapkan data notifikasi untuk setiap user
    const notifications = users.map(user => ({
    user_id: user.id,
    title,
    message,
    deadline: null,
    is_read: false,
    created_at: new Date().toISOString()
    }));

    const { error } = await supabase
    .from('notifications')
    .insert(notifications);

    if (error) {
    await Swal.fire({
        icon: 'error',
        title: 'Gagal Broadcast',
        text: 'Terjadi kesalahan saat mengirim broadcast',
        timer: 2000,
        showConfirmButton: false
    });
    return false;
    }

    await Swal.fire({
    icon: 'success',
    title: 'Broadcast Berhasil!',
    text: `Notifikasi berhasil dikirim ke ${users.length} pengguna`,
    timer: 2500,
    showConfirmButton: false
    });

    return true;
} catch (error) {
    console.error('Broadcast notification error:', error);
    await Swal.fire({
    icon: 'error',
    title: 'Terjadi Kesalahan',
    text: 'Gagal mengirim broadcast',
    timer: 2000,
    showConfirmButton: false
    });
    return false;
}
},

/**
 * Mengekspor data (users, activities, schools) ke file CSV.
 * @param dataType Jenis data yang diekspor
 * @returns Promise<boolean>
 */
async exportData(dataType: 'users' | 'activities' | 'schools'): Promise<boolean> {
try {
    await Swal.fire({
    title: 'Mengekspor Data...',
    html: 'Mohon tunggu sebentar',
    allowOutsideClick: false,
    didOpen: () => {
        Swal.showLoading();
    }
    });

    let data: any[] = [];

    // Ambil data sesuai tipe yang dipilih
    switch (dataType) {
    case 'users': {
        const { data: users } = await supabase.from('users').select('*');
        data = users || [];
        break;
    }
    case 'activities': {
        const { data: activities } = await supabase.from('activities').select('*');
        data = activities || [];
        break;
    }
    case 'schools': {
        const { data: schools } = await supabase.from('schools').select('*');
        data = schools || [];
        break;
    }
    }

    if (data.length === 0) {
    await Swal.fire({
        icon: 'info',
        title: 'Tidak Ada Data',
        text: 'Tidak ada data untuk diekspor',
        timer: 2000,
        showConfirmButton: false
    });
    return false;
    }

    // Konversi data ke format CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
    Object.values(row).map(val =>
        typeof val === 'string' ? `"${val}"` : val
    ).join(',')
    );
    const csv = [headers, ...rows].join('\n');

        // Proses download file CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dataType}_${new Date().toISOString()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        await Swal.fire({
        icon: 'success',
        title: 'Ekspor Berhasil!',
        text: `Data ${dataType} berhasil diekspor`,
        timer: 2000,
        showConfirmButton: false
        });

        return true;
    } catch (error) {
        console.error('Export data error:', error);
        await Swal.fire({
        icon: 'error',
        title: 'Ekspor Gagal',
        text: 'Terjadi kesalahan saat mengekspor data',
        timer: 2000,
        showConfirmButton: false
        });
        return false;
    }
    }
};