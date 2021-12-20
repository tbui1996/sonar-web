import { Container, Grid } from '@material-ui/core';

import { useEffect, useState } from 'react';
import Page from '../components/Page';
import { AppModalities } from '../components/general/app';
import StyledPieChart from '../components/charts/StyledPieChart';
import { FormCount } from '../@types/form';
import axios from '../utils/axios';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  // const { user } = useAuth();
  const [formCount, setFormCount] = useState<FormCount>();

  useEffect(() => {
    async function execute() {
      await axios.get<FormCount>(`/forms/count`).then((res) => {
        setFormCount(res.data);
      });
    }

    execute().catch((e) => {
      console.log(e);
    });
  }, []);

  return (
    <Page title="Dashboard | Sonar">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPieChart
              data={[50, 10, formCount?.count || 0]}
              labels={['Broadcast', 'Chat', 'Forms']}
              title="Modality Utilization"
            />
          </Grid>

          <Grid item xs={12} lg={8}>
            <AppModalities />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
