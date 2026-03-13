import {Injectable} from '@angular/core';
import {createClient, SupabaseClient, User} from '@supabase/supabase-js';
import {environment} from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class SupabaseService {
	private supabase: SupabaseClient;

	constructor() {
		this.supabase = createClient(
			environment.supabaseUrl,
			environment.supabaseKey,
		);
	}

	get client(): SupabaseClient {
		return this.supabase;
	}

	async initializeAnonymousSession(): Promise<User | null> {
		try {
			const {data: sessionData} = await this.supabase.auth.getSession();

			if (sessionData.session) {
				console.log(
					'Visitor already had an active session:',
					sessionData.session.user.id,
				);
				return sessionData.session.user;
			}

			const {data, error} = await this.supabase.auth.signInAnonymously();

			if (error) throw error;

			console.log('New phantom visitor authenticated!', data.user?.id);
			return data.user;
		} catch (error) {
			console.error('Error in anonymous authentication:', error);
			return null;
		}
	}

	async createDemoBoard(visitorId: string): Promise<string | null> {
		try {
			const {data, error} = await this.supabase.rpc('create_demo_board', {
				new_visitor_id: visitorId,
			});

			if (error) throw error;

			console.log('Demo board successfully generated! Board ID:', data);
			return data;
		} catch (error) {
			console.error('Error creating demo board:', error);
			return null;
		}
	}

	async getUserBoard(userId: string): Promise<string | null> {
		try {
			const {data, error} = await this.supabase
				.from('boards')
				.select('id')
				.eq('visitor_id', userId)
				.order('created_at', {ascending: false})
				.limit(1)
				.maybeSingle();

			if (error) throw error;

			return data ? data.id : null;
		} catch (error) {
			console.error('Error crítico buscando el tablero del visitante:', error);
			return null;
		}
	}
}
