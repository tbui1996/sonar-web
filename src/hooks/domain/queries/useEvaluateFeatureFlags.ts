import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axiosInstance from '../../../utils/axios';

type FlagEvaluationResults = Record<string, boolean>;

interface EvaluationOptions {
  defaultFlagValues?: FlagEvaluationResults;
}

export type UseEvaluateFeatureFlagsOptions = UseQueryOptions<
  FlagEvaluationResults,
  string
> &
  EvaluationOptions;

export const useEvaluateFeatureFlagsKey = 'evaluate-feature-flags';

const useEvaluateFeatureFlags = ({
  defaultFlagValues = {},
  ...queryOptions
}: UseEvaluateFeatureFlagsOptions = {}): UseQueryResult<
  FlagEvaluationResults,
  string
> =>
  useQuery<FlagEvaluationResults, string>(
    useEvaluateFeatureFlagsKey,
    async () =>
      (
        await axiosInstance.get<{ result: FlagEvaluationResults }>(
          '/flags/evaluate'
        )
      ).data.result,
    {
      ...queryOptions,
      select: (result) => ({
        ...defaultFlagValues,
        ...result
      })
    }
  );

export default useEvaluateFeatureFlags;
