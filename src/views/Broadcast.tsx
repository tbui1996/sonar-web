import { Container, Card, Typography } from '@material-ui/core';
import Page from '../components/Page';
import HeaderDashboard from '../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../routes/paths';

export default function Broadcast() {
  return (
    <Page title="Broadcast | Sonar">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Broadcast"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Broadcast' }
          ]}
        />
        <Card sx={{ height: '72vh', display: 'flex' }}>
          <Typography>...</Typography>
        </Card>
      </Container>
    </Page>
  );
}
