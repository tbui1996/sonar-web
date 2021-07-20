import { Container } from '@material-ui/core';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';

export default function Support() {
  return (
    <Page title="Support | Sonar">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Support"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Support' }
          ]}
        />
      </Container>
    </Page>
  );
}
