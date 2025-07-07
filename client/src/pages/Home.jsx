import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchPosts = async () => {
    try {
      const query = [];
      if (search) query.push(`search=${search}`);
      if (category) query.push(`category=${category}`);
      const queryString = query.length ? `?${query.join('&')}` : '';
      const res = await axios.get(`/api/posts${queryString}`);
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search, category]);

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Recent Posts</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post._id} className="p-4 border rounded space-y-2">
            <h2 className="text-xl font-semibold">
              <Link to={`/post/${post._id}`}>{post.title}</Link>
            </h2>
            {post.image && (
              <img src={post.image} alt={post.title} className="w-full max-h-60 object-cover rounded" />
            )}
            <p className="text-gray-700">{post.content.slice(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
