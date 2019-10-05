import { createMuiTheme } from '@material-ui/core/styles';

class Theme {

  constructor (type, custom) {

    this.type = type || "dark";

    this.theme = {};

    this.setPalette(this.type);

    this.theme.typography = {
      useNextVariants: true
    };
    this.theme.overrides = {
      MuiButton: {
        contained: {
          width: "90%",
          margin: "10px auto",
          display: "block"
        }
      },
      MuiPaper: {
        root: {
          padding: "1em",
          overflow: "auto"
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
      MuiRadio: {
        colorPrimary: {
          color: this.theme.palette.primary.main,
          "&$disabled": {
            color: this.theme.palette.primary.main,
            opacity: 0.38
          }
        }
      },
      MuiCheckbox: {
        colorPrimary: {
          color: this.theme.palette.primary.main,
          "&$disabled": {
            color: this.theme.palette.primary.main,
            opacity: 0.38
          }
        },
        root: {
          padding: 0
        }
      },
      MuiFormLabel: {
        root: {
          color: "inherit",
          "&$focused": {
            color: this.theme.palette.primary.main
          }
        }
      },
      MuiInputBase: {
        root: {
          color: "inherit"
        }
      },
      MuiFilledInput: {
        underline: {
          "&:after": {
            borderBottom: "2px solid " + this.theme.palette.primary.main
          }
        }
      },
      MuiTypography: {
        colorTextSecondary: {
          color: "inherit"
        },
        body1:{
          color: "inherit"
        },
        body2:{
          color: "inherit"
        },
        root: {
          color: "inherit"
        }
      },
      MuiIconButton: {
        root: {
          color: "inherit"
        }
      }
    };
    
  }

  setPalette(type) {
    switch (type) {
      case "dark":
        this.theme.palette = this.getDark();
        break;
      case "light":
        this.theme.palette = this.getLight();
        break;
      case "custom":
      default:
        this.theme.palette = this.getDark();
        break;
    }
  }

  getTheme() {
    return createMuiTheme(this.theme);
  }

  getDark() {
    return {
      "common": {
          "black":"#313539",
          "white":"#fff",
          "main":"#fff"
      },
      "background": {
          "paper": "#1f2229",
          "default":"#282c34",
          "search": "#FFFFFF"
      },
      "primary": {
          "light":"rgb(77, 171, 245)",
          "main":"rgb(33, 150, 243)",
          "dark":"rgb(23, 105, 170)",
          "contrastText":"#fff"
      },
      "error": {
          "light":"#e57373",
          "main":"#f44336",
          "dark":"#d32f2f",
          "contrastText":"#fff"
      },
      "text": {
          "primary":"rgba(0, 0, 0, 0.87)",
          "secondary":"rgba(0, 0, 0, 0.54)",
          "disabled":"rgba(0, 0, 0, 0.38)",
          "hint":"rgba(0, 0, 0, 0.38)"
      }
    }
  }

  getLight() {
    return {
      "common": {
          "black":"#313539",
          "white":"#fff",
          "main":"#313539"
      },
      "background": {
          "paper": "rgb(255, 255, 255)",
          "default":"#EEEEEE",
          "search": "#000000"
      },
      "primary": {
          "light":"rgb(77, 171, 245)",
          "main":"rgb(33, 150, 243)",
          "dark":"rgb(23, 105, 170)",
          "contrastText":"#fff"
      },
      "error": {
          "light":"#e57373",
          "main":"#f44336",
          "dark":"#d32f2f",
          "contrastText":"#fff"
      },
      "text": {
          "primary":"rgba(0, 0, 0, 0.87)",
          "secondary":"rgba(0, 0, 0, 0.54)",
          "disabled":"rgba(0, 0, 0, 0.38)",
          "hint":"rgba(0, 0, 0, 0.38)"
      }
    }
  }
}

export default Theme;