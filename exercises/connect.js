const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connect = (url) => {
	mongoose.connect(url, {
		useNewUrlParser: true,
		autoReconnect: true,
		reconnectTries: Number.MAX_VALUE,
		reconnectInterval: 1000,
		poolSize: 20,
	});
};

module.exports = connect;
