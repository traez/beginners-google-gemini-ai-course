import type { Metadata } from "next";
import Chat from "@/components/Chat";

export const metadata: Metadata = {
  title: "Chat - Beginners Google Gemini Ai Course",
  description: "Created by Trae Zeeofor",
};

const pageChat = () => {
  return (
    <div className="w-full h-auto bg-silver-rust">
      <section className="flex flex-col justify-start items-center py-2 px-8 w-full max-w-[1440px] min-h-[calc(100vh-82.96px)] mx-auto">
        <h1 className=" text-black-purple">Chat</h1>
        <Chat />
      </section>
    </div>
  );
};

export default pageChat;
