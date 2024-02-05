import { Button } from '@/components/ui/button';
import { Montserrat } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React from 'react';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
const SignSocials = () => {
  const router = useRouter();

  const handleGoogle = () => {
      router.push('http://localhost:8080/auth/google');
  }

  const handle42 = () => {
      router.push('http://localhost:8080/auth/42');
  }
  return (
    <div
      className={`${montserrat.className} flex flex-col w-4/5 gap-5 sm:mt-6 `}
    >
      <Button
        onClick={handleGoogle}
        className="bg-white text-gray-500 flex items-center justify-center gap-2 text-[13px] sm:text-[16px] rounded-sm h-[41px] sm:h-[50px] hover:opacity-95 hover:bg-white cursor-pointer">
        <img src="Google Logo.svg" alt="google image" />
        continue with Google
      </Button>
      <Button 
        onClick={handle42}
        className="bg-black text-white flex items-center justify-center gap-2 text-[13px] sm:text-[16px] rounded-sm h-[41px] sm:h-[50px]  hover:opacity-95 hover:bg-black cursor-pointer">
        <img src="/Apple Logo.svg" className="w-5" />
        continue with 42
      </Button>
    </div>
  );
};

export default SignSocials;
