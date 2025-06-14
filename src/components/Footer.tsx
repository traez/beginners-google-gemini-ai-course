export default function Footer() {
  return (
    <footer className="p-2 flex flex-row justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm border-t-2 border-solid border-gray-800 bg-pale-fedora text-black-purple w-full h-auto mx-auto">
      <a
        href="https://github.com/traez/beginners-google-gemini-ai-course"
        target="_blank"
        rel="noopener noreferrer"
        className=" hover:underline hover:text-blue-300 font-bold text-black-purple"
      >
        Source Code
      </a>
      <b>
        <span>© {new Date().getFullYear()}</span> Trae Zeeofor
      </b>
    </footer>
  );
}
