import { FunctionComponent } from 'react';
import { Formik, Form, Field } from 'formik';
import { Paper, Button, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Select } from 'formik-material-ui';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import axios from 'axios';

const useStyles = makeStyles(() => ({
  formContainer: {
    width: '350px',
    marginTop: '2rem',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    marginTop: '1rem',
    width: '100%',
  }
}));

interface Values {
  scope: string;
  content: string;
}

const BroadcastForm: FunctionComponent = () => {
  const classes = useStyles();

  return (
  <Paper className={classes.formContainer}>
    <Typography variant="h6">Broadcast</Typography>
    <Formik
      initialValues={{
        scope: 'global',
        content: ''
      }}
      validate={values => {
        const errors: Partial<Values> = {};
        if (!values.scope) {
          errors.scope = 'Required';
        }
        if (!values.content) {
          errors.content = 'Required';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        axios.post(`http://localhost:8000/broadcast/`, {
          scope: values.scope,
          content: values.content
        }).then(res => {
          setSubmitting(false);
          return resetForm({
            values: {
              scope: 'global',
              content: ''
            }
          })
        }).catch(err => {
          setSubmitting(false);
          console.error(err);
        });
      }}
      >
      {({ submitForm, isSubmitting }) => (
      <Form>
        <Field
          component={Select}
          className={classes.field}
          variant="outlined"
          name="scope"
          inputProps={{
            id: 'scope',
          }}
        >
          <MenuItem value="global">Global</MenuItem>
          <MenuItem value="circulo">Circulo</MenuItem>
          <MenuItem value="provider">Provider</MenuItem>
        </Field>
        <br />
        <Field
          className={classes.field}
          component={TextField}
          name="content"
          type="text"
          label="Content"
          multiline
          variant="outlined"
          rows={4}
        />
        {isSubmitting && <LinearProgress />}
        <br />
        <Button
          className={classes.field}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          onClick={submitForm}
        >
          Broadcast
        </Button>
      </Form>
      )}
    </Formik>
  </Paper>
  );
};

export default BroadcastForm;
