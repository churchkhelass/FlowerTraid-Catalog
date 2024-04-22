import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function skeletonCatalog() {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rectangular" width={210} height={250} />
      <Skeleton variant="text" width={210} height={64} sx={{ fontSize: '1rem' }} />
    </Stack>
  );
}