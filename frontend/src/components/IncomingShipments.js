import {
  Typography,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import ProgressBar from "./ProgressBar/ProgressBar";
import Loading from "./Loading/Loading";
import styled from "@emotion/styled";
import { ShipmentsContext } from "../App";
import { useNavigate } from "react-router-dom";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.secondary,
    color: theme.palette.common.white,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const IncomingShipments = () => {
  const [shipments, setShipments] = useContext(ShipmentsContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching data from the Flask API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (shipments.incoming.length > 0) return;
      const response = (await api.get("/ships")).data.incoming;
      setShipments({
        ...shipments,
        incoming: response.map((shipment) => ({
          ...shipment,
          ["Orders"]: [],
          ["Weight of Order (tons)"]: 0,
        })),
      });
    } catch (error) {
      console.error("Error fetching incoming shipments:", error);
    }
  };

  const columns = [
    "Shipping Line",
    "Vessel Capacity (tonnes)",
    "Port of Origin",
    "Port of Destination",
    "Departure Time",
    "Arrival Time",
    "Priority",
    "Cargo Type",
    "Idle Time (hours)",
    "Weight of Order (tons)",
    "% Capacity",
  ];
  const columnAlignments = {
    "% Capacity": "center",
  };

  if (shipments.length === 0) return <Loading />;

  return (
    <Grid container sx={{ px: 8, pb: 8 }}>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mx: 3, my: 5 }}
          textAlign="left"
          fontWeight="500"
        >
          Incoming Shipments
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <StyledTableCell key={index} align={columnAlignments[column]}>
                    {column}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {shipments.incoming.map((shipment, index) => (
                <StyledTableRow
                  key={index}
                  onClick={() => navigate(`/shipment/${shipment["Ship ID"]}`)}
                >
                  <TableCell>{shipment["Shipping Line"]}</TableCell>
                  <TableCell>{shipment["Vessel Capacity (tonnes)"]}</TableCell>
                  <TableCell>{shipment["Port of Origin"]}</TableCell>
                  <TableCell>{shipment["Port of Destination"]}</TableCell>
                  <TableCell>
                    {new Date(shipment["Departure Time"]).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(shipment["Arrival Time"]).toLocaleString()}
                  </TableCell>
                  <TableCell>{shipment["Priority"]}</TableCell>
                  <TableCell>{shipment["Cargo Type"]}</TableCell>
                  <TableCell>{shipment["Idle Time (hours)"]}</TableCell>
                  <TableCell>{shipment["Weight of Order (tons)"]}</TableCell>
                  <TableCell>
                    <ProgressBar
                      width={`${
                        Math.min((shipment["Weight of Order (tons)"] /
                          shipment["Vessel Capacity (tonnes)"]) *
                        100, 99.23)
                      }%`}
                    />
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default IncomingShipments;
