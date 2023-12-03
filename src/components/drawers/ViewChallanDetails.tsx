import { useAppDispatch } from "@/hooks";
import { fetchFeeDetails, fetchSearchByMode } from "@/store/fees.slice";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineDelete, AiOutlineFilePdf } from "react-icons/ai";
import IDrawer from "../ui/utils/IDrawer";
import { useSearchParams } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import { useAppSelector } from "@/store";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
  isForCoadmin?: boolean;
  regno: string;
  challan_id: string;
}

export default function ViewChallanDetails({ children, challan_id }: props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const user = useAppSelector((state) => state.fees.user);
  const [usn, setUsn] = useState("");
  const [challanState, setChallanState] = useState<
    | {
        challan_id: string;
        name: string;
        date: string;
        usn: string;
        method: string;
        amount_paid1: string;
        sem: string;
        branch: string;
        bank: string;
      }
    | undefined
  >(undefined);
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const branch = params.get("branch");
  const year = params.get("year");
  const toDate = params.get("toDate");
  const fromDate = params.get("fromDate");
  const mode = params.get("mode");
  const feeType = params.get("feeType");

  const findChallan = useCallback(async () => {
    setIsChecking(true);
    try {
      const formData = new FormData();
      formData.append("challan_id", challan_id);
      formData.append("college", user?.college!);

      const response = await axios(
        process.env.NEXT_PUBLIC_ADMIN_URL + "feechallanfilter.php",
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
  }, [challan_id, user?.college]);

  useEffect(() => {
    isOpen && findChallan();
  }, [isOpen, findChallan]);

  const submit = useCallback(() => {
    if (usn) {
      setIsChecking(true);
      const formData = new FormData();
      formData.append("usn", usn);
      formData.append("challan_no", challan_id);
      formData.append("college", user?.college!);
      axios
        .post(process.env.NEXT_PUBLIC_ADMIN_URL + "feeupdateusn.php", formData)
        .then(async (res: any) => {
          toast.success(res.data.msg);
          await findChallan();
          setIsChecking(false);
          if (branch && mode && fromDate && toDate && year && feeType)
            dispatch(
              fetchSearchByMode({
                college: user?.college!,
                branch,
                mode,
                fromDate,
                toDate,
                year,
                feeType,
              })
            );
          if (branch && year)
            dispatch(
              fetchFeeDetails({
                branch,
                year,
                college: user?.college!,
              })
            );
        })
        .catch((e) => {
          toast.error(e.response?.data?.msg);
          setIsChecking(false);
        });
    }
  }, [
    usn,
    challan_id,
    branch,
    dispatch,
    feeType,
    findChallan,
    fromDate,
    mode,
    toDate,
    user?.college,
    year,
  ]);

  const onDelete = useCallback(() => {
    if (challan_id) {
      setIsDeleting(true);
      const formData = new FormData();
      formData.append("challan_id", challan_id);
      formData.append("college", user?.college!);
      axios
        .post(
          process.env.NEXT_PUBLIC_ADMIN_URL + "feedeletechallan.php",
          formData
        )
        .then(async (res: any) => {
          toast.success(res.data.msg);
          await findChallan();
          setIsDeleting(false);
          if (branch && mode && fromDate && toDate && year && feeType)
            dispatch(
              fetchSearchByMode({
                college: user?.college!,
                branch,
                mode,
                fromDate,
                toDate,
                year,
                feeType,
              })
            );
          if (branch && year)
            dispatch(
              fetchFeeDetails({
                branch,
                year,
                college: user?.college!,
              })
            );
        })
        .catch((e) => {
          toast.error(e.response?.data?.msg);
          setIsDeleting(false);
        });
    }
  }, [usn, challan_id]);

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
        <VStack
          alignItems={"flex-start"}
          pt={"5"}
          w={"full"}
          h={"full"}
          gap={"2"}
          justifyContent={"start"}
          position={"relative"}
        >
          <FormControl px={"5"}>
            <HStack>
              <FormLabel flex={1}>
                <Text>Challan Id</Text>
              </FormLabel>
              <Input
                bg={"white"}
                isReadOnly
                value={challanState?.challan_id}
                variant={"filled"}
                flex={"1.5"}
              />
            </HStack>
          </FormControl>
          <FormControl px={"5"}>
            <HStack>
              <FormLabel flex={1}>
                <Text>USN</Text>
              </FormLabel>
              <Input
                bg={"white"}
                isReadOnly={!!challanState?.usn}
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                variant={"filled"}
                flex={"1.5"}
              />
            </HStack>
          </FormControl>
          <FormControl px={"5"}>
            <HStack>
              <FormLabel flex={1}>
                <Text>Name</Text>
              </FormLabel>
              <Input
                bg={"white"}
                isReadOnly
                value={challanState?.name}
                variant={"filled"}
                flex={"1.5"}
              />
            </HStack>
          </FormControl>
          <FormControl px={"5"}>
            <HStack>
              <FormLabel flex={1}>
                <Text>Branch</Text>
              </FormLabel>
              <Input
                variant={"filled"}
                isReadOnly
                bg={"white"}
                value={challanState?.branch}
                flex={"1.5"}
              />
            </HStack>
          </FormControl>
          <FormControl px={"5"}>
            <HStack>
              <FormLabel flex={1}>
                <Text>Sem</Text>
              </FormLabel>
              <Input
                variant={"filled"}
                isReadOnly
                bg={"white"}
                flex={"1.5"}
                value={challanState?.sem}
              />
            </HStack>
          </FormControl>
          <FormControl px={"5"}>
            <HStack>
              <FormLabel flex={1}>
                <Text>Bank</Text>
              </FormLabel>
              <Input
                variant={"filled"}
                isReadOnly
                bg={"white"}
                flex={"1.5"}
                value={challanState?.bank}
              />
            </HStack>
          </FormControl>
          <FormControl px={"5"}>
            <HStack>
              <FormLabel flex={1}>
                <Text>Date</Text>
              </FormLabel>
              <Input
                variant={"filled"}
                isReadOnly
                bg={"white"}
                flex={"1.5"}
                value={challanState?.date}
              />
            </HStack>
          </FormControl>
          <FormControl px={"5"}>
            <HStack>
              <FormLabel flex={1}>
                <Text>Method</Text>
              </FormLabel>
              <Input
                variant={"filled"}
                isReadOnly
                bg={"white"}
                flex={"1.5"}
                value={challanState?.method}
              />
            </HStack>
          </FormControl>
          <FormControl px={"5"}>
            <HStack w={"full"}>
              <FormLabel flex={1}>
                <Text>Amount Paid</Text>
              </FormLabel>
              <Input
                flex={"1.5"}
                variant={"filled"}
                isReadOnly
                bg={"white"}
                value={challanState?.amount_paid1}
              />
            </HStack>
          </FormControl>
          <VStack
            position={"sticky"}
            p={"5"}
            top={"100%"}
            className="border-gray-300 border-top"
            bottom={"0"}
            w={"full"}
          >
            <Button
              as={Link}
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_ADMIN_URL}${
                user?.college == "KSPT"
                  ? "feekspreceiptdownload"
                  : "feedownloadreciept"
              }.php?challan_id=${challanState?.challan_id}&college=${
                user?.college
              }`}
              w={"full"}
              colorScheme="purple"
              leftIcon={<AiOutlineFilePdf className={"text-xl"} />}
            >
              Download Challan
            </Button>
            <Button
              w={"full"}
              colorScheme="red"
              isLoading={isDeleting}
              onClick={onDelete}
              leftIcon={<AiOutlineDelete className={"text-xl"} />}
            >
              Delete Challan
            </Button>
          </VStack>
        </VStack>
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}
