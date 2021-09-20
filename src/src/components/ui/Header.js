import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import GitHubIcon from "@material-ui/icons/GitHub";

import * as ROUTES from "../../shared/constants/routes";

function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const useStyles = makeStyles((theme) => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: "1.5em",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appbar: {
    zIndex: theme.zIndex.modal + 1,
  },
  homeSiteText: {
    color: theme.palette.common.red,
    fontFamily: "Pacifico",
    fontWeight: 500,
    fontSize: "1.2rem",
    textDecoration: "none",
  },
  drawerContainer: {
    backgroundColor: theme.palette.common.blue,
  },
  drawerItemText: {
    ...theme.typography.tab,
    color: "white",
    fontWeigh: 700,
    textTransform: "None",
  },
  drawerDivider: {
    backgroundColor: "white",
  },
}));

export default function Header() {
  let location = useLocation();
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerGeneralLinks = [
    { name: "Home", path: ROUTES.INDEX },
    { name: "About", path: ROUTES.ABOUT },
  ];
  const drawerToolLinks = [
    { name: "Subnet Calculator", path: ROUTES.SUBNETCALC },
  ];

  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar position="fixed" className={classes.appbar}>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() =>
                drawerOpen ? setDrawerOpen(false) : setDrawerOpen(true)
              }
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" className={classes.title} align="center">
              Network Tools by{" "}
              <a
                href="https://www.yaklin.ca"
                className={classes.homeSiteText}
                rel="noreferrer noopener nofollow"
                target="_blank"
                aria-label="blog"
              >
                Yaklin.ca
              </a>
            </Typography>
            <IconButton
              color="inherit"
              component={Link}
              to={"/"}
              aria-label="homepage"
            >
              <HomeIcon />
            </IconButton>
            <IconButton
              color="inherit"
              component={"a"}
              href="https://github.com/brianyaklin/tools.yaklin.ca"
              rel="noopener noreferrer nofollow"
              target="_blank"
              aria-label="github"
            >
              <GitHubIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbarMargin} />
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        classes={{ paper: classes.drawerContainer }}
      >
        <div className={classes.toolbarMargin} />
        <List>
          {drawerGeneralLinks.map((link, index) => (
            <ListItem
              button
              key={index}
              component={Link}
              to={link.path}
              onClick={() => setDrawerOpen(false)}
              selected={link.path === location.pathname}
            >
              <ListItemText
                primary={link.name}
                className={classes.drawerItemText}
              />
            </ListItem>
          ))}
          <Divider className={classes.drawerDivider} />
          {drawerToolLinks.map((link, index) => (
            <ListItem
              button
              key={index}
              component={Link}
              to={link.path}
              onClick={() => setDrawerOpen(false)}
              selected={link.path === location.pathname}
            >
              <ListItemText
                primary={link.name}
                className={classes.drawerItemText}
              />
            </ListItem>
          ))}
          <Divider className={classes.drawerDivider} />
          <ListItem
            button
            component={"a"}
            href="https://www.yaklin.ca"
            rel="noopener noreferrer nofollow"
            target="_blank"
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemText
              primary="Blog"
              className={classes.homeSiteText}
              disableTypography
            />
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );
}
