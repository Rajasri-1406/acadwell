import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Heart, 
  Eye, 
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Brain,
  Coffee,
  Users,
  Award,
  Star,
  ChevronLeft
} from 'lucide-react';
import '../../css/community/CommunityFeed.css';
import { Link } from 'react-router-dom';
const CommunityFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for posts
  const posts = [
    {
      id: 1,
      title: "How to manage exam anxiety and stress effectively?",
      description: "I've been struggling with severe anxiety before exams. Looking for practical strategies that have worked for others...",
      author: {
        name: "Alex Chen",
        type: "student",
        anonymous: false
      },
      tags: ["Mental Health", "Exam Prep", "Stress Management"],
      stats: {
        replies: 12,
        likes: 28,
        views: 156
      },
      timeAgo: "2 hours ago",
      status: "active",
      featured: true
    },
    {
      id: 2,
      title: "Best practices for machine learning model validation?",
      description: "Working on my final project and need guidance on proper validation techniques for ML models...",
      author: {
        name: "Anonymous",
        type: "student",
        anonymous: true   
      },
      tags: ["Machine Learning", "CS301", "Project Help"],
      stats: {
        replies: 8,
        likes: 15,
        views: 89
      },
      timeAgo: "4 hours ago",
      status: "answered",
      acceptedAnswer: true
    },
    {
      id: 3,
      title: "Study group formation - Calculus II",
      description: "Looking to form a study group for Calculus II. We can meet twice a week and help each other with problem sets...",
      author: {
        name: "Dr. Sarah Johnson",
        type: "teacher",
        anonymous: false
      },
      tags: ["Study Groups", "Mathematics", "MATH201"],
      stats: {
        replies: 25,
        likes: 42,
        views: 234
      },
      timeAgo: "6 hours ago",
      status: "active"
    },
    {
      id: 4,
      title: "Mindfulness techniques for students - Evidence-based approaches",
      description: "Sharing some research-backed mindfulness practices that can help with academic stress and overall well-being...",
      author: {
        name: "Dr. Michael Rodriguez",
        type: "counselor",
        anonymous: false
      },
      tags: ["Mindfulness", "Mental Health", "Research"],
      stats: {
        replies: 18,
        likes: 67,
        views: 312
      },
      timeAgo: "1 day ago",
      status: "answered",
      featured: true
    },
    {
      id: 5,
      title: "Anyone else struggling with imposter syndrome?",
      description: "Starting to doubt my abilities as I progress through my CS degree. How do you deal with feeling like you don't belong?",
      author: {
        name: "Anonymous",
        type: "student",
        anonymous: true
      },
      tags: ["Mental Health", "Self Doubt", "Career Advice"],
      stats: {
        replies: 31,
        likes: 89,
        views: 445
      },
      timeAgo: "2 days ago",
      status: "active"
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Posts', icon: MessageSquare },
    { value: 'mental-health', label: 'Mental Health', icon: Brain },
    { value: 'academic', label: 'Academic', icon: BookOpen },
    { value: 'study-groups', label: 'Study Groups', icon: Users },
    { value: 'unanswered', label: 'Unanswered', icon: AlertCircle },
    { value: 'trending', label: 'Trending', icon: TrendingUp }
  ];

  const getUserBadge = (userType) => {
    const badges = {
      student: { color: 'bg-blue-500/20 text-blue-400', label: 'Student' },
      teacher: { color: 'bg-green-500/20 text-green-400', label: 'Teacher' },
      counselor: { color: 'bg-purple-500/20 text-purple-400', label: 'Counselor' }
    };
    return badges[userType] || badges.student;
  };

  const getStatusIcon = (status, hasAccepted = false) => {
    if (hasAccepted) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'answered') return <CheckCircle className="w-4 h-4 text-blue-400" />;
    return <Clock className="w-4 h-4 text-yellow-400" />;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         post.tags.some(tag => tag.toLowerCase().includes(selectedFilter.replace('-', ' ')));
    return matchesSearch && matchesFilter;
  });

  const handlePostClick = (postId) => {
    // This would navigate to post detail - replace with your routing logic
    console.log(`Navigate to post ${postId}`);
  };

 const handleAskQuestion = () => {
  window.location.href = "/community/askquestion"; 
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="community-feed">
        {/* Header Section */}
        <div className="feed-header">
          <div className="header-content">
            {/* Left: Back Button */}
            <div className="header-left">
              <Link to="/dashboard/student" className="back-btn">
                <ChevronLeft className="back-icon" />
                <span className="back-text">Back to Dashboard</span>
              </Link>
            </div>

            {/* Center: Title */}
            <div className="header-center">
              <h1 className="page-title">Community Forum</h1>
              <p className="page-subtitle">Connect, share knowledge, and support each other</p>
            </div>

            {/* Right: Ask Question */}
            <div className="header-right">
              <Link to='/community/askquestion'>
                <button className="ask-question-btn">
                  <Plus className="w-5 h-5" />
                  Ask Question
                </button>
              </Link>
            </div>
          </div>
        </div>


        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search questions, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <Filter className="filter-icon" />
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="filter-select"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Posts */}
        <div className="featured-section">
          <h2 className="section-title">
            <Star className="w-5 h-5" />
            Featured Discussions
          </h2>
          <div className="featured-posts">
            {posts.filter(post => post.featured).slice(0, 2).map(post => (
              <div key={post.id} className="featured-post-card" onClick={() => handlePostClick(post.id)}>
                <div className="post-header">
                  <div className="author-info">
                    {post.author.anonymous ? (
                      <span className="anonymous-badge">Anonymous</span>
                    ) : (
                      <>
                        <span className="author-name">{post.author.name}</span>
                        <span className={`user-badge ${getUserBadge(post.author.type).color}`}>
                          {getUserBadge(post.author.type).label}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="post-time">{post.timeAgo}</span>
                </div>
                
                <h3 className="post-title">{post.title}</h3>
                <p className="post-description">{post.description}</p>
                
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag-badge">{tag}</span>
                  ))}
                </div>
                
                <div className="post-stats">
                  <div className="stat-item">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.stats.replies}</span>
                  </div>
                  <div className="stat-item">
                    <Heart className="w-4 h-4" />
                    <span>{post.stats.likes}</span>
                  </div>
                  <div className="stat-item">
                    <Eye className="w-4 h-4" />
                    <span>{post.stats.views}</span>
                  </div>
                  <div className="status-indicator">
                    {getStatusIcon(post.status, post.acceptedAnswer)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div className="posts-section">
          <h2 className="section-title">
            <MessageSquare className="w-5 h-5" />
            All Discussions ({filteredPosts.length})
          </h2>
          
          <div className="posts-list">
            {filteredPosts.map(post => (
              <div key={post.id} className="post-card" onClick={() => handlePostClick(post.id)}>
                <div className="post-header">
                  <div className="author-info">
                    {post.author.anonymous ? (
                      <span className="anonymous-badge">Anonymous</span>
                    ) : (
                      <>
                        <span className="author-name">{post.author.name}</span>
                        <span className={`user-badge ${getUserBadge(post.author.type).color}`}>
                          {getUserBadge(post.author.type).label}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="post-time">{post.timeAgo}</span>
                </div>
                
                <h3 className="post-title">{post.title}</h3>
                <p className="post-description">{post.description}</p>
                
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag-badge">{tag}</span>
                  ))}
                </div>
                
                <div className="post-footer">
                  <div className="post-stats">
                    <div className="stat-item">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.stats.replies} replies</span>
                    </div>
                    <div className="stat-item">
                      <Heart className="w-4 h-4" />
                      <span>{post.stats.likes}</span>
                    </div>
                    <div className="stat-item">
                      <Eye className="w-4 h-4" />
                      <span>{post.stats.views}</span>
                    </div>
                  </div>
                  
                  <div className="status-indicator">
                    {getStatusIcon(post.status, post.acceptedAnswer)}
                    <span className="status-text">
                      {post.acceptedAnswer ? 'Solved' : 
                       post.status === 'answered' ? 'Answered' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Ask Button for Mobile */}
        <button onClick={handleAskQuestion} className="floating-ask-btn">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CommunityFeed;