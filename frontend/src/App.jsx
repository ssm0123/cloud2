import { useState, useEffect } from 'react';
import { postApi } from './api/postApi';
import './App.css';

// --- Sub-components (Defined outside to prevent focus loss) ---

const ListView = ({ posts, handlePostClick, handleCreateClick }) => (
  <div className="board-container fade-in">
    <h2>게시판 목록</h2>
    <button className="btn-primary" onClick={handleCreateClick}>글쓰기</button>
    <div className="table-responsive">
      <table className="post-table">
        <thead>
          <tr>
            <th style={{ width: '8%' }}>번호</th>
            <th style={{ width: '57%' }}>제목</th>
            <th style={{ width: '15%' }}>작성자</th>
            <th style={{ width: '20%' }}>작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id} onClick={() => handlePostClick(post.id)} className="clickable-row">
              <td>{post.id}</td>
              <td className="post-title-cell">{post.title}</td>
              <td>{post.author}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DetailView = ({ currentPost, setView, handleEditClick, handleDelete }) => (
  <div className="board-container detail-view fade-in">
    <h2>{currentPost?.title}</h2>
    <div className="post-meta">
      <span>작성자: {currentPost?.author}</span> | 
      <span> 작성일: {new Date(currentPost?.createdAt).toLocaleString()}</span>
    </div>
    <div className="post-content">
      {currentPost?.content}
    </div>
    <div className="btn-group">
      <button onClick={() => setView('list')}>목록으로</button>
      <button onClick={() => handleEditClick(currentPost)}>수정</button>
      <button className="btn-danger" onClick={() => handleDelete(currentPost.id)}>삭제</button>
    </div>
  </div>
);

const FormView = ({ currentPost, formData, handleChange, handleSubmit, setView }) => (
  <div className="board-container fade-in">
    <h2>{currentPost ? '게시글 수정' : '게시글 작성'}</h2>
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label>제목</label>
        <input 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          required 
          autoFocus={!currentPost}
        />
      </div>
      <div className="form-group">
        <label>작성자</label>
        <input 
          name="author" 
          value={formData.author} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label>내용</label>
        <textarea 
          name="content" 
          value={formData.content} 
          onChange={handleChange} 
          rows="10" 
          required 
        />
      </div>
      <div className="btn-group">
        <button type="submit" className="btn-primary">{currentPost ? '수정완료' : '등록'}</button>
        <button type="button" onClick={() => setView('list')}>취소</button>
      </div>
    </form>
  </div>
);

function App() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'detail', 'form'
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', author: '' });

  // 초기 목록 로드
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postApi.getAllPosts();
      // 최신글 상단 정렬
      const sortedPosts = response.data.sort((a, b) => b.id - a.id);
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreateClick = () => {
    setFormData({ title: '', content: '', author: '' });
    setCurrentPost(null);
    setView('form');
  };

  const handleEditClick = (post) => {
    setFormData({ title: post.title, content: post.content, author: post.author });
    setCurrentPost(post);
    setView('form');
  };

  const handlePostClick = async (id) => {
    try {
      const response = await postApi.getPost(id);
      setCurrentPost(response.data);
      setView('detail');
    } catch (error) {
      console.error('Error fetching post detail:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await postApi.deletePost(id);
      fetchPosts();
      setView('list');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPost) {
        await postApi.updatePost(currentPost.id, formData);
      } else {
        await postApi.createPost(formData);
      }
      fetchPosts();
      setView('list');
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React + Spring MVC Bulletin Board</h1>
      </header>
      <main>
        {view === 'list' && (
          <ListView 
            posts={posts} 
            handlePostClick={handlePostClick} 
            handleCreateClick={handleCreateClick} 
          />
        )}
        {view === 'detail' && (
          <DetailView 
            currentPost={currentPost} 
            setView={setView} 
            handleEditClick={handleEditClick} 
            handleDelete={handleDelete} 
          />
        )}
        {view === 'form' && (
          <FormView 
            currentPost={currentPost} 
            formData={formData} 
            handleChange={handleChange} 
            handleSubmit={handleSubmit} 
            setView={setView} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
