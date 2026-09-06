export function PrimeCategoryHeader({ name }: { name: string }) {
  return (
    <div className="border-b border-[#FFC107]/25 bg-gradient-to-r from-[#004D55] to-[#006670] px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-wider text-[#FFC107] sm:text-base">
      {name}
    </div>
  )
}
