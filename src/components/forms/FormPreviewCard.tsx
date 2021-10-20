import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {
  Divider,
  FormGroup,
  Theme,
  Box,
  IconButton,
  Drawer
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import {
  FormElementProps,
  FormPreviewProps,
  OptionsInput,
  InputSubmission,
  FormToEditProps
} from '../../@types/form';
import { INPUT_TYPES } from '../../constants/formConstants';
import FormEdit from '../../views/forms/Edit';

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

const DRAWER_WIDTH = 400;

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
  submissionResponses,
  isEditable
}: FormPreviewProps) {
  const [open, setOpen] = useState(false);
  const [formToEdit, setFormToEdit] = useState<FormToEditProps | null>();
  const classes = useStyles();
  const classesNone = useStylesNone();

  useEffect(() => {
    setFormToEdit({
      id: form.Form.id,
      title: form.Form.title,
      description: form.Form.description
    });
  }, [form.Form]);

  function toggleDrawer() {
    setOpen(!open);
  }

  return (
    <Card
      className={classes.root}
      variant="outlined"
      sx={{ position: isFormPreview ? 'fixed' : 'inherit' }}
    >
      <CardContent className={isOliveHelps ? classes.content : ''}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Box
            sx={{
              width: '92%'
            }}
          >
            <Typography
              variant={isOliveHelps ? 'subtitle1' : 'h6'}
              classes={isOliveHelps ? { root: classes.padding } : {}}
            >
              {formToEdit?.title}
            </Typography>
            <Divider />
            <Typography
              variant={isOliveHelps ? 'caption' : 'subtitle1'}
              classes={isOliveHelps ? { root: classes.padding } : {}}
            >
              {formToEdit?.description}
            </Typography>
          </Box>
          {isEditable && (
            <IconButton color="primary" onClick={toggleDrawer}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
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
      {formToEdit && (
        <Drawer
          anchor="right"
          open={open}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          <FormEdit
            data={formToEdit}
            updateData={setFormToEdit}
            setOpen={setOpen}
          />
        </Drawer>
      )}
    </Card>
  );
}
