import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@material-ui/core';
import {
  FormApiResponse,
  FormApiSubmitResponse,
  InputSubmission
} from '../../@types/form';
import FormPreviewCard from '../../components/forms/FormPreviewCard';
import LoadingScreen from '../../components/LoadingScreen';

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

      const formRes = await axios.get<FormApiResponse>(
        `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}/forms/${params.id}`
      );

      setForm(formRes.data);

      const submitRes = await axios.get<FormApiSubmitResponse>(
        `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}/forms/${params.id}/response`
      );

      if (!submitRes.data || !Array.isArray(submitRes.data)) {
        console.log('Expected forms to exist and be an array');
      }

      const formsArrayBySubmissionId = submitRes.data.submissions.filter(
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
      <Typography
        variant="h5"
        style={{ textAlign: 'center', paddingBottom: '24px' }}
      >{`Response - Sumbmission ID ${params.formSubmissionId}`}</Typography>
      <FormPreviewCard
        form={form}
        isOliveHelps={false}
        submissionResponses={responses}
      />
    </Box>
  );
}
