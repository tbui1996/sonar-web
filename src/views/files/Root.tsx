import { useCallback, useEffect, useState } from 'react';
import { Box, Card, Container, Drawer, makeStyles } from '@material-ui/core';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import HeaderDashboard from '../../components/HeaderDashboard';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import axios from '../../utils/axios';
import { File } from '../../@types/file';
import LoadingScreen from '../../components/LoadingScreen';
import { columns } from './filesTableColumns';
import FileAssociate from './Associate';
import ConfirmDialog from '../../components/general/app/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 400;
const useStyles = makeStyles({
  table: {
    width: '100%',
    '& .MuiDataGrid-columnHeaderTitle': {
      whiteSpace: 'normal',
      lineHeight: '1.3!important',
      maxHeight: 'fit-content!important',
      minHeight: '6em!important',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus, &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, &.MuiDataGrid-root .MuiDataGrid-cell--withRenderer': {
      outline: 'none'
    }
  }
});
export default function Files() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<Array<File>>([]);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [fileToUpdate, setFileToUpdate] = useState<File | null>();
  const [fileIdToDelete, setFileIdToDelete] = useState<number | null>();
  const classes = useStyles();
  const { token } = useAuth();

  useEffect(() => {
    async function execute() {
      const res = await axios.get<Array<File>>(`/cloud/get_file`);

      if (!res.data || !Array.isArray(res.data)) {
        console.log('Expected forms to exist and be an array');
      }

      setFiles(res.data || []);
    }

    setLoading(true);
    execute()
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleTableDisplay(fileId: string) {
    const index = files.findIndex((file) => file.fileId === fileId);

    if (index >= 0 && fileToUpdate) {
      setFiles([
        ...files.slice(0, index),
        fileToUpdate,
        ...files.slice(index + 1)
      ]);
    }
  }

  const handleDeleteFile = useCallback(async () => {
    setOpenConfirm(false);
    if (fileIdToDelete) {
      setLoading(true);
      const res = await axios
        .put(`/cloud/delete_file/${fileIdToDelete}`, {
          id: fileIdToDelete
        })
        .catch((e) => {
          console.error(e);
        });
      const index = files.findIndex((file) => file.id === fileIdToDelete);
      if (res && index >= 0)
        setFiles([...files.slice(0, index), ...files.slice(index + 1)]);
    }

    setFileIdToDelete(null);
    setLoading(false);
  }, [fileIdToDelete, files]);

  function handleOpenConfirm() {
    setOpenConfirm(!openConfirm);
  }

  const handleClick = useCallback(
    async (param: GridCellParams) => {
      const t = await token();
      switch (param?.colDef?.field) {
        case 'associate':
          setFileToUpdate({
            id: param.row.id,
            fileId: param.row.fileId,
            fileName: param.row.fileName,
            filePath: param.row.filePath,
            fileMimetype: param.row.fileMimetype,
            memberId: param.row.memberId,
            sendUserId: param.row.sendUserId,
            dateUploaded: param.row.dateUploaded,
            dateLastAccessed: param.row.dateLastAccessed,
            DeletedAt: param.row.DeletedAt,
            chatId: param.row.chatId
          });
          setOpen(!open);
          break;
        case 'view':
          window.open(
            `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}/cloud/file_download/${param.row.fileId}?authorization=${t}`
          );
          break;
        case 'delete':
          setFileIdToDelete(param.row.id);
          setOpenConfirm(true);
          break;
        default:
          setFileToUpdate(null);
          break;
      }
    },
    [token, open]
  );

  const loadingState = (
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
  return (
    <Page title="Forms | Sonar">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Files"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Files' }
          ]}
        />
        <Card
          sx={{
            minHeight: '50vh',
            paddingTop: '2rem',
            paddingBottom: '2rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {fileToUpdate && (
            <Drawer
              anchor="right"
              open={open}
              PaperProps={{
                sx: { width: DRAWER_WIDTH }
              }}
            >
              <FileAssociate
                data={fileToUpdate}
                updateData={setFileToUpdate}
                setOpen={setOpen}
                handleTableDisplay={handleTableDisplay}
              />
            </Drawer>
          )}
          {loading ? (
            loadingState
          ) : (
            <DataGrid
              onCellClick={handleClick}
              columns={columns}
              rows={files}
              className={classes.table}
              disableColumnMenu
              autoHeight
            />
          )}
        </Card>
        <ConfirmDialog
          open={openConfirm}
          title="Are you sure you want to delete this file?"
          description="This file will be deleted and cannot be undone."
          onConfirm={handleDeleteFile}
          onCancel={handleOpenConfirm}
        />
      </Container>
    </Page>
  );
}
