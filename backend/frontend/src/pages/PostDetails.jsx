import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

const PostDetails = () => {
  const postId = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const res = await axios.get("https://blog-43pq.onrender.com/api/posts/" + postId);
      setPost(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete("https://blog-43pq.onrender.com/api/posts/" + postId, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPostComments = async () => {
    setLoader(true);
    try {
      const res = await axios.get("https://blog-43pq.onrender.com/api/comments/post/" + postId);
      setComments(res.data);
      setLoader(false);
    } catch (err) {
      setLoader(true);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, [postId]);

  const postComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://blog-43pq.onrender.com/api/comments/create",
        { comment: comment, author: user.username, postId: postId, userId: user._id },
        { withCredentials: true }
      );
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="pt-10 bg-light-green min-h-screen">
      <Navbar />
      {loader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="container mx-auto px-4 md:px-8 lg:px-16 mt-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-black md:text-3xl">{post.title}</h1>
              {user?._id === post?.userId && (
                <div className="flex items-center space-x-2">
                  <BiEdit className="text-xl cursor-pointer text-blue-600" onClick={() => navigate("/edit/" + postId)} />
                  <MdDelete className="text-xl cursor-pointer text-red-600" onClick={handleDeletePost} />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-gray-600 mb-4">
              <p>@{post.username}</p>
              <div className="flex space-x-2 text-sm">
                <p>{new Date(post.updatedAt).toDateString()}</p>
                <p>{new Date(post.updatedAt).toLocaleTimeString()}</p>
              </div>
            </div>
            <img src={post.photo} className="w-full h-auto max-w-full max-h-[60vh] object-contain rounded-lg mb-8" alt="" />
            <p className="text-gray-800 leading-relaxed mb-8">{post.desc}</p>
            <div className="flex items-center space-x-4 font-semibold text-gray-700 mb-8">
              <p>Categories:</p>
              <div className="flex flex-wrap space-x-2">
                {post.categories?.map((c, i) => (
                  <span key={i} className="bg-gray-200 rounded-lg px-3 py-1">{c}</span>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Comments:</h3>
              {comments?.map((c) => (
                <Comment key={c._id} c={c} post={post} />
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <input
                onChange={(e) => setComment(e.target.value)}
                type="text"
                placeholder="Write a comment"
                className="w-full md:flex-1 outline-none py-2 px-4 border border-gray-300 rounded-lg"
              />
              <button
                onClick={postComment}
                className="w-full md:w-auto bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PostDetails;
