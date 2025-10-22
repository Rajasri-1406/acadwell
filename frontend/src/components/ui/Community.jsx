import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MessageCircle,
  Heart,
  Send,
  PlusCircle,
  CheckCircle,
  User,
  Users,
  Clock,
} from "lucide-react";

const API_BASE = "https://acadwell-backend-7ufj.onrender.com/api/community";


const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAddPost, setShowAddPost] = useState(false);
  const [isAnonPost, setIsAnonPost] = useState(true);
  const [isAnonAnswer, setIsAnonAnswer] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [filter, setFilter] = useState("recent");
  const [creditPoints, setCreditPoints] = useState(10);

  // Fetch user profile
  useEffect(() => {
    const tkn = sessionStorage.getItem("token");
    if (!tkn) return;
    setToken(tkn);

    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${tkn}` },
      })
      .then((res) => setCurrentUser(res.data.user))
      .catch((err) => console.error("Profile fetch failed:", err));
  }, []);

  const fetchPosts = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}?filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch posts error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchPosts();
  }, [token, filter]);

  const addPost = async () => {
    if (!newPost.trim()) return alert("Enter post content!");
    try {
      await axios.post(
        API_BASE,
        { question: newPost, isAnonymous: isAnonPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPost("");
      setShowAddPost(false);
      fetchPosts();
    } catch (err) {
      console.error("Add post error:", err);
      alert("Failed to add post");
    }
  };

  const postAnswer = async (postId) => {
    if (!newAnswer.trim()) return alert("Enter answer!");
    try {
      await axios.post(
        `${API_BASE}/${postId}/answer`,
        { text: newAnswer, isAnonymous: isAnonAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewAnswer("");
      setSelectedPost(null);
      fetchPosts();
    } catch (err) {
      console.error("Post answer error:", err);
      alert("Failed to post answer");
    }
  };

  const likePost = async (postId) => {
    try {
      await axios.put(`${API_BASE}/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err) {
      console.error("Like post error:", err);
    }
  };

  const acceptAnswer = async (postId, answerId) => {
    try {
      await axios.put(
        `${API_BASE}/${postId}/accept/${answerId}`,
        { credits: creditPoints },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Answer accepted with ${creditPoints} credits`);
      fetchPosts();
    } catch (err) {
      console.error("Accept answer error:", err);
      alert("Failed to accept answer");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-center">🧠 Community Hub</h1>

        {/* Filter & Add Post Button */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex gap-3">
            {[{ label: "Recent", key: "recent" }, { label: "Connections", key: "connections" }, { label: "My Posts", key: "mine" }].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1 rounded-full transition ${filter === f.key ? "bg-indigo-600" : "bg-slate-700 hover:bg-slate-600"} flex items-center gap-1 text-sm`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              Credit:
              <input
                type="number"
                min="1"
                value={creditPoints}
                onChange={(e) => setCreditPoints(parseInt(e.target.value))}
                className="w-16 bg-slate-700 rounded text-center border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => setShowAddPost(true)}
              className="bg-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <PlusCircle /> Add Post
            </button>
          </div>
        </div>

        {/* Add Post Overlay */}
        {showAddPost && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={() => setShowAddPost(false)}
          >
            <div
              className="bg-slate-800 p-5 rounded-2xl w-full max-w-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-3">New Post</h2>
              <textarea
                rows={4}
                className="w-full p-3 rounded-xl bg-slate-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                placeholder="Write your post..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={isAnonPost}
                    onChange={() => setIsAnonPost(!isAnonPost)}
                    className="accent-indigo-500"
                  />
                  Post Anonymously
                </label>
                <button
                  onClick={addPost}
                  className="bg-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
                >
                  <Send /> Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-400">No posts found.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-slate-800 p-5 rounded-2xl mb-5 shadow-lg hover:scale-[1.01] transition-transform">
              <p className="font-medium text-lg">{post.question}</p>
              <p className="text-gray-400 text-sm mb-3">— {post.postedBy}</p>

              <div className="flex items-center gap-4 text-gray-400 mb-3">
                <button onClick={() => likePost(post._id)} className="flex items-center gap-1 hover:text-red-400 transition">
                  <Heart size={16}/> {post.likes || 0}
                </button>
              </div>

              {/* Answers */}
              {post.answers?.map((ans) => (
                <div key={ans._id} className={`p-3 rounded-xl mb-2 ${ans.accepted ? "bg-green-800/50 border border-green-400" : "bg-slate-700"} shadow`}>
                  <div className="flex justify-between items-center">
                    <p>{ans.text}</p>
                    {ans.accepted && (
                      <span className="text-green-400 text-xs flex items-center gap-1">
                        <CheckCircle size={14}/> Accepted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">— {ans.postedBy}</p>
                  {currentUser?.id === post.userId && !ans.accepted && (
                    <button onClick={()=>acceptAnswer(post._id, ans._id)} className="text-green-400 text-sm hover:underline mt-1 flex items-center gap-1">
                      <CheckCircle size={14}/> Accept
                    </button>
                  )}
                </div>
              ))}

              {/* Answer Box */}
              {selectedPost === post._id ? (
                <div className="mt-3 flex flex-col gap-2">
                  <textarea
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="2"
                    placeholder="Write answer..."
                    value={newAnswer}
                    onChange={(e)=>setNewAnswer(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input type="checkbox" checked={isAnonAnswer} onChange={()=>setIsAnonAnswer(!isAnonAnswer)} className="accent-indigo-500"/>
                      Answer Anonymously
                    </label>
                    <button onClick={()=>postAnswer(post._id)} className="bg-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-700 flex items-center gap-1 transition">
                      <Send size={16}/> Send
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={()=>setSelectedPost(post._id)} className="text-indigo-400 mt-2 hover:underline flex items-center gap-1 transition">
                  <MessageCircle/> Answer
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
