'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

import { cn } from '../../../../lib/utils';

function BubbleBackground({
  ref,
  className,
  children,
  interactive = false,
  transition = { stiffness: 100, damping: 20 },
  style: styleProp,

  colors = {
    first: '59,130,246',
    second: '219,39,119',
    third: '6,182,212',
    fourth: '220,38,38',
    fifth: '234,179,8',
    sixth: '124,58,237',
  },

  ...props
}) {
  const containerRef = React.useRef(null);
  const filterId = React.useId().replace(/:/g, '');
  React.useImperativeHandle(ref, () => containerRef.current);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, transition);
  const springY = useSpring(mouseY, transition);

  const rectRef = React.useRef(null);
  const rafIdRef = React.useRef(null);
  const lastCursorRef = React.useRef({ x: 0, y: 0 });
  const [lastCursorPosition, setLastCursorPosition] = React.useState(null);

  React.useLayoutEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        rectRef.current = containerRef.current.getBoundingClientRect();
      }
    };

    updateRect();

    const el = containerRef.current;
    const ro = new ResizeObserver(updateRect);
    if (el) ro.observe(el);

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, []);

  React.useEffect(() => {
    if (!interactive) return;

    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = rectRef.current;
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      lastCursorRef.current = { x, y };

      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        mouseX.set(x);
        mouseY.set(y);
      });
    };

    const handleMouseLeave = () => {
      setLastCursorPosition({ ...lastCursorRef.current });
    };

    el.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    });
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [interactive, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      data-slot="bubble-background"
      className={cn('relative overflow-hidden', className)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        minHeight: 200,
        background: '#f1f5f9',
        ...(styleProp || {}),
      }}
      {...props}>
      <style>
        {`
            [data-slot="bubble-background"] {
              --first-color: ${colors.first};
              --second-color: ${colors.second};
              --third-color: ${colors.third};
              --fourth-color: ${colors.fourth};
              --fifth-color: ${colors.fifth};
              --sixth-color: ${colors.sixth};
            }
          `}
      </style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}
        aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, filter: `url(#${filterId}) blur(40px)` }}>
        <motion.div
          style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            top: '10%',
            left: '10%',
            borderRadius: '50%',
            mixBlendMode: 'hard-light',
            transform: 'translateZ(0)',
            willChange: 'transform',
            background: `radial-gradient(circle at center, rgba(${colors.first},0.95) 0%, rgba(${colors.first},0.4) 50%, transparent 70%)`,
          }}
          animate={{ y: [-50, 50, -50] }}
          transition={{ duration: 30, ease: 'easeInOut', repeat: Infinity }}
        />

        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformOrigin: 'calc(50% - 400px) 50%',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
        >
          <div
            style={{
              width: '80%',
              height: '80%',
              borderRadius: '50%',
              mixBlendMode: 'hard-light',
              background: `radial-gradient(circle at center, rgba(${colors.second},0.8) 0%, rgba(${colors.second},0) 50%)`,
            }}
          />
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformOrigin: 'calc(50% + 400px) 50%',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          <div
            style={{
              position: 'absolute',
              width: '80%',
              height: '80%',
              top: 'calc(50% + 200px)',
              left: 'calc(50% - 500px)',
              borderRadius: '50%',
              mixBlendMode: 'hard-light',
              background: `radial-gradient(circle at center, rgba(${colors.third},0.95) 0%, rgba(${colors.third},0.4) 50%, transparent 70%)`,
            }}
          />
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            top: '10%',
            left: '10%',
            borderRadius: '50%',
            mixBlendMode: 'hard-light',
            opacity: 0.9,
            transform: 'translateZ(0)',
            willChange: 'transform',
            background: `radial-gradient(circle at center, rgba(${colors.fourth},0.95) 0%, rgba(${colors.fourth},0.4) 50%, transparent 70%)`,
          }}
          animate={{ x: [-50, 50, -50] }}
          transition={{ duration: 40, ease: 'easeInOut', repeat: Infinity }}
        />

        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformOrigin: 'calc(50% - 800px) calc(50% + 200px)',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        >
          <div
            style={{
              position: 'absolute',
              width: '160%',
              height: '160%',
              top: '-80%',
              left: '-80%',
              borderRadius: '50%',
              mixBlendMode: 'hard-light',
              background: `radial-gradient(circle at center, rgba(${colors.fifth},0.8) 0%, rgba(${colors.fifth},0) 50%)`,
            }}
          />
        </motion.div>

        {(interactive || lastCursorPosition) && (
          <motion.div
            key={interactive ? 'follow' : 'return'}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              mixBlendMode: 'hard-light',
              opacity: 0.9,
              background: `radial-gradient(circle at center, rgba(${colors.sixth},0.95) 0%, rgba(${colors.sixth},0.4) 50%, transparent 70%)`,
              ...(interactive
                ? { x: springX, y: springY, transform: 'translateZ(0)', willChange: 'transform' }
                : { transform: 'translateZ(0)', willChange: 'transform' }),
            }}
            initial={lastCursorPosition && !interactive ? { x: lastCursorPosition.x, y: lastCursorPosition.y } : false}
            animate={interactive ? undefined : { x: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            onAnimationComplete={lastCursorPosition && !interactive ? () => setLastCursorPosition({ x: 0, y: 0 }) : undefined}
          />
        )}
      </div>
      {children}
    </div>
  );
}

export { BubbleBackground };
