import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`/api/posts/${id}`)
      .then(res => {
        setPost(res.data);
        setComments(res.data.comments || []);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/posts/${id}/comments`, { text: comment });
      setComments([...comments, res.data]);
      setComment('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <article className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        {post.image && <img src={post.image} alt={post.title} className="w-full max-h-96 object-cover" />}
        <p>{post.content}</p>
        <p className="text-sm text-gray-500">Category: {post.category?.name}</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold">Comments</h2>
        {user ? (
          <form onSubmit={handleComment} className="space-y-2 mt-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded"
              rows="3"
              required
            ></textarea>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Post Comment
            </button>
          </form>
        ) : (
          <p className="text-gray-600 italic">Login to leave a comment.</p>
        )}

        <div className="mt-4 space-y-3">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="p-2 border rounded">
                <p className="text-gray-800">{c.text}</p>
                <p className="text-sm text-gray-500">By {c.author?.name || 'Anonymous'}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  );
}