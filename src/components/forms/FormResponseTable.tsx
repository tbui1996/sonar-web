import React, { useState, useCallback, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowData } from '@mui/x-data-grid';
import { Box } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { FormResponseTableProps, Input } from '../../@types/form';
import { useStyles } from '../../utils/tableStyles';

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
      const newArray = submitItem;
      if (columns !== undefined) {
        const begField = parseInt(columns[1]?.field, 10);
        const lastField = parseInt(columns[columns.length - 1]?.field, 10);
        const columnFields: number[] = [];
        for (let i = begField; i <= lastField; i++) {
          columnFields.push(i);
        }
        for (let i = 0; i < submitItem.length; i++) {
          if (columnFields.includes(submitItem[i].inputId)) {
            columnFields[columnFields.indexOf(submitItem[i].inputId)] = -1;
          }
        }
        columnFields.forEach((v) => {
          if (v !== -1) {
            newArray.push({
              id: firstSubmission.id,
              formSubmissionId: firstSubmission.formSubmissionId,
              inputId: v,
              response: '-'
            });
          }
        });
      }
      newArray
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
  }, [columns, submits]);

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
