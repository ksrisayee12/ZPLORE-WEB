import './globals.css';

export const metadata = {
  title: 'Zplore — Deep-Tech Studio',
  description:
    'Zplore builds frontier AI, security, and intelligence systems. Studio · Projects · Services · Enterprise.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="grain">{children}</body>
    </html>
  );
}
