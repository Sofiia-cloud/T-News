import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import styles from '../modules/PostForm.module.css';

export const PostForm: React.FC = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    setLoading(true);
    try {
      let imageUrl = null;
      if (image) {
        const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'posts'), {
        text,
        imageUrl,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        likes: [],
        likesCount: 0,
        comments: [],
      });

      setText('');
      setImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Создать публикацию</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Что у вас нового?"
        rows={3}
        className={styles.textarea}
      />
      <div className={styles.actions}>
        <label className={styles.fileLabel}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className={styles.fileInput}
          />
          Добавить изображение
        </label>
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? 'Публикация...' : 'Опубликовать'}
        </button>
      </div>

      {image && (
        <div className={styles.imagePreview}>
          <p>Изображение для загрузки: {image.name}</p>
        </div>
      )}
    </form>
  );
};
