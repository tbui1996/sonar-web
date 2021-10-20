import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  Container,
  Grid,
  AppBar,
  Tabs,
  Tab
} from '@material-ui/core';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import type { FormApiResponse } from '../../@types/form';
import LoadingScreen from '../../components/LoadingScreen';
import Page from '../../components/Page';
import FormPreviewCard from '../../components/forms/FormPreviewCard';
import OliveHelpsMock from '../../components/olive/OliveHelpsMock';
import { FormApiSubmitResponse } from '../../@types/form';
import FormResponseTable from '../../components/forms/FormResponseTable';
import StyledPieChart from '../../components/charts/StyledPieChart';
import { a11yProps, TabPanel } from '../../components/TabPanel';
import axios from '../../utils/axios';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    width: {
      marginBottom: '0.5rem',
      marginTop: '0.5rem'
    },
    flex: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    root: {
      flexGrow: 1
    },
    justifyEven: {
      justifyContent: 'space-evenly'
    },
    flexGrowWidth: {
      flexGrow: 1,
      maxWidth: '100%'
    },
    backgroundColor: {
      backgroundColor: theme.palette.background.paper
    }
  })
);

export default function View() {
  const [form, setForm] = useState<FormApiResponse | undefined>();
  const [response, setResponse] = useState<FormApiSubmitResponse | undefined>();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const params = useParams<{ id: string }>();

  useEffect(() => {
    async function execute() {
      if (!params.id) {
        return;
      }

      const formRes = await axios.get<FormApiResponse>(`/forms/${params.id}`);

      setForm(formRes.data);

      const submitRes = await axios.get<FormApiSubmitResponse>(
        `/forms/${params.id}/response`
      );

      setResponse(submitRes.data);
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

    await axios.post(`/forms/${params.id}/send`).catch((e) => {
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

  const discards = response?.discards?.length || 0;
  const submitted = response?.submissions?.length || 0;

  return (
    <Page title="Form View">
      <div className={classes.root}>
        <AppBar position="static" classes={{ root: classes.backgroundColor }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="forms tabs"
            classes={{ flexContainer: classes.justifyEven }}
          >
            <Tab label="Form Preview" {...a11yProps(0)} sx={{ flexGrow: 1 }} />
            <Tab label="Form Response" {...a11yProps(1)} sx={{ flexGrow: 1 }} />
          </Tabs>
        </AppBar>
      </div>
      <TabPanel value={value} index={0}>
        <Container maxWidth="xl" className={classes.flex}>
          <FormPreviewCard form={form} isOliveHelps={false} isEditable />
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={2}>
          <Grid item xl={3} lg={3} sx={{ flexGrow: 1, maxWidth: '400px' }}>
            <StyledPieChart
              data={[submitted, discards]}
              labels={['Submitted', 'Discarded']}
              title="Forms Sent"
            />
          </Grid>
          <Grid
            item
            xl={3}
            lg={9}
            sx={{ flexGrow: 1, overflowY: 'scroll' }}
            classes={{ root: classes.flexGrowWidth }}
          >
            <FormResponseTable
              inputs={form.Inputs}
              submits={response?.submissions}
            />
          </Grid>
        </Grid>
      </TabPanel>
    </Page>
  );
}
