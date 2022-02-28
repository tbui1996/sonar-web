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

const useEditAppointments = (
  options: UseMutationOptions<AxiosResponse, string, AppointmentForm> = {}
): UseMutationResult<AxiosResponse, string, AppointmentForm> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, AppointmentForm>(
    (request) =>
      axiosInstance.put(`/appointment/${request.appointmentId}`, {
        appointmentId: request.appointmentId,
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
        agencyProviderId: request.agencyProviderId,
        appointmentNotes: request.appointmentNotes,
        appointmentOtherPurpose: request.appointmentOtherPurpose,
        patientId: request.patientId
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
