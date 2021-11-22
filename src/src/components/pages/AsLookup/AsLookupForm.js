import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import * as CONSTANTS from "../../../shared/constants/constants";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "400px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

function isAsn(asn) {
  return (
    typeof asn === "number" && isFinite(asn) && asn <= 4294967295 && asn >= 0
  );
}

const AsLookupForm = (props) => {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [isInvalidAsn, setIsInvalidAsn] = useState(false);

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
    props.setAsnLoading(true);
    props.setAdvPrefLoading(true);
    props.setAsnData(null);
    props.setAdvPrefData(null);

    axios
      .get(
        `https://stat.ripe.net/data/as-overview/data.json?sourceapp=${CONSTANTS.RIPE_SRC_APP}&resource=${searchValue}`
      )
      .then((response) => {
        props.setAsnError(null);
        props.setAsnLoading(false);
        props.setAsnData([
          { title: "Type", data: response.data.data.type },
          { title: "Resource", data: response.data.data.resource },
          { title: "Holder", data: response.data.data.holder },
          {
            title: "Announced",
            data: response.data.data.announced ? "True" : "False",
          },
          { title: "ASN Block Range", data: response.data.data.block.resource },
          { title: "ASN Block Name", data: response.data.data.block.name },
          {
            title: "ASN Block Description",
            data: response.data.data.block.desc,
          },
        ]);
      })
      .catch((error) => {
        props.setAsnError(error);
        props.setAsnLoading(false);
      });

    axios
      .get(
        `https://stat.ripe.net/data/announced-prefixes/data.json?sourceapp=${CONSTANTS.RIPE_SRC_APP}&resource=${searchValue}`
      )
      .then((response) => {
        props.setAdvPrefError(null);
        props.setAdvPrefData(response.data);
        props.setAdvPrefLoading(false);
      })
      .catch((error) => {
        props.setAdvPrefError(error);
        props.setAdvPrefLoading(false);
      });
  };

  return (
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
  );
};

export default AsLookupForm;
