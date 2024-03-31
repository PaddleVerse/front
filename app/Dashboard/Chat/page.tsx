"use client";

import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";

const Page = (props: any) => {
  const router = useRouter();

  useEffect(() => {
    router.push("/Dashboard/Chat");
  });
  return <></>;
};
export default Page;
