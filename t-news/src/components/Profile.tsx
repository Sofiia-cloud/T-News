import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PostForm } from './PostForm';
import styles from '../modules/Profile.module.css';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(
    'Обо мне: римский философ, поэт и государственный деятель.'
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Логика загрузки изображения
    console.log('Изменение изображения');
  };

  const handleBioSave = () => {
    setIsEditing(false);
    // Логика сохранения био
  };

  return (
    <div className={styles.profile_container}>
      <section className={styles.person_info}>
        <div className={styles.profile_image}>
          <img
            id="profile-image"
            src="/img/image.svg"
            alt="Изображение профиля"
          />
          <label className={styles.change_image}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            Изменить фото
          </label>
        </div>

        <div className={styles.profile_header}>
          <div className={styles.profile_info_header}>
            <h1>{user?.displayName || user?.email || 'Пользователь'}</h1>
            <button
              className={styles.change_bio}
              onClick={() => setIsEditing(!isEditing)}
            >
              <img src="/img/edit.svg" alt="Редактировать" />
            </button>
          </div>

          <div className={styles.profile_info_body}>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onBlur={handleBioSave}
                autoFocus
                className={styles.bio_textarea}
              />
            ) : (
              <p>{bio}</p>
            )}
            <button
              className={styles.change_bio}
              onClick={() => setIsEditing(!isEditing)}
            >
              <img src="/img/edit.svg" alt="Редактировать" />
            </button>
          </div>
        </div>

        <div className={styles.subscribe}>
          <button className={styles.subscribe_btn}>Подписаться</button>
        </div>
      </section>

      <PostForm />

      <section className={styles.posts}>
        {/* Здесь будут посты пользователя */}
        <div className={styles.publication}>
          <div className={styles.publication_content}>
            <div className={styles.publication_header}>
              <img
                alt="person icon"
                src="/img/image.svg"
                className={styles.publication_person_image}
              />
              <p className={styles.name}>{user?.displayName || user?.email}</p>
            </div>
            <div className={styles.publication_body}>
              <p className={styles.publication_text}>
                «Мустанг» был заперт; он словно припал на широкие колеса, будто
                спал. Автомобиль Клэрис забавлял доктора Лектера...
              </p>
            </div>
            <div className={styles.publication_footer}>
              <button className={styles.likes_button}>
                <img
                  className={styles.like_img}
                  alt="heart"
                  src="/img/svg-heart.svg"
                />
                <span className={styles.likes_count}>21</span>
              </button>
              <button className={styles.grey_button}>
                Комментарии <span className={styles.comments_count}>5</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
