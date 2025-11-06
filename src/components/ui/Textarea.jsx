import { TextField } from '@mui/material';
export const Textarea = (props) => {
  return (
    <TextField
      multiline
      minRows={3}
      fullWidth
      variant="outlined"
      {...props}
    />
  );
}