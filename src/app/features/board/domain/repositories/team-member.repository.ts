import {TeamMember} from '../../models/board.models';

/** Port for fetching team members — used to populate the assignee picker. */
export abstract class TeamMemberRepository {
	abstract getAll(): Promise<TeamMember[]>;
}
