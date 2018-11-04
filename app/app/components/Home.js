// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from 'element-react';
import routes from '../constants/routes';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    console.log(styles);
    return (
      <div className={styles.container} data-tid="container">
        <section className={styles.navBar}>NavBar</section>
        <section className={styles.searchPanel}>
          <section className={styles.searchInputContainer}>
            <Input placeholder="Name" />
            <Button>Search</Button>
          </section>
          <section className={styles.luckyPanel}>
            <div className={styles.toggleBtn}>+</div>
            <div className={styles.recommendedGallery}>
              {[1, 2, 3].map(i => (
                <section key={i} className={styles.galleryCard}>
                  <div
                    style={{
                      backgroundColor: 'black',
                      height: '240px',
                      width: '180px'
                    }}
                  />
                  <div
                    style={{
                      width: '208px',
                      height: '64px',
                      marginTop: '-64px',
                      padding: '12px 40px',
                      backgroundColor: 'blue'
                    }}
                  >
                    <h3 style={{ fontSize: '14px' }}>Hello World</h3>
                    <p style={{ fontSize: '12px' }}>Great to view !</p>
                  </div>
                </section>
              ))}
            </div>
          </section>
        </section>
        <section className={styles.galleryContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((item) => (
            <Link key={item} to={routes.GALLERY}>
              <section className={styles.galleryCard}>
                <div
                  style={{
                    backgroundColor: 'black',
                    height: '240px',
                    width: '180px'
                  }}
                />
                <div
                  style={{
                    width: '208px',
                    height: '64px',
                    marginTop: '-64px',
                    padding: '12px 40px',
                    backgroundColor: 'blue'
                  }}
                >
                  <h3 style={{ fontSize: '14px' }}>Hello World</h3>
                  <p style={{ fontSize: '12px' }}>Great to view !</p>
                </div>
              </section>
            </Link>
          ))}
        </section>
      </div>
    );
  }
}
