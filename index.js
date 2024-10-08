const express = require('express');
const connectDB = require('./config/db');
const auth = require('./config/jwtMiddleware');

// Initialize the app
const app = express();
app.use(express.json());
const verifyAdmin = (req,res,next)=>{
    if(req.user.role=="admin"){
        next();
    }
    else {
        return res.status(403).json({ msg: 'RESTRICTED ROUTE - Only Admin can access this route', status:0 });
    }
}

// Connect to MongoDB
connectDB();
app.get('/',(req,res)=>{
    res.json({
        message:"Welcome To Inventory Mangement System",
        satus:1
    });
})
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin',auth.verify,verifyAdmin,require('./routes/admin'));
app.use('/api/shop', auth.verify, require('./routes/shopOwner'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on HTTP port ${PORT}`));
