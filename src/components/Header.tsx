import Link from "next/link";

export default function Header() {
  return (
    <nav className="w-full h-auto flex flex-col justify-center items-center gap-1 md:flex-row md:justify-between py-1 px-4 border-b-2 border-gray-800  bg-pale-fedora text-black-purple mx-auto sticky top-0 z-50">
      <menu className="flex justify-start">
        <Link
          href="/"
          className="flex items-center self-center text-[20px] sm:text-2xl font-semibold whitespace-nowrap   hover:text-blue-300"
        >
          Beginners Google Gemini Ai Course
        </Link>
      </menu>
      <aside className="flex justify-center items-center gap-2 md:gap-4">
        <Link
          href="/create"
          className="text-base font-semibold border-2 border-blue-900 px-2 py-1 rounded-md hover:bg-yellow-300 transition duration-300"
        >
          Create
        </Link>

        <Link
          href="/admin"
          className="text-base font-semibold border-2 border-blue-900 px-2 py-1 rounded-md hover:bg-yellow-300 transition duration-300"
        >
          Admin
        </Link>
      </aside>
    </nav>
  );
}
