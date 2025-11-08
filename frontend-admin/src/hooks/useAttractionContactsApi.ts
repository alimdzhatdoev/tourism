import { Attraction, AttractionContact, Contact } from '@app/core/models';
import ContactKind from '@app/core/models/ContactKind';
import {
  useCreateAttractionContactMutation,
  useDeleteAttractionContactMutation,
} from '@app/core/store/attractions_contacts';
import { useLazyGetContackKindsListQuery } from '@app/core/store/contact_kinds';
import {
  useCreateContactMutation,
  useDeleteContactMutation,
  useUpdateContactMutation,
} from '@app/core/store/contacts';
import { useCallback, useMemo } from 'react';

type MixedData = Record<any, any>;
type InitialData = { name: string; value: string };
type CreateData = InitialData & { kind: ContactKind['id'] };

type UpdateData = {
  contactId: Contact['id'];
  kind: ContactKind['id'];
  value: string;
};

type DeleteData = {
  contactId: Contact['id'];
  attractionContactId: AttractionContact['id'];
};

type Updates = {
  toCreate: Array<InitialData>;
  toUpdate: Array<UpdateData>;
  toDelete: Array<DeleteData>;
};

const INITIAL_UPDATES: Updates = {
  toCreate: [],
  toUpdate: [],
  toDelete: [],
};

const CONTACT_KIND_NAMES = ['phone', 'website', 'email', 'whatsapp', 'social'];

const getInitialData = (mixedData: MixedData) => {
  return Object.entries(mixedData).reduce((acc, [key, value]) => {
    if (CONTACT_KIND_NAMES.includes(key)) {
      return [...acc, { name: key, value }];
    } else {
      return acc;
    }
  }, [] as Array<InitialData>);
};

const getCreateData = (
  initialData: Array<InitialData>,
  contactKinds: Array<ContactKind>,
) => {
  return initialData.reduce((acc, cur) => {
    if (!cur.value) return acc;

    const foundKind = contactKinds.find(kind => kind.name === cur.name);

    if (foundKind) {
      return [...acc, { ...cur, kind: foundKind.id }];
    } else {
      return acc;
    }
  }, [] as Array<CreateData>);
};

export const useAttractionContactsApi = () => {
  const [getContactKinds] = useLazyGetContackKindsListQuery();

  const [createContact] = useCreateContactMutation();
  const [updateContact] = useUpdateContactMutation();
  const [deleteContact] = useDeleteContactMutation();

  const [createAttractionContact] = useCreateAttractionContactMutation();
  const [deleteAttractionContact] = useDeleteAttractionContactMutation();

  const createContacts = useCallback(
    async (initialData: Array<InitialData>, attraction: Attraction) => {
      if (!initialData.length) return;

      const contactKindsResponse = await getContactKinds({
        size: 9999,
      }).unwrap();

      const contactKinds = contactKindsResponse.data.results;

      const createData = getCreateData(initialData, contactKinds);

      if (!createData.length) return;

      await Promise.all(
        createData.map(async data => {
          const createContactResponse = await createContact({
            kind: data.kind,
            value: data.value,
          }).unwrap();

          const newContactId = createContactResponse.data.id;

          await createAttractionContact({
            attraction: attraction.id,
            contact: newContactId,
          }).unwrap();
        }),
      );
    },
    [createAttractionContact, createContact, getContactKinds],
  );

  const create = useCallback(
    async (mixedData: MixedData, attraction: Attraction) => {
      const initialData = getInitialData(mixedData);
      await createContacts(initialData, attraction);
    },
    [createContacts],
  );

  const update = useCallback(
    async (mixedData: MixedData, attraction: Attraction) => {
      const initialData = getInitialData(mixedData);

      if (!initialData.length && !attraction.contacts.length) return;

      const updates = initialData.reduce((acc, cur) => {
        const oldContact = attraction.contacts.find(
          contact => contact.contact.kind.name === cur.name,
        );

        if (
          oldContact && // Существует старый
          Boolean(cur.value) && // Не пустое значение
          oldContact.contact.value !== cur.value // Значения различаются
        ) {
          return {
            ...acc,
            toUpdate: [
              ...acc.toUpdate,
              {
                value: cur.value,
                contactId: oldContact.contact.id,
                kind: oldContact.contact.kind.id,
              },
            ],
          };
        }

        if (
          oldContact && // Существует старый
          !cur.value // Пустое значение
        ) {
          return {
            ...acc,
            toDelete: [
              ...acc.toDelete,
              {
                contactId: oldContact.contact.id,
                attractionContactId: oldContact.id,
              },
            ],
          };
        }

        if (
          !oldContact && // Отсутствует старый
          Boolean(cur.value) // Не пустое значение
        ) {
          return {
            ...acc,
            toCreate: [...acc.toCreate, cur],
          };
        }

        // oldContact && // Существует старый
        // Boolean(cur.value) && // Не пустое значение
        // oldContact.contact.value === cur.value // Значения совпадают
        return acc;
      }, INITIAL_UPDATES);

      await createContacts(updates.toCreate, attraction);

      await Promise.all(
        updates.toUpdate.map(contact =>
          updateContact({
            id: contact.contactId,
            ...contact,
          }).unwrap(),
        ),
      );

      await Promise.all(
        updates.toDelete.map(async contact => {
          await deleteAttractionContact({
            id: contact.attractionContactId,
          }).unwrap();

          await deleteContact({
            id: contact.contactId,
          }).unwrap();
        }),
      );
    },
    [createContacts, deleteAttractionContact, deleteContact, updateContact],
  );

  return useMemo(
    () => ({
      create,
      update,
    }),
    [create, update],
  );
};
