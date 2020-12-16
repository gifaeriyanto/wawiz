import { atom } from 'recoil';

export const broadcastListState = atom<number | undefined>({
  key: 'broadcastListState',
  default: undefined,
});
