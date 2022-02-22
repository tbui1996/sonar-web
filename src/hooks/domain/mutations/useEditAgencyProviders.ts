import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient
} from 'react-query';
import { AxiosResponse } from 'axios';
import axiosInstance from '../../../utils/axios';
import {
  useGetAgencyProvidersKey,
  AgencyProviderDetails
} from '../queries/useGetAgencyProviders';

const useEditAgencyProvider = (
  options: UseMutationOptions<AxiosResponse, string, AgencyProviderDetails> = {}
): UseMutationResult<AxiosResponse, string, AgencyProviderDetails> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, AgencyProviderDetails>(
    (request) =>
      axiosInstance.put(`/agency_provider/${request.agencyProviderId}`, {
        agencyProviderId: request.agencyProviderId,
        doddNumber: request.doddNumber,
        nationalProviderId: request.nationalProviderId,
        firstName: request.firstName,
        middleName: request.middleName,
        lastName: request.lastName,
        suffix: request.suffix,
        businessName: request.businessName,
        businessTIN: request.businessTIN,
        businessAddress1: request.businessAddress1,
        businessAddress2: request.businessAddress2,
        businessCity: request.businessCity,
        businessState: request.businessState,
        businessZip: request.businessZip,
        createdTimestamp: request.createdTimestamp,
        lastModifiedTimestamp: request.lastModifiedTimestamp
      }),
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        options.onSuccess?.(data, variables, context);
        queryClient.invalidateQueries(useGetAgencyProvidersKey);
      }
    }
  );
};

export default useEditAgencyProvider;
