import React from 'react';
import comHead from './dnft_head.png';
import comSoon from './coming_soon.gif';
const SoonModal = () => (
  <div style={{
    zIndex: 3,
    position: 'sticky',
    top: '84px',
    width: '100%',
  }}>
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(0, 0, 0, 0.6)',
    }}>
      <img src={comHead} alt="DNFT" style={{
        width: '7%',
        height: '4%',
        minWidth: '82px',
        minHeight: '37px'
      }}/>
      <img src={comSoon} alt="Coming Soon" style={{
        width: '20%',
        height: '6%',
        minWidth: '342px',
        minHeight: '75px',
        margin: '4rem 0'
      }}/>
      <p style={{
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        fontSize: '3.6rem',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '-0.015em',
        color: '#60EADA'
      }}>Coming Soon</p>
    </div>
  </div>
)
export default SoonModal
