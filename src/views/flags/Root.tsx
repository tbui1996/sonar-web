import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useGetFeatureFlags from '../../hooks/domain/queries/useGetFeatureFlags';
import useDeleteFeatureFlag from '../../hooks/domain/mutations/useDeleteFeatureFlag';
import CreateFeatureFlagDialog from './CreateFeatureFlagDialog';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import FlagRow from './FlagRow';
import ConfirmDialog from '../../components/general/app/ConfirmDialog';
import useEvaluateFeatureFlags from '../../hooks/domain/queries/useEvaluateFeatureFlags';

const useStyles = makeStyles((theme) => ({
  deleteButtonRoot: {
    marginLeft: theme.spacing(1),
    '&.Mui-disabled': {
      pointerEvents: 'auto',
      cursor: 'help'
    }
  }
}));

const Flags: React.FC = () => {
  const classes = useStyles();
  const { data: evaluatedFlags } = useEvaluateFeatureFlags({
    defaultFlagValues: {
      testFlag: false
    }
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { data: flags } = useGetFeatureFlags();
  const {
    mutateAsync: deleteFlag,
    isLoading: isDeleting
  } = useDeleteFeatureFlag();
  const [selectedFlagsIds, setSelectedFlagIds] = useState<
    Record<number, boolean>
  >({});

  const selectedFlags = flags?.filter((f) => selectedFlagsIds[f.id]);

  const toggleFlagSelection = (flagId: number) =>
    setSelectedFlagIds((cur) => ({
      ...cur,
      [flagId]: !cur[flagId]
    }));

  return (
    <Page title="Flags | Sonar">
      <HeaderDashboard
        heading={`Flags${
          evaluatedFlags?.testFlag ? ' (test flag enabled)' : ''
        }`}
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Flags' }
        ]}
      />
      <Paper elevation={4}>
        <TableContainer>
          <Toolbar>
            <Button
              variant="outlined"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              New Flag
            </Button>
            <Tooltip
              title={
                !selectedFlags?.length ? 'Select flags to delete them' : ''
              }
            >
              <div>
                <Button
                  sx={{ marginLeft: '8px' }}
                  classes={{
                    root: classes.deleteButtonRoot
                  }}
                  disabled={!selectedFlags?.length}
                  variant="contained"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                >
                  Delete Selected
                </Button>
              </div>
            </Tooltip>
          </Toolbar>
          <Table sx={{ minWidth: 480 }} arai-label="feature flags">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>Flag Name</TableCell>
                <TableCell>Flag Key</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Enabled?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flags &&
                flags.map((flag, i) => (
                  <FlagRow
                    onSelect={() => toggleFlagSelection(flag.id)}
                    isSelected={!!selectedFlagsIds[flag.id]}
                    key={flag.id}
                    isLast={i === flags.length - 1}
                    name={flag.name}
                    updatedAt={flag.updatedAt}
                    isEnabled={flag.isEnabled}
                    id={flag.id}
                    flagKey={flag.key}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <CreateFeatureFlagDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
      {selectedFlags && (
        <ConfirmDialog
          isConfirming={isDeleting}
          open={isDeleteConfirmOpen}
          title="Are you sure you want to delete these flags?"
          description={
            <Box>
              <Typography variant="subtitle2">
                By confirming the following flags will be deleted:
              </Typography>
              <ul style={{ padding: '8px 16px 0 16px' }}>
                {selectedFlags.map((f) => (
                  <li key={f.id}>{f.name}</li>
                ))}
              </ul>
            </Box>
          }
          onConfirm={async () => {
            await Promise.all(
              selectedFlags.map((flag) => deleteFlag({ id: flag.id }))
            );
            setIsDeleteConfirmOpen(false);
          }}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </Page>
  );
};

export default Flags;
