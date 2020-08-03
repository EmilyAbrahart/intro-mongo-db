const mongoose = require('mongoose');

// Connect the app to the server
const connect = () => {
	return mongoose.connect('mongodb://localhost:27017/whatever');
};

// SCHEMAS
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
		// Referencing another collection 'school' within this collection.
		school: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'school',
		},
	},
	{ timestamps: true }
);

const school = new mongoose.Schema({
	district: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'district',
	},
	name: String,
	openSince: Number,
	students: Number,
	isGreat: Boolean,
	staff: [{ type: String }],
});

// Compound Indexes
// A school's name must be unique but only within the same district. There can be other schools of the same name in other districts.

school.index(
	{
		district: 1,
		name: 1,
	},
	{ unique: true }
);

// MIDDLEWARE HOOKS
// Before saving, run the function
school.pre('save', function () {
	console.log('before save');
});
// After saving, run the asyncronus function, where doc is the instance of the doc itself.
school.post('save', function (doc, next) {
	setTimeout(() => {
		console.log('after save');
		next();
	}, 300);
});

// VIRTUALS
school
	.virtual('staffCount')
	// Must use a regular function and not an arrow function to ensure 'this' is bound to what you want it bound to for it to work.
	.get(function () {
		return this.staff.length;
	});

// MODELS
// Create a mongo model using the schema above. Models start with a capital as standard. Collection names start with a lower case and singular as standard. The name will be pluralised by Mongo.
const Student = mongoose.model('student', student); // (name of collection, schema)
const School = mongoose.model('school', school);

// Querying the student collection.
// connect()
// 	.then(async (connection) => {
// 		const student = await Student.create({ firstName: 'Tim' });
// 		const found = await Student.find({ firstName: 'thi' });
// 		const foundById = await Student.findById('asdasfdgfd');
// 		const updated = await Student.findByIdAndUpdate('asdasasfd', {});
// 		console.log(student);
// 	})
// 	.catch((e) => console.error(e));

// Querying the student collection and populating the object with the necessary school information.
connect().then(async (connection) => {
	const schoolConfig = {
		name: 'apple elementary',
		openSince: 2009,
		students: 1000,
		isGreat: true,
		staff: ['x', 'y', 'z'],
	};
	const school2Config = {
		name: 'orange elementary',
		openSince: 1980,
		students: 600,
		isGreat: false,
		staff: ['a', 'b', 'c'],
	};

	const schools = await School.create([schoolConfig, school2Config]);

	const matchSchool =
		// Find the school with greater > 600 students with isGreat = true.
		// await School.findOne({ students: { $gt: 600 }, isGreat: true })

		await School.findOne({
			staff: 'b',

			// To search for multiple staff:
			// $in: {staff: ['a', 'c']}
			// $ operator means its a native mongo function.

			// To sort by descending openSince and return only the first 2 documents that meet the criteria:
			// .sort('-openSince')
			// .limit(2)
		}).exec();

	// findOneAndUpdate will find the school if it exists and return it.
	// upsert: true means that if the document isn't found, create a new document and update it with the values from the second object.
	const school = await School.findOneAndUpdate(
		{ name: 'mlk elementary' },
		{ name: 'mlk elementary' },
		{ upsert: true, new: true }
	).exec();
	const student = await Student.create({
		firstName: 'Trisha',
		school: school._id,
	});
	const student2 = await Student.create({
		firstName: 'Mark',
		school: school._id,
	});

	// Find the object by id.
	const matchId = await Student.findById(student.id).populate('school').exec();

	// Find the object where the first name is Trisha.
	const matchName = await Student.findOne({ firstName: 'Trisha' })
		.populate('school')
		.exec();
	console.log(matchId);
	console.log(matchName);
	console.log(matchSchool);
	console.log(matchSchool.staffCount);
});
