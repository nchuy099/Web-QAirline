const express = require("express");
const router = express.Router();
const flightPriceController = require("../controllers/flightPriceController");

// ROute cho Flight Prices
router.get("/flight-prices", flightPriceController.getFlightPrices);
router.get(
  "/flight-prices/:id",
  flightPriceController.getFlightPriceByFlightId
);
router.get("/flights-unpriced", flightPriceController.getFlightUnpriced);

router.post("/flight-prices", flightPriceController.addFlightPrice);
router.put("/flight-prices/:id", flightPriceController.updateFlightPrice);
router.delete("/flight-prices/:id", flightPriceController.deleteFlightPrice);
router.patch("/flight-prices/:flightPriceId/update-seat-capacity", flightPriceController.updateSeatCapacity);

router.get("/class-overview", flightPriceController.getClassOverview);

module.exports = router;
