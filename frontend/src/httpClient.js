import axios from "axios";
import {base} from "../next.config.js";

export default axios.create({
  withCredentials: true,
  baseURL: base,
});
