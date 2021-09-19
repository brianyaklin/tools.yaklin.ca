import { createTheme } from "@material-ui/core/styles";

const toolsBlue = "#003049";
const toolsRed = "#D62828";
const toolsOrange = "#F77F00";
const toolsYellow = "#FCBF49";

export default createTheme({
  palette: {
    common: {
      blue: toolsBlue,
      red: toolsRed,
      orange: toolsOrange,
      yellow: toolsYellow,
    },
    primary: {
      main: toolsBlue,
    },
    secondary: {
      main: toolsOrange,
    },
  },
});
