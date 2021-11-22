import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  attribution: {
    marginTop: theme.spacing(2),
  },
}));

const RipeAttribution = () => {
  const classes = useStyles();
  return (
    <Container className={classes.attribution}>
      <Typography variant="subtitle1" align="center">
        This tool would not be possible without the public API's at{" "}
        <a
          href="https://stat.ripe.net/docs/data_api"
          rel="noreferrer noopener nofollow"
          target="_blank"
        >
          RIPE.net
        </a>
        <span role="img" aria-label="sheep">
          👏
        </span>
      </Typography>
    </Container>
  );
};

export default RipeAttribution;
