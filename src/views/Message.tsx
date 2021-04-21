import { Container, Card, Typography } from '@material-ui/core';
import Page from '../components/Page';
import HeaderDashboard from '../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../routes/paths';

export default function Message() {
  return (
    <Page title="Message | Sonar">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Message"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Message' }
          ]}
        />
        <Card sx={{ height: '72vh', display: 'flex' }}>
          <Typography>...</Typography>
        </Card>
      </Container>
    </Page>
  );
}
