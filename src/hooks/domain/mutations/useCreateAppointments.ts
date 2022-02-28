import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient
} from 'react-query';
import { AxiosResponse } from 'axios';
import axiosInstance from '../../../utils/axios';
import { useGetAppointmentsKey } from '../queries/useGetPatientAppointments';
import { AppointmentForm } from '../../../views/appointments/CreateAppointmentDialog';

const useCreateAppointment = (
  options: UseMutationOptions<AxiosResponse, string, AppointmentForm> = {}
): UseMutationResult<AxiosResponse, string, AppointmentForm> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, AppointmentForm>(
    (request: AppointmentForm) => axiosInstance.post('/appointment', request),
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
