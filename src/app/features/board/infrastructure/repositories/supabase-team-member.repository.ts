import {Injectable, inject} from '@angular/core';
import {TeamMemberRepository} from '../../domain/repositories/team-member.repository';
import {SupabaseService} from '../../../../core/services/supabase';
import {TeamMember} from '../../models/board.models';

@Injectable({
	providedIn: 'root',
})
export class SupabaseTeamMemberRepository implements TeamMemberRepository {
	private supabase = inject(SupabaseService).client;

	async getAll(): Promise<TeamMember[]> {
		try {
			const {data, error} = await this.supabase
				.from('team_members')
				.select('id, name, avatar_url, role')
				.order('name', {ascending: true});

			if (error) throw error;
			return data ?? [];
		} catch (error) {
			console.error('Error fetching team members:', error);
			return [];
		}
	}
}
