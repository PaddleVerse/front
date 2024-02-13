"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Rajdhani } from "next/font/google";
import { useForm } from "react-hook-form";
import * as z from "zod";
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

import { Form } from "@/components/ui/form";
import FormElement from "./components/Sign/FormElement";
import SignButton from "./components/Sign/SignButton";
import SignSocials from "./components/Sign/SignSocials";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import axios from 'axios';

import {
  FormLinesAlready,
  FormLinesSignUp,
} from "./components/Sign/FormRest";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});


export default function InputForm() {

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  }); 

  function onSubmit(values: z.infer<typeof FormSchema>) {
    axios.post("http://localhost:8080/auth/login", {
      username: values.username,
      password: values.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      const data = response.data;

      const accessToken = data.access_token;

      document.cookie = `access_token=${data.access_token}; path=/;`;

      // Check if access_token is present
      if (accessToken) {
        // Access token is present, make a request to the protected endpoint
        axios.get("http://localhost:8080/auth/protected", {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        .then(response => {
          if (response.status === 200)
            router.push('/Dashboard');
          else
            console.log("Failed to authenticate with protected endpoint");
        })
        .catch(error => {
          console.log("Error during protected endpoint request", error);
        });
      }
    })
    .catch(error => {
      console.log("Error during login request", error);
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
              Login
            </motion.h1>
            {/* Username Field */}
            <FormElement form={form} placeholder={"username"} />
            {/* Password Field */}
            <FormElement form={form} placeholder={"password"} />
            <div className="w-full flex items-center justify-center">
              <SignButton p="SIGN-IN" />
            </div>
          </form>
        </Form>
        <FormLinesSignUp />
        <SignSocials />
        <FormLinesAlready des="Don't have an account?" n="REGISTER" url="/register"/>
      </div>
    </div>
  );
}
