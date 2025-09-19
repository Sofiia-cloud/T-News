import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

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
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Создать публикацию</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Что у вас нового?"
        rows={3}
        className="w-full p-4 border border-gray-200 rounded-xl resize-vertical text-gray-700 mb-4 focus:border-blue-500 focus:outline-none"
      />
      <div className="flex justify-between items-center">
        <label className="cursor-pointer text-blue-600 font-medium">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="hidden"
          />
          Добавить изображение
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 disabled:opacity-50"
        >
          {loading ? 'Публикация...' : 'Опубликовать'}
        </button>
      </div>
    </form>
  );
};
