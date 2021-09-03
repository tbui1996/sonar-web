export type Users = {
  users: User[];
  paginationToken: string;
};

export interface User {
  email: string;
  firstName: string | null;
  lastName: string | null;
  organization: string | null;
  group: string;
  sub: string;
}
