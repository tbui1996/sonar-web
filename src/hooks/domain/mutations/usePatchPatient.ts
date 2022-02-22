import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient
} from 'react-query';
import { AxiosResponse } from 'axios';
import axiosInstance from '../../../utils/axios';
import { useGetPatientsKey } from '../queries/useGetPatients';

export interface PatchPatientRequest {
  patientId: string;
  insuranceId: string;
  patientFirstName: string;
  patientMiddleName: string;
  patientLastName: string;
  patientSuffix: string;
  patientDateOfBirth: string;
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
}

const usePatchFeatureFlag = (
  options: UseMutationOptions<AxiosResponse, string, PatchPatientRequest> = {}
): UseMutationResult<AxiosResponse, string, PatchPatientRequest> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, string, PatchPatientRequest>(
    (request) =>
      axiosInstance.put(`/patient/${request.patientId}`, {
        patientId: request.patientId,
        insuranceId: request.insuranceId,
        patientFirstName: request.patientFirstName,
        patientMiddleName: request.patientMiddleName,
        patientLastName: request.patientLastName,
        patientSuffix: request.patientSuffix,
        patientDateOfBirth: request.patientDateOfBirth,
        patientPrimaryLanguage: request.patientPrimaryLanguage,
        patientPreferredGender: request.patientPreferredGender,
        patientEmailAddress: request.patientEmailAddress,
        patientHomePhone: request.patientHomePhone,
        patientHomeLivingArrangement: request.patientHomeLivingArrangement,
        patientHomeAddress1: request.patientHomeAddress1,
        patientHomeAddress2: request.patientHomeAddress2,
        patientHomeCity: request.patientHomeCity,
        patientHomeCounty: request.patientHomeCounty,
        patientHomeState: request.patientHomeState,
        patientHomeZip: request.patientHomeZip,
        patientSignedCirculoConsentForm:
          request.patientSignedCirculoConsentForm,
        patientCirculoConsentFormLink: request.patientCirculoConsentFormLink,
        patientSignedStationMDConsentForm:
          request.patientSignedStationMDConsentForm,
        patientStationMDConsentFormLink:
          request.patientStationMDConsentFormLink,
        patientCompletedGoSheet: request.patientCompletedGoSheet,
        patientMarkedAsActive: request.patientMarkedAsActive
      }),
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        options.onSuccess?.(data, variables, context);
        queryClient.invalidateQueries(useGetPatientsKey);
      }
    }
  );
};

export default usePatchFeatureFlag;
