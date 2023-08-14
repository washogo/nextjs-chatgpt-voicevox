import Navigation from '@/app/components/Navigation';
import './globals.css';

export const metadata = {
  title: 'VoiceGPT',
  description: 'VoiceGPT',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div className="flex flex-col min-h-screen bg-gray-50 relative">
          <Navigation />

          <main className="flex-1 container max-w-screen-sm mx-auto px-5 py-5">{children}</main>

          <footer className="py-5">
            <div className="text-center text-sm">Copyright © All rights reserved | FullStackChannel</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
