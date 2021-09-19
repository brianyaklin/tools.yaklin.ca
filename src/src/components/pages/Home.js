import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import SearchIcon from "@material-ui/icons/Search";
import BuildIcon from "@material-ui/icons/Build";

import TechImage from "../../assets/TechImage.jpg";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    minWidth: 275,
    maxWidth: 275,
    height: "100%",
  },
  toolIcon: {
    marginLeft: "auto",
  },
  avatar: {
    backgroundColor: theme.palette.common.orange,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
}));

export default function Home() {
  const classes = useStyles();
  const toolCards = [
    {
      title: "Subnet Calculator",
      ariaLabel: "mac search tool",
      description: "A subnet calculator for IPv4 addresses.",
      actionIcon: <BuildIcon />,
      to: "/subnet-calculator",
    },
    {
      title: "MAC Vendor Search",
      ariaLabel: "subnet tool",
      description: "MAC address vendor search.",
      actionIcon: <SearchIcon />,
      to: "/mac-vendor-search",
    },
  ];

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center">
        {toolCards.map((card, index) => (
          <Grid key={index} item>
            <Card className={classes.cardRoot} variant="outlined">
              <CardHeader
                avatar={
                  <Avatar
                    aria-label={card.ariaLabel}
                    className={classes.avatar}
                    variant="rounded"
                  >
                    {card.actionIcon}
                  </Avatar>
                }
                action={
                  <IconButton
                    aria-label="use tool"
                    component={Link}
                    to={card.to}
                  >
                    <DoubleArrowIcon />
                  </IconButton>
                }
                title={card.title}
              />
              <CardMedia
                className={classes.media}
                image={TechImage}
                title="tech image"
              />
              <CardContent>
                <Typography variant="body2" component="p">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
