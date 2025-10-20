import React, { useState } from 'react';
import { 
  ArrowLeft,
  Heart,
  MessageSquare,
  Eye,
  Share2,
  Flag,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Send,
  Paperclip,
  Award,
  Crown,
  Shield
} from 'lucide-react';
import '../../css/community/PostDetial.css';
const PostDetail = () => {
  const [newReply, setNewReply] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  // Mock post data
  const post = {
    id: 1,
    title: "How to manage exam anxiety and stress effectively?",
    description: `I've been struggling with severe anxiety before exams for the past few months. It's gotten to the point where I sometimes have panic attacks just thinking about upcoming tests. I've tried some basic breathing exercises, but they don't seem to help much when I'm really overwhelmed.

I'm looking for practical strategies that have actually worked for other students. Has anyone found specific techniques or resources that made a real difference? I'm particularly interested in:

- Long-term strategies for building confidence
- Immediate techniques for during the exam
- How to change negative thought patterns
- Whether therapy or counseling helped anyone

Any advice would be really appreciated. I know I'm not alone in this, but it definitely feels isolating sometimes.`,
    author: {
      name: "Alex Chen",
      type: "student",
      anonymous: false,
      avatar: null,
      reputation: 245,
      joinDate: "Sep 2023"
    },
    tags: ["Mental Health", "Exam Prep", "Stress Management", "Anxiety"],
    stats: {
      replies: 12,
      likes: 28,
      views: 156
    },
    timeAgo: "2 hours ago",
    status: "active"
  };

  // Mock replies data
  const replies = [
    {
      id: 1,
      content: `I completely understand what you're going through - I went through the exact same thing last year. Here are some strategies that really helped me:

**Before the exam:**
- Start studying earlier so you're not cramming (reduces panic)
- Practice with timed mock exams to get used to pressure
- Create a consistent pre-exam routine (same breakfast, same preparation)

**During the exam:**
- 4-7-8 breathing technique (breathe in for 4, hold for 7, out for 8)
- Read through ALL questions first to get an overview
- Start with questions you feel confident about to build momentum

**Long-term mindset:**
- Remember that one exam doesn't define you or your future
- Talk to your professors - many are understanding about anxiety

I also found that talking to a counselor at the student health center was incredibly helpful. They taught me cognitive techniques for reframing negative thoughts.

You're definitely not alone in this! ❤️`,
      author: {
        name: "Dr. Sarah Johnson",
        type: "teacher",
        anonymous: false,
        reputation: 1250,
        verified: true
      },
      timeAgo: "1 hour ago",
      likes: 15,
      isAccepted: true,
      replies: [
        {
          id: 11,
          content: "Thank you so much Dr. Johnson! The 4-7-8 breathing technique sounds really practical. I'm going to try the mock exam approach too.",
          author: {
            name: "Alex Chen",
            type: "student",
            anonymous: false
          },
          timeAgo: "45 minutes ago",
          likes: 3
        }
      ]
    },
    {
      id: 2,
      content: `I struggled with this too and what helped me the most was:

1. **Progressive muscle relaxation** - there are great apps for this
2. **Positive self-talk** - instead of "I'm going to fail" → "I've prepared well and I'll do my best"
3. **Visualization** - imagine yourself calmly taking the exam and succeeding

Also, don't underestimate the power of good sleep and nutrition. When I was sleep-deprived, my anxiety was 10x worse.

The campus counseling center offers free anxiety workshops too - highly recommend checking those out!`,
      author: {
        name: "Maya Patel",
        type: "student",
        anonymous: false,
        reputation: 180
      },
      timeAgo: "30 minutes ago",
      likes: 8,
      isAccepted: false,
      replies: []
    },
    {
      id: 3,
      content: `As someone who specializes in student mental health, I want to add that what you're experiencing is very common and treatable. Some evidence-based approaches that work well:

**Cognitive Behavioral Therapy (CBT)** - helps identify and change negative thought patterns
**Mindfulness-Based Stress Reduction** - proven effective for test anxiety
**Systematic desensitization** - gradually exposing yourself to exam-like situations

If your anxiety is severe enough to cause panic attacks, I'd strongly encourage you to speak with a professional. Many techniques work better when you have guidance initially.

Our counseling center offers specialized support for academic anxiety. Feel free to reach out if you'd like specific resources.`,
      author: {
        name: "Dr. Michael Rodriguez",
        type: "counselor",
        anonymous: false,
        reputation: 2100,
        verified: true,
        specialist: true
      },
      timeAgo: "15 minutes ago",
      likes: 22,
      isAccepted: false,
      replies: []
    }
  ];

  const getUserBadge = (user) => {
    if (user.type === 'counselor') return { color: 'bg-purple-500/20 text-purple-400', label: 'Counselor', icon: Shield };
    if (user.type === 'teacher') return { color: 'bg-green-500/20 text-green-400', label: 'Teacher', icon: Award };
    return { color: 'bg-blue-500/20 text-blue-400', label: 'Student', icon: null };
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSubmitReply = () => {
    if (newReply.trim()) {
      console.log('Submit reply:', newReply);
      setNewReply('');
    }
  };

  const handleAcceptAnswer = (replyId) => {
    console.log('Accept answer:', replyId);
  };

  const handleBack = () => {
    console.log('Navigate back to community feed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="post-detail">
        {/* Header with Back Button */}
        <div className="detail-header">
          <button onClick={handleBack} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            Back to Community
          </button>
        </div>

        {/* Main Post */}
        <div className="main-post">
          {/* Post Header */}
          <div className="post-header">
            <div className="author-section">
              <div className="author-info">
                <div className="author-details">
                  <span className="author-name">{post.author.name}</span>
                  <div className="author-meta">
                    {(() => {
                      const badge = getUserBadge(post.author);
                      return (
                        <span className={`user-badge ${badge.color}`}>
                          {badge.icon && <badge.icon className="w-4 h-4" />}
                          {badge.label}
                        </span>
                      );
                    })()}
                    <span className="reputation">{post.author.reputation} reputation</span>
                    <span className="join-date">Joined {post.author.joinDate}</span>
                  </div>
                </div>
              </div>
              <div className="post-time">{post.timeAgo}</div>
            </div>
          </div>

          {/* Post Content */}
          <div className="post-content">
            <h1 className="post-title">{post.title}</h1>
            
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag-badge">{tag}</span>
              ))}
            </div>

            <div className="post-description">
              {post.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Post Actions */}
          <div className="post-actions">
            <div className="action-buttons">
              <button 
                onClick={handleLike}
                className={`action-btn ${isLiked ? 'liked' : ''}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{post.stats.likes + (isLiked ? 1 : 0)}</span>
              </button>
              
              <div className="action-btn">
                <MessageSquare className="w-5 h-5" />
                <span>{post.stats.replies} replies</span>
              </div>
              
              <div className="action-btn">
                <Eye className="w-5 h-5" />
                <span>{post.stats.views} views</span>
              </div>
              
              <button className="action-btn">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              
              <button className="action-btn report">
                <Flag className="w-5 h-5" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="replies-section">
          <div className="replies-header">
            <h2 className="replies-title">{replies.length} Answers</h2>
          </div>

          <div className="replies-list">
            {replies.map((reply) => {
              const badge = getUserBadge(reply.author);
              return (
                <div key={reply.id} className={`reply-card ${reply.isAccepted ? 'accepted' : ''}`}>
                  {reply.isAccepted && (
                    <div className="accepted-badge">
                      <CheckCircle className="w-4 h-4" />
                      <span>Accepted Answer</span>
                    </div>
                  )}

                  <div className="reply-header">
                    <div className="reply-author">
                      <span className="author-name">{reply.author.name}</span>
                      <div className="author-badges">
                        <span className={`user-badge ${badge.color}`}>
                          {badge.icon && <badge.icon className="w-4 h-4" />}
                          {badge.label}
                        </span>
                        {reply.author.verified && (
                          <span className="verified-badge">
                            <CheckCircle className="w-4 h-4" />
                            Verified
                          </span>
                        )}
                        {reply.author.specialist && (
                          <span className="specialist-badge">
                            <Crown className="w-4 h-4" />
                            Specialist
                          </span>
                        )}
                      </div>
                      <span className="reputation">{reply.author.reputation} reputation</span>
                    </div>
                    <span className="reply-time">{reply.timeAgo}</span>
                  </div>

                  <div className="reply-content">
                    {reply.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
                    ))}
                  </div>

                  <div className="reply-actions">
                    <button className="reply-action-btn">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{reply.likes}</span>
                    </button>
                    
                    <button className="reply-action-btn">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    
                    <button className="reply-action-btn">
                      <MessageSquare className="w-4 h-4" />
                      <span>Reply</span>
                    </button>

                    {!reply.isAccepted && post.author.name === "Alex Chen" && (
                      <button 
                        onClick={() => handleAcceptAnswer(reply.id)}
                        className="accept-btn"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept Answer</span>
                      </button>
                    )}
                  </div>

                  {/* Nested Replies */}
                  {reply.replies && reply.replies.length > 0 && (
                    <div className="nested-replies">
                      {reply.replies.map((nestedReply) => {
                        const nestedBadge = getUserBadge(nestedReply.author);
                        return (
                          <div key={nestedReply.id} className="nested-reply">
                            <div className="nested-reply-header">
                              <span className="author-name">{nestedReply.author.name}</span>
                              <span className={`user-badge ${nestedBadge.color}`}>
                                {nestedBadge.label}
                              </span>
                              <span className="reply-time">{nestedReply.timeAgo}</span>
                            </div>
                            <p className="nested-reply-content">{nestedReply.content}</p>
                            <div className="nested-reply-actions">
                              <button className="reply-action-btn">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{nestedReply.likes}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reply Form */}
        <div className="reply-form-section">
          <h3 className="form-title">Your Answer</h3>
          
          <div className="reply-form">
            <div className="form-header">
              <span className="current-user">Replying as Alex Student</span>
            </div>
            
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write your answer here... Be helpful and constructive."
              className="reply-textarea"
              rows={6}
            />
            
            <div className="form-actions">
              <div className="form-tools">
                <button className="tool-btn">
                  <Paperclip className="w-4 h-4" />
                  <span>Attach</span>
                </button>
              </div>
              
              <button 
                onClick={handleSubmitReply}
                className="submit-btn"
                disabled={!newReply.trim()}
              >
                <Send className="w-4 h-4" />
                <span>Post Answer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
