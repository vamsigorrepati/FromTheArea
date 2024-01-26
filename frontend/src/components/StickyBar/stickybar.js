import React from "react";
import Container from '@components/Container';
import styles from './stickybar.module.scss';
import ProfileButton from '@components/Profile';
import Search from "@components/Search";


const StickyBar = ({ onSearch, user} ) => {
  return (
    <footer className={styles.defaultfooter}>
      <Container className={styles.footerContainer}>
        <div className={styles.buttonContainer}>
          <Search onSearch={onSearch} />
          <div className={styles.profile}>
            <ProfileButton user={user}/>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default StickyBar;
