export default function Loading() {
  return (
    <div className="min-h-svh flex items-center justify-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span>Loading…</span>
      </div>
    </div>
  )
}

