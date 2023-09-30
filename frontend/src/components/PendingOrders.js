import {
  Typography,
  Grid,
  Checkbox,
  TableCell,
  Table,
  TableRow,
  TableHead,
  TableBody,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import api from "../api/api";
import styled from "@emotion/styled";
import Loading from "./Loading/Loading";

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

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
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
          }}
        >
          {`Auto-Assign ${selected.length} Selected Order${
            selected.length === 1 ? "" : "s"
          }`}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align={columnAlignments[column]}>
                  {column === "Auto-Assign" ? (
                    <>
                      Select All <br />
                      <StyledCheckbox
                        disabled={isLoading}
                        checked={selected.length === orders.length}
                        onChange={(e) => {
                          e.target.checked
                            ? setSelected(orders.map((_, i) => i))
                            : setSelected([]);
                        }}
                      />
                    </>
                  ) : (
                    column
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((shipment, index) => (
              <TableRow key={index}>
                <TableCell>{shipment["Port of Origin"]}</TableCell>
                <TableCell>{shipment["Port of Destination"]}</TableCell>
                <TableCell>
                  {new Date(
                    shipment["Expected Time of Arrival"]
                  ).toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  {shipment["Weight of Order (tons)"]}
                </TableCell>
                <TableCell align="center">
                  <StyledCheckbox
                    disabled={isLoading}
                    checked={selected.includes(index)}
                    onChange={(e) => {
                      e.target.checked
                        ? setSelected([...selected, index])
                        : setSelected(selected.filter((i) => i !== index));
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default PendingOrders;
