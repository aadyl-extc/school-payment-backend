const {
  getALLTransaction,
  getTransactionsBySchool,
  getTransactionStatus
} = require("../config/transactionService");
const mongoose = require("mongoose");



const fetchAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sort || "payment_time";
    const sortOrder = req.query.order || "desc";

    const result = await getALLTransaction(page, limit, sortField, sortOrder);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const fetchTransactionsBySchool = async (req, res) => {
  try {
    const  schoolId  = new mongoose.Types.ObjectId(process.env.SCHOOL_ID);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sort || "payment_time";
    const sortOrder = req.query.order || "desc";

    const result = await getTransactionsBySchool(
      schoolId,
      page,
      limit,
      sortField,
      sortOrder
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchTransactionStatus = async (req, res) => {
  try {
    const { customOrderId } = req.params;

    // Check if the given ID is a valid ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(customOrderId);


    const result = await getTransactionStatus(customOrderId, isObjectId);

    if (!result) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error in fetchTransactionStatus:", error);
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  fetchAllTransactions,
  fetchTransactionsBySchool,
  fetchTransactionStatus,
};