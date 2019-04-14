import { createMuiTheme } from '@material-ui/core/styles';

const primaryRGB = "33, 150, 243"; // Primary blue color

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "rgb(" + primaryRGB + ")"
    }
  },
  overrides: {
    MuiButton: {
      root: {
        backgroundColor: "rgba("+primaryRGB+", 0)",
        margin: 0,
        color: "inherit",
        display: "block",
        textAlign: "left",
        "&:hover": {
          backgroundColor: "rgba("+primaryRGB+", 0.4)"
        }
      },
      flat: {
        margin: "5px auto"
      },
      outlined: {
        border: "1px solid rgba("+primaryRGB+", 0.5)",
        color: "#2196f3",
        "&:hover": {
          backgroundColor: "rgba("+primaryRGB+", 0.1)",
          borderColor: "#2196f3"
        }
      }
    },
    MuiRadio: {
      colorPrimary: {
        color: "rgb("+primaryRGB+")",
        "&$disabled": {
          color: "rgba("+primaryRGB+", 0.26)"
        }
      },
      root: {
        color: "inherit"
      }
    },
    MuiFormGroup: {
      row: {
        display: "inline-block"
      }
    },
    MuiFormControlLabel: {
      label: {
        color: "inherit",
        "&$disabled": {
          color: "inherit",
          opacity: "0.38"
        }
      }
    },
    MuiCheckbox: {
      colorPrimary: {
        color: "rgb("+primaryRGB+")",
        "&$disabled": {
          color: "rgba("+primaryRGB+", 0.26)"
        }
      },
      root: {
        padding: 0,
        "&$checked": {
          color: "rgb("+primaryRGB+")"
        }
      }
    }
  },

});

export default theme;