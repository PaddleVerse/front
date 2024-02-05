"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Rajdhani } from "next/font/google";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { useRouter } from 'next/navigation';


const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

import { Form } from "@/components/ui/form";
import FormElement from "../components/Sign/FormElement";
import SignButton from "../components/Sign/SignButton";
import SignSocials from "../components/Sign/SignSocials";



import {
  FormLinesAlready,
  FormLinesSignUp,
} from "../components/Sign/FormRest";

const FormSchema = z.object({
  name: z.string().min(2,{
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});


export default function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const router = useRouter();

  function onSubmit(values: z.infer<typeof FormSchema>) {
    
    axios.post("http://localhost:8080/auth/signup", {
      name: values.name,
      username: values.username,
      password: values.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      form.reset({
        name: "",
        username: "",
        password: ""
      });
      router.push("/");
    })
    .catch(error => {
      //   console.log("Username already taken");
    });

  }
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="md:w-[480px] pb-[40px] sm:pb-[50px] bg-dashBack flex flex-col items-center rounded-2xl md:rounded-lg w-[310px] xm:w-[370px] select-none ring-[0.2px] ring-red-500">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-4/5 mt-5 space-y-6 sm:mt-10"
          >
            <motion.h1
              className={`${rajdhani.className} text-redValorant lg:text-4xl md:text-3xl text-2xl font-semibold mb-2 sm:mb-0`}
            >
              REGISTER
            </motion.h1>
            {/* Name Field */}
            <FormElement form={form} placeholder={"name"} />
            {/* Username Field */}
            <FormElement form={form} placeholder={"username"} />
            {/* Password Field */}
            <FormElement form={form} placeholder={"password"} />
            {/* Sign Button */}
            <div className="w-full flex items-center justify-center">
              <SignButton p="SIGN-UP" />
            </div>
          </form>
        </Form>
        <FormLinesSignUp />
        <SignSocials />
        <FormLinesAlready des="ALREADY HAVE AN ACCOUNT ?" n="LOGIN" url="/" />
      </div>
    </div>
  );
}
