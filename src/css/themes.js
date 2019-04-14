import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      main: "#2196f3"
    }
  },
  overrides: {
    MuiButton: {
      root: {
        backgroundColor: "rgba(33, 150, 243, 0)",
        margin: 0,
        color: "inherit",
        display: "block",
        textAlign: "left",
        "&:hover": {
          backgroundColor: "rgba(33, 150, 243, 0.4)"
        }
      },
      flat: {
        margin: "5px auto"
      },
      outlined: {
        border: "1px solid rgba(33, 150, 243, 0.5)",
        color: "#2196f3",
        "&:hover": {
          backgroundColor: "rgba(33, 150, 243, 0.1)",
          borderColor: "#2196f3"
        }
      }
    },
    MuiTypography: {
      body2: {
        color: "inherit"
      }
    },
    MuiRadio: {
      root: {
        color: "inherit"
      }
    },
    MuiFormGroup: {
      row: {
        display: "inline-block"
      }
    }
  },

});

export default theme;