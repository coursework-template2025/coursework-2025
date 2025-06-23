const path = require('path');
const { config } = require('dotenv');

config();

const rootPath = __dirname;

const configObj = {
    rootPath,
    publicPath: path.join(rootPath, 'public'),
    mongoose: {
        db: process.env.MONGO_URI,
    },
};

module.exports = configObj;
