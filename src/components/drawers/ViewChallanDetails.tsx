import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  fetchFeeDetails,
  fetchSelectedFeeDeatails,
  SelectedFee,
  updateFeeDetail,
} from "@/store/fees.slice";
import {
  Button,
  Center,
  Heading,
  HStack,
  Input,
  Select,
  Tag,
  TagLabel,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineCheckCircle, AiOutlineFileProtect } from "react-icons/ai";
import IDrawer from "../ui/utils/IDrawer";
import IModal from "../ui/utils/IModal";
import { useSupabase } from "@/app/supabase-provider";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
  isForCoadmin?: boolean;
  regno: string;
  challan_id: string;
}

export default function ViewChallanDetails({
  children,
  regno,
  challan_id,
}: props) {
  const { isOpen, onClose, onOpen: onModalOpen } = useDisclosure();
  const [isChecking, setIsChecking] = useState(false);
  const [usn, setUsn] = useState("");
  const [challanState, setChallanState] = useState<
    | {
        challan_id: string;
        name: string;
        date: string;
        usn: string;
        method: string;
        amount_paid: string;
        amount_paid1: string;
      }
    | undefined
  >(undefined);

  const onOpen = () => {
    onModalOpen();
  };

  const findChallan = useCallback(async () => {
    setIsChecking(true);
    try {
      const formData = new FormData();
      formData.append("challan_id", challan_id);
      const response = await axios(
        process.env.NEXT_PUBLIC_ADMIN_URL + "feesearchchallan.php",
        {
          method: "POST",
          data: formData,
        }
      );
      setChallanState(response.data[0]);
      setUsn(response.data[0]?.usn);
    } catch (e: any) {
      toast.error(e.response?.data?.msg);
    }
    setIsChecking(false);
  }, [challan_id]);

  useEffect(() => {
    isOpen && findChallan();
  }, [isOpen]);

  const submit = () => {
    if (usn) {
      setIsChecking(true);
      const formData = new FormData();
      formData.append("usn", usn);
      formData.append("challan_no", challan_id);
      axios
        .post(process.env.NEXT_PUBLIC_ADMIN_URL + "feeupdateusn.php", formData)
        .then(async (res: any) => {
          toast.success(res.data.msg);
          await findChallan()
          setIsChecking(false);
        })
        .catch((e) => {
          toast.error(e.response?.data?.msg);
          setIsChecking(false);
        });
    }
  };

  return (
    <>
      <IDrawer
        isLoading={isChecking}
        isDisabled={false}
        onSubmit={submit}
        buttonTitle="Save"
        onClose={() => {
          onClose();
        }}
        isOpen={isOpen}
        heading="Challan Details"
      >
        <VStack w={"full"} h={"full"} justifyContent={"space-between"}>
          <VStack
            position={"sticky"}
            py={"5"}
            top={"100%"}
            className="border-gray-300 border-top"
            bottom={"0"}
            w={"full"}
            bg={"white"}
          >
            <Heading size={"md"}>{challanState?.name}</Heading>
            {challanState && challanState.usn.length == 0 ? (
              <Input
                value={usn}
                textAlign={"center"}
                size={"sm"}
                placeholder="Enter USN"
                mb={"5"}
                w={"50%"}
                onChange={(e) => setUsn(e.target.value)}
              />
            ) : (
              <Heading size={"sm"} color={"gray.600"}>
                {usn}
              </Heading>
            )}
            <HStack
              pt={"5"}
              flexWrap={"wrap"}
              justifyContent={"center"}
              gap={"3"}
            >
              <Tag
                pl={"0"}
                size={"lg"}
                borderRadius={"full"}
                colorScheme="facebook"
              >
                <Tag
                  size={"lg"}
                  borderRadius={"full"}
                  colorScheme="facebook"
                  variant={"solid"}
                >
                  Challan Id
                </Tag>
                <TagLabel ml={"2"}>{challan_id}</TagLabel>
              </Tag>
              <Tag
                pl={"0"}
                size={"lg"}
                borderRadius={"full"}
                colorScheme="facebook"
              >
                <Tag
                  size={"lg"}
                  borderRadius={"full"}
                  colorScheme="facebook"
                  variant={"solid"}
                >
                  Method
                </Tag>
                <TagLabel ml={"2"}>{challanState?.method}</TagLabel>
              </Tag>
              <Tag
                pl={"0"}
                size={"lg"}
                borderRadius={"full"}
                colorScheme="facebook"
              >
                <Tag
                  size={"lg"}
                  borderRadius={"full"}
                  colorScheme="facebook"
                  variant={"solid"}
                >
                  Paid Date
                </Tag>
                <TagLabel ml={"2"}>{challanState?.date}</TagLabel>
              </Tag>
              <Tag
                pl={"0"}
                size={"lg"}
                borderRadius={"full"}
                colorScheme="facebook"
              >
                <Tag
                  size={"lg"}
                  borderRadius={"full"}
                  colorScheme="facebook"
                  variant={"solid"}
                >
                  <TagLabel>Amount Paid</TagLabel>
                </Tag>
                <TagLabel ml={"2"}>{challanState?.amount_paid}</TagLabel>
              </Tag>
            </HStack>
          </VStack>
        </VStack>
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}
