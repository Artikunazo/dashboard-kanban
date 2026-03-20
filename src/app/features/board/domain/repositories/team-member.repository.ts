import { TeamMember } from '../../models/board.models';

export abstract class TeamMemberRepository {
  abstract getAll(): Promise<TeamMember[]>;
}
