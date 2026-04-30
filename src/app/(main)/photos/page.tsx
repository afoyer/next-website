import PhotosBrowser from './PhotosBrowser';
import styles from './photos.module.scss';

export default function Photos() {
  return (
    <div className={styles.page}>
      <PhotosBrowser />
    </div>
  );
}
