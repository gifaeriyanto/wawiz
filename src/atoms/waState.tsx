import capitalize from 'capitalize';
import { atom, selector } from 'recoil';

export const waState = atom({
  key: 'waState',
  default: 'Initializing...',
});

export const waStateFormatted = selector({
  key: 'waStateFormatted',
  get: ({ get }) => {
    const status = get(waState);
    return capitalize(status.replace(/_/g, ' '));
  },
});

export const waQrCode = atom({
  key: 'waQrCode',
  default: '',
});
