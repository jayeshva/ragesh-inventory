const jwt = require('jsonwebtoken');

const JWT_SECRET = 'yourSecretKey';  

const verify = (req, res, next) => {

    const token = req.header('x-auth-token');

 
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied',status:0 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); 
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' , status:0});
  }
};

module.exports = {verify};
