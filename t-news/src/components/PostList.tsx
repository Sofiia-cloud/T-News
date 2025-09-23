import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Post as PostType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useLikes } from '../hooks/useLikes';
import styles from '../modules/PostList.module.css';

export const PostList: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toggleLike, loading: likeLoading } = useLikes();

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
          createdAt: data.createdAt?.toDate() || new Date(),
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

  const handleLikeClick = async (post: PostType) => {
    if (!user) {
      alert('Войдите в систему чтобы ставить лайки');
      return;
    }

    try {
      const isLiked = post.likes.includes(user.uid);
      await toggleLike(post.id, isLiked);
    } catch (error) {
      console.error('Ошибка при лайке:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('ru', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка постов...</div>;
  }

  return (
    <div className={styles.postsContainer}>
      <h2 className={styles.title}>Лента новостей</h2>

      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Пока нет публикаций. Будьте первым!</p>
        </div>
      ) : (
        <div className={styles.postsList}>
          {posts.map((post) => {
            const isLiked = user ? post.likes.includes(user.uid) : false;
            const isOwnPost = user ? user && post.userId === user.uid : false;

            return (
              <div key={post.id} className={styles.publication}>
                <div className={styles.publicationContent}>
                  <div className={styles.publicationHeader}>
                    <img
                      src={post.userAvatar || '/img/image.svg'}
                      alt={post.userName}
                      className={styles.publicationPersonImage}
                    />
                    <div className={styles.userInfo}>
                      <p className={styles.name}>{post.userName}</p>
                      <span className={styles.time}>
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.publicationBody}>
                    <p className={styles.publicationText}>{post.text}</p>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        className={styles.postImage}
                      />
                    )}
                  </div>

                  <div className={styles.publicationFooter}>
                    <button
                      onClick={() => handleLikeClick(post)}
                      disabled={likeLoading || isOwnPost}
                      className={`${styles.likesButton} ${isLiked ? styles.liked : ''} ${isOwnPost ? styles.disabled : ''}`}
                      title={
                        isOwnPost
                          ? 'Нельзя лайкать свои посты'
                          : isLiked
                            ? 'Убрать лайк'
                            : 'Поставить лайк'
                      }
                    >
                      <svg
                        className={styles.likeIcon}
                        viewBox="0 0 24 24"
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className={styles.likesCount}>
                        {post.likesCount}
                      </span>
                    </button>

                    <button className={styles.greyButton}>
                      <svg
                        className={styles.commentIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Комментарии
                      <span className={styles.commentsCount}>
                        {post.comments?.length || 0}
                      </span>
                    </button>

                    <button className={styles.greyButton}>
                      <svg
                        className={styles.shareIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      Поделиться
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
