import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axiosInstance from '../../../utils/axios';
import { PatientDetails } from '../../../views/patients/PatientRow';

interface ResultWrapper<T> {
  result: T;
}

export const useGetPatientsKey = 'get-patients';

const useGetPatients = (
  options: UseQueryOptions<PatientDetails[], string> = {}
): UseQueryResult<PatientDetails[], string> =>
  useQuery<PatientDetails[], string>(
    useGetPatientsKey,
    async () =>
      (await axiosInstance.get<ResultWrapper<PatientDetails[]>>('/patient'))
        .data.result,
    options
  );

export default useGetPatients;
