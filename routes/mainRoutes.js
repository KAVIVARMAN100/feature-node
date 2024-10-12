import express from "express";
import rhyminRoutes from "../modules/vendor/rhyminAPI.js";


const router = express.Router();

export default [rhyminRoutes, router]; 
