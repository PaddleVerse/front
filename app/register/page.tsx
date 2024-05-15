"use client";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "../../components/cn";
import { Input } from "../../components/ui/newinput";
import { Label } from "../../components/ui/newlabel";
import { ipAdress } from "@/app/utils";

import BottomGradient from "@/components/ui/bottomGradiant";
import {
  IconBrandGoogle
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { set } from "lodash";


export default function SignupFormDemo() {
  const [is, setIs] = useState(0);
  const [error, setError] = useState("");
  const form = useForm();
  const router = useRouter();

  const isValidValues = (value: any) => {
    if (value?.name.length < 3 || value?.name.length > 20)
      return 1;
    else if (value?.middlename.length < 3 || value?.middlename.length > 20)
      return 2;
    else if (value?.nickname.length < 3 || value?.nickname.length > 20)
      return 3;
    else if (value?.password.length < 6 || value?.password.length > 20)
      return 4;
    return 0;
  };
  
  useEffect(() => {
    if (is === 1)
      setError("Name must be at least 3 characters long and at most 20 characters long.");
    else if (is === 2)
      setError("middlename must be at least 3 characters long and at most 20 characters long.");
    else if (is === 3)
      setError("nickname must be at least 3 characters long and at most 20 characters long.");
    else if (is === 4)
      setError("Password must be at least 6 characters long and at most 20 characters long.");
    else if (is === 5)
      setError("nickname already exist.");
    else
      setError("");
  }, [is]);

  const serverError = (err: any) => {
    setIs(6);
    setError(err);
  }

  function onSubmit(values : any) {
    if (isValidValues(values) !== 0)
    {
      setIs(isValidValues(values));
      return;
    }
    axios.post(`http://${ipAdress}:8080/auth/signup`, {
      name: values.name,
      middlename: values.middlename,
      nickname: values.nickname,
      password: values.password
    }).then((res) => {
      if (res?.data?.status === 'success')
      {
        form.reset();
        router.push("/Signin");
      }else if (res?.data?.status === 'error_')
        setIs(5);
    })
    .catch((err) => {
      if (err.response)
        serverError(err.response.data.message);
      console.log(err.response.data);
    });
  }


  const handleGoogle = () => {
    router.push(`http://${ipAdress}:8080/auth/google`);
  }

  const handle42 = () => {
      router.push(`http://${ipAdress}:8080/auth/42`);
  }

  return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="max-w-md lg:w-full w-[80%] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-[#101823] ring-[0.2px] ring-red-500 z-10">
          <motion.h1
              className='text-red-500 lg:text-4xl md:text-3xl text-2xl font-semibold mb-2 sm:mb-0 text-center'
            >
              Register
            </motion.h1>

          <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="firstname">Name</Label>
                <Input id="firstname" placeholder="Tyler" type="text" {...form.register('name')}/>
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">middlename</Label>
                <Input id="lastname" placeholder="Durden" type="text" {...form.register('middlename')}/>
              </LabelInputContainer>
            </div>
              {(is === 1 || is === 2) && <p className="text-red-500 text-sm my-4">{error}</p>}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="nickname">nickname</Label>
              <Input id="nickname" placeholder="Tyler_durden" type="text" {...form.register('nickname')}/>
              {is === 3 && <p className="text-red-500 text-sm my-4">{error}</p>}
              {is === 5 && <p className="text-red-500 text-sm my-4">{error}</p>}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="••••••••" type="password" {...form.register('password')}/>
              {is === 4 && <p className="text-red-500 text-sm my-4">{error}</p>}
            </LabelInputContainer>
              {is === 6 && <p className="text-red-500 text-sm my-4">{error}</p>}
            <button
              className="bg-gradient-to-br relative group/btn bg-[#192536] bloc w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Sign up &rarr;
              <BottomGradient />
            </button>

            <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

            <div className="flex flex-col space-y-4">
              <button
                className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-[#192536]"
                type="button"
                onClick={handle42}
              >
                <Image alt="42" src="/Apple Logo.svg" className="w-5" width={100} height={100} />
                <span className="text-neutral-300 text-sm">
                  Intra 42
                </span>
                <BottomGradient />
              </button>
              <button
                className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-[#192536]"
                type="button"
                onClick={handleGoogle}
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
                <span className="text-neutral-300 text-sm">
                  Google
                </span>
                <BottomGradient />
              </button>
            </div>
          </form>
          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          <div className="w-full flex justify-between">
            <Label className="text-gray-300 text-sm" >Already have an account?</Label>
            <Link href='/Signin' className="text-gray-300 text-sm" >Sign In &rarr;</Link>
          </div>
        </div>
      </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
