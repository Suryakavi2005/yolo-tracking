import './globals.css';

export const metadata = {
  title: 'Employee Tracking - Coimbatore',
  description: 'Employee location tracking dashboard for Coimbatore',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
