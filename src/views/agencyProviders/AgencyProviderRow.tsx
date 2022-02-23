import React from 'react';
import { TableCell, TableRow, useTheme, IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
// import { AgencyProviderDetails } from '../../hooks/domain/queries/useGetAgencyProviders';

interface AgencyProvderDetail {
  handleClick: () => void;
  agencyProviderId: string;
  doddNumber: string;
  nationalProviderId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  businessName: string;
  businessTIN: string;
  businessAddress1: string;
  businessAddress2: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  createdTimestamp: string;
  lastModifiedTimestamp: string;
}
const AgencyProviderRow: React.FC<AgencyProvderDetail> = ({
  handleClick,
  agencyProviderId,
  doddNumber,
  nationalProviderId,
  firstName,
  middleName,
  lastName,
  suffix,
  businessName,
  businessTIN,
  businessAddress1,
  businessAddress2,
  businessCity,
  businessState,
  businessZip,
  createdTimestamp,
  lastModifiedTimestamp
}) => {
  const theme = useTheme();
  console.log(typeof doddNumber);
  return (
    <>
      <TableRow
        data-testid="agencyProvider-row-root"
        role="checkbox"
        sx={{
          borderBottom: `1px solid ${theme.palette.primary.lighter}`
        }}
      >
        <TableCell>
          <IconButton onClick={handleClick} color="primary">
            <Edit />
          </IconButton>
        </TableCell>
        <TableCell>{agencyProviderId}</TableCell>
        <TableCell>{doddNumber}</TableCell>
        <TableCell>{nationalProviderId}</TableCell>
        <TableCell>{firstName}</TableCell>
        <TableCell>{middleName}</TableCell>
        <TableCell>{lastName}</TableCell>
        <TableCell>{suffix}</TableCell>
        <TableCell>{businessName}</TableCell>
        <TableCell>{businessTIN}</TableCell>
        <TableCell>{businessAddress1}</TableCell>
        <TableCell>{businessAddress2}</TableCell>
        <TableCell>{businessCity}</TableCell>
        <TableCell>{businessState}</TableCell>
        <TableCell>{businessZip}</TableCell>
        <TableCell>{createdTimestamp}</TableCell>
        <TableCell>{lastModifiedTimestamp}</TableCell>
      </TableRow>
    </>
  );
};

export default AgencyProviderRow;
