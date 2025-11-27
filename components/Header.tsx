export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">
            Organize and manage your tasks efficiently with a modern, intuitive interface.
          </p>
        </div>
      </div>
    </header>
  );
}
