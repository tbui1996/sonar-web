import { useParams } from 'react-router-dom';
import { Typography } from '@material-ui/core';

export default function View() {
  const params = useParams<{ id: string }>();

  if (!params?.id) {
    return <></>;
  }

  return <Typography>{params.id}</Typography>;
}
