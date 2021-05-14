import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button } from '@material-ui/core';

import axios from 'axios';

import type { Form } from '../../@types/form';
import LoadingScreen from '../../components/LoadingScreen';

export default function View() {
  const [form, setForm] = useState<Form | undefined>();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const params = useParams<{ id: string }>();

  useEffect(() => {
    async function execute() {
      if (!params.id) {
        return;
      }

      const res = await axios.get<Form>(
        `https://api.sonar.circulo.dev/forms/${params.id}`
      );

      setForm(res.data);
    }

    if (!params.id) {
      return;
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

  const handleSendForm = useCallback(async () => {
    if (!params.id) {
      return;
    }

    setSending(true);

    await axios
      .post(`https://api.sonar.circulo.dev/forms/${params.id}/send`)
      .catch((e) => {
        console.log(e);
      });

    setSending(false);
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
      width="100%"
      padding="3rem"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography>{params.id}</Typography>
      <Button disabled={sending} onClick={handleSendForm}>
        Send
      </Button>
    </Box>
  );
}
