import { useState, useCallback } from 'react';
import { Container, Card, Box, Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import useForm, {
  FormProvider,
  DEFAULT_TEXT,
  OptionsInput
} from '../../hooks/useForm';

import { PATH_DASHBOARD } from '../../routes/paths';
import InputComponent from '../../components/general/forms/Input';
import ConfirmDialog from '../../components/general/app/ConfirmDialog';

function Form() {
  // select an input as active, after which the sidebar moves to it
  // be able to add an input after another input regardless of where it's at
  // have a single input component that can change types
  // - if you change the type, it wipes the saved data for that input
  const history = useHistory();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState(0);
  const [creating, setCreating] = useState(false);
  const {
    inputs,
    setInputs,
    title,
    setTitle,
    description,
    setDescription
  } = useForm();

  const handleInsertAfter = (order: number) => {
    setInputs((draft) => {
      draft.splice(order + 1, 0, { ...DEFAULT_TEXT, order: order + 1 });
      draft.forEach((input, index) => {
        if (index > order + 1) {
          input.order += 1;
        }
      });
    });
  };

  const handleDelete = (order: number) => {
    setInputs((draft) => {
      if (order === draft.length - 1) {
        setSelected(draft.length - 2);
      }

      draft.splice(order, 1);
      draft.forEach((input, index) => {
        if (index >= order) {
          input.order -= 1;
        }
      });
    });
  };

  const handleCreateForm = useCallback(async () => {
    setOpenConfirm(false);
    setCreating(true);
    const res = await axios
      .post('https://api.sonar.circulo.dev/forms', {
        title,
        description,
        inputs: inputs.map((item) => {
          if (item.type === 'text') {
            return item;
          }

          return {
            ...item,
            options: JSON.stringify((item as OptionsInput).options)
          };
        })
      })
      .catch((e) => {
        console.log(e);
      });

    setCreating(false);

    if (!res) {
      history.push(`/dashboard/forms`);
      return;
    }

    history.push(`/dashboard/forms/${res.data.string}`);
  }, [title, description, inputs, history]);

  return (
    <>
      <Box
        sx={{
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Card
          sx={{
            minWidth: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <TextField
            fullWidth
            required
            disabled={creating}
            helperText="Enter the Title for your Form"
            placeholder="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              marginBottom: '1rem'
            }}
          />
          <TextField
            fullWidth
            multiline
            disabled={creating}
            minRows={3}
            placeholder="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              marginBottom: '1rem'
            }}
          />
        </Card>
        <Box id="inputs" sx={{ minWidth: '50%' }}>
          {inputs.map((input) => (
            <Box key={input.order} sx={{ marginTop: '1rem' }}>
              <InputComponent
                disabled={creating}
                order={input.order}
                selected={selected === input.order}
                onSelect={() => setSelected(input.order)}
                onInsertAfter={() => handleInsertAfter(input.order)}
                onDelete={() => handleDelete(input.order)}
              />
            </Box>
          ))}
        </Box>
        <Card
          sx={{
            margin: '2rem',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              variant="contained"
              onClick={() => setOpenConfirm(true)}
              disabled={creating}
            >
              Create
            </Button>
          </Box>
        </Card>
      </Box>
      <ConfirmDialog
        open={openConfirm}
        title="Are you sure you want to create this form?"
        description="This form will be sent out to the specified providers and cannot be undone."
        onConfirm={handleCreateForm}
        onCancel={() => setOpenConfirm(false)}
      />
    </>
  );
}

export default function Create() {
  return (
    <Page title="Create Form | Sonar">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Create Form"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Forms', href: PATH_DASHBOARD.modalities.forms.root },
            { name: 'Create Form' }
          ]}
        />
        <FormProvider>
          <Form />
        </FormProvider>
      </Container>
    </Page>
  );
}
