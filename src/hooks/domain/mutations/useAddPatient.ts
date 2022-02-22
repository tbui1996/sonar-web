import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient
} from 'react-query';
import { AxiosResponse } from 'axios';
import axiosInstance from '../../../utils/axios';
import { useGetPatientsKey } from '../queries/useGetPatients';

export interface CreatePatientRequest {
  patientId: string;
  insuranceId: string;
  patientFirstName: string;
  patientMiddleName: string;
  patientLastName: string;
  patientSuffix: string;
  patientDateOfBirth: Date;
  patientPrimaryLanguage: string;
  patientPreferredGender: string;
  patientEmailAddress: string;
  patientHomePhone: string;
  patientHomeLivingArrangement: string;
  patientHomeAddress1: string;
  patientHomeAddress2: string;
  patientHomeCity: string;
  patientHomeCounty: string;
  patientHomeState: string;
  patientHomeZip: string;
  patientSignedCirculoConsentForm: boolean;
  patientCirculoConsentFormLink: string;
  patientSignedStationMDConsentForm: boolean;
  patientStationMDConsentFormLink: string;
  patientCompletedGoSheet: boolean;
  patientMarkedAsActive: boolean;
  patientCreatedTimestamp: Date;
  patientLastModifiedTimestamp: Date;
}

const useCreatePatient = (
  options: UseMutationOptions<AxiosResponse, string, CreatePatientRequest> = {}
): UseMutationResult<AxiosResponse, string, CreatePatientRequest> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, CreatePatientRequest>(
    (request: CreatePatientRequest) => axiosInstance.post('/patient', request),
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        options.onSuccess?.(data, variables, context);
        await queryClient.invalidateQueries(useGetPatientsKey);
      }
    }
  );
};

export default useCreatePatient;
