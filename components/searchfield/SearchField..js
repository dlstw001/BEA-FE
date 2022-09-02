import { Autocomplete, TextField } from "@mui/material";

export default function SearchField({
  id,
  checked,
  onChange,
  options,
  label,
}) {
  return (
    <Autocomplete
      isOptionEqualToValue={(option, value) => option.id === value.id}
      disablePortal
      blurOnSelect={true}
      disabled={checked}
      id={id}
      onChange={onChange}
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
