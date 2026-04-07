import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CerdasLiving — Business Strategy Dashboard",
  description: "Dashboard strategi bisnis internal CerdasLiving",
};

/**
 * Layout untuk /bisnis route group.
 * Menyembunyikan portal Header (<header>) & Footer (.footer)
 * agar halaman bisnis tampil mandiri tanpa navigasi portal.
 */
export default function BisnisGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        /* Hide portal Header (fixed position nav bar) */
        body > main > header:first-of-type,
        body header[style*="position: fixed"],
        body header[style*="position:fixed"] {
          display: none !important;
        }
        /* Hide portal Footer */
        footer.footer,
        body > main > footer {
          display: none !important;
        }
        /* Remove the 68px spacer div Header injects on non-home pages */
        body > main > div[style*="height: 68"],
        body > main > div[style*="height:68"] {
          display: none !important;
        }
        /* Reset main padding */
        body > main {
          padding: 0 !important;
          margin: 0 !important;
          min-height: unset !important;
        }
        /* Ensure bisnis pages use full viewport */
        body {
          background: #f4f6fa !important;
        }
      `}</style>
      {children}
    </>
  );
}
