import React, { ButtonHTMLAttributes, memo } from 'react';
import cn from 'classnames';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'contained' | 'danger' | 'text';
  asIcon?: boolean;
}

export const LocalButton: React.FC<Props> = memo(
  ({ className, children, variant = 'default', asIcon = false, ...props }) => {
    const activeEffect: string = 'active:scale-[.98] active:opacity-90';
    const focusEffect: string = 'focus:outline focus:outline-1';
    const disabledEffect: string = 'disabled:bg-main_light_opacity_50';
    const bgStyle: Record<typeof variant, string> = {
      default: 'bg-yellow_button',
      contained: 'bg-menu_dark',
      danger: 'bg-main_red',
      text: 'bg-none',
    };
    const hoverEffect: Record<typeof variant, string> = {
      default: 'hover:bg-yellow_text',
      contained: 'hover:bg-yellow_text',
      danger: 'hover:opacity-90',
      text: 'hover:text-main_light',
    };

    return (
      <button
        {...props}
        className={cn(
          {
            'w-10 h-10 flex rounded-lg items-center justify-center': asIcon,
            'px-4 rounded-lg h-12 transition': !asIcon && variant !== 'text',
            'underline text-yellow_text text-sm': variant === 'text',
            [activeEffect]: !props.disabled,
            [hoverEffect[variant]]: !props.disabled,
            [focusEffect]: variant !== 'text',
          },
          bgStyle[variant],
          disabledEffect,
          className,
        )}
      >
        {children}
      </button>
    );
  },
);
