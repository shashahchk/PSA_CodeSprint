import {
  Typography,
  Grid,
  Checkbox,
  TableCell,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Button,
  Paper,
  TableContainer,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import styled from "@emotion/styled";
import Loading from "./Loading/Loading";
import { StyledTableCell, StyledTableRow } from "./IncomingShipments";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { ShipmentsContext } from "../App";

const LoadingContainer = styled.div(() => ({
  position: "fixed",
  zIndex: 2,
  left: "50%",
}));

const BlurFilter = styled.div`
  backdrop-filter: blur(7px);
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.03);
`;

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
  "&.Mui-disabled": {
    color: theme.palette.grey[300],
  },
}));

const StyledAllCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.grey[300],
  "&.Mui-checked": {
    color: theme.palette.grey[300],
  },
  "&.Mui-disabled": {
    color: theme.palette.grey[300],
  },
}));

const StyledIndeterminateCheckbox = styled(IndeterminateCheckBoxIcon)(
  ({ theme }) => ({
    color: theme.palette.grey[300],
  })
);

const PendingOrders = () => {
  const [orders, setOrders] = useState([]); // ALL ORDERS as sent by the API
  const [shipments, setShipments, assignedOrders, setAssignedOrders] =
    useContext(ShipmentsContext);
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetching data from the Flask API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/orders");
      setOrders([...response.data.incoming, ...response.data.outgoing]);
    } catch (error) {
      console.error("Error fetching incoming orders:", error);
    }
  };

  const columns = [
    "Port of Origin",
    "Port of Destination",
    "Expected Time of Arrival",
    "Weight of Order (tons)",
    "Auto-Assign",
  ];
  const columnAlignments = {
    "Weight of Order (tons)": "right",
    "Auto-Assign": "center",
  };

  if (orders.length === 0) return <Loading />;

  const shownOrders = orders.filter(
    (order) => !assignedOrders.includes(order["Order ID"])
  );

  return (
    <Grid container rowGap={2} sx={{ px: 32, py: 4 }}>
      {isLoading && (
        <>
          <BlurFilter />
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        </>
      )}
      <Grid container item xs={12} justifyContent="space-between">
        <Typography
          variant="h4"
          component="h1"
          sx={{ m: 3 }}
          textAlign="left"
          fontWeight="500"
        >
          Pending Orders
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ m: 3, borderRadius: 3 }}
          disabled={selected.length === 0 || isLoading}
          onClick={async () => {
            setIsLoading(true);
            const totalOrders = [...selected, ...assignedOrders];
            const response = await api.post("/assign_orders", {
              ids: totalOrders,
            });
            setShipments({
              incoming: 
                shipments.incoming.map(shipment => {
                  const newShipment = response.data.find(s => s["Ship ID"] === shipment["Ship ID"]);
                  console.log(newShipment)
                  if (!newShipment) return shipment;
                  return {
                    ...newShipment,
                    ["Weight of Order (tons)"]: newShipment["Orders"].reduce(
                      (acc, order) => acc + order["Weight of Order (tons)"],
                      0
                    ),
                  }
                }),
              outgoing: 
                shipments.outgoing.map(shipment => {
                  const newShipment = response.data.find(s => s["Ship ID"] === shipment["Ship ID"]);
                  if (!newShipment) return shipment;
                  return {
                    ...newShipment,
                    ["Weight of Order (tons)"]: newShipment["Orders"].reduce(
                      (acc, order) => acc + order["Weight of Order (tons)"],
                      0
                    ),
                  }
                })
              
            });
            setAssignedOrders(totalOrders);
            setSelected([]);
            setIsLoading(false);
          }}
        >
          {`Auto-Assign ${selected.length} Selected Order${
            selected.length === 1 ? "" : "s"
          }`}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <StyledTableCell key={index} align={columnAlignments[column]}>
                    {column === "Auto-Assign" ? (
                      <>
                        Select All <br />
                        <StyledAllCheckbox
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < orders.length
                          }
                          indeterminateIcon={<StyledIndeterminateCheckbox />}
                          disabled={isLoading}
                          checked={selected.length === orders.length}
                          onChange={(e) => {
                            e.target.checked
                              ? setSelected(
                                  orders.map((order) => order["Order ID"])
                                )
                              : setSelected([]);
                          }}
                        />
                      </>
                    ) : (
                      column
                    )}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {shownOrders.length === 0 ? (
                <StyledTableRow>
                  <TableCell colSpan={5} align="center">
                    No orders in this shipment
                  </TableCell>
                </StyledTableRow>
              ) : (
                shownOrders.map((order) => (
                  <StyledTableRow key={order["Order ID"]}>
                    <TableCell>{order["Port of Origin"]}</TableCell>
                    <TableCell>{order["Port of Destination"]}</TableCell>
                    <TableCell>
                      {new Date(
                        order["Expected Time of Arrival"]
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {order["Weight of Order (tons)"]}
                    </TableCell>
                    <TableCell align="center">
                      <StyledCheckbox
                        disabled={isLoading}
                        checked={selected.includes(order["Order ID"])}
                        onChange={(e) => {
                          e.target.checked
                            ? setSelected([...selected, order["Order ID"]])
                            : setSelected(
                                selected.filter((i) => i !== order["Order ID"])
                              );
                        }}
                      />
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default PendingOrders;
