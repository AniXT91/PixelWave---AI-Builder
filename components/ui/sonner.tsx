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
            'group toast group-[.toaster]:bg-orange-50 group-[.toaster]:text-orange-900 group-[.toaster]:border-orange-200 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-orange-700',
          actionButton:
            'group-[.toast]:bg-orange-500 group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-orange-100 group-[.toast]:text-orange-900',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
