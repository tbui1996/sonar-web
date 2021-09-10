import { User } from '../@types/users';

export default function mapUserDisplayName(users: User[]): User[] {
  return users.map((u: User) => {
    u.displayName = `${u.firstName || u.email} ${
      u.firstName && u.lastName ? u.lastName : ''
    }`;
    return u;
  });
}
