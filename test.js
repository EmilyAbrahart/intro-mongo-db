const mongoose = require('mongoose');

// Connect the app to the server
const connect = () => {
	return mongoose.connect('mongodb://localhost:27017/whatever');
};

// Create a schema for the new collection. Schemas start with a lower case as standard.
const student = new mongoose.Schema(
	{
		firstName: {
			// The object allows validation. For no validation, you can just use String without the object and type key.
			type: String,
			required: true,
		},
		faveFoods: [{ type: String }],
		info: {
			school: {
				type: String,
			},
			shoeSize: {
				type: Number,
			},
		},
	},
	{ timestamps: true }
);

// Create a mongo model using the schema above. Models start with a capital as standard. Collection names start with a lower case and singular as standard. The name will be pluralised by Mongo.
const Student = mongoose.model('student', student); // (name of collection, schema)

connect()
	.then(async (connection) => {
		const student = await Student.create({ firstName: 'Tim' });
		const found = await Student.find({ firstName: 'thi' });
		const foundById = await Student.findById('asdasfdgfd');
		const updated = await Student.findByIdAndUpdate('asdasasfd', {});
		console.log(student);
	})
	.catch((e) => console.error(e));
