import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient
} from 'react-query';
import { AxiosResponse } from 'axios';
import axiosInstance from '../../../utils/axios';
import { AppointmentDetails } from '../../../views/appointments/AppointmentRow';
import { useGetAppointmentsKey } from '../queries/useGetPatientAppointments';

const useCreateAppointment = (
  options: UseMutationOptions<AxiosResponse, string, AppointmentDetails> = {}
): UseMutationResult<AxiosResponse, string, AppointmentDetails> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, AppointmentDetails>(
    (request: AppointmentDetails) =>
      axiosInstance.post('/appointment', request),
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        options.onSuccess?.(data, variables, context);
        await queryClient.invalidateQueries(useGetAppointmentsKey);
      }
    }
  );
};

export default useCreateAppointment;
