export type Users = {
  users: User[];
  paginationToken: string;
};

export interface Organization {
  id: number;
  name: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  organization: Organization | null;
  group: string;
  sub: string;
  displayName: string;
}

export interface EditUserProps {
  user?: User;
  users?: Users;
  organizations?: Organization[];
  handleClick: (user?: User) => void;
  setEditView: (val: boolean) => void;
  setUser: (user?: User) => void;
  setUsers: (users?: Users) => void;
}
