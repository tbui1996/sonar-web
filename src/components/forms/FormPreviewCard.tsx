import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Divider, FormGroup, Theme } from '@material-ui/core';
import {
  FormElementProps,
  FormPreviewProps,
  OptionsInput,
  InputSubmission
} from '../../@types/form';
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

function FormInput({ input, index, isOliveHelps, response }: FormElementProps) {
  const elem = INPUT_TYPES.find((elem) => elem.id === input.type);

  if (!elem) {
    throw new Error('Invalid input type');
  }

  return (
    <elem.Element
      input={input as OptionsInput}
      index={index}
      isOliveHelps={isOliveHelps}
      response={response}
    />
  );
}

export default function FormPreviewCard({
  form,
  isOliveHelps,
  isFormPreview,
  submissionResponses
}: FormPreviewProps) {
  const classes = useStyles();
  const classesNone = useStylesNone();

  return (
    <Card
      className={classes.root}
      variant="outlined"
      sx={{ position: isFormPreview ? 'fixed' : 'inherit' }}
    >
      <CardContent className={isOliveHelps ? classes.content : ''}>
        <Typography
          variant={isOliveHelps ? 'subtitle1' : 'h6'}
          classes={isOliveHelps ? { root: classes.padding } : {}}
        >
          {form.Form.title}
        </Typography>
        <Divider />
        <Typography
          variant={isOliveHelps ? 'caption' : 'subtitle1'}
          classes={isOliveHelps ? { root: classes.padding } : {}}
        >
          {form.Form.description}
        </Typography>
        <FormGroup classes={isOliveHelps ? classesNone : classes}>
          {form.Inputs.map((input, index) => {
            const submission = submissionResponses?.find(
              (response: InputSubmission) => response.inputId === input.id
            );
            return (
              <FormInput
                input={input as OptionsInput}
                index={index}
                key={index}
                isOliveHelps={isOliveHelps}
                response={submission}
              />
            );
          })}
        </FormGroup>
      </CardContent>
    </Card>
  );
}
