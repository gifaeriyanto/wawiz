import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { API, APIPaths } from 'utils/api';

interface UseQrCodeResult {
  qrCode: string;
}

export const useQrCode = (waStatus: string) => {
  return useQuery(
    ['qr-code', waStatus],
    async () => {
      const res: AxiosResponse<UseQrCodeResult> = await API.get(
        APIPaths.qrCode,
      );
      return res.data.qrCode;
    },
    {
      enabled: !!waStatus,
      refetchInterval: waStatus === 'CONNECTED' ? false : 1000,
      refetchIntervalInBackground: true,
    },
  );
};
