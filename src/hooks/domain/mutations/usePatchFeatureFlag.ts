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

export interface PatchFeatureFlagRequest {
  name?: string;
  isEnabled?: boolean;
  id: number;
}

const usePatchFeatureFlag = (
  options: UseMutationOptions<
    AxiosResponse,
    string,
    PatchFeatureFlagRequest
  > = {}
): UseMutationResult<AxiosResponse, string, PatchFeatureFlagRequest> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, PatchFeatureFlagRequest>(
    (request) =>
      axiosInstance.patch(`/flags/${request.id}`, {
        name: request.name,
        isEnabled: request.isEnabled
      }),
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

export default usePatchFeatureFlag;
