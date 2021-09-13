import { capitalize } from 'lodash';

// ----------------------------------------------------------------------

function getFirstCharacter(name: string) {
  return capitalize(name && name.charAt(0));
}

export default function createAvatar(name: string) {
  return {
    name: getFirstCharacter(name),
    color: 'primary'
  } as const;
}
