import { TextField } from "@mui/material";


const fieldSx = {
    input: { color: "white" },
    label: { color: "white" },
    paddingBottom: "10px",
  };


export default function TextFieldJob({
    name,
    label,
    value,
    required = false,
    multiline = false,
    rows,
    type = "text",
    handleChange, 
    isEditing
  }: {
    name: string;
    label: string;
    value: string;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    type?: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=> void;
    isEditing: boolean;
  }) {
    return (
      <TextField
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        sx={fieldSx}
        fullWidth
        required={required}
        multiline={multiline}
        rows={rows}
        type={type}
        disabled={!isEditing}
      />
    );
  }
  