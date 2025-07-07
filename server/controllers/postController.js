import Post from '../models/Post.js';
import Category from '../models/Category.js';




export  const getPosts = async (req, res) => { 
  const { page = 1, limit = 10, category, search } = req.query;
  const filter = {};

  if (category) filter.Category = category;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const posts = await Post.find(filter)
    .populate('category')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Post.countDocuments(filter);

  res.json({ posts, total });
};

export  const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('category');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

export  const createPost = async (req, res) => {
  const { title, content, category, image } = req.body;
  const post = new Post({ title, content, category, image });
  await post.save();
  res.status(201).json(post);
};

export  const updatePost = async (req, res) => {
  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Post not found' });
  res.json(updated);
};

export const deletePost = async (req, res) => {
  const deleted = await Post.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Post not found' });
  res.json({ message: 'Post deleted' });
};

export const addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = {
    text: req.body.text,
    author: req.user?.name || 'Anonymous',
    createdAt: new Date()
  };

  post.comments.push(comment);
  await post.save();

  res.status(201).json(comment);
};
export const incrementViewCount = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  post.viewCount += 1;
  await post.save();

  res.json(post);
};

export  const getPostsByCategory = async (req, res) => {
  const { category } = req.params;
  const posts = await Post.find({ category, })
    .populate('category')
    .sort({ createdAt: -1 });
  if (!posts.length) return res.status(404).json({ message: 'No posts found in this category' });
  res.json(posts);
}
 export const searchPosts = async (req, res) => {
  const { query } = req.query;
  const posts = await Post.find({ title: { $regex: query, $options: 'i' } })
    .populate('category')
    .sort({ createdAt: -1 });
  if (!posts.length) return res.status(404).json({ message: 'No posts found' });
  res.json(posts);
};

export default {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  incrementViewCount,
  getPostsByCategory,
  searchPosts
};