import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

// CD holographic disc for inside the case
function CDDisc({ size = 180, spin = false }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
        animation: spin ? 'cd-rotate 12s linear infinite' : 'none',
        flexShrink: 0,
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
      }}
    >
      {/* Base CD Image from Decorator */}
      <img 
        src="/cd.png" 
        alt="" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          borderRadius: '50%',
          display: 'block'
        }} 
      />

      {/* Holographic Overlay (Matches Decorator) */}
      <div
        className="cd-holo"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      />

      {/* Lighting Glare - Sharp & Hard like plastic/metal */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.2) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Center Hub Clear Area */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '8%',
          height: '8%',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.7)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
}

export default function JewelCase({ onOpen, isOpen }) {
  const lidRef = useRef(null);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && lidRef.current) {
      const tl = gsap.timeline();
      
      // 1. Smooth unlatch & swing (Right to Left)
      tl.to(lidRef.current, {
        rotateY: -115,
        duration: 1.5,
        ease: "power2.inOut"
      });

      // 2. Subtle zoom in as it opens
      tl.to(containerRef.current, {
        scale: 1.15,
        z: 200,
        duration: 2.0,
        ease: "power2.inOut"
      }, 0.2);

      // 3. Editorial Fade Out
      tl.to(wrapperRef.current, {
        opacity: 0,
        filter: 'blur(15px)',
        duration: 0.8,
        ease: "power1.in"
      }, "-=0.8");
    }
  }, [isOpen]);

  return (
    <div
      ref={wrapperRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: 'var(--color-background)',
        padding: isMobile ? '16px' : '24px',
        position: 'relative',
        overflow: 'hidden',
        perspective: isMobile ? '1500px' : '2500px',
      }}
    >
      {/* Editorial Soft Lighting Background */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.6) 0%, transparent 80%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Jewel Case Container */}
      <div 
        ref={containerRef}
        style={{ 
          transformStyle: 'preserve-3d',
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.div
          style={{
            position: 'relative',
            width: isMobile ? 'min(90vw, 420px)' : 'clamp(320px, 70vw, 520px)',
            maxWidth: isMobile ? 'none' : 'calc((100vh - 200px) * 1.18)',
            cursor: isOpen ? 'default' : 'pointer',
            transformStyle: 'preserve-3d',
          }}
          whileHover={!isOpen ? { 
            scale: 1.02, 
            rotateX: 2, 
            rotateY: 2,
            transition: { duration: 0.4, ease: "easeOut" } 
          } : {}}
          onClick={!isOpen ? onOpen : undefined}
        >
          {/* 1. BACK CASE (Outer Shell with Thickness) */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 3,
              aspectRatio: '1.18/1',
              width: '100%',
              boxShadow: '0 50px 100px rgba(0,0,0,0.15), 0 20px 40px rgba(0,0,0,0.1)',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: 'translateZ(-5px)', // Positioned at the back
            }}
          >
            {/* 3D Edges (Simulating plastic thickness) */}
            <div style={{ position: 'absolute', inset: -1, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 3, transform: 'translateZ(2px)' }} />
            <div style={{ position: 'absolute', inset: -2, border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 4, transform: 'translateZ(4px)' }} />

            {/* 2. INNER TRAY (Recessed / The "Dive") */}
            <div style={{
              position: 'absolute',
              inset: '2%',
              background: '#121212',
              borderRadius: 2,
              boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.8), 0 1px 2px rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Spine Detail (Textured Dot-Matrix) */}
              <div style={{ 
                position: 'absolute', 
                left: 0, top: 0, bottom: 0, 
                width: '10%', 
                background: 'linear-gradient(90deg, #0a0a0a, #1a1a1a)',
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '4px 4px',
                borderRight: '1px solid rgba(255,255,255,0.08)'
              }} />
              
              {/* Inner Tray Ledge (More Depth) */}
              <div style={{
                position: 'absolute',
                inset: '0 0 0 10%',
                border: '8px solid #161616',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
                pointerEvents: 'none'
              }} />

              {/* CD Locking Hub (Realistic Hub Teeth) */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '55%',
                transform: 'translate(-50%, -50%) translateZ(4px)',
                width: '12%',
                height: '14%',
                background: 'radial-gradient(circle, #222, #000)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                zIndex: 1
              }}>
                {/* 6 Teeth Hub */}
                {[0, 60, 120, 180, 240, 300].map(deg => (
                  <div key={deg} style={{
                    position: 'absolute',
                    width: '30%',
                    height: '10%',
                    background: '#2a2a2a',
                    transform: `rotate(${deg}deg) translateX(120%)`,
                    borderRadius: 1,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }} />
                ))}
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>

              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: '55%',
                transform: 'translate(-50%, -50%) translateZ(2px)',
                zIndex: 2
              }}>
                <CDDisc size={Math.min(isMobile ? 300 : 360, windowWidth * 0.7)} spin={isOpen} />
              </div>
            </div>
          </div>

          {/* 3. FRONT LID (Fully Transparent Hard Plastic) */}
          <div
            ref={lidRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              zIndex: 10,
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1.5px solid rgba(255,255,255,0.6)',
                borderRadius: 3,
                width: '100%',
                height: '100%',
                boxShadow: '0 15px 40px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Lid Hinges (Left) */}
              <div style={{ position: 'absolute', left: 3, top: '8%', width: 6, height: 24, background: 'rgba(255,255,255,0.1)', borderRadius: 2, border: '0.5px solid rgba(255,255,255,0.2)' }} />
              <div style={{ position: 'absolute', left: 3, bottom: '8%', width: 6, height: 24, background: 'rgba(255,255,255,0.1)', borderRadius: 2, border: '0.5px solid rgba(255,255,255,0.2)' }} />

              {/* Interaction Tabs (Right Edge Pull Points) */}
              <div style={{ position: 'absolute', right: -2, top: '40%', width: 4, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: '4px 0 0 4px' }} />

              {/* Glossy Reflection (Moves slightly) */}
              <motion.div 
                animate={{ x: isOpen ? 100 : 0, opacity: isOpen ? 0 : 1 }}
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-20%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.25) 48%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.25) 52%, transparent 60%)',
                  pointerEvents: 'none',
                }} 
              />

              {/* Booklet Insert */}
              <div style={{
                position: 'absolute',
                inset: '2.5% 2.5% 2.5% 11%',
                background: '#ffffff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8%',
                transform: 'translateZ(1px)',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")'
              }}>
                 <div style={{ 
                   width: '100%', 
                   height: '100%', 
                   border: '1px solid rgba(156,123,90,0.12)', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   alignItems: 'center', 
                   justifyContent: 'center',
                   textAlign: 'center'
                 }}>
                   <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: 'clamp(12px, 1.8vw, 13px)', color: 'var(--color-ink-muted)', fontWeight: 700, letterSpacing: '0.4em', marginBottom: '10%', textTransform: 'lowercase' }}>piper connolly</span>
                   <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 6vw, 48px)', fontStyle: 'italic', color: '#111', lineHeight: 0.85 }}>beautiful<br/>life</span>
                   <div style={{ width: '15%', height: 1, background: 'var(--color-oxblood)', opacity: 0.15, margin: '15% 0' }} />
                   <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: 'clamp(14px, 1.8vw, 14px)', color: 'var(--color-ink)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'lowercase' }}>tap to open ✦</span>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
