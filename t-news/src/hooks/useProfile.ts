import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { auth, db, storage } from '../services/firebase';
import { User } from '../types';

interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  photoURL?: string;
}

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserProfile = async (userId: string, data: UpdateProfileData) => {
    setLoading(true);
    setError(null);

    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, data, { merge: true });
      return true;
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении профиля');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (
    file: File,
    userId: string
  ): Promise<string | null> => {
    try {
      const user = auth.currentUser;
      if (user?.photoURL) {
        try {
          const oldImageRef = ref(storage, user.photoURL);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.log('Старое изображение не найдено или уже удалено');
        }
      }

      const storageRef = ref(
        storage,
        `profile-images/${userId}/${Date.now()}_${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке изображения');
      return null;
    }
  };

  const updateProfileData = async (data: {
    displayName?: string;
    bio?: string;
    photoFile?: File;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Пользователь не авторизован');

      const updates: UpdateProfileData = {};
      let photoURL: string | null;

      if (data.photoFile) {
        photoURL = await uploadProfileImage(data.photoFile, user.uid);
        if (photoURL) {
          updates.photoURL = photoURL;
        }
      }

      if (data.displayName && data.displayName !== user.displayName) {
        updates.displayName = data.displayName;
      }

      if (data.bio !== undefined) {
        updates.bio = data.bio;
      }

      if (updates.displayName || updates.photoURL) {
        await updateProfile(user, {
          displayName: updates.displayName,
          photoURL: updates.photoURL,
        });
      }

      await updateUserProfile(user.uid, updates);
      window.location.reload();
      return true;
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении профиля');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке профиля');
      return null;
    }
  };

  return {
    updateProfileData,
    getUserProfile,
    uploadProfileImage,
    loading,
    error,
    clearError: () => setError(null),
  };
}
