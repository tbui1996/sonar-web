import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Divider, FormGroup, Theme } from '@material-ui/core';
import { FormApiResponse, Input, OptionsInput } from '../../@types/form';
import { INPUT_TYPES } from '../../constants/formConstants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(0.75)
      }
    },
    content: {
      padding: '.75px'
    },
    padding: {
      margin: '2%'
    }
  })
);

const useStylesNone = makeStyles({
  root: {
    '& > *': {
      margin: '4px'
    }
  }
});

function FormInput(props: {
  input: Input | OptionsInput;
  index: number;
  isOliveHelps: boolean;
}) {
  const input = props.input as OptionsInput;
  const elem = INPUT_TYPES.find((elem) => elem.id === input.type);

  if (!elem) {
    throw new Error('Invalid input type');
  }

  return (
    <elem.Element
      input={input}
      index={props.index}
      isOliveHelps={props.isOliveHelps}
    />
  );
}

export default function FormPreviewCard(props: {
  form: FormApiResponse;
  isOliveHelps: boolean;
  isFormPreview?: boolean;
}) {
  const classes = useStyles();
  const classesNone = useStylesNone();

  return (
    <Card
      className={classes.root}
      variant="outlined"
      sx={{ position: props.isFormPreview ? 'fixed' : 'inherit' }}
    >
      <CardContent className={props.isOliveHelps ? classes.content : ''}>
        <Typography
          variant={props.isOliveHelps ? 'subtitle1' : 'h6'}
          classes={props.isOliveHelps ? { root: classes.padding } : {}}
        >
          {props.form.Form.title}
        </Typography>
        <Divider />
        <Typography
          variant={props.isOliveHelps ? 'caption' : 'subtitle1'}
          classes={props.isOliveHelps ? { root: classes.padding } : {}}
        >
          {props.form.Form.description}
        </Typography>
        <FormGroup classes={props.isOliveHelps ? classesNone : classes}>
          {props.form.Inputs.map((input, index) => (
            <FormInput
              input={input}
              index={index}
              key={index}
              isOliveHelps={props.isOliveHelps}
            />
          ))}
        </FormGroup>
      </CardContent>
    </Card>
  );
}
