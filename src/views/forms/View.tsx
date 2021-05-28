import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, Container } from '@material-ui/core';

import axios from 'axios';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import type { FormApiResponse } from '../../@types/form';
import LoadingScreen from '../../components/LoadingScreen';
import Page from '../../components/Page';
import FormPreviewCard from '../../components/forms/FormPreviewCard';
import OliveHelpsMock from '../../components/olive/OliveHelpsMock';

const useStyles = makeStyles(() =>
  createStyles({
    width: {
      marginBottom: '0.5rem',
      marginTop: '0.5rem'
    },
    flex: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column'
    }
  })
);

export default function View() {
  const [form, setForm] = useState<FormApiResponse | undefined>();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const classes = useStyles();

  const params = useParams<{ id: string }>();

  useEffect(() => {
    async function execute() {
      if (!params.id) {
        return;
      }

      const res = await axios.get<FormApiResponse>(
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
    <Page title="Form View">
      <Container maxWidth="xl" className={classes.flex}>
        <FormPreviewCard form={form} isOliveHelps={false} />
        <Button
          disabled={sending}
          onClick={handleSendForm}
          variant="contained"
          className={classes.width}
        >
          Send
        </Button>
        <OliveHelpsMock form={form} />
      </Container>
    </Page>
  );
}
