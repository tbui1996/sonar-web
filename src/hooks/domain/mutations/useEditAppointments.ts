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

export type AppointmentDetailsRequest = Omit<
  AppointmentDetails,
  | 'handleClick'
  | 'middleName'
  | 'providerFullName'
  | 'createdTimestamp'
  | 'suffix'
  | 'dateOfBirth'
  | 'primaryLanguage'
  | 'preferredGender'
  | 'emailAddress'
  | 'homeAddress1'
  | 'homeAddress2'
  | 'homeCity'
  | 'homeState'
  | 'homeZip'
  | 'signedCirculoConsentForm'
  | 'circuloConsentFormLink'
  | 'signedStationMDConsentForm'
  | 'stationMDConsentFormLink'
  | 'completedGoSheet'
  | 'markedAsActive'
  | 'nationalProviderId'
  | 'businessTIN'
  | 'businessAddress1'
  | 'businessAddress2'
  | 'businessCity'
  | 'businessState'
  | 'businessZip'
  | 'patientHomePhone'
  | 'patientHomeLivingArrangement'
  | 'patientHomeCounty'
  | 'insuranceId'
  | 'appointmentCreated'
  | 'lastModifiedTimestamp'
  | 'appointmentStatusChangedOn'
>;
const useEditAppointments = (
  options: UseMutationOptions<
    AxiosResponse,
    string,
    AppointmentDetailsRequest
  > = {}
): UseMutationResult<AxiosResponse, string, AppointmentDetailsRequest> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, AppointmentDetailsRequest>(
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
