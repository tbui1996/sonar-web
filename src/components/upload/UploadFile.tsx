import { useState, useEffect } from 'react';

import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogActions,
  Chip,
  Paper,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import { Theme } from '@mui/material';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Dropzone from 'react-dropzone';
import { useSnackbar } from 'notistack';

import { FileInput } from '../../@types/chat';
import useUploadFileToCloud from '../../hooks/domain/mutations/useUploadFileToCloud';

const useStyles = makeStyles((t: Theme) => ({
  container: {
    width: '20rem',
    height: '12rem'
  },
  circularProgress: {
    position: 'absolute',
    top: '45%',
    left: '45%'
  },
  paper: {
    backgroundColor: '#FFE9C9',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    marginTop: '1rem',
    textAlign: 'center',
    border: '1px dashed #F47F65'
  },
  insertIcon: { color: t.palette.secondary.main },
  chip: {
    alignItems: 'center',
    marginTop: '1rem',
    width: '200px',
    display: 'flex'
  }
}));

export default function UploadFile() {
  const [open, setOpen] = useState(false);
  const [currentFileInputs, setCurrentFileInputs] = useState<FileInput>({});
  const [file, setFile] = useState<File>();
  const classes = useStyles();
  function onDeleteFile() {
    setCurrentFileInputs((prev) => ({
      ...prev,
      file: undefined
    }));
  }
  function handleClose() {
    setOpen(false);
  }
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: uploadFile, isLoading: isUploading } = useUploadFileToCloud({
    onSuccess: () => {
      onDeleteFile();
      handleClose();
    },
    onError: () => {
      enqueueSnackbar('Unable to upload file', {
        variant: 'error',
        autoHideDuration: 4_000
      });
    }
  });

  function handleClickOpen() {
    setOpen(true);
  }

  useEffect(() => {
    if (currentFileInputs) {
      setFile(currentFileInputs.file);
    } else {
      setFile(undefined);
    }
  }, [currentFileInputs]);

  function onChangeFile(files: File[]) {
    if (files === null) {
      return;
    }

    if (files.length <= 0) {
      return;
    }

    const file = files[0];
    setCurrentFileInputs((prev) => ({
      ...prev,
      file
    }));
  }

  function onSubmit() {
    if (file === undefined) {
      return;
    }

    uploadFile(file);
  }

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={handleClickOpen}
        sx={{ marginBottom: '1rem' }}
        aria-label="openModal"
      >
        Upload File
      </Button>

      <Dialog open={open}>
        <DialogTitle>Choose file to upload</DialogTitle>
        <Container className={classes.container}>
          {isUploading && (
            <CircularProgress className={classes.circularProgress} />
          )}
          <Dropzone
            accept=".pdf,.png,.jpeg,.jpg"
            maxFiles={1}
            onDrop={(acceptedFiles) => onChangeFile(acceptedFiles)}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <Paper className={classes.paper}>
                  <input {...getInputProps()} data-testid="fileinput" />
                  <InsertDriveFileIcon
                    fontSize="large"
                    className={classes.insertIcon}
                  />
                  <p>Drag 'n' drop a file here, or click to select file</p>
                </Paper>
              </div>
            )}
          </Dropzone>
          {file !== undefined && (
            <Chip
              className={classes.chip}
              label={file?.name}
              onDelete={onDeleteFile}
            />
          )}
        </Container>
        <DialogActions>
          <Button onClick={onSubmit} aria-label="upload">
            Upload
          </Button>
          <Button onClick={handleClose} aria-label="cancel">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
