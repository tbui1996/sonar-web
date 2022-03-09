import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient
} from 'react-query';
import { AxiosResponse } from 'axios';
import axiosInstance from '../../../utils/axios';
import { useGetAppointmentsKey } from '../queries/useGetPatientAppointments';

export interface DeleteAppointmentRequest {
  appointmentId: string;
}

const useDeleteAppointment = (
  options: UseMutationOptions<
    AxiosResponse,
    string,
    DeleteAppointmentRequest
  > = {}
): UseMutationResult<AxiosResponse, string, DeleteAppointmentRequest> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, DeleteAppointmentRequest>(
    (request) => axiosInstance.delete(`/appointment/${request.appointmentId}`),
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        options.onSuccess?.(data, variables, context);
        queryClient.invalidateQueries(useGetAppointmentsKey);
      }
    }
  );
};

export default useDeleteAppointment;
