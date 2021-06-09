import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
              .map((item: Input, index: number) => (
                <TableCell key={index}>{item.label}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {submits?.map((s, index) => (
            <TableRow key={index}>
              <TableCell key={index}>{s[0].formSubmissionId}</TableCell>
              {s
                .filter((input) => input.response)
                .sort((a, b) => a.inputId - b.inputId)
                .map((resp, index) => (
                  <>
                    <TableCell key={index}>{resp.response}</TableCell>
                  </>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
