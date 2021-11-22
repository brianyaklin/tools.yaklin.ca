import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/ToolTip";
import IconButton from "@material-ui/core/IconButton";
import LinkIcon from "@material-ui/icons/Link";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import getSubnetInfo from "../../../shared/utils/ipUtil";
import * as ROUTES from "../../../shared/constants/routes";

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
  iconContainer: {
    marginBottom: theme.spacing(1),
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SubnetCalculator() {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [ip, setIp] = useState(null);
  const [mask, setMask] = useState(null);
  const [subnetInfo, setSubnetInfo] = useState(null);
  const [copyLinkOpen, setCopyLinkOpen] = useState(false);
  const [copyResultsOpen, setCopyResultsOpen] = useState(false);
  const [hiddenCopyArea, setHiddenCopyArea] = useState("");
  const resultDataRef = useRef();
  let query = useQuery();
  const history = createBrowserHistory();

  useEffect(() => {
    let queryIp = query.get("ip");
    let queryPrefix = query.get("prefix");
    if (queryIp && queryPrefix) {
      setSearchValue(queryIp + "/" + queryPrefix);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Identify IP address
      let matchIpResult = searchValue.match(
        /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g
      );
      if (matchIpResult) {
        setIp(matchIpResult[0]);
      } else {
        setIp(null);
      }

      // Identify dotted decimal mask or prefix length
      let matchMaskLengthResult = searchValue.match(
        /\/1[0-9]|\/2[0-9]|\/3[0-2]|\/[0-9]/
      );
      let matchMaskDottedResult = searchValue.match(
        /(((255\.){3}(255|254|252|248|240|224|192|128+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))/g
      );

      if (matchMaskLengthResult || matchMaskDottedResult) {
        if (matchMaskLengthResult) {
          setMask(matchMaskLengthResult[0].replace("/", ""));
        } else if (matchMaskDottedResult) {
          setMask(matchMaskDottedResult[0]);
        }
      } else {
        matchMaskLengthResult = "/32";
        setMask("32");
      }

      if (ip && mask) {
        if (matchMaskLengthResult) {
          setSubnetInfo(getSubnetInfo(ip, parseInt(mask)));
        } else if (matchMaskDottedResult) {
          setSubnetInfo(getSubnetInfo(ip, mask));
        }
        history.push({
          pathname: ROUTES.SUBNETCALC,
          search: `?ip=${ip}&prefix=${mask}`,
        });
      } else {
        // Clear subnetInfo variable if a IP and mask aren't found
        setSubnetInfo(null);
        history.push({
          pathname: ROUTES.SUBNETCALC,
        });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue, mask, ip]);

  useEffect(() => {
    let resultText = "";
    if (subnetInfo) {
      resultText = `Subnet Information for network ${subnetInfo.networkAddress}/${subnetInfo.prefixLength}:
Generated by https://tools.yaklin.ca
-------------------------------------------------------------------
Searched Text: ${searchValue}
IP: ${subnetInfo.ip}
Is Public? ${subnetInfo.isPublic}
Mask: ${subnetInfo.dottedMask}
Wildcard Mask: ${subnetInfo.wildcardMask}
Prefix Length: ${subnetInfo.prefixLength}
Class: ${subnetInfo.class}
Network Address: ${subnetInfo.networkAddress}
Broadcast Address: ${subnetInfo.broadcastAddress}
Host Range: ${subnetInfo.hostRange.start} to ${subnetInfo.hostRange.end}
Number of Hosts: ${subnetInfo.hostQuantity}
-------------------------------------------------------------------`;
      setHiddenCopyArea(resultText);
    }
  }, [subnetInfo, searchValue]);

  const handleCopyLinkClick = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        setCopyLinkOpen(true);
      },
      (error) => {
        console.log("copy to clipboard failed");
      }
    );
  };

  const handleCopyResultsClick = () => {
    navigator.clipboard.writeText(resultDataRef.current.value).then(
      () => {
        setCopyResultsOpen(true);
      },
      (error) => {
        console.log("copy to clipboard failed");
      }
    );
  };

  const handleCopyLinkClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCopyLinkOpen(false);
  };

  const handleCopyResultsClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCopyResultsOpen(false);
  };

  return (
    <Container>
      <Typography gutterBottom variant="h3" align="center">
        Subnet Calculator
      </Typography>
      <Container align="center">
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <TextField
            id="subnet-search"
            label="IP Address and Mask"
            variant="outlined"
            size="small"
            helperText="Enter the IP address and network mask as a prefix length (eg. /24) or in dotted decimal notation (eg. 255.255.255.0). If only an IP address is provided, mask length will be set to 32."
            className={classes.textField}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </Container>
      {subnetInfo && (
        <Container className={classes.content}>
          {navigator.clipboard && (
            <Container
              disableGutters
              align="right"
              className={classes.iconContainer}
            >
              <Tooltip title="Copy Link">
                <IconButton onClick={handleCopyLinkClick}>
                  <LinkIcon aria-label="copy link details" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy Results">
                <IconButton onClick={handleCopyResultsClick}>
                  <FileCopyIcon aria-label="copy result details" />
                </IconButton>
              </Tooltip>
            </Container>
          )}
          <TableContainer component={Paper}>
            <Table size="small" aria-label="Subnet search result data">
              <caption>
                Subnet information for network {subnetInfo.networkAddress}/
                {subnetInfo.prefixLength}
              </caption>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    IP
                  </TableCell>
                  <TableCell align="right">{subnetInfo.ip}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Is Public?
                  </TableCell>
                  <TableCell align="right">{subnetInfo.isPublic}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Mask
                  </TableCell>
                  <TableCell align="right">{subnetInfo.dottedMask}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Wildcard Mask
                  </TableCell>
                  <TableCell align="right">{subnetInfo.wildcardMask}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Prefix Length
                  </TableCell>
                  <TableCell align="right">{subnetInfo.prefixLength}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Class
                  </TableCell>
                  <TableCell align="right">{subnetInfo.class}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Network Address
                  </TableCell>
                  <TableCell align="right">
                    {subnetInfo.networkAddress}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Broadcast Address
                  </TableCell>
                  <TableCell align="right">
                    {subnetInfo.broadcastAddress}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Host Range
                  </TableCell>
                  <TableCell align="right">
                    {subnetInfo.hostRange.start} to {subnetInfo.hostRange.end}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Number of Hosts
                  </TableCell>
                  <TableCell align="right">{subnetInfo.hostQuantity}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Snackbar
            open={copyLinkOpen}
            autoHideDuration={3000}
            onClose={handleCopyLinkClose}
          >
            <MuiAlert onClose={handleCopyLinkClose} severity="success">
              Link copied to clipboard!
            </MuiAlert>
          </Snackbar>
          <Snackbar
            open={copyResultsOpen}
            autoHideDuration={3000}
            onClose={handleCopyResultsClose}
          >
            <MuiAlert onClose={handleCopyResultsClose} severity="success">
              Subnet info copied to clipboard!
            </MuiAlert>
          </Snackbar>
          <textarea
            hidden
            defaultValue={hiddenCopyArea}
            ref={resultDataRef}
          ></textarea>
        </Container>
      )}
    </Container>
  );
}