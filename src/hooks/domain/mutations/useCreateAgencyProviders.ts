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

const useCreateAgencyProviders = (
  options: UseMutationOptions<AxiosResponse, string, AgencyProviderDetails> = {}
): UseMutationResult<AxiosResponse, string, AgencyProviderDetails> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, AgencyProviderDetails>(
    (request: AgencyProviderDetails) =>
      axiosInstance.post('/agency_provider', request),
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        options.onSuccess?.(data, variables, context);
        await queryClient.invalidateQueries(useGetAgencyProvidersKey);
      }
    }
  );
};

export default useCreateAgencyProviders;
