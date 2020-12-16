import { atom, selector } from 'recoil';
import { auth } from 'utils/firebase';

export const authState = atom<'initializing' | 'auth' | 'un-auth'>({
  key: 'authState',
  default: 'initializing',
});

export const userData = selector({
  key: 'userData',
  get: async ({ get }) => {
    const authStatus = get(authState);
    if (authStatus === 'auth') {
      return {
        data: auth.currentUser,
      };
    } else {
      return {
        data: null,
      };
    }
  },
});
