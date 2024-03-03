"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../components/ui/newlabel";
import { Input } from "../components/ui/newinput";
import { cn } from "../components/cn";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { set, useForm } from "react-hook-form";
import { motion } from "framer-motion";


import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import Link from "next/link";


export default function SignupFormDemo() {
  const [is, setIs] = useState(0);
  const [error, setError] = useState("");
  const form = useForm();
  const router = useRouter();

  const isValidValues = (value: any) => {
    if (value.username.length < 3)
      return 3;
    else if (value.password.length < 6)
      return 4;
    return 0;
  };
  
  useEffect(() => {
    if (is === 3) {
      setError("Username must be at least 3 characters long.");
    } else if (is === 4) {
      setError("Password must be at least 6 characters long.");
    } else {
      setError("");
    }
  }, [is]);

    const onSubmit = (values: any) => {
    setIs(isValidValues(values));
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


  const handleGoogle = () => {
    router.push('http://localhost:8080/auth/google');
  }

  const handle42 = () => {
      router.push('http://localhost:8080/auth/42');
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-md lg:w-full w-[80%] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black ring-[0.2px] ring-[var(--blue-500)]">
        <motion.h1
            className='text-[var(--blue-500)] lg:text-4xl md:text-3xl text-2xl font-semibold mb-2 sm:mb-0 text-center'
          >
            Login
          </motion.h1>

        <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter your username" type="text" {...form.register('username')}/>
            {is === 3 && <p className="text-red-500 text-sm my-4">{error}</p>}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="••••••••" type="password" {...form.register('password')}/>
            {is === 4 && <p className="text-red-500 text-sm my-4">{error}</p>}
          </LabelInputContainer>
          <button
            className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign In &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900"
              type="button"
              onClick={handle42}
            >
              <img src="/Apple Logo.svg" className="w-5" />
              <span className="text-neutral-300 text-sm">
                Intra 42
              </span>
              <BottomGradient />
            </button>
            <button
              className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900"
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
          <Label className="text-gray-300 text-sm" >Don't have an account?</Label>
          <Link href='/register' className="text-gray-300 text-sm" >Sign Up &rarr;</Link>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

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



// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { motion } from "framer-motion";
// import { Rajdhani } from "next/font/google";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// const rajdhani = Rajdhani({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// import { Form } from "@/components/ui/form";
// import FormElement from "./components/Sign/FormElement";
// import SignButton from "./components/Sign/SignButton";
// import SignSocials from "./components/Sign/SignSocials";

// import { useEffect, useState } from "react";
// import { useRouter } from 'next/navigation';

// import axios from 'axios';

// import {
//   FormLinesAlready,
//   FormLinesSignUp,
// } from "./components/Sign/FormRest";

// const FormSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
//   password: z.string().min(6, {
//     message: "Password must be at least 6 characters.",
//   }),
// });


// export default function InputForm() {

//   const router = useRouter();

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       username: "",
//       password: "",
//     },
//   }); 

//   function onSubmit(values: z.infer<typeof FormSchema>) {
//     axios.post("http://localhost:8080/auth/login", {
//       username: values.username,
//       password: values.password
//     }, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//     .then(response => {
//       const data = response.data;

//       const accessToken = data.access_token;

//       document.cookie = `access_token=${data.access_token}; path=/;`;

//       // Check if access_token is present
//       if (accessToken) {
//         // Access token is present, make a request to the protected endpoint
//         axios.get("http://localhost:8080/auth/protected", {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`
//           }
//         })
//         .then(response => {
//           if (response.status === 200)
//             router.push('/Dashboard');
//           else
//             console.log("Failed to authenticate with protected endpoint");
//         })
//         .catch(error => {
//           console.log("Error during protected endpoint request", error);
//         });
//       }
//     })
//     .catch(error => {
//       console.log("Error during login request", error);
//     });
//   }

//   return (
//     <div className="w-full h-full flex items-center justify-center">
//       <div className="md:w-[480px] pb-[40px] sm:pb-[50px] bg-dashBack flex flex-col items-center rounded-2xl md:rounded-lg w-[310px] xm:w-[370px] select-none ring-[0.2px] ring-red-500">
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="w-4/5 mt-5 space-y-6 sm:mt-10"
//           >
//             <motion.h1
//               className={`${rajdhani.className} text-redValorant lg:text-4xl md:text-3xl text-2xl font-semibold mb-2 sm:mb-0`}
//             >
//               Login
//             </motion.h1>
//             {/* Username Field */}
//             <FormElement form={form} placeholder={"username"} />
//             {/* Password Field */}
//             <FormElement form={form} placeholder={"password"} />
//             <div className="w-full flex items-center justify-center">
//               <SignButton p="SIGN-IN" />
//             </div>
//           </form>
//         </Form>
//         <FormLinesSignUp />
//         <SignSocials />
//         <FormLinesAlready des="Don't have an account?" n="REGISTER" url="/register"/>
//       </div>
//     </div>
//   );
// }
