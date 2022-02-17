import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axiosInstance from '../../../utils/axios';

interface ResultWrapper<T> {
  result: T;
}

export interface AgencyProviderDetails {
  agencyProviderId: string;
  nationalProviderId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  businessName: string;
  businessTIN: string;
  businessAddress1: string;
  businessAddress2: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  createdTimestamp: string;
  lastModifiedTimestamp: string;
}

export const useGetAgencyProvidersKey = 'get-agency-providers';

const useGetAgencyProviders = (
  options: UseQueryOptions<AgencyProviderDetails[], string> = {}
): UseQueryResult<AgencyProviderDetails[], string> =>
  useQuery<AgencyProviderDetails[], string>(
    useGetAgencyProvidersKey,
    async () =>
      (
        await axiosInstance.get<ResultWrapper<AgencyProviderDetails[]>>(
          '/agency_provider'
        )
      ).data.result,
    options
  );

export default useGetAgencyProviders;
