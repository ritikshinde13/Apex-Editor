import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export type AnimatedButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'
> &
  MotionProps & {
    children?: React.ReactNode;
    as?: any;
    variant?: 'default' | 'cyan' | 'purple' | 'subtle';
  };

/**
 * AnimatedButton
 * - Inspired by VengeanceUI
 * - Spring physics whileHover & whileTap
 * - Border beam shine sweep with exclusion mask
 * - Text mask shimmer
 */
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children = 'Browse Components',
  className = '',
  as = 'button',
  variant = 'default',
  ...rest
}) => {
  const Component = (motion as any)[as] || motion.button;

  const variantStyles = {
    default:
      'bg-editor-surface/90 hover:bg-editor-hover border-editor-border text-editor-text [--shine:rgba(255,255,255,0.7)]',
    cyan:
      'bg-gradient-to-r from-accent-cyan/90 to-blue-500/90 text-black font-semibold border-cyan-300/40 shadow-glow-cyan [--shine:rgba(255,255,255,0.95)]',
    purple:
      'bg-gradient-to-r from-accent-purple/90 to-indigo-600/90 text-white font-semibold border-purple-400/40 shadow-glow-purple [--shine:rgba(255,255,255,0.85)]',
    subtle:
      'bg-transparent hover:bg-editor-surface/60 border-editor-border/60 text-editor-subtext hover:text-editor-text [--shine:rgba(0,229,255,0.8)]',
  };

  return (
    <Component
      {...rest}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      }}
      className={cn(
        'group inline-flex items-center justify-center px-5 py-2 rounded-xl relative overflow-hidden border',
        'font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
        variantStyles[variant],
        className
      )}
    >
      {/* Text with shine mask */}
      <motion.span
        className="tracking-wide flex items-center justify-center gap-2 h-full w-full relative z-10"
        style={{
          WebkitMaskImage:
            'linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))',
          maskImage:
            'linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))',
        }}
        initial={{ ['--mask-x' as any]: '100%' } as any}
        animate={{ ['--mask-x' as any]: '-100%' } as any}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: 'linear',
          repeatDelay: 1.2,
        }}
      >
        {children}
      </motion.span>

      {/* Border shine effect using CSS exclusion mask */}
      <motion.span
        className="block absolute inset-0 rounded-[inherit] p-[1.5px] pointer-events-none"
        style={{
          background:
            'linear-gradient(-75deg, transparent 30%, var(--shine) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
        initial={{ backgroundPosition: '100% 0', opacity: 0 }}
        animate={{ backgroundPosition: ['100% 0', '0% 0'], opacity: [0, 1, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 1.2,
        }}
      />
    </Component>
  );
};

export default AnimatedButton;
