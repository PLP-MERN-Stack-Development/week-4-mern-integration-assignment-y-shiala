import  express  from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment
} from '../controllers/postController.js';



const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/comments', protect, addComment);

export default router;
