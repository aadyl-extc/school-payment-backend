const axios = require("axios");
const Order = require("../models/Order");
const OrderStatus = require("../models/OrderStatus");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");



exports.createPayment = async (req, res) =>{
    try {
        const { student_info, amount } = req.body;

        //CREATING ORDER IN DATABASE
        const order = await Order.create({  
            school_id: process.env.SCHOOL_ID,
            user_id: req.user ? req.user._id : null,            
            student_info,
            gateway_name: "Edviron",
            amount: amount,
            callback_url: process.env.CALLBACK_URL
        });

        //CREATING ORDERSTATUS IN DB
        const orderStatus = await OrderStatus.create({
            collect_id : order._id,
            order_amount: amount,
            status : "pending"
        });

        //CREATING JWT SIGN FOR ORDERSTATUS
        const payload = {
            school_id: process.env.SCHOOL_ID,
            amount,
            callback_url: process.env.CALLBACK_URL
        };

        const sign = jwt.sign(payload, process.env.PG_KEY);

        //PAYMENT GATEWAY INTEGRATION
        const edvironRequest = {
            school_id: process.env.SCHOOL_ID,
            amount: amount.toString(),         
            callback_url: process.env.CALLBACK_URL,
            sign: sign                           
        };

        const response = await axios.post(
        process.env.COLLECT_API_URL,
        edvironRequest,
        {
        headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
            "Content-Type": "application/json"
            }
        });

        await Order.findByIdAndUpdate(order._id, {
            collect_request_id: response.data.collect_request_id,
            payment_url: response.data.Collect_request_url  
        });

        return res.status(200).json({
           success: true,
            message: "PAYMENT LINK CREATED SUCCESSFULLY",
            data: {
                order_id: order._id,
                collect_request_id: response.data.collect_request_id,
                payment_url: response.data.Collect_request_url,  
                amount: amount,
                student_info: student_info
            }
        });
    } catch (error) {
            return res.status(500).json({
            success: false,
            error: "Failed to create payment"
        });
    }
};


