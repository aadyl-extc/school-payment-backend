
const express = require("express");
const router = express.Router();


const {
  fetchAllTransactions,
  fetchTransactionsBySchool,
  fetchTransactionStatus,
} = require("../controllers/transactionController");


router.get("/", fetchAllTransactions);
router.get("/school/:schoolId", fetchTransactionsBySchool);
router.get("/:customOrderId", fetchTransactionStatus);

module.exports = router;
