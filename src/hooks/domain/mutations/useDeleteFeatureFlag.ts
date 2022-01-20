import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient
} from 'react-query';
import { AxiosResponse } from 'axios';
import axiosInstance from '../../../utils/axios';
import { useGetFeatureFlagsKey } from '../queries/useGetFeatureFlags';
import { useEvaluateFeatureFlagsKey } from '../queries/useEvaluateFeatureFlags';

export interface DeleteFeatureFlagRequest {
  id: number;
}

const useDeleteFeatureFlag = (
  options: UseMutationOptions<
    AxiosResponse,
    string,
    DeleteFeatureFlagRequest
  > = {}
): UseMutationResult<AxiosResponse, string, DeleteFeatureFlagRequest> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, DeleteFeatureFlagRequest>(
    (request) => axiosInstance.delete(`/flags/${request.id}`),
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        options.onSuccess?.(data, variables, context);
        queryClient.invalidateQueries(useGetFeatureFlagsKey);
        queryClient.invalidateQueries(useEvaluateFeatureFlagsKey);
      }
    }
  );
};

export default useDeleteFeatureFlag;
