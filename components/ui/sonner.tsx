'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[var(--color-card)] group-[.toaster]:text-[var(--color-text)] group-[.toaster]:border-[var(--color-border)] group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-[var(--color-muted)]',
          actionButton:
            'group-[.toast]:bg-[var(--color-primary)] group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-[var(--color-card-dark)] group-[.toast]:text-[var(--color-text)]',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
