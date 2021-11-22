import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

import RipeAttribution from "../../ui/RipeAttribution";
import DescriptiveTable from "../../ui/DescriptiveTable";
import AsLookupForm from "./AsLookupForm";
import AdvPrefixTable from "./AdvPrefixTable";

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: theme.spacing(1),
    width: "600px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  loading: {
    display: "flex",
    justifyContent: "center",
  },
}));

const AsLookup = () => {
  const classes = useStyles();
  const [asnData, setAsnData] = useState(null);
  const [asnError, setAsnError] = useState(null);
  const [asnLoading, setAsnLoading] = useState(null);
  const [advPrefData, setAdvPrefData] = useState(null);
  const [advPrefError, setAdvPrefError] = useState(null);
  const [advPrefLoading, setAdvPrefLoading] = useState(false);

  const handleAsnAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAsnError(null);
  };

  const handleAdvPrefAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAsnError(null);
  };

  return (
    <Container>
      <Typography gutterBottom variant="h3" align="center">
        BGP ASN Lookup
      </Typography>
      <Container align="center">
        <AsLookupForm
          setAsnError={setAsnError}
          setAsnData={setAsnData}
          setAsnLoading={setAsnLoading}
          setAdvPrefError={setAdvPrefError}
          setAdvPrefData={setAdvPrefData}
          setAdvPrefLoading={setAdvPrefLoading}
        />
      </Container>
      <Container className={classes.content}>
        {asnLoading && (
          <>
            <Typography variant="subtitle1" align="center">
              Loading BGP ASN details.
            </Typography>
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          </>
        )}
        {asnError ? (
          <Snackbar
            open={asnError}
            autoHideDuration={3000}
            onClose={handleAsnAlertClose}
          >
            <MuiAlert onClose={handleAsnAlertClose} severity="error">
              Unable to obtain BGP ASN summary data due to {asnError.message}
            </MuiAlert>
          </Snackbar>
        ) : (
          asnData && (
            <DescriptiveTable
              size="small"
              ariaLabel="BGP ASN search result data"
              caption="BGP ASN search results"
              data={asnData}
            />
          )
        )}
        {advPrefLoading && (
          <>
            <Typography variant="subtitle1" align="center">
              Loading list of advertised prefixes.
            </Typography>
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          </>
        )}
        {advPrefError ? (
          <Snackbar
            open={asnError}
            autoHideDuration={3000}
            onClose={handleAdvPrefAlertClose}
          >
            <MuiAlert onClose={handleAdvPrefAlertClose} severity="error">
              Unable to obtain BGP ASN advertised prefix data due to{" "}
              {advPrefError.message}
            </MuiAlert>
          </Snackbar>
        ) : (
          advPrefData && <AdvPrefixTable prefixes={advPrefData.data.prefixes} />
        )}
      </Container>
      <RipeAttribution />
    </Container>
  );
};

export default AsLookup;
