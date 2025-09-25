import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { PostForm } from './PostForm';
import profile_photo from '../assets/image.svg';
import edit from '../assets/edit.svg';
import cross from '../assets/Cross.svg';
import styles from '../modules/Profile.module.css';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { updateProfileData, loading, error } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Загружаем данные пользователя при монтировании
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        bio: user.bio || 'Расскажите о себе...',
      });
      setImagePreview(user.photoURL || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Размер изображения не должен превышать 5MB');
        return;
      }

      setSelectedImage(file);

      // Создаем превью изображения
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    const success = await updateProfileData({
      displayName: formData.displayName.trim(),
      bio: formData.bio.trim(),
      photoFile: selectedImage || undefined,
    });

    if (success) {
      setIsEditing(false);
      setSelectedImage(null);
      // Можно показать сообщение об успехе
      alert('Профиль успешно обновлен!');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImage(null);
    // Восстанавливаем оригинальные данные
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        bio: user.bio || 'Расскажите о себе...',
      });
      setImagePreview(user.photoURL || null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) {
    return <div className={styles.loading}>Пользователь не найден</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <section className={styles.personInfo}>
        <div className={styles.profileImage}>
          <div className={styles.imageContainer}>
            <img
              src={imagePreview || profile_photo}
              alt="Изображение профиля"
              className={styles.profileImage}
            />
            {isEditing && (
              <label className={styles.imageOverlay}>
                <span>Изменить фото</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              </label>
            )}
          </div>

          {isEditing && (
            <button
              className={styles.changeImageButton}
              onClick={() => document.getElementById('imageInput')?.click()}
            >
              Изменить фото
            </button>
          )}
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.profileInfoHeader}>
            {isEditing ? (
              <input
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Введите ваше имя"
                className={styles.nameInput}
                maxLength={50}
              />
            ) : (
              <h1>{user.displayName || 'Пользователь'}</h1>
            )}

            <button
              className={styles.editButton}
              onClick={() => setIsEditing(!isEditing)}
              title={isEditing ? 'Отменить' : 'Редактировать'}
            >
              <img
                src={isEditing ? cross : edit}
                alt={isEditing ? 'Отменить' : 'Редактировать'}
              />
            </button>
          </div>

          <div className={styles.profileInfoBody}>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Расскажите о себе..."
                className={styles.bioTextarea}
                rows={4}
                maxLength={500}
              />
            ) : (
              <p>
                {user.bio || 'Пользователь еще не добавил информацию о себе.'}
              </p>
            )}
          </div>

          {isEditing && (
            <div className={styles.editControls}>
              <button
                onClick={handleSave}
                disabled={loading}
                className={styles.saveButton}
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Отмена
              </button>
            </div>
          )}

          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>42</span>
            <span className={styles.statLabel}>публикаций</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>127</span>
            <span className={styles.statLabel}>подписчиков</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>89</span>
            <span className={styles.statLabel}>подписок</span>
          </div>
        </div>
      </section>

      <PostForm />

      {/* Здесь будут посты пользователя */}
      <section className={styles.userPosts}>
        <h2>Мои публикации</h2>
        <div className={styles.emptyPosts}>
          <p>У вас пока нет публикаций</p>
        </div>
      </section>
    </div>
  );
};
