import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Post as PostType } from '../types';
import styles from '../modules/PostList.module.css';

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
    return <div className={styles.loading}>Загрузка постов...</div>;
  }

  return (
    <div className={styles.posts}>
      <h2>Лента новостей</h2>

      {posts.length === 0 ? (
        <div className={styles.empty}>
          <p>Пока нет публикаций. Будьте первым!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <div key={post.id} className={styles.publication}>
              <div className={styles.content}>
                <div className={styles.header}>
                  <img
                    src={post.userAvatar || '/img/image.svg'}
                    alt={post.userName}
                    className={styles.personImg}
                  />
                  <div className={styles.info}>
                    <p className={styles.name}>{post.userName}</p>
                    <span className={styles.time}>
                      {post.createdAt?.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className={styles.body}>
                  <p className={styles.text}>{post.text}</p>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className={styles.postImg}
                    />
                  )}
                </div>

                <div className={styles.footer}>
                  <button className={styles.likeBtn}>
                    <img
                      src="/img/svg-heart.svg"
                      alt="Лайк"
                      className={styles.likeImg}
                    />
                    <span className={styles.likes}>{post.likesCount}</span>
                  </button>

                  <button className={styles.greyBtn}>
                    Комментарии
                    <span className={styles.commentCount}>
                      {post.comments?.length || 0}
                    </span>
                  </button>

                  <button className={styles.greyBtn}>Поделиться</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
