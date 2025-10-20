import React, { useState } from 'react';
import { 
  ArrowLeft,
  HelpCircle,
  Tag,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Lightbulb,
  MessageSquare,
  BookOpen,
  Brain,
  Users
} from 'lucide-react';
import '../../css/community/AskQuestion.css';
import { useNavigate } from 'react-router-dom';
const AskQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    isAnonymous: false,
    category: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Predefined categories and tags
  const categories = [
    { id: 'academic', label: 'Academic Help', icon: BookOpen, color: 'blue' },
    { id: 'mental-health', label: 'Mental Health', icon: Brain, color: 'purple' },
    { id: 'study-groups', label: 'Study Groups', icon: Users, color: 'green' },
    { id: 'general', label: 'General Discussion', icon: MessageSquare, color: 'gray' }
  ];

  const popularTags = {
    academic: ['Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Assignment Help', 'Exam Prep'],
    'mental-health': ['Anxiety', 'Stress Management', 'Depression', 'Motivation', 'Sleep Issues', 'Mindfulness', 'Self Care', 'Therapy'],
    'study-groups': ['Group Formation', 'Study Partners', 'Online Sessions', 'Local Meetups', 'Subject Specific'],
    general: ['Career Advice', 'University Life', 'Time Management', 'Resources', 'Tips & Tricks']
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddTag = (tag) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title should be at least 10 characters';
    } else if (formData.title.length > 150) {
      newErrors.title = 'Title should be under 150 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Please provide more details (at least 20 characters)';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'Please add at least one tag';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitted:', formData);
      
      // Navigate back to community feed
      handleBack();
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const navigate= useNavigate();
  const handleBack = () => {
    navigate("/community");
  };

  const getCategoryColor = (color) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="ask-question-page">
        {/* Header */}
        <div className="page-header">
          <button onClick={handleBack} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            Back to Community
          </button>
          
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">Ask a Question</h1>
              <p className="page-subtitle">Get help from our community of students, teachers, and counselors</p>
            </div>
            
            <div className="header-actions">
              {/* <button 
                onClick={() => setShowPreview(!showPreview)}
                className="preview-btn"
              >
                {showPreview ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                {showPreview ? 'Edit' : 'Preview'}
              </button> */}
            </div>
          </div>
        </div>

        <div className="form-container">
          {!showPreview ? (
            /* Form View */
            <div className="question-form">
              {/* Tips Section */}
              <div className="tips-section">
                <div className="tips-header">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <span className="tips-title">Writing a good question</span>
                </div>
                <ul className="tips-list">
                  <li>Be specific and clear in your title</li>
                  <li>Provide context and details in the description</li>
                  <li>Choose relevant tags to help others find your question</li>
                  <li>Be respectful and constructive</li>
                </ul>
              </div>

              {/* Category Selection */}
              <div className="form-section">
                <label className="form-label">
                  Category *
                  {errors.category && <span className="error-text">{errors.category}</span>}
                </label>
                
                <div className="category-grid">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleInputChange('category', category.id)}
                      className={`category-card ${formData.category === category.id ? 'selected' : ''} ${getCategoryColor(category.color)}`}
                    >
                      <category.icon className="w-6 h-6" />
                      <span className="category-name">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="form-section">
                <label className="form-label">
                  Question Title *
                  <span className="char-count">{formData.title.length}/150</span>
                  {errors.title && <span className="error-text">{errors.title}</span>}
                </label>
                
                <input
                  type="text"
                  placeholder="Be specific and imagine you're asking another person"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`title-input ${errors.title ? 'error' : ''}`}
                  maxLength={150}
                />
              </div>

              {/* Description Input */}
              <div className="form-section">
                <label className="form-label">
                  Description *
                  <span className="char-count">{formData.description.length} characters</span>
                  {errors.description && <span className="error-text">{errors.description}</span>}
                </label>
                
                <textarea
                  placeholder="Provide all the details someone would need to understand your question. What have you tried? What specific help do you need?"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`description-input ${errors.description ? 'error' : ''}`}
                  rows={8}
                />
              </div>

              {/* Tags Section */}
              <div className="form-section">
                <label className="form-label">
                  Tags * (up to 5)
                  {errors.tags && <span className="error-text">{errors.tags}</span>}
                </label>
                
                {/* Selected Tags */}
                {formData.tags.length > 0 && (
                  <div className="selected-tags">
                    {formData.tags.map(tag => (
                      <span key={tag} className="selected-tag">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Popular Tags for Selected Category */}
                {formData.category && popularTags[formData.category] && (
                  <div className="popular-tags">
                    <span className="tags-subtitle">Popular tags:</span>
                    <div className="tags-grid">
                      {popularTags[formData.category].map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleAddTag(tag)}
                          disabled={formData.tags.includes(tag) || formData.tags.length >= 5}
                          className="tag-suggestion"
                        >
                          <Plus className="w-3 h-3" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Privacy Settings */}
              <div className="form-section">
                <div className="privacy-section">
                  <div className="privacy-header">
                    <label className="form-label">Privacy Settings</label>
                  </div>
                  
                  <div className="privacy-option">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={formData.isAnonymous}
                      onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                      className="privacy-checkbox"
                    />
                    <label htmlFor="anonymous" className="privacy-label">
                      <div className="privacy-content">
                        <span className="privacy-title">Post anonymously</span>
                        <span className="privacy-description">Your name won't be visible to other users</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="submit-section">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner" />
                      Posting Question...
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-5 h-5" />
                      Post Your Question
                    </>
                  )}
                </button>
                
                <button onClick={handleBack} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Preview View */
            <div className="preview-section">
              <div className="preview-header">
                <h2 className="preview-title">Question Preview</h2>
                <p className="preview-subtitle">This is how your question will appear to others</p>
              </div>
              
              <div className="preview-card">
                <div className="preview-post-header">
                  <div className="preview-author">
                    <span className="author-name">
                      {formData.isAnonymous ? 'Anonymous' : 'You'}
                    </span>
                    <span className="user-badge bg-blue-500/20 text-blue-400">Student</span>
                  </div>
                  <span className="post-time">Just now</span>
                </div>
                
                <h3 className="preview-post-title">
                  {formData.title || 'Your question title will appear here'}
                </h3>
                
                {formData.tags.length > 0 && (
                  <div className="preview-tags">
                    {formData.tags.map(tag => (
                      <span key={tag} className="preview-tag">{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="preview-description">
                  {formData.description || 'Your question description will appear here'}
                </div>
                
                <div className="preview-stats">
                  <div className="stat-item">
                    <MessageSquare className="w-4 h-4" />
                    <span>0 replies</span>
                  </div>
                  <div className="stat-item">
                    <Eye className="w-4 h-4" />
                    <span>0 views</span>
                  </div>
                </div>
              </div>
              
              <div className="preview-actions">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !validateForm()}
                  className="submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner" />
                      Posting Question...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Looks Good - Post It!
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;