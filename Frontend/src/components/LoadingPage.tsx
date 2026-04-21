export const LoadingPage = () => {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-[3px] border-orange-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}