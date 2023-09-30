import React from "react";
import psaLogo from "../../psa_logo.png";
import { Grid, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { AccountCircleTwoTone } from "@mui/icons-material";

const StyledNavbar = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3, 6),
  boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.05)",
  borderRadius: theme.spacing(1.5),
  backgroundColor: "white",
  zIndex: 2,
  position: "sticky",
  top: 0,
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: "black",
  fontWeight: 500,
  fontFamily: "Roboto",
  textDecoration: "none",
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(1.7, 2, 1.5, 2),
  borderRadius: theme.spacing(2),
  "&:hover": {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, 0.4)",
  },
  transition: "all 0.3s ease",
}));

const Navbar = () => {
  return (
    <StyledNavbar container>
      <Grid item>
        <a href="/">
          <img src={psaLogo} alt="logo" style={{ width: "100px" }} />
        </a>
      </Grid>
      <Grid container item xs justifyContent="flex-end">
        <StyledLink to="/incoming_shipments">Incoming Shipments</StyledLink>
        <StyledLink to="/outgoing_shipments">Outgoing Shipments</StyledLink>
        <StyledLink to="/pending_orders">Pending Orders</StyledLink>
        <Grid item alignSelf="center" sx={{ pl: 2, cursor: "pointer" }}>
          <AccountCircleTwoTone fontSize="large" />
        </Grid>
      </Grid>
    </StyledNavbar>
  );
};

export default Navbar;
