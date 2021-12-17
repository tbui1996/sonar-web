import {
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams
} from '@mui/x-data-grid';
import { Box, Button, Tooltip } from '@material-ui/core';
import { getFormattedDate } from '../../utils/tableStyles';

const getTruncatedCell = (value: string) => (
  <Tooltip title={value}>
    <Box
      sx={{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }}
    >
      {value}
    </Box>
  </Tooltip>
);

export const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.4 },
  {
    field: 'fileName',
    headerName: 'File Name',
    flex: 1,
    renderCell: (params: GridRenderCellParams) =>
      getTruncatedCell(params.value as string)
  },
  {
    field: 'fileMimetype',
    headerName: 'File Mime Type',
    flex: 1
  },
  {
    field: 'sendUserId',
    headerName: 'Send User ID',
    flex: 1,
    renderCell: (params: GridRenderCellParams) =>
      getTruncatedCell(params.value as string)
  },
  {
    field: 'chatId',
    headerName: 'Chat ID',
    flex: 0.6
  },
  {
    field: 'dateUploaded',
    headerName: 'Date Uploaded',
    flex: 0.7,
    type: 'date',
    valueFormatter: (params: GridValueFormatterParams) =>
      getFormattedDate(params?.value as string)
  },
  {
    field: 'dateLastAccessed',
    headerName: 'Date Last Accessed',
    flex: 0.7,
    type: 'date',
    valueFormatter: (params: GridValueFormatterParams) =>
      getFormattedDate(params?.value as string)
  },
  {
    field: 'memberId',
    headerName: 'Member ID',
    flex: 0.7
  },
  {
    field: 'view',
    headerName: '-',
    flex: 0.5,
    sortable: false,
    align: 'center',
    renderCell: () => (
      <Button color="primary" variant="contained">
        View
      </Button>
    )
  },
  {
    field: 'associate',
    headerName: '-',
    flex: 0.7,
    sortable: false,
    align: 'center',
    renderCell: () => (
      <Button color="primary" variant="contained">
        Associate
      </Button>
    )
  },
  {
    field: 'delete',
    headerName: '-',
    flex: 0.5,
    sortable: false,
    align: 'center',
    renderCell: () => (
      <Button color="primary" variant="outlined">
        Delete
      </Button>
    )
  }
];
