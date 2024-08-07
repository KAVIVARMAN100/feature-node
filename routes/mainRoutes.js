import express from "express";
import vendorRouter from "../modules/vendor/vendorRoutes.js";


const router = express.Router();
console.log("enteringgg");

export default [vendorRouter, router]; 
