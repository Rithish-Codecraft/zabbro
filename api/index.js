import { createRequestHandler } from "react-router";
import * as build from "../build/server/index.js";

export default createRequestHandler(build);
