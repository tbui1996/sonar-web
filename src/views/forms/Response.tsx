import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@material-ui/core';
import { PDFDownloadLink } from '@react-pdf/renderer';
import axios from '../../utils/axios';
import {
  FormApiResponse,
  FormApiSubmitResponse,
  InputSubmission
} from '../../@types/form';
import FormPreviewCard from '../../components/forms/FormPreviewCard';
import LoadingScreen from '../../components/LoadingScreen';
import { FormPDF } from '../../components/forms/FormPDF';

export default function Response() {
  const [form, setForm] = useState<FormApiResponse | undefined>();
  const [responses, setResponses] = useState<Array<InputSubmission>>([]);
  const [loading, setLoading] = useState(false);

  const params = useParams<{ id: string; formSubmissionId: string }>();

  useEffect(() => {
    async function execute() {
      if (!params.id || !params.formSubmissionId) {
        return;
      }

      const [formData, formSubmitResponse] = await Promise.all([
        axios.get<FormApiResponse>(`/forms/${params.id}`),
        axios.get<FormApiSubmitResponse>(`/forms/${params.id}/response`)
      ]);

      setForm(formData.data);

      if (!formSubmitResponse.data || !Array.isArray(formSubmitResponse.data)) {
        console.log('Expected forms to exist and be an array');
      }

      const formsArrayBySubmissionId = formSubmitResponse.data.submissions.filter(
        (item: InputSubmission[]) =>
          item[0].formSubmissionId === parseInt(params.formSubmissionId, 10)
      );

      const [formBySubmissionId] = formsArrayBySubmissionId;
      setResponses(formBySubmissionId);
    }

    setLoading(true);
    execute()
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  if (!params?.id) {
    return <></>;
  }

  if (loading) {
    return (
      <Box
        width="100%"
        display="flex"
        padding="3rem"
        alignItems="center"
        justifyContent="center"
      >
        <LoadingScreen />
      </Box>
    );
  }

  if (!form) {
    return (
      <Box>
        <Typography>No Form</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: '24px'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '15px'
        }}
      >
        <Typography variant="h5">{`Response - Sumbmission ID ${params.formSubmissionId}`}</Typography>
        <Button variant="contained" style={{ color: 'white' }}>
          <PDFDownloadLink
            style={{ color: 'white', textDecoration: 'none' }}
            document={
              <FormPDF
                submissionId={params.formSubmissionId}
                form={form}
                submissionResponses={responses}
              />
            }
            fileName={`Response-submission-id-${params.formSubmissionId}.pdf`}
          >
            {({ loading }) => (loading ? 'Loading...' : 'Download')}
          </PDFDownloadLink>
        </Button>
      </Box>
      <FormPreviewCard
        form={form}
        isOliveHelps={false}
        submissionResponses={responses}
      />
    </Box>
  );
}
