import React from "react";
import psaLogo from "../../psa_logo.png";
import { Grid, Link, styled } from "@mui/material";

const StyledNavbar = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3, 6),
  boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.05)",
  borderRadius: theme.spacing(1.5),
  backgroundColor: "white",
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: "black",
  fontWeight: 500,
  fontFamily: "Roboto",
  textDecoration: "none",
  margin: theme.spacing(0.5),
  padding: theme.spacing(1.5, 2, 1.5, 2),
  borderRadius: theme.spacing(2),
  alignSelf: "center",
  "&:hover": {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.3)",
  },
  transition: "all 0.3s ease",
}));

const Navbar = () => {
  return (
    <StyledNavbar container justifyContent="space-between">
      <a href="/">
        <img src={psaLogo} alt="logo" style={{ width: "100px" }} />
      </a>
      <Grid item sx={{ alignSelf: "center" }}>
        <StyledLink href="/incoming_shipments">Incoming Shipments</StyledLink>
        <StyledLink href="/outgoing_shipments">Outgoing Shipments</StyledLink>
        <StyledLink href="/incoming_orders">Incoming Orders</StyledLink>
      </Grid>
    </StyledNavbar>
  );
};

export default Navbar;
