import { makeStyles } from '@material-ui/core';
import { formatDate } from '@fullcalendar/react';

export const useStyles = makeStyles({
  table: {
    width: '100%',
    '& .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-cell': {
      whiteSpace: 'normal',
      lineHeight: '1.3!important',
      maxHeight: 'fit-content!important',
      minHeight: 'auto!important',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },

    '& .MuiDataGrid-row': {
      lineHeight: '3!important'
    },

    '& .MuiDataGrid-columnHeaderWrapper': {
      maxHeight: 'none!important',
      flex: '1 0 auto'
    },

    '&.MuiDataGrid-root .MuiDataGrid-cell:focus, &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, &.MuiDataGrid-root .MuiDataGrid-cell--withRenderer': {
      outline: 'none'
    }
  }
});

export const getFormattedDate = (date: string) =>
  formatDate(date, {
    month: 'numeric',
    year: 'numeric',
    day: 'numeric',
    timeZone: 'UTC'
  });
