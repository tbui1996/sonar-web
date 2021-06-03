import { Container, Grid } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Page from '../components/Page';
import {
  AppModalities,
  AppAreaInstalled,
  AppTotalDownloads,
  AppTotalInstalled,
  AppTotalActiveUsers
} from '../components/general/app';
import StyledPieChart from '../components/charts/StyledPieChart';
import { FormCount } from '../@types/form';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  // const { user } = useAuth();
  const [formCount, setFormCount] = useState<FormCount>();

  useEffect(() => {
    async function execute() {
      await axios
        .get<FormCount>(`https://api.sonar.circulo.dev/forms/count`)
        .then((res) => {
          setFormCount(res.data);
        });
    }

    execute().catch((e) => {
      console.log(e);
    });
  }, []);

  return (
    <Page title="Dashboard: App | Minimal-UI">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <AppTotalActiveUsers />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalInstalled />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalDownloads />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <StyledPieChart
              data={[80, 120, 79, 414, formCount?.count || 0]}
              labels={['Note', 'Message', 'RX', 'Broadcast', 'Forms']}
              title="Modality Utilization"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled />
          </Grid>

          <Grid item xs={12} lg={8}>
            <AppModalities />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
