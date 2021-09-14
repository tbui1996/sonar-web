import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory, useParams } from 'react-router-dom';
import { FormResponseTableProps, Input } from '../../@types/form';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

export default function FormResponseTable({
  inputs,
  submits
}: FormResponseTableProps) {
  const classes = useStyles();
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const handleClick = useCallback(
    (formSubmissionId: number) => {
      history.push(
        `/dashboard/forms/${params.id}/response/${formSubmissionId}`
      );
    },
    [history, params]
  );

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="form response table">
        <TableHead>
          <TableRow>
            <TableCell>Submission ID</TableCell>
            {inputs
              .filter(
                (input) =>
                  input.type !== 'divider' &&
                  input.type !== 'link' &&
                  input.type !== 'message'
              )
              .sort((a, b) => a.id - b.id)
              .map((item: Input) => (
                <TableCell key={item.id}>{item.label}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {submits?.map((submitItem) => {
            const [firstSubmission] = submitItem;
            const { id, inputId, formSubmissionId } = firstSubmission;
            return (
              <TableRow
                key={id}
                hover
                onClick={() => handleClick(formSubmissionId)}
              >
                <TableCell key={inputId}>{formSubmissionId}</TableCell>
                {submitItem
                  .filter((input) => input.response)
                  .sort((a, b) => a.inputId - b.inputId)
                  .map((resp) => (
                    <>
                      <TableCell key={resp.id}>{resp.response}</TableCell>
                    </>
                  ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
