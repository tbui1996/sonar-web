export type Users = {
  users: User[];
  paginationToken: string;
};

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  group: string;
  sub: string;
}
