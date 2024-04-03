"use cient";
import React from "react";
import { useRouter } from "next/navigation";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "../../../../components/ui/3d-card";
import Image from "next/image";

interface Props {
  user: any;
}

const UserCard = ({ user }: Props) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/Dashboard/Profile?id=${user.id}`);
  };
  return (
    <div onClick={handleClick} className="cursor-pointer">
      <CardContainer className="inter-var">
        <CardBody className="relative group/card  hover:shadow-2xl hover:shadow-redColor/[0.1] bg-black border-[#FF4656]/[0.8] w-auto h-auto rounded-xl p-6 border">
          <CardItem translateZ="100" className="w-full mt-4">
            <Image
              src={user.picture ? user.picture : "/friend.png"}
              height="1000"
              width="1000"
              className="h-60 w-60 object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <div className="flex flex-col justify-between items-center mt-10">
            <CardItem
              translateZ={20}
              as="div"
              className="px-4 py-2 rounded-xl text-xs font-normal text-white"
            >
              {user?.name}
            </CardItem>
            <CardItem
              translateZ={20}
              as="div"
              className="px-4 py-2 rounded-xl bg-[#34202A] text-redColor text-xs font-bold"
            >
              @{user?.username}
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default UserCard;
