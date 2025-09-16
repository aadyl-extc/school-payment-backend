# School Payment Backend API

A simple Node.js with Express.js backend for managing school payments and transactions with MongoDB and JWT authentication.

## 🚀 Features

- User Authentication with JWT
- Payment Gateway Integration
- Transaction Management
- Webhook Processing
- MongoDB Database
- Simple REST API

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JSON Web Tokens (JWT)
- **Payment Gateway**: Edviron API

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js installed
- MongoDB Atlas account
- Basic knowledge of JavaScript

## ⚙️ Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/aadyl-extc/school-payment-system.git
cd school-payment-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add:

```env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=24h

# Payment Gateway (Provided)
PG_KEY=your_pg_key_here
PG_SECRET=your_pg_secret_here
API_KEY=edviro_api_key or your_api_key_here
PORT=5000


```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL

- **Local**: `http://localhost:5000`
- **Live**: `https://school-payment-backend-production.up.railway.app`

### Authentication

All API endpoints (except login/register) require JWT token in the Authorization header:

```bash
Authorization: Bearer your_jwt_token_here
```

### API Endpoints

#### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |

#### 💳 Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-payment` | Create new payment request |

#### 📊 Transactions

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/transactions` | Get all transactions | `?page=1&limit=10` |
| GET | `/transactions/school/:schoolId` | Get transactions by school | `?page=1&limit=10` |
| GET | `/transaction-status/:custom_order_id` | Check transaction status | None |

#### 🔄 Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook` | Process payment webhooks |

## 📝 API Usage Examples

### 1. User Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 2. Create Payment

```bash
curl -X POST http://localhost:5000/create-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "amount": "1000",
    "callback_url": "https://your-website.com/callback",
    "student_info": {
      "name": "John Doe",
      "id": "STU001",
      "email": "john@example.com"
    }
  
```

### 3. Get All Transactions

```bash
curl -X GET "http://localhost:5000/transactions?page=1&limit=10" \
  -H "Authorization: Bearer your_jwt_token"
```

### 4. Get School Transactions

```bash
curl -X GET "http://localhost:5000/transactions/school/:schoolId" \
  -H "Authorization: Bearer your_jwt_token"
```

### 5. Check Transaction Status

```bash
curl -X GET "http://localhost:5000/transaction/:cutomerOrderId" \
  -H "Authorization: Bearer your_jwt_token"
```

## 🗄️ Database Schema

### Order Collection

```javascript
{
  _id: ObjectId,
  school_id: String,
  trustee_id: String,
  student_info: {
    name: String,
    id: String,
    email: String
  },
  gateway_name: String
}
```

### OrderStatus Collection

```javascript
{
  collect_id: ObjectId, // References Order._id
  order_amount: Number,
  transaction_amount: Number,
  payment_mode: String,
  payment_details: String,
  bank_reference: String,
  payment_message: String,
  status: String,
  error_message: String,
  payment_time: Date
}
```

### User Collection

```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // Hashed
  createdAt: Date
}
```

## 📁 Project Structure

```bash

school-payment-backend/
├── src/
│   ├── config/
│   │   ├──db.js
│   │   └──transactionService.js 
│   │ 
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── paymentController.js
│   │   ├── transactionController.js
│   │   └── webhookController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Order.js
│   │   ├── OrderStatus.js
│   │   └── User.js
│   └── routes/
│       ├── authRoutes.js
│       ├── paymentRoutes.js
│       └── transactionRoutes.js
│       
├── .env
├── .gitignore
├── app.js
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

## 🧪 Testing the API

### Using Postman

1. Import the included `postman-collection.json`
2. Set up environment variables:
   - `base_url`: <http://localhost:5000>
   - `jwt_token`: (get from login response)
3. Test each endpoint

### Sample Test Data

```javascript
// Sample Order
{
  "school_id": "xyz",
  "trustee_id": "xyz",
  "student_info": {
    "name": "John Doe",
    "id": "STU001",
    "email": "john@example.com"
  },
  "gateway_name": "PhonePe"
}

// Sample OrderStatus
{
  "collect_id": "order_id_from_above",
  "order_amount": 2000,
  "transaction_amount": 2200,
  "payment_mode": "upi",
  "payment_details": "success@ybl",
  "bank_reference": "YESBNK222",
  "payment_message": "payment success",
  "status": "success",
  "error_message": "NA",
  "payment_time": "2025-01-15T08:14:21.945Z"
}
```

## 🚀 Deployment

### Deploy to Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set MONGODB_URI="your_connection_string"
heroku config:set JWT_SECRET="your_secret"
# ... add other env vars
git push heroku main
```

## ❗ Important Notes

- Keep your `.env` file secure and never commit it to Git
- Use strong JWT secrets in production
- Test all endpoints before deployment
- Make sure MongoDB Atlas allows connections from your deployment platform

## 🐛 Troubleshooting

### Common Issues

``
**1. "Cannot connect to MongoDB"**

- Check your MONGODB_URI in .env file
- Make sure MongoDB Atlas allows connections from 0.0.0.0/0
``
**2. "JWT token invalid"**

- Make sure you're including the token in Authorization header
- Check if the token has expired (default: 24h)

``
**3. "Port already in use"**

- Change PORT in .env file or kill the process using that port

## 📞 Support

If you have any questions or issues:

- Create an issue on GitHub
- Check the troubleshooting section above

## 🔗 Live Demo

- **API Base URL**: <https://school-payment-backend-production.up.railway.app>
- **GitHub Repository**: <https://github.com/aadyl-extc/school-payment-system>

## 📄 License

This project is for educational purposes as part of a software developer assessment.

---
