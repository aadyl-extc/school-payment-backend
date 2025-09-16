const express = require("express");
const router = express.Router();
const { createPayment } = require("../controllers/paymentController");
const { handleWebhook } = require("../controllers/webhookController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-payment", authMiddleware, createPayment);

router.post("/webhook", handleWebhook);

module.exports = router;
