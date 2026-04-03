

// Year is baked in at build time (static export). Rebuild annually to update.
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-100 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>
          © {year} Nômade Fuleiro
        </p>

      </div>
    </footer>
  )
}
