const OrderStatus = require("../models/OrderStatus");
const Order = require("../models/Order");

exports.handleWebhook = async (req, res) => {
  try {
    const { order_info , status } = req.body;

    //WEBHOOK VALIDATION
      if (!order_info || !order_info.order_id) {
      return res.status(400).json({ error: "INVALID WEBHOOK PAYLOAD" });
    }
    
      const order = await Order.findOne({ 
      collect_request_id: order_info.order_id 
    });

      if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    // Update status in DB
    let dbStatus = "pending";
    if (order_info.status === "success") dbStatus = "success";
    else if (order_info.status === "failed") dbStatus = "failed";


    const orderStatus = await OrderStatus.findOneAndUpdate(
      { collect_id: order._id },
      {
        status: dbStatus,
        transaction_amount: order_info.transaction_amount || order_info.order_amount,
        payment_mode: order_info.payment_mode || "unknown",
        payment_details: order_info.payemnt_details || "N/A", // Note: typo in their API
        bank_reference: order_info.bank_reference || "N/A",
        payment_message: order_info.Payment_message || "N/A",
        error_message: order_info.error_message || "NA",
        payment_time: order_info.payment_time ? new Date(order_info.payment_time) : new Date()
      },
      { new: true }
    );

    console.log("Webhook received:", orderStatus);

    res.status(200).json({ message: "Webhook processed", dbStatus });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ error: "Webhook error", details: err.message });
  }
};
