require('dotenv').config();
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const express = require('express');
const { checkSchema } = require('express-validator');
const cors = require('cors');
const helmet = require('helmet');
const configureDB = require('./config/db');
const upload = require('./app/middlewares/multer');
const compression = require('compression');
const userCltr = require('./app/controller/user-cltr');
const postCltr = require('./app/controller/post-cltr');
const commentCltr = require('./app/controller/comment-cltr');
const authenticationUser = require('./app/middlewares/authenticatedUser');
const authorizedUser = require('./app/middlewares/authorized');

// Initialize Express app
const app = express();
const port = process.env.PORT

// Database configuration
configureDB();

// Middleware setup
app.use(express.json());
const allowedOrigins = ['http://localhost:3334', 'https://blog-app-six-chi.vercel.app'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory

// Logging configuration
// const logFilePath = path.join('C:', 'Users', 'Rathan', 'Desktop', 'dct', 'blog-app', 'logs.txt');
// const accessLogStream = fs.createWriteStream(path.join(logFilePath), { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));

// app.use(function(req, res, next) {
//     console.log(`${req.ip} - ${req.method} - ${req.url} - ${new Date()}`);
//     next();
// });

// Validation schemas
const userRegisterValidationSchema = require('./app/validations/user-register-validations');
const userLoginValidationSchema = require('./app/validations/user-login-validationsSchema');
const postValidationSchema = require('./app/validations/post-validationSchema');

// Routes
app.post('/api/users/register', checkSchema(userRegisterValidationSchema), userCltr.register);
app.post('/api/users/login', checkSchema(userLoginValidationSchema), userCltr.login);
app.get('/api/users/checkemail', userCltr.checkEmail);
app.post('/api/users/upload-profile-picture', authenticationUser, upload.single('profilePicture'), userCltr.uploadProfilePicture);
app.get('/api/users/profile', authenticationUser, userCltr.getProfile);
app.put('/api/users/profile', authenticationUser, userCltr.updateProfile);

// Posts
app.post('/api/posts', authenticationUser, checkSchema(postValidationSchema), postCltr.create);
app.get('/api/posts', postCltr.get);
app.get('/api/posts/:id', authenticationUser, postCltr.singlePost);
app.put('/api/posts/:id', authenticationUser, postCltr.update);
app.delete('/api/posts/:id', authenticationUser, checkSchema(postValidationSchema), postCltr.remove);
app.get('/api/posts', authenticationUser, checkSchema(postValidationSchema), postCltr.myposts);

// Comments
app.post('/api/posts/:postId/comments', authenticationUser, commentCltr.create);
app.get('/api/posts/:postId/comments/:commentId', authenticationUser, commentCltr.single);
app.delete('/api/posts/:postId/comments/:commentId', authenticationUser, commentCltr.remove);
app.get('/api/posts/:postId/comments', commentCltr.get);
app.put('/api/posts/:postId/comments/:commentId', authenticationUser, commentCltr.update);

app.listen(port, () => {
    console.log("Server successfully running on", port);
});
