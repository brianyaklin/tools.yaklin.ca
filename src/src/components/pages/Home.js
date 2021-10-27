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
import BuildIcon from "@material-ui/icons/Build";
import SearchIcon from "@material-ui/icons/Search";

import CalculatorImage from "../../assets/charles-deluvio-GlavtG-umzE-unsplash.jpg";
import MapImage from "../../assets/delfi-de-la-rua-vfzfavUZmfc-unsplash.jpg";

import * as ROUTES from "../../shared/constants/routes";

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
      ariaLabel: "Subnet calculator tool",
      description: "A subnet calculator for IPv4 addresses and networks.",
      actionIcon: <BuildIcon />,
      to: ROUTES.SUBNETCALC,
      media: {
        image: CalculatorImage,
        title: "Subnet Calculator",
      },
    },
    {
      title: "BGP ASN Lookup",
      ariaLabel: "BGP ASN lookup tool",
      description: "Search for details on a BGP ASN.",
      actionIcon: <SearchIcon />,
      to: ROUTES.ASLOOKUP,
      media: {
        image: MapImage,
        title: "BGP ASN Lookup",
      },
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
                image={card.media.image}
                title={card.media.title}
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
