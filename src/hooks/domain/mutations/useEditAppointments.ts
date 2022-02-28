import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient
} from 'react-query';
import { AxiosResponse } from 'axios';
import axiosInstance from '../../../utils/axios';
import { useGetAppointmentsKey } from '../queries/useGetPatientAppointments';
import { AppointmentDetails } from '../../../views/appointments/AppointmentRow';

const useEditAppointments = (
  options: UseMutationOptions<AxiosResponse, string, AppointmentDetails> = {}
): UseMutationResult<AxiosResponse, string, AppointmentDetails> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, AppointmentDetails>(
    (request) =>
      axiosInstance.put(`/appointment/${request.appointmentId}`, {
        appointmentId: request.appointmentId,
        patientId: request.patientId,
        agencyProviderId: request.agencyProviderId,
        firstName: request.firstName,
        lastName: request.lastName,
        appointmentStatus: request.appointmentStatus,
        appointmentScheduled: request.appointmentScheduled,
        appointmentPurpose: request.appointmentPurpose,
        patientchiefComplaint: request.patientChiefComplaint,
        businessName: request.businessName,
        circulatorDriverFullName: request.circulatorDriverFullName,
        patientDiastolicBloodPressure: request.patientDiastolicBloodPressure,
        patientSystolicBloodPressure: request.patientSystolicBloodPressure,
        patientRespirationsPerMinute: request.patientRespirationsPerMinute,
        patientPulseBeatsPerMinute: request.patientPulseBeatsPerMinute,
        patientWeightLbs: request.patientWeightLbs,
        appointmentNotes: request.appointmentNotes,
        appointmentOtherPurpose: request.appointmentOtherPurpose
      }),
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        options.onSuccess?.(data, variables, context);
        queryClient.invalidateQueries(useGetAppointmentsKey);
      }
    }
  );
};

export default useEditAppointments;
