export function AppFooter() {
  return (
    <footer className="border-t px-4 py-4 text-xs text-muted-foreground sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Brasilab · Intranet Lab</span>
        <span>Uso interno · Informações confidenciais</span>
      </div>
    </footer>
  );
}
