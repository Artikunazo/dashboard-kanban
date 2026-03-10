import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  async initializeAnonymousSession(): Promise<User | null> {
    try {
      const { data: sessionData } = await this.supabase.auth.getSession();

      if (sessionData.session) {
        console.log('Visitor already had an active session:', sessionData.session.user.id);
        return sessionData.session.user;
      }

      const { data, error } = await this.supabase.auth.signInAnonymously();

      if (error) throw error;

      console.log('New phantom visitor authenticated!', data.user?.id);
      return data.user;

    } catch (error) {
      console.error('Error in anonymous authentication:', error);
      return null;
    }
  }
}