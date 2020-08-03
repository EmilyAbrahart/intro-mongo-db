const User = require('./user');

// .exec() is used to tell Mongo that there is no further querying coming.
// Always use after queries. (QUERIES ONLY)
const getUserById = (id) => {
	return User.findById(id).exec();
};

const getAllUsers = () => {
	return User.find({}).exec();
};

const createUser = (userDetails) => {
	return User.create(userDetails);
};

const removeUserById = (id) => {
	return User.findByIdAndRemove(id);
};

const updateUserById = (id, update) => {
  // {new: true} means that after the db has been updated, return the updated object.
  // By default, mongo will return the object before it was updated.
	return User.findByIdAndUpdate(id, update, { new: true }).exec();
};

module.exports = {
	getUserById,
	getAllUsers,
	createUser,
	removeUserById,
	updateUserById,
};
