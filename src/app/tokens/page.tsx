import type { Metadata } from "next";
import Tokens from "@/components/Tokens";

export const metadata: Metadata = {
  title: "Tokens - Beginners Google Gemini Ai Course",
  description: "Created by Trae Zeeofor",
};

const pageTokens = () => {
  return (
    <div className="w-full h-auto bg-silver-rust">
      <section className="flex flex-col justify-start items-center py-2 px-8 w-full max-w-[1440px] min-h-[calc(100vh-82.96px)] mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Tokens
        </h1>
        <Tokens />
      </section>
    </div>
  );
};

export default pageTokens;
