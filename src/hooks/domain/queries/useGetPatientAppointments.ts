import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axiosInstance from '../../../utils/axios';
import { AppointmentDetails } from '../../../views/appointments/AppointmentRow';

interface ResultWrapper<T> {
  result: T;
}

export const useGetAppointmentsKey = 'get-appointments';

const useGetPatientAppointments = (
  options: UseQueryOptions<AppointmentDetails[], string> = {}
): UseQueryResult<AppointmentDetails[], string> =>
  useQuery<AppointmentDetails[], string>(
    useGetAppointmentsKey,
    async () =>
      (
        await axiosInstance.get<ResultWrapper<AppointmentDetails[]>>(
          '/appointment'
        )
      ).data.result,
    options
  );

export default useGetPatientAppointments;
