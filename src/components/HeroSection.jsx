// HeroSection.jsx — Premium landing hero with branding and doodle background

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DOODLES = [
  { type: 'star4', x: '8%',  y: '15%', size: 28, delay: 0,    rot: 15,  mobileX: '10%', mobileY: '10%', mobileSize: 20 },
  { type: 'star4', x: '90%', y: '20%', size: 22, delay: 0.8,  rot: -10, mobileX: '85%', mobileY: '15%', mobileSize: 18 },
  { type: 'heart', x: '5%',  y: '70%', size: 20, delay: 1.2,  rot: -8,  mobileX: '10%', mobileY: '75%', mobileSize: 16 },
  { type: 'heart', x: '93%', y: '65%', size: 18, delay: 0.4,  rot: 12,  mobileX: '85%', mobileY: '70%', mobileSize: 14 },
  { type: 'star4', x: '15%', y: '85%', size: 16, delay: 1.8,  rot: 30,  mobileX: '20%', mobileY: '88%', mobileSize: 12 },
  { type: 'swirl', x: '85%', y: '80%', size: 24, delay: 0.6,  rot: -20, mobileX: '80%', mobileY: '85%', mobileSize: 18 },
  { type: 'spark', x: '75%', y: '12%', size: 14, delay: 2.0,  rot: 0,   mobileX: '70%', mobileY: '8%',  mobileSize: 10 },
  { type: 'spark', x: '20%', y: '45%', size: 12, delay: 1.5,  rot: 45,  mobileX: '15%', mobileY: '40%', mobileSize: 10 },
  { type: 'star4', x: '55%', y: '5%',  size: 10, delay: 2.5,  rot: -5,  mobileX: '50%', mobileY: '5%',  mobileSize: 8  },
  { type: 'swirl', x: '3%',  y: '40%', size: 18, delay: 1.0,  rot: 10,  mobileX: '5%',  mobileY: '35%', mobileSize: 14 },
];

const ARTIST_IMAGES = [
  { src: '/piper-press.jpg',   x: '3%',   y: '10%', width: '320px', mobileWidth: '140px', rotate: -4,  duration: 40 },
  { src: '/piper-press-2.jpg', x: '72%',  y: '8%',  width: '260px', mobileWidth: '120px', rotate: 6,   duration: 45 },
  { src: '/piper-press-3.jpg', x: '5%',   y: '55%', width: '340px', mobileWidth: '150px', rotate: -8,  duration: 38 },
  { src: '/piper-press-4.jpg', x: '68%',  y: '58%', width: '280px', mobileWidth: '130px', rotate: 3,   duration: 50 },
];

