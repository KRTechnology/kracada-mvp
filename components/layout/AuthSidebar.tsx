import Image from "next/image";
import { Logo } from "@/components/common/Logo";
import signup_avatar_one from "@/app/assets/images/signup_avatar-1.png";
import signup_avatar_two from "@/app/assets/images/signup_avatar-2.png";
import signup_avatar_three from "@/app/assets/images/signup_avatar-3.png";
import signup_avatar_four from "@/app/assets/images/signup_avatar-4.png";

interface AuthSidebarProps {
  heading?: string;
}

export function AuthSidebar({
  heading = "Your one stop shop for everything that is important to you",
}: AuthSidebarProps) {
  return (
    <div className="hidden md:flex w-3/5 flex-col justify-center items-start bg-[#2A0C00] text-white p-10">
      <Logo className="mb-10" to="/" />

      <h1 className="text-5xl mb-10">{heading}</h1>
      <div className="flex items-center mt-6">
        {/* Avatars with +3 behind them */}
        <div className="flex -space-x-4 relative">
          {/* Positioned behind as the first element (lowest in DOM) */}
          <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-[#334155] border-2 border-white text-white font-semibold absolute z-0 left-[160px]">
            +3
          </div>
          <Image
            src={signup_avatar_one}
            alt="avatar1"
            width={60}
            height={60}
            className="rounded-full border-2 border-white relative z-40"
          />
          <Image
            src={signup_avatar_two}
            alt="avatar2"
            width={60}
            height={60}
            className="rounded-full border-2 border-white relative z-30"
          />
          <Image
            src={signup_avatar_three}
            alt="avatar3"
            width={60}
            height={60}
            className="rounded-full border-2 border-white relative z-20"
          />
          <Image
            src={signup_avatar_four}
            alt="avatar4"
            width={60}
            height={60}
            className="rounded-full border-2 border-white relative z-10"
          />
        </div>

        {/* Stars and text */}
        <div className="flex flex-col ml-16">
          <div className="text-[#F59E0B] text-4xl">★★★★★</div>
          <span className="text-white text-xs mt-1">200+ Active Users</span>
        </div>
      </div>
    </div>
  );
}
