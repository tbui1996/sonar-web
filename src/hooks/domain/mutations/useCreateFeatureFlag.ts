import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient
} from 'react-query';
import { AxiosResponse } from 'axios';
import axiosInstance from '../../../utils/axios';
import { useGetFeatureFlagsKey } from '../queries/useGetFeatureFlags';

export interface CreateFeatureFlagRequest {
  name: string;
  key: string;
}

const useCreateFeatureFlag = (
  options: UseMutationOptions<
    AxiosResponse,
    string,
    CreateFeatureFlagRequest
  > = {}
): UseMutationResult<AxiosResponse, string, CreateFeatureFlagRequest> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, CreateFeatureFlagRequest>(
    (request: CreateFeatureFlagRequest) =>
      axiosInstance.post('/flags', request),
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        options.onSuccess?.(data, variables, context);
        await queryClient.invalidateQueries(useGetFeatureFlagsKey);
      }
    }
  );
};

export default useCreateFeatureFlag;
