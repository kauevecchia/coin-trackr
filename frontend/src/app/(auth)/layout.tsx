import Header from '@/components/Header';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header showAuthButtons={false} />
      <div className="flex flex-col items-center justify-center min-h-screen pt-20">
        {children}
      </div>
    </div>
  );
}