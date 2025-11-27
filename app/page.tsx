import { TaskList } from '@/components/TaskList';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <TaskList />
      </main>
    </div>
  );
}
