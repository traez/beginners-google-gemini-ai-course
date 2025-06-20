import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-auto bg-silver-rust">
      <section className="flex flex-col justify-start items-center py-2 px-8 w-full max-w-[1440px] min-h-[calc(100vh-82.96px)] mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Gemini-Powered Intelligence Tool
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Explore business insights using Google&apos;s{" "}
          <code>gemini-2.0-flash</code> model.
        </p>
        <p className="mt-4 text-lg dark:text-gray-300 font-bold text-blue-800">
          Features include AI chat, token counting, and real-time prompy content
          generation.
        </p>
        <div className="relative w-full max-w-[370px] aspect-[740/987] mt-4">
          <Image
            src="/gemini.jpg"
            alt="gemini"
            fill
            sizes="(min-width: 360px) 100vw"
            className="object-contain rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}
