import React from 'react';
import { Kbd } from '@chakra-ui/react';
import styles from './style.less';

const unityUrl = 'https://fun.dnft.world/unityv8/index.html';

const UnityScreen = (props) => (
  <div className={styles.unityWrapper}>
    <h2 className={styles.title}>NFT Gallery</h2>
    <p className={styles.article}>
            With the rapid development of digital technology, the tools and media used for art expression are also
            changing in the direction of digitization. NFT's artworks can now be exhibited in a special exhibition
            gallery.
    </p>
    <section>
      <iframe className={styles.iframeWrapper} src={unityUrl} frameBorder="0"/>
    </section>
    <div className={styles.kdbRow}>
      <div>
        <label>Focus</label>
        <Kbd>ESC</Kbd>
      </div>
      <div>
        <label>Walk</label>
        <Kbd mr=".8rem">W/↑</Kbd>
        <Kbd mr=".8rem">A/←</Kbd>
        <Kbd mr=".8rem">S/→</Kbd>
        <Kbd>D/↓</Kbd>
      </div>
      <div>
        <label>Camera</label>
        <Kbd>Mouse</Kbd>
      </div>
    </div>
  </div>
);
export default UnityScreen;
