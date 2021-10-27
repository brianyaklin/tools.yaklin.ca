import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import * as CONSTANTS from "../../shared/constants/constants";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "400px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  content: {
    marginTop: theme.spacing(1),
    width: "450px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  attribution: {
    marginTop: theme.spacing(2),
  },
}));

function isAsn(asn) {
  return (
    typeof asn === "number" && isFinite(asn) && asn <= 4294967295 && asn >= 0
  );
}

export default function AsLookup() {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [respData, setRespData] = useState(null);
  const [isInvalidAsn, setIsInvalidAsn] = useState(false);
  const [error, setError] = useState(null);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(null);
  };

  useEffect(() => {
    if (searchValue === "") {
      setIsInvalidAsn(false);
    } else if (isAsn(parseInt(searchValue))) {
      setIsInvalidAsn(false);
    } else {
      setIsInvalidAsn(true);
    }
  }, [searchValue]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    axios
      .get(
        `https://stat.ripe.net/data/as-overview/data.json?sourceapp=${CONSTANTS.RIPE_SRC_APP}&resource=${searchValue}`
      )
      .then((response) => {
        setError(null);
        // setRespData(response.data);
        setRespData([
          { name: "Type", data: response.data.data.type },
          { name: "Resource", data: response.data.data.resource },
          { name: "Holder", data: response.data.data.holder },
          {
            name: "Announced",
            data: response.data.data.announced ? "True" : "False",
          },
          { name: "ASN Block Range", data: response.data.data.block.resource },
          { name: "ASN Block Name", data: response.data.data.block.name },
          {
            name: "ASN Block Description",
            data: response.data.data.block.desc,
          },
        ]);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <Container>
      <Typography gutterBottom variant="h3" align="center">
        BGP ASN Lookup
      </Typography>
      <Container align="center">
        <form noValidate autoComplete="off" onSubmit={onFormSubmit}>
          <TextField
            id="as-search"
            label="ASN"
            variant="outlined"
            size="small"
            helperText="Enter the BGP ASN number you wish to search"
            className={classes.textField}
            value={searchValue}
            type="number"
            onChange={(e) => setSearchValue(e.target.value)}
            error={isInvalidAsn}
          />
          <Button
            type="submit"
            variant="outlined"
            disabled={isInvalidAsn || searchValue === ""}
          >
            Search
          </Button>
        </form>
      </Container>
      <Container className={classes.content}>
        {error ? (
          <Snackbar
            open={error}
            autoHideDuration={3000}
            onClose={handleAlertClose}
          >
            <MuiAlert onClose={handleAlertClose} severity="error">
              Unable to process your request due to {error.message}
            </MuiAlert>
          </Snackbar>
        ) : (
          respData && (
            <TableContainer component={Paper}>
              <Table size="small" aria-label="BGP ASN search result data">
                <caption>Search results for BGP ASN {searchValue}</caption>
                <TableBody>
                  {respData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell align="right">{item.data}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}
      </Container>
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
    </Container>
  );
}
