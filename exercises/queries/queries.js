const Post = require('./post');

const postByTitle = (title) => {
	return Post.findOne({
		title: title,
	}).exec();
};

const postsForAuthor = (authorId) => {
	return Post.find({
		author: authorId,
	}).exec();
};

const fullPostById = (id) => {
	return Post.findById(id).populate('author').exec();
};

const allPostsSlim = (fieldsToSelect) => {
  // Return only the fields passed to the function.
	return Post.find({}).select(fieldsToSelect);
};

const postByContentLength = (maxContentLength, minContentLength) => {
	return Post.find({
		contentLength: { $gt: minContentLength, $lt: maxContentLength },
	}).exec();
};

const addSimilarPosts = (postId, similarPosts) => {
  // Add each of the posts in the array of similarPosts passed to the function, to the similarPosts field (array) in the post without overwriting the posts that are already in the array.
	return Post.findByIdAndUpdate(
		postId,
		{
			$push: { similarPosts: { $each: similarPosts } },
		},
		{ new: true }
	);
};

module.exports = {
	postByTitle,
	postsForAuthor,
	fullPostById,
	allPostsSlim,
	postByContentLength,
	addSimilarPosts,
};
