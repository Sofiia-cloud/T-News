import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Post as PostType } from '../types';

export const PostList: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: PostType[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({
          id: doc.id,
          text: data.text,
          userId: data.userId,
          userEmail: data.userEmail,
          userName: data.userName,
          userAvatar: data.userAvatar,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt?.toDate(),
          likes: data.likes || [],
          likesCount: data.likesCount || 0,
          comments: data.comments || [],
        });
      });
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка постов...</div>;
  }

  return (
    <div className="posts-container">
      <h2>Лента новостей</h2>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>Пока нет публикаций. Будьте первым!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="publication">
              <div className="publication-content">
                <div className="publication-header">
                  <img
                    src={post.userAvatar || '/img/image.svg'}
                    alt={post.userName}
                    className="publication-person-image"
                  />
                  <div className="user-info">
                    <p className="name">{post.userName}</p>
                    <span className="time">
                      {post.createdAt?.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="publication-body">
                  <p className="publication-text">{post.text}</p>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="post-image"
                    />
                  )}
                </div>

                <div className="publication-footer">
                  <button className="likes-button">
                    <img
                      src="/img/svg-heart.svg"
                      alt="Лайк"
                      className="like-img"
                    />
                    <span className="likes-count">{post.likesCount}</span>
                  </button>

                  <button className="grey-button">
                    Комментарии
                    <span className="comments-count">
                      {post.comments?.length || 0}
                    </span>
                  </button>

                  <button className="grey-button">Поделиться</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
