import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axiosInstance from '../../../utils/axios';

export interface FeatureFlagResponse {
  id: number;
  key: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  updatedBy: string;
  createdBy: string;
  isEnabled: boolean;
}

export const useGetFeatureFlagsKey = 'get-feature-flags';

interface ResultWrapper<T> {
  result: T;
}

const useGetFeatureFlags = (
  options: UseQueryOptions<FeatureFlagResponse[], string> = {}
): UseQueryResult<FeatureFlagResponse[], string> =>
  useQuery<FeatureFlagResponse[], string>(
    useGetFeatureFlagsKey,
    async () =>
      (await axiosInstance.get<ResultWrapper<FeatureFlagResponse[]>>('/flags'))
        .data.result,
    options
  );

export default useGetFeatureFlags;