function DoodleSVG({ type, size, color = 'var(--color-sepia)' }) {
  const s = size;
  switch (type) {
    case 'star4':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 2 L13 9 L20 8 L14 12 L18 19 L12 15 L6 19 L10 12 L4 8 L11 9 Z" />
        </svg>
      );
    case 'heart':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 21 C12 21 3 14 3 8 C3 5 5.5 3 8 3 C10 3 11.5 4 12 5.5 C12.5 4 14 3 16 3 C18.5 3 21 5 21 8 C21 14 12 21 12 21 Z" />
        </svg>
      );
    case 'swirl':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 12 C12 12 18 10 18 6 C18 3 15 2 13 3 C11 4 10 7 11 9 C12 11 15 13 17 12 C19 11 19 8 17 7" />
        </svg>
      );
    case 'spark':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <path d="M12 2 L13 9 L20 10 L13 11 L12 18 L11 11 L4 10 L11 9 Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function HeroSection({ onOpenCase }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      style={{
        height: '100%',
        background: 'var(--color-background)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: isMobile ? '40px 20px' : '60px 40px',
      }}
    >
      {/* 1. ATMOSPHERIC CAMPAIGN GLOWS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '70%',
            height: '70%',
            background: 'radial-gradient(circle, rgba(184,48,48,0.2) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }} 
        />
        <motion.div 
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '15%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(107,26,26,0.15) 0%, transparent 60%)',
            filter: 'blur(120px)',
          }} 
        />
      </div>

      {/* 2. FILM GRAIN & CAUSTICS */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")', mixBlendMode: 'overlay' }} />
      
      {/* Subtle Prismatic Leak (CD Reflection effect) */}
      <motion.div 
        animate={{
          rotate: [0, 360],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '120%',
          height: '120%',
          background: 'conic-gradient(from 0deg, transparent, rgba(255,100,100,0.05), transparent, rgba(100,150,255,0.05), transparent)',
          filter: 'blur(60px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Integrated Doodles (Whisper style) */}
      {DOODLES.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.25, 0.15], y: [0, -15, 0], rotate: [d.rot, d.rot + 10, d.rot] }}
          transition={{
            opacity: { delay: d.delay, duration: 1.5 },
            y: { delay: d.delay, duration: 6 + i, repeat: Infinity, ease: 'easeInOut' },
            rotate: { delay: d.delay, duration: 10 + i, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{ 
            position: 'absolute', 
            left: isMobile ? d.mobileX : d.x, 
            top: isMobile ? d.mobileY : d.y, 
            pointerEvents: 'none', 
            zIndex: 2,
            filter: isMobile ? 'blur(0.5px)' : 'none'
          }}
        >
          <DoodleSVG type={d.type} size={isMobile ? d.mobileSize : d.size} />
        </motion.div>
      ))}

      {/* Artist Campaign Images (Floating) */}
      {ARTIST_IMAGES.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9, rotate: img.rotate }}
          animate={{ 
            opacity: 0.75, 
            scale: 1,
            x: [0, 15, -10, 0],
            y: [0, -20, 10, 0],
            rotate: [img.rotate, img.rotate + 4, img.rotate - 3, img.rotate]
          }}
          transition={{
            opacity: { duration: 2, delay: 0.5 + i * 0.3 },
            scale: { duration: 2, delay: 0.5 + i * 0.3 },
            x: { duration: img.duration, repeat: Infinity, ease: "easeInOut" },
            y: { duration: img.duration * 0.8, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: img.duration * 1.2, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: 'absolute',
            left: isMobile 
              ? (i === 0 ? '-5%' : i === 1 ? '65%' : i === 2 ? '0%' : '70%') 
              : img.x,
            top: isMobile 
              ? (i === 0 ? '12%' : i === 1 ? '18%' : i === 2 ? '62%' : '68%') 
              : img.y,
            width: isMobile ? img.mobileWidth : img.width,
            zIndex: 3,
            pointerEvents: 'none',
            mixBlendMode: 'multiply',
            filter: isMobile ? 'contrast(1.05) brightness(0.95)' : 'grayscale(0.1) contrast(1.1) brightness(0.9)',
          }}
        >
          <img 
            src={img.src} 
            alt="Artist" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              display: 'block',
              filter: 'grayscale(0.2) contrast(1.1) brightness(0.9)',
            }} 
          />
        </motion.div>
      ))}

      {/* Main Campaign Visual */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Artist name */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.2, duration: 1.2 }}
          style={{
            fontFamily: 'var(--font-typewriter)',
            fontSize: 'clamp(14px, 3vw, 20px)',
            fontWeight: 700,
            color: 'var(--color-sepia)',
            letterSpacing: '0.4em',
            textTransform: 'lowercase',
            marginBottom: 12,
          }}
        >
          piper connolly
        </motion.p>

        {/* Title Treatment: Luminous Serif */}
        <div className="relative inline-block mb-6">
          <motion.h1
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(72px, 22vw, 140px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--color-ink)',
              lineHeight: 0.8,
              letterSpacing: '-0.04em',
              position: 'relative',
              zIndex: 2,
              textShadow: isMobile ? '0 0 20px rgba(255,255,255,0.4)' : 'none',
            }}
          >
            beautiful life
          </motion.h1>
          
          {/* Luminous Core Glow */}
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              inset: '-20%',
              background: 'radial-gradient(circle, var(--color-piper-red) 0%, transparent 70%)',
              filter: 'blur(50px)',
              zIndex: 1,
            }}
          />
          
          {/* Iridescent Text Highlight (Reflecting light off CD) */}
          <motion.div 
             animate={{ x: ['-20%', '120%'] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             style={{
               position: 'absolute',
               inset: 0,
               background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
               mixBlendMode: 'overlay',
               zIndex: 3,
               pointerEvents: 'none',
               transform: 'skewX(-20deg)'
             }}
          />
        </div>

        {/* Date line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.9, duration: 1 }}
          style={{
            fontFamily: 'var(--font-typewriter)',
            fontSize: 'clamp(14px, 1.8vw, 16px)',
            fontWeight: 700,
            color: 'var(--color-ink-muted)',
            letterSpacing: '0.5em',
            textTransform: 'lowercase',
            marginBottom: isMobile ? 40 : 80,
          }}
        >
          yours june 5
        </motion.p>

        {/* CTA Section */}
        <div className="relative flex flex-col items-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenCase}
            className="group relative flex h-[54px] w-[240px] items-center justify-center overflow-hidden rounded-full bg-[#111] text-white transition-all duration-500 hover:bg-[var(--color-oxblood)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
            style={{
              boxShadow: isMobile ? '0 10px 30px rgba(184,48,48,0.2)' : 'none'
            }}
          >
            <span className="relative z-10 font-typewriter text-[16px] font-bold tracking-[0.1em]">open the cd</span>
            <motion.div 
              animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-[var(--color-piper-red)] opacity-20" 
            />
            <div className="absolute inset-0 translate-y-full bg-gradient-to-tr from-[var(--color-piper-red)] to-[var(--color-oxblood)] transition-transform duration-500 group-hover:translate-y-0" />
          </motion.button>

          {/* Integrated Hint: "decorate yours" */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1.6, duration: 1.2 }}
            style={{
              marginTop: 20,
              fontFamily: 'var(--font-typewriter)',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--color-sepia)',
              letterSpacing: '0.25em',
              textTransform: 'lowercase',
            }}
          >
            decorate yours
          </motion.p>
        </div>
      </div>

      {/* Refined bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(to bottom, transparent, var(--color-background))',
          pointerEvents: 'none',
          zIndex: 5
        }}
      />
    </section>
  );
}

