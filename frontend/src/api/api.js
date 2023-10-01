import axios from "axios";

const api = axios.create({
  baseURL: "https://sprinters-backend-d5a26399c495.herokuapp.com/api",
});

export default api;
