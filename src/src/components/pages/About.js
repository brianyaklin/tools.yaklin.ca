import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "700px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

export default function Home() {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Container>
        <Typography variant="h3" align="center" gutterBottom>
          So whats this all about?
        </Typography>
        <Typography variant="body1" gutterBottom>
          Hello and welcome to my site, I'm Brian Yaklin, a network engineer by
          day and a hobbyist web designer and blogger by night! I have been in
          the IT industry since around 2002 and over that period of time have
          come across various different tools that I use on a semi-frequent
          basis. In an effort to improve my frontend and backend developement
          knowledge I thought that I would bridge my daytime role with my hobby
          and make a tools site.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Part of the reason I wanted to create a tools site was to have a
          single location for the more common tools that I use. I'm always
          looking to add new tools and improve on the existing ones. The source
          code for this site is available on Github, please see the license in
          Github for more details. If you encounter any issues with the tools or
          would like some features added, please feel free to create an Issue on
          Github for this project.
        </Typography>
      </Container>
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Shout-Outs
        </Typography>
        <Typography variant="body1">
          A few shout-outs that I would like to make. This site wouldn't be
          possible without a few noteworthy projects and services.
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              <a
                href="https://unsplash.com/"
                rel="noreferrer noopener nofollow"
                target="_blank"
              >
                Unsplash
              </a>{" "}
              for amazing free images!
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <a
                href="https://stat.ripe.net/docs/data_api"
                rel="noreferrer noopener nofollow"
                target="_blank"
              >
                RIPEstat
              </a>{" "}
              for access to their public data API's
            </Typography>
          </li>
        </ul>
      </Container>
    </Container>
  );
}
