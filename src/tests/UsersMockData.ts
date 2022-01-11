export const testOrg = {
  id: 1,
  name: 'Fake Org'
};

export const getUserWithOrgAndGroup = (
  includeOrg: boolean,
  includeGroup: boolean
) => ({
  id: '1',
  username: 'username',
  email: 'username@circulohealth.com',
  firstName: 'John',
  lastName: 'Smith',
  organization: includeOrg ? testOrg : null,
  group: includeGroup ? 'externals_supervisor' : '',
  sub: 'test',
  displayName: 'username'
});
