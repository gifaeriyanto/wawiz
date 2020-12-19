import { AxiosResponse } from 'axios';
import { RecipientData } from 'interfaces/broadcast';
import { useQuery } from 'react-query';
import { API } from 'utils/api';

export interface UseContactsParams {
  page: number;
  query: string;
}

export interface UseContactsResponse {
  hasMore: boolean;
  data: RecipientData[];
  totalData: number;
  totalPage: number;
}

export const useContacts = (params: UseContactsParams) => {
  return useQuery(
    ['contactsData', params],
    async () => {
      const res: AxiosResponse<UseContactsResponse> = await API.get(
        `/contacts/${params.page}/${params.query}`,
      );
      const parsed = (res.data.data || []).map((item: any) => {
        return {
          id: item.id._serialized,
          name: item.name,
          number: item.id.user,
        } as RecipientData;
      });
      return {
        ...res.data,
        data: parsed,
      };
    },
    {
      enabled: !!params,
    },
  );
};
