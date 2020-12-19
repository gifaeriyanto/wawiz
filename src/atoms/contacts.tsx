import { RecipientData } from 'interfaces/broadcast';
import { atom, selector } from 'recoil';

export const contactsAtom = atom<RecipientData[]>({
  key: 'contacts',
  default: [],
});

export const contactsAtomSelected = atom<RecipientData[]>({
  key: 'contactsSelected',
  default: [],
});

export const contactsAtomNotSelected = selector({
  key: 'contactsNotSelected',
  get: ({ get }) => {
    const contacts = get(contactsAtom);
    const contactsSelected = get(contactsAtomSelected);
    const result = contacts.filter((contact) => {
      const index = contactsSelected.findIndex(
        (item) => item.id === contact.id,
      );
      return index === -1;
    });
    return result;
  },
});
