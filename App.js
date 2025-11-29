import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send, User, Home, Film, Search, PlusSquare, X, Camera, Bell, Mail } from 'lucide-react';

const ConnectifyEnhanced = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [data, setData] = useState({
    users: [],
    posts: [],
    friendRequests: [],
    reels: [],
    messages: [],
    notifications: []
  });
  
  const [newPost, setNewPost] = useState({ content: '', image: null });
  const [newReel, setNewReel] = useState({ caption: '', video: null });
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({ bio: '', photo: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePostId, setSharePostId] = useState(null);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const profilePhotoRef = useRef(null);

  useEffect(() => {
    loadData();
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentScreen('dashboard');
    }
  }, []);

  useEffect(() => {
    if (data.users.length > 0) {
      saveData();
    }
  }, [data]);

  const loadData = () => {
    const users = JSON.parse(localStorage.getItem('connectify_users') || '[]');
    const posts = JSON.parse(localStorage.getItem('connectify_posts') || '[]');
    const requests = JSON.parse(localStorage.getItem('connectify_requests') || '[]');
    const reels = JSON.parse(localStorage.getItem('connectify_reels') || '[]');
    const messages = JSON.parse(localStorage.getItem('connectify_messages') || '[]');
    const notifications = JSON.parse(localStorage.getItem('connectify_notifications') || '[]');
    setData({ users, posts, friendRequests: requests, reels, messages, notifications });
  };

  const saveData = () => {
    localStorage.setItem('connectify_users', JSON.stringify(data.users));
    localStorage.setItem('connectify_posts', JSON.stringify(data.posts));
    localStorage.setItem('connectify_requests', JSON.stringify(data.friendRequests));
    localStorage.setItem('connectify_reels', JSON.stringify(data.reels));
    localStorage.setItem('connectify_messages', JSON.stringify(data.messages));
    localStorage.setItem('connectify_notifications', JSON.stringify(data.notifications));
  };

  const addNotification = (toUsername, message, type) => {
    const notification = {
      id: Date.now(),
      toUsername,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({ ...prev, notifications: [notification, ...prev.notifications] }));
  };

  const register = () => {
    if (!regUsername || !regPassword) {
      alert('Please fill all fields');
      return;
    }
    if (data.users.find(u => u.username === regUsername)) {
      alert('Username already exists');
      return;
    }
    
    const newUser = {
      id: Date.now(),
      username: regUsername,
      password: regPassword,
      bio: '',
      photo: null,
      friends: [],
      createdAt: new Date().toISOString()
    };
    
    setData(prev => ({ ...prev, users: [...prev.users, newUser] }));
    alert('Account created! Please login.');
    setCurrentScreen('login');
    setRegUsername('');
    setRegPassword('');
  };

  const login = () => {
    const user = data.users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (user) {
      setCurrentUser(loginUsername);
      sessionStorage.setItem('currentUser', loginUsername);
      setCurrentScreen('dashboard');
      setLoginUsername('');
      setLoginPassword('');
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    setCurrentScreen('welcome');
  };

  const getCurrentUserData = () => {
    return data.users.find(u => u.username === currentUser);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReel(prev => ({ ...prev, video: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const createPost = () => {
    if (!newPost.content && !newPost.image) {
      alert('Post cannot be empty');
      return;
    }

    const user = getCurrentUserData();
    const post = {
      id: Date.now(),
      userId: user.id,
      username: currentUser,
      content: newPost.content,
      image: newPost.image,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    setData(prev => ({ ...prev, posts: [post, ...prev.posts] }));
    setNewPost({ content: '', image: null });
    alert('Post created!');
  };

  const createReel = () => {
    if (!newReel.video) {
      alert('Please select a video');
      return;
    }

    const user = getCurrentUserData();
    const reel = {
      id: Date.now(),
      userId: user.id,
      username: currentUser,
      caption: newReel.caption,
      video: newReel.video,
      likes: [],
      createdAt: new Date().toISOString()
    };

    setData(prev => ({ ...prev, reels: [reel, ...prev.reels] }));
    setNewReel({ caption: '', video: null });
    alert('Reel posted!');
  };

  const toggleLike = (postId) => {
    const post = data.posts.find(p => p.id === postId);
    const isLiking = !post.likes.includes(currentUser);
    
    setData(prev => ({
      ...prev,
      posts: prev.posts.map(post => {
        if (post.id === postId) {
          const likes = post.likes.includes(currentUser)
            ? post.likes.filter(u => u !== currentUser)
            : [...post.likes, currentUser];
          return { ...post, likes };
        }
        return post;
      })
    }));

    if (isLiking && post.username !== currentUser) {
      addNotification(post.username, `${currentUser} liked your post`, 'like');
    }
  };

  const toggleReelLike = (reelId) => {
    const reel = data.reels.find(r => r.id === reelId);
    const isLiking = !reel.likes.includes(currentUser);

    setData(prev => ({
      ...prev,
      reels: prev.reels.map(reel => {
        if (reel.id === reelId) {
          const likes = reel.likes.includes(currentUser)
            ? reel.likes.filter(u => u !== currentUser)
            : [...reel.likes, currentUser];
          return { ...reel, likes };
        }
        return reel;
      })
    }));

    if (isLiking && reel.username !== currentUser) {
      addNotification(reel.username, `${currentUser} liked your reel`, 'like');
    }
  };

  const addComment = (postId) => {
    const comment = commentText[postId];
    if (!comment || !comment.trim()) return;

    const post = data.posts.find(p => p.id === postId);
    
    setData(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, {
              id: Date.now(),
              username: currentUser,
              text: comment,
              createdAt: new Date().toISOString()
            }]
          };
        }
        return p;
      })
    }));

    setCommentText(prev => ({ ...prev, [postId]: '' }));

    if (post.username !== currentUser) {
      addNotification(post.username, `${currentUser} commented on your post`, 'comment');
    }
  };

  const sendFriendRequest = (toUsername) => {
    const fromUser = getCurrentUserData();
    const toUser = data.users.find(u => u.username === toUsername);
    
    const request = {
      id: Date.now(),
      fromUserId: fromUser.id,
      fromUsername: currentUser,
      toUserId: toUser.id,
      toUsername,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setData(prev => ({ ...prev, friendRequests: [...prev.friendRequests, request] }));
    addNotification(toUsername, `${currentUser} sent you a friend request`, 'friend_request');
    alert('Friend request sent!');
  };

  const acceptRequest = (requestId) => {
    const request = data.friendRequests.find(r => r.id === requestId);
    
    setData(prev => ({
      ...prev,
      users: prev.users.map(user => {
        if (user.username === currentUser) {
          return { ...user, friends: [...user.friends, request.fromUserId] };
        }
        if (user.username === request.fromUsername) {
          return { ...user, friends: [...user.friends, request.toUserId] };
        }
        return user;
      }),
      friendRequests: prev.friendRequests.map(r => 
        r.id === requestId ? { ...r, status: 'accepted' } : r
      )
    }));
    
    addNotification(request.fromUsername, `${currentUser} accepted your friend request`, 'friend_accept');
    alert('Friend request accepted!');
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const message = {
      id: Date.now(),
      from: currentUser,
      to: selectedChat,
      text: messageText,
      createdAt: new Date().toISOString()
    };

    setData(prev => ({ ...prev, messages: [...prev.messages, message] }));
    setMessageText('');
    addNotification(selectedChat, `New message from ${currentUser}`, 'message');
  };

  const sharePost = (postId, toUsername) => {
    const post = data.posts.find(p => p.id === postId);
    const message = {
      id: Date.now(),
      from: currentUser,
      to: toUsername,
      text: `Shared a post: ${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}`,
      sharedPost: postId,
      createdAt: new Date().toISOString()
    };

    setData(prev => ({ ...prev, messages: [...prev.messages, message] }));
    addNotification(toUsername, `${currentUser} shared a post with you`, 'share');
    alert(`Post shared with ${toUsername}!`);
    setShowShareModal(false);
    setSharePostId(null);
  };

  const updateProfile = () => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(user => 
        user.username === currentUser 
          ? { ...user, bio: profileData.bio, photo: profileData.photo }
          : user
      )
    }));
    setEditProfile(false);
    alert('Profile updated!');
  };

  const markNotificationsAsRead = () => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.toUsername === currentUser ? { ...n, read: true } : n
      )
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const isFriend = (userId) => {
    const user = getCurrentUserData();
    return user.friends.includes(userId);
  };

  const startChatWith = (username) => {
    setSelectedChat(username);
    setActiveTab('messages');
  };

  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Connectify
          </h1>
          <p className="text-gray-600 text-lg mb-8">Share moments, connect with friends</p>
          <button 
            onClick={() => setCurrentScreen('login')}
            className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-xl font-semibold mb-3 hover:shadow-lg transition"
          >
            Login
          </button>
          <button 
            onClick={() => setCurrentScreen('register')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
          <input
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="w-full p-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-pink-500 outline-none"
          />
          <input
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-3 border-2 border-gray-200 rounded-xl mb-6 focus:border-pink-500 outline-none"
          />
          <button 
            onClick={register}
            className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Register
          </button>
          <button onClick={() => setCurrentScreen('welcome')} className="w-full mt-4 text-pink-500 hover:underline">
            Back to Welcome
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back!</h2>
          <input
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="w-full p-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-pink-500 outline-none"
          />
          <input
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-3 border-2 border-gray-200 rounded-xl mb-6 focus:border-pink-500 outline-none"
          />
          <button 
            onClick={login}
            className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Login
          </button>
          <button onClick={() => setCurrentScreen('register')} className="w-full mt-4 text-pink-500 hover:underline">
            Create new account
          </button>
        </div>
      </div>
    );
  }

  const user = getCurrentUserData();
  const userPosts = data.posts.filter(p => 
    p.username === currentUser || user.friends.includes(p.userId)
  );
  const pendingRequests = data.friendRequests.filter(r => 
    r.toUsername === currentUser && r.status === 'pending'
  );
  
  const allUsers = data.users.filter(u => 
    u.username !== currentUser
  ).filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));

  const userNotifications = data.notifications.filter(n => n.toUsername === currentUser);
  const unreadNotifications = userNotifications.filter(n => !n.read);

  const friends = data.users.filter(u => user.friends.includes(u.id));
  const conversations = friends.map(friend => {
    const msgs = data.messages.filter(m => 
      (m.from === currentUser && m.to === friend.username) ||
      (m.from === friend.username && m.to === currentUser)
    );
    const lastMsg = msgs[msgs.length - 1];
    return { friend, lastMessage: lastMsg };
  });

  const currentConversation = selectedChat ? data.messages.filter(m =>
    (m.from === currentUser && m.to === selectedChat) ||
    (m.from === selectedChat && m.to === currentUser)
  ) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Connectify
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('messages')}
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <Mail size={24} className="text-gray-700" />
            </button>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markNotificationsAsRead();
              }}
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <Bell size={24} className="text-gray-700" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
            <span className="font-semibold">@{currentUser}</span>
            <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>

        {showNotifications && (
          <div className="absolute right-4 top-16 bg-white rounded-xl shadow-lg w-80 max-h-96 overflow-y-auto border">
            <div className="p-4 border-b font-semibold">Notifications</div>
            {userNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              userNotifications.map(notif => (
                <div key={notif.id} className={`p-4 border-b hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}>
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(notif.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around py-2 max-w-5xl mx-auto">
          <button onClick={() => setActiveTab('feed')} className={`p-3 ${activeTab === 'feed' ? 'text-pink-500' : 'text-gray-600'}`}>
            <Home size={24} />
          </button>
          <button onClick={() => setActiveTab('search')} className={`p-3 ${activeTab === 'search' ? 'text-pink-500' : 'text-gray-600'}`}>
            <Search size={24} />
          </button>
          <button onClick={() => setActiveTab('reels')} className={`p-3 ${activeTab === 'reels' ? 'text-pink-500' : 'text-gray-600'}`}>
            <Film size={24} />
          </button>
          <button onClick={() => setActiveTab('post')} className={`p-3 ${activeTab === 'post' ? 'text-pink-500' : 'text-gray-600'}`}>
            <PlusSquare size={24} />
          </button>
          <button onClick={() => setActiveTab('profile')} className={`p-3 ${activeTab === 'profile' ? 'text-pink-500' : 'text-gray-600'}`}>
            <User size={24} />
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-4 pb-20">
        {activeTab === 'feed' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Feed</h2>
            {userPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No posts yet. Start posting or add friends!
              </div>
            ) : (
              userPosts.map(post => {
                const postUser = data.users.find(u => u.username === post.username);
                return (
                  <div key={post.id} className="bg-white rounded-2xl mb-4 shadow">
                    <div className="p-4 flex items-center gap-3">
                      {postUser?.photo ? (
                        <img src={postUser.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {post.username[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{post.username}</div>
                        <div className="text-xs text-gray-500">{formatDate(post.createdAt)}</div>
                      </div>
                    </div>
                    
                    {post.image && (
                      <img src={post.image} alt="" className="w-full object-cover max-h-96" />
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button onClick={() => toggleLike(post.id)} className="flex items-center gap-2">
                          <Heart size={24} fill={post.likes.includes(currentUser) ? '#ef4444' : 'none'} 
                                 className={post.likes.includes(currentUser) ? 'text-red-500' : 'text-gray-700'} />
                          <span className="text-sm font-semibold">{post.likes.length}</span>
                        </button>
                        <button onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))} className="flex items-center gap-2">
                          <MessageCircle size={24} className="text-gray-700" />
                          <span className="text-sm font-semibold">{post.comments.length}</span>
                        </button>
                        <button onClick={() => { setSharePostId(post.id); setShowShareModal(true); }}>
                          <Send size={24} className="text-gray-700" />
                        </button>
                      </div>
                      {post.content && <p className="text-gray-800 mb-2">{post.content}</p>}
                      
                      {showComments[post.id] && (
                        <div className="mt-4 space-y-3">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="flex gap-2">
                              <span className="font-semibold text-sm">{comment.username}</span>
                              <span className="text-sm text-gray-700">{comment.text}</span>
                            </div>
                          ))}
                          <div className="flex gap-2 mt-3">
                            <input
                              value={commentText[post.id] || ''}
                              onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Add a comment..."
                              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:border-pink-500 outline-none"
                            />
                            <button 
                              onClick={() => addComment(post.id)}
                              className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-600"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Reels</h2>
            {data.reels.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No reels yet. Be the first to post!
              </div>
            ) : (
              data.reels.map(reel => {
                const reelUser = data.users.find(u => u.username === reel.username);
                return (
                  <div key={reel.id} className="bg-white rounded-2xl mb-6 shadow overflow-hidden">
                    <div className="p-4 flex items-center gap-3">
                      {reelUser?.photo ? (
                        <img src={reelUser.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {reel.username[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{reel.username}</div>
                        <div className="text-xs text-gray-500">{formatDate(reel.createdAt)}</div>
                      </div>
                    </div>
                    
                    <video src={reel.video} controls className="w-full max-h-96 bg-black" />
                    
                    <div className="p-4">
                      <div className="flex items-center gap-4 mb-2">
                        <button onClick={() => toggleReelLike(reel.id)} className="flex items-center gap-2">
                          <Heart size={24} fill={reel.likes.includes(currentUser) ? '#ef4444' : 'none'} 
                                 className={reel.likes.includes(currentUser) ? 'text-red-500' : 'text-gray-700'} />
                          <span className="text-sm font-semibold">{reel.likes.length}</span>
                        </button>
                        <MessageCircle size={24} className="text-gray-700" />
                        <Send size={24} className="text-gray-700" />
                      </div>
                      {reel.caption && <p className="text-gray-800">{reel.caption}</p>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'post' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create Post</h2>
            <div className="bg-white rounded-2xl p-6 shadow mb-6">
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="What's on your mind?"
                className="w-full p-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-pink-500 outline-none resize-none"
                rows="4"
              />
              {newPost.image && (
                <div className="mb-4 relative">
                  <img src={newPost.image} alt="" className="w-full rounded-xl max-h-96 object-cover" />
                  <button
                    onClick={() => setNewPost(prev => ({ ...prev, image: null }))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Camera size={20} /> Add Photo
                </button>
                <button onClick={createPost} className="flex-1 bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-xl font-semibold">
                  Post
                </button>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-6">Create Reel</h2>
            <div className="bg-white rounded-2xl p-6 shadow">
              <input
                value={newReel.caption}
                onChange={(e) => setNewReel(prev => ({ ...prev, caption: e.target.value }))}
                placeholder="Add a caption..."
                className="w-full p-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-pink-500 outline-none"
              />
              {newReel.video && (
                <div className="mb-4 relative">
                  <video src={newReel.video} controls className="w-full rounded-xl max-h-96 bg-black" />
                  <button 
                    onClick={() => setNewReel(prev => ({ ...prev, video: null }))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input type="file" ref={videoInputRef} onChange={handleVideoSelect} accept="video/*" className="hidden" />
                <button 
                  onClick={() => videoInputRef.current.click()}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Film size={20} /> Select Video
                </button>
                <button onClick={createReel} className="flex-1 bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-xl font-semibold">
                  Post Reel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Find Friends</h2>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full p-3 border-2 border-gray-200 rounded-xl mb-6 focus:border-pink-500 outline-none"
            />
            
            {pendingRequests.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Friend Requests</h3>
                {pendingRequests.map(req => {
                  const reqUser = data.users.find(u => u.username === req.fromUsername);
                  return (
                    <div key={req.id} className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-4 mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {reqUser?.photo ? (
                          <img src={reqUser.photo} alt="" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                            {req.fromUsername[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{req.fromUsername}</div>
                          <div className="text-sm text-gray-600">wants to be friends</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => acceptRequest(req.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
                      >
                        Accept
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <h3 className="font-semibold mb-3">All Users</h3>
            {allUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No users found</div>
            ) : (
              allUsers.map(u => {
                const userIsFriend = isFriend(u.id);
                const hasPendingRequest = data.friendRequests.some(r => 
                  r.fromUsername === currentUser && r.toUsername === u.username && r.status === 'pending'
                );

                return (
                  <div key={u.id} className="bg-white rounded-xl p-4 mb-3 shadow flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {u.photo ? (
                        <img src={u.photo} alt="" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {u.username[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{u.username}</div>
                        {u.bio && <div className="text-sm text-gray-600">{u.bio}</div>}
                        {userIsFriend && <div className="text-xs text-green-600 font-semibold">Friends</div>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {userIsFriend ? (
                        <button 
                          onClick={() => startChatWith(u.username)}
                          className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                        >
                          <MessageCircle size={16} /> Message
                        </button>
                      ) : (
                        <button 
                          onClick={() => sendFriendRequest(u.username)}
                          className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-4 py-2 rounded-xl"
                          disabled={hasPendingRequest}
                        >
                          {hasPendingRequest ? 'Sent' : 'Add Friend'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
            <div className="col-span-1 bg-white rounded-2xl shadow">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Messages</h2>
              </div>
              <div className="overflow-y-auto max-h-96">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No conversations</div>
                ) : (
                  conversations.map(({ friend, lastMessage }) => (
                    <button
                      key={friend.id}
                      onClick={() => setSelectedChat(friend.username)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b ${selectedChat === friend.username ? 'bg-pink-50' : ''}`}
                    >
                      {friend.photo ? (
                        <img src={friend.photo} alt="" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {friend.username[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{friend.username}</div>
                        {lastMessage && (
                          <div className="text-sm text-gray-500 truncate">
                            {lastMessage.text}
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="col-span-2 bg-white rounded-2xl shadow flex flex-col">
              {selectedChat ? (
                <>
                  <div className="p-4 border-b flex items-center gap-3">
                    {data.users.find(u => u.username === selectedChat)?.photo ? (
                      <img src={data.users.find(u => u.username === selectedChat).photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {selectedChat[0].toUpperCase()}
                      </div>
                    )}
                    <h3 className="font-semibold">{selectedChat}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
                    {currentConversation.map(msg => (
                      <div key={msg.id} className={`flex ${msg.from === currentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.from === currentUser ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t flex gap-2">
                    <input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 outline-none"
                    />
                    <button onClick={sendMessage} className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600">
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow mb-6">
              <div className="flex items-center gap-4 mb-6">
                {user.photo ? (
                  <img src={user.photo} alt="" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                    {currentUser[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{currentUser}</h2>
                  <p className="text-gray-600">{user.bio || 'No bio yet'}</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setEditProfile(true);
                  setProfileData({ bio: user.bio || '', photo: user.photo });
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-300 mb-4"
              >
                Edit Profile
              </button>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{data.posts.filter(p => p.username === currentUser).length}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{user.friends.length}</div>
                  <div className="text-sm text-gray-600">Friends</div>
                </div>
              </div>
            </div>

            {editProfile && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                  
                  <div className="mb-4">
                    {profileData.photo ? (
                      <div className="relative inline-block">
                        <img src={profileData.photo} alt="" className="w-24 h-24 rounded-full object-cover" />
                        <button 
                          onClick={() => setProfileData(prev => ({ ...prev, photo: null }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                        {currentUser[0].toUpperCase()}
                      </div>
                    )}
                    <input type="file" ref={profilePhotoRef} onChange={handleProfilePhotoSelect} accept="image/*" className="hidden" />
                    <button 
                      onClick={() => profilePhotoRef.current.click()}
                      className="mt-2 text-pink-500 hover:underline flex items-center gap-2"
                    >
                      <Camera size={16} /> Change Photo
                    </button>
                  </div>

                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Write a bio..."
                    className="w-full p-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-pink-500 outline-none resize-none"
                    rows="3"
                  />

                  <div className="flex gap-2">
                    <button 
                      onClick={updateProfile}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-xl font-semibold"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditProfile(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <h3 className="text-xl font-bold mb-4">My Posts</h3>
            <div className="grid grid-cols-3 gap-2">
              {data.posts.filter(p => p.username === currentUser).map(post => (
                <div key={post.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  {post.image ? (
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2 text-xs text-gray-600 text-center">
                      {post.content.substring(0, 50)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Share Post</h3>
              <button onClick={() => { setShowShareModal(false); setSharePostId(null); }}>
                <X size={24} />
              </button>
            </div>
            
            {friends.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No friends to share with</p>
            ) : (
              friends.map(friend => (
                <button
                  key={friend.id}
                  onClick={() => sharePost(sharePostId, friend.username)}
                  className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 rounded-lg mb-2"
                >
                  {friend.photo ? (
                    <img src={friend.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {friend.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="font-semibold">{friend.username}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectifyEnhanced;