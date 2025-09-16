const Order = require("../models/Order");
const OrderStatus = require("../models/OrderStatus");
const mongoose = require("mongoose");




//GETTING ALL TRANSACTION
const getALLTransaction = async (page = 1, limit = 10, sortField = "payment_time", sortOrder = "desc") => {
    try {
        const skip = (page - 1)*limit;
        const sortValue = sortOrder === "asc" ? 1 : -1;

    // BUILDING AGGREGATION TIMELINE
    const pipeline = [
      {
        // JOINING OrderStatus 
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "order_status",
        },
      },
 

      {
        // CONVERTING ARRAY INTO SINGLE OBJECT
        $unwind: {
          path: "$order_status",
          preserveNullAndEmptyArrays: true,
        },
      },

    

      {
        $project: {
          collect_id: "$_id",
          school_id: new mongoose.Types.ObjectId(process.env.SCHOOL_ID),
          gateway: "$gateway_name",
          order_amount: "$order_status.order_amount",
          transaction_amount: "$order_status.transaction_amount",
          status: "$order_status.status",
          custom_order_id: "$_id",
          payment_time: "$order_status.payment_time",
          student_name: "$student_info.name",
        },
      },
      {
        // DYNAMICALLY SORTING
        $sort: { [sortField]: sortValue },
      },
      { $skip: skip },
      { $limit: limit },
    ];

    const transactions = await Order.aggregate(pipeline);

    // COUNTING DOCUMENTS FOR PAGINATION
    const totalRecords = await Order.countDocuments();
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      transactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
      },
    };
    } catch (error) {
        
    }
};


//GETTING TRANSACTION BY SCHOOL

const getTransactionsBySchool = async (
  schoolId,
  page = 1,
  limit = 10,
  sortField = "payment_time",
  sortOrder = "desc"
) => {
  try {
    const skip = (page - 1) * limit;
    const sortValue = sortOrder === "asc" ? 1 : -1;

    const pipeline = [
    

      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "order_status",
        },
      },
      {
        $unwind: {
          path: "$order_status",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          collect_id: "$_id",
          school_id: new mongoose.Types.ObjectId(process.env.SCHOOL_ID),
          school_name: "$school_info.name",
          gateway: "$gateway_name",
          order_amount: "$order_status.order_amount",
          transaction_amount: "$order_status.transaction_amount",
          status: "$order_status.status",
          custom_order_id: "$_id",
          payment_time: "$order_status.payment_time",
          student_name: "$student_info.name",
        },
      },
      { $sort: { [sortField]: sortValue } },
      { $skip: skip },
      { $limit: limit },
    ];

    const transactions = await Order.aggregate(pipeline);

    const totalRecords = await Order.countDocuments(process.env.SCHOOL_ID);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      transactions,
      school_id:process.env.SCHOOL_ID,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
      },
    };
  } catch (error) {
    throw new Error("Failed to get school transactions: " + error.message);
  }
};


//GETTING TRANSACTION STATUS


const getTransactionStatus = async (customOrderId) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(customOrderId);

    const pipeline = [
      {
        $match: isObjectId
          ? { _id: new mongoose.Types.ObjectId(customOrderId) }
          : { collect_request_id: customOrderId },
      },
      {
        $lookup: {
          from: "orderstatuses", // check collection name
          localField: "_id",
          foreignField: "collect_id",
          as: "order_status",
        },
      },
      { $unwind: { path: "$order_status", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          custom_order_id: "$collect_request_id",
          collect_id: "$_id",
          school_id: "$school_id",
          student_info: "$student_info",
          gateway: "$gateway_name",
          order_amount: { $ifNull: ["$order_status.order_amount", "$amount"] },
          transaction_amount: {
            $ifNull: ["$order_status.transaction_amount", "$amount"],
          },
          payment_mode: "$order_status.payment_mode",
          status: { $ifNull: ["$order_status.status", "pending"] },
          payment_message: "$order_status.payment_message",
          payment_time: "$order_status.payment_time",
        },
      },
    ];

  
    const result = await Order.aggregate(pipeline);
    

    if (!result.length) {
      throw new Error("Transaction not found");
    }
    return result[0];
  } catch (error) {
    throw new Error("Failed to get transaction status: " + error.message);
  }
};


module.exports = {
  getALLTransaction,
  getTransactionsBySchool,
  getTransactionStatus,
};

