import type { Metadata } from "next";
import Prompt from "@/components/Prompt";

export const metadata: Metadata = {
  title: "Prompt - Beginners Google Gemini Ai Course",
  description: "Created by Trae Zeeofor",
};

const pagePrompt = () => {
  return (
    <div className="w-full h-auto bg-silver-rust">
      <section className="flex flex-col justify-start items-center py-2 px-8 w-full max-w-[1440px] min-h-[calc(100vh-82.96px)] mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Prompt
        </h1>
        <Prompt />
      </section>
    </div>
  );
};

export default pagePrompt;
