import React, { useState, useCallback, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowData } from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { FormResponseTableProps, Input } from '../../@types/form';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    '& .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-cell': {
      whiteSpace: 'normal',
      lineHeight: '1.5!important',
      maxHeight: 'fit-content!important',
      minHeight: 'auto!important',
      display: 'flex',
      alignItems: 'center'
    },

    '& .MuiDataGrid-columnHeaderWrapper': {
      maxHeight: 'none!important',
      flex: '1 0 auto'
    },

    '& .MuiDataGrid-cell': {
      overflowWrap: 'anywhere',
      padding: '18px'
    }
  }
});

export default function FormResponseTable({
  inputs,
  submits
}: FormResponseTableProps) {
  const [columns, setColumns] = useState<GridColDef[]>();
  const [rows, setRows] = useState<Array<GridRowData>>();
  const classes = useStyles();
  const history = useHistory();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const data = inputs
      .filter(
        (input) =>
          input.type !== 'divider' &&
          input.type !== 'link' &&
          input.type !== 'message'
      )
      .sort((a, b) => a.id - b.id)
      .map((item: Input) => ({
        field: item.id.toString(),
        headerName: item.label,
        flex: item.type === 'email' ? 1.5 : 1,
        sortable: false
      }));

    data.unshift({
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      sortable: false
    });
    setColumns(data);
  }, [inputs]);

  useEffect(() => {
    const rowsData = submits?.map((submitItem) => {
      const [firstSubmission] = submitItem;
      let row = { id: firstSubmission.formSubmissionId };
      submitItem
        .filter((input) => input.response)
        .sort((a, b) => a.inputId - b.inputId)
        .forEach((resp) => {
          row = {
            ...row,
            [resp.inputId.toString() as string]: resp.response
          };
        });

      return row;
    });

    setRows(rowsData);
  }, [submits]);

  const handleClick = useCallback(
    (formSubmissionId: number) => {
      history.push(
        `/dashboard/forms/${params.id}/response/${formSubmissionId}`
      );
    },
    [history, params]
  );

  return (
    <Box>
      {columns && (
        <DataGrid
          rows={rows || []}
          columns={columns}
          className={classes.table}
          onRowClick={(param) => handleClick(param.row.id)}
          disableColumnMenu
          autoHeight
        />
      )}
    </Box>
  );
}
