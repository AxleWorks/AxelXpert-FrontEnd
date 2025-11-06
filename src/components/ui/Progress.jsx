import LinearProgress from "@mui/material/LinearProgress";

export const Progress = ({ value = 0, ...props }) => {
  return (
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 8,
        borderRadius: 9999,
        backgroundColor: "primary.light",
        "& .MuiLinearProgress-bar": {
          borderRadius: 9999,
          backgroundColor: "primary.main",
        },
      }}
      {...props}
    />
  );
};
