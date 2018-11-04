// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Gallery.css';

type Props = {};

export default class Gallery extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <div className={styles.viewer}>
          {[1, 2, 3, 4, 5, 6].map((image) => (
            <img key={image} src="https://placehold.it/1920x1080?text=1" alt="" />
          ))}
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ height: '34%' }} />
        </div>
        <section className={styles.fab}>
          <div className={styles.inner}>
            <div className={styles.menu}>
              <div className={styles.item}>
                <span>Bottom</span>
              </div>
              <div className={styles.item}>
              <Link to={routes.HOME}>Home</Link>

              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
