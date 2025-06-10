import { useAppDispatch } from "@/hooks";
import { fetchFeeDetails, fetchSearchByMode } from "@/store/fees.slice";
import {
  Button,
  HStack,
  Input,
  Text,
  useDisclosure,
  VStack,
  Field,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineFilePdf } from "react-icons/ai";
import IDrawer from "../ui/utils/IDrawer";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store";
import { useUser } from "@/utils/auth";
import Link from "next/link";
import { toaster } from "../ui/toaster";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
  isForCoadmin?: boolean;
  regno: string;
  challan_id: string;
}

export default function ViewChallanDetails({ children, challan_id }: props) {
  const { open, onClose, onOpen } = useDisclosure();
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const user = useUser();
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
  const acadYear = useAppSelector((state) => state.fees.acadYear);

  const findChallan = useCallback(async () => {
    setIsChecking(true);
    try {
      const formData = new FormData();
      formData.append("challan_id", challan_id);
      formData.append("college", user?.college!);
      formData.append("acadyear", acadYear);

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
      toaster.error({ title: e.response?.data?.msg });
    }
    setIsChecking(false);
  }, [challan_id, user?.college]);

  useEffect(() => {
    open && findChallan();
  }, [open, findChallan]);

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
          toaster.success({ title: res.data.msg });
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
          toaster.error({ title: e.response?.data?.msg });
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
          toaster.success({ title: res.data.msg });
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
          toaster.error({ title: e.response?.data?.msg });
          setIsDeleting(false);
        });
    }
  }, [usn, challan_id]);

  return (
    <>
      <IDrawer
        loading={isChecking}
        disabled={false}
        onSubmit={submit}
        buttonTitle="Save"
        onClose={() => {
          onClose();
        }}
        open={open}
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
          <Field.Root px={"5"}>
            <HStack>
              <Field.Label flex={1}>
                <Text>Challan Id</Text>
              </Field.Label>
              <Input readOnly value={challanState?.challan_id} flex={"1.5"} />
            </HStack>
          </Field.Root>
          <Field.Root px={"5"}>
            <HStack>
              <Field.Label flex={1}>
                <Text>USN</Text>
              </Field.Label>
              <Input
                readOnly={!!challanState?.usn}
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                flex={"1.5"}
              />
            </HStack>
          </Field.Root>
          <Field.Root px={"5"}>
            <HStack>
              <Field.Label flex={1}>
                <Text>Name</Text>
              </Field.Label>
              <Input readOnly value={challanState?.name} flex={"1.5"} />
            </HStack>
          </Field.Root>
          <Field.Root px={"5"}>
            <HStack>
              <Field.Label flex={1}>
                <Text>Branch</Text>
              </Field.Label>
              <Input readOnly value={challanState?.branch} flex={"1.5"} />
            </HStack>
          </Field.Root>
          <Field.Root px={"5"}>
            <HStack>
              <Field.Label flex={1}>
                <Text>Sem</Text>
              </Field.Label>
              <Input readOnly flex={"1.5"} value={challanState?.sem} />
            </HStack>
          </Field.Root>
          <Field.Root px={"5"}>
            <HStack>
              <Field.Label flex={1}>
                <Text>Bank</Text>
              </Field.Label>
              <Input readOnly flex={"1.5"} value={challanState?.bank} />
            </HStack>
          </Field.Root>
          <Field.Root px={"5"}>
            <HStack>
              <Field.Label flex={1}>
                <Text>Date</Text>
              </Field.Label>
              <Input readOnly flex={"1.5"} value={challanState?.date} />
            </HStack>
          </Field.Root>
          <Field.Root px={"5"}>
            <HStack>
              <Field.Label flex={1}>
                <Text>Method</Text>
              </Field.Label>
              <Input readOnly flex={"1.5"} value={challanState?.method} />
            </HStack>
          </Field.Root>
          <Field.Root px={"5"}>
            <HStack w={"full"}>
              <Field.Label flex={1}>
                <Text>Amount Paid</Text>
              </Field.Label>
              <Input flex={"1.5"} readOnly value={challanState?.amount_paid1} />
            </HStack>
          </Field.Root>
          <VStack
            position={"sticky"}
            p={"5"}
            top={"100%"}
            className="border-gray-300 border-top"
            bottom={"0"}
            w={"full"}
          >
            <Button asChild w={"full"} colorPalette="purple">
              <Link
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_ADMIN_URL}${
                  user?.college == "KSPT"
                    ? "feekspreceiptdownload"
                    : "feedownloadreciept"
                }.php?challan_id=${challanState?.challan_id}&college=${
                  user?.college
                }`}
              >
                <AiOutlineFilePdf className={"text-xl"} />
                Download Challan
              </Link>
            </Button>
            <Button
              w={"full"}
              colorPalette="red"
              loading={isDeleting}
              onClick={onDelete}
            >
              <AiOutlineDelete className={"text-xl"} />
              Delete Challan
            </Button>
          </VStack>
        </VStack>
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}
