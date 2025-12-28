import { supabase } from '../lib/supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  school_id?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  school_id: string | null;
  role: string;
  eco_score: number;
  email_verified: boolean;
}

export const authService = {
  // Register new user dengan Supabase Auth
  async register(data: RegisterData): Promise<{ user: User | null; error: string | null }> {
    try {
      // 1. Register dengan Supabase Auth (akan kirim verification email otomatis)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            school_id: data.school_id || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (signUpError) {
        return { user: null, error: signUpError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Registrasi gagal' };
      }

      // 2. Insert ke tabel users (untuk data tambahan)
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id, // Gunakan ID dari Supabase Auth
          email: data.email.toLowerCase().trim(),
          full_name: data.full_name,
          school_id: data.school_id || null,
          role: 'student',
          eco_score: 0,
          email_verified: false,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Insert user error:', insertError);
        // Rollback: hapus user dari auth jika insert gagal
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { user: null, error: 'Gagal menyimpan data user' };
      }

      // Return user data (email belum terverifikasi)
      const newUser: User = {
        id: authData.user.id,
        email: data.email.toLowerCase().trim(),
        full_name: data.full_name,
        school_id: data.school_id || null,
        role: 'student',
        eco_score: 0,
        email_verified: false,
      };

      return { user: newUser, error: null };
    } catch (error) {
      console.error('Register error:', error);
      return { user: null, error: 'Terjadi kesalahan saat registrasi' };
    }
  },

  // Login dengan Supabase Auth
  async login(credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
    try {
      // 1. Login dengan Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password,
      });

      if (signInError) {
        return { user: null, error: 'Email atau password salah' };
      }

      if (!authData.user) {
        return { user: null, error: 'Login gagal' };
      }

      // 2. Cek verifikasi email
      if (!authData.user.email_confirmed_at) {
        await supabase.auth.signOut();
        return { user: null, error: 'Email belum diverifikasi. Silakan cek inbox Anda.' };
      }

      // 3. Ambil data lengkap dari tabel users
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (fetchError || !userData) {
        console.error('Fetch user error:', fetchError);
        return { user: null, error: 'Gagal mengambil data user' };
      }

      // 4. Update last_login dan email_verified
      await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          email_verified: true 
        })
        .eq('id', authData.user.id);

      // 5. Return user data
      const user: User = {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        school_id: userData.school_id,
        role: userData.role,
        eco_score: userData.eco_score,
        email_verified: true,
      };

      return { user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'Terjadi kesalahan saat login' };
    }
  },

  // Logout
  async logout() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current user dari Supabase session
  async getCurrentUser(): Promise<User | null> {
    try {
      // 1. Cek session Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }

      // 2. Cek verifikasi email
      if (!session.user.email_confirmed_at) {
        return null;
      }

      // 3. Ambil data lengkap dari tabel users
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || !userData) {
        return null;
      }

      return {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        school_id: userData.school_id,
        role: userData.role,
        eco_score: userData.eco_score,
        email_verified: userData.email_verified || false,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  },

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Resend verification error:', error);
      return { error: 'Gagal mengirim ulang email verifikasi' };
    }
  },

  // Handle email verification callback
  async handleEmailVerification(): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        return { success: false, error: 'Verifikasi gagal' };
      }

      // Update email_verified di tabel users
      await supabase
        .from('users')
        .update({ email_verified: true })
        .eq('id', session.user.id);

      return { success: true, error: null };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'Terjadi kesalahan saat verifikasi' };
    }
  }
};