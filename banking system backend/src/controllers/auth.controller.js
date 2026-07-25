const usermodel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const tokenBlackListModel = require('../models/blackList.model');

async function userRegisterController(req, res) {
    const { email, name, password } = req.body;

    const isExist = await usermodel.findOne({ email });
    if (isExist) {
        return res.status(422).json({ message: 'User already exists with email' });
    }

    const user = new usermodel({ email, name, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3 * 24 * 60 * 60 * 1000
});
    res.status(201).json({ message: 'User registered successfully', user:{ _id: user._id, email: user.email, name: user.name } });

}

async function userLoginController(req, res) {
    const { email, password } = req.body;

    const user = await usermodel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
   res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3 * 24 * 60 * 60 * 1000
});
    res.status(200).json({ message: 'User logged in successfully', user: { _id: user._id, email: user.email, name: user.name } });
};

async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
});

    res.status(200).json({
        message: "User logged out successfully"
    })
}

async function getMeController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    return res.status(200).json({
        user: {
            _id: req.user._id,
            email: req.user.email,
            name: req.user.name
        }
    });
}

module.exports = { userRegisterController, userLoginController, userLogoutController, getMeController }