'use client';

import { useEffect } from 'react';

export default function AntiScreenshot() {
  useEffect(() => {
    // 1. Mencegah klik kanan
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Mencegah shortcut keyboard tertentu
    const handleKeyDown = (e: KeyboardEvent) => {
      // Deteksi tombol PrintScreen
      if (e.key === 'PrintScreen') {
        // Attempt to clear clipboard only if user interaction allowed
        try {
          navigator.clipboard.writeText('');
        } catch (err) {
          // Silently ignore – clipboard access may be blocked without user activation
        }
        alert('Fitur screenshot dan copy dinonaktifkan demi keamanan.');
        e.preventDefault();
      }

      // Deteksi kombinasi DevTools, Print, Save, dll
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'P' || e.key === 'p' || e.key === 'S' || e.key === 's' || e.key === 'C' || e.key === 'c'))
      ) {
        e.preventDefault();
      }
    };

    // 3. Membersihkan clipboard jika PrintScreen ditekan (keyup)
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        try {
          navigator.clipboard.writeText('');
        } catch (err) {
          // ignore clipboard permission errors
        }
      }
    };

    // 4. Mencegah aksi copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Memasang event listener
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('copy', handleCopy);

    // Mencegah block selection melalui CSS pada body
    document.body.style.userSelect = 'none';
    // Note: correct property name is lowercase 'webkitUserSelect'
    // @ts-ignore
    (document.body.style as any).webkitUserSelect = 'none';

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('copy', handleCopy);
      document.body.style.userSelect = '';
      // @ts-ignore
      (document.body.style as any).webkitUserSelect = '';
    };
  }, []);

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Menyembunyikan seluruh halaman jika dicetak (Ctrl+P / Command+P) */
        @media print {
          html, body {
            display: none !important;
          }
        }
        
        /* Disable selection globally */
        * {
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }
      `
    }} />
  );
}
