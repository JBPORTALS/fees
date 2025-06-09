import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  fetchSelectedFeeDeatails,
  SelectedFee,
  updateFeeDetail,
} from "@/store/fees.slice";
import {
  Button,
  Center,
  Heading,
  HStack,
  NumberInput,
  Stat,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import IDrawer from "../ui/utils/IDrawer";
import IModal from "../ui/utils/IModal";
import HistoryItem from "../ui/HistoryItem";
import { useUser } from "@/utils/auth";
import Link from "next/link";
import { toaster } from "../ui/toaster";
import { LuFileDown } from "react-icons/lu";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
  isForCoadmin?: boolean;
  regno: string;
  id: string;
}

export default function ViewFeeDetailsModal({ children, regno, id }: props) {
  const { open, onClose, onOpen: onModalOpen } = useDisclosure();
  const {
    open: isConfirmOpen,
    onClose: onConfirmClose,
    onOpen: onConfirmOpen,
  } = useDisclosure();

  const selectedFeeDetails = useAppSelector(
    (state) => state.fees.selected_fee.data
  ) as SelectedFee[];
  const error = useAppSelector((state) => state.fees.selected_fee.error);
  const loading = useAppSelector(
    (state) => state.fees.selected_fee.pending
  ) as boolean;
  const dispatch = useAppDispatch();
  const [challanId, setChallanId] = useState("");
  const [state, setState] = useState({ total: "" });
  // const [isUpdating, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const user = useUser();
  const acadYear = useAppSelector((state) => state.fees.acadYear);
  const [challanState, setChallanState] = useState<
    | {
        challan_id: string;
        usn: string;
        name: string;
        date: string;
        method: string;
        amount_paid: string;
        amount_paid1: string;
      }
    | undefined
  >(undefined);

  const onOpen = () => {
    onModalOpen();
    dispatch(fetchSelectedFeeDeatails({ regno, id, college: user?.college! }));
  };

  const findChallan = async () => {
    setIsChecking(true);
    try {
      const formData = new FormData();
      formData.append("challan_id", challanId);
      formData.append("reg_no", regno);
      formData.append("college", user?.college!);
      formData.append("acadYear", acadYear);
      const response = await axios(
        process.env.NEXT_PUBLIC_ADMIN_URL + "feesearchchallan.php",
        {
          method: "POST",
          data: formData,
        }
      );
      setChallanState(response.data[0]);
      onConfirmOpen();
    } catch (e: any) {
      toaster.error({ title: e.response?.data?.msg });
    }
    setIsChecking(false);
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      total: selectedFeeDetails[0]?.total?.toString(),
    }));
  }, [selectedFeeDetails]);

  const onsubmit = async () => {
    await dispatch(
      updateFeeDetail({
        method: challanState!.method,
        paid: challanState!.amount_paid,
        challan_id: challanState!.challan_id,
        college: user?.college!,
      })
    ).then(() => {
      if (!error) {
        setChallanId("");
        onConfirmClose();
      }
    });
    onOpen();
  };

  // const onUpdateTotal = async () => {
  //   setIsLoading(true);
  //   const formData = new FormData();
  //   formData.append("regno", selectedFeeDetails[0].regno);
  //   formData.append("sem", selectedFeeDetails[0].sem);
  //   formData.append("year", selectedFeeDetails[0].year);
  //   formData.append("total", state.total);
  //   formData.append("college", user?.college!);
  //   formData.append("acadYear", acadYear);
  //   try {
  //     await axios(process.env.NEXT_PUBLIC_ADMIN_URL + "feeupdatetotal.php", {
  //       method: "POST",
  //       data: formData,
  //     });
  //     console.log("Reached");
  //     toaster.success({
  //       title: "Total fee updated successfully",
  //     });
  //     dispatch(
  //       fetchFeeDetails({
  //         branch: selectedFeeDetails[0].branch,
  //         year: selectedFeeDetails[0].year,
  //         college: user?.college!,
  //       })
  //     );
  //   } catch (e: any) {
  //     console.log(e);
  //     toaster.error({ title: e.response.data.msg });
  //   }
  //   setIsLoading(false);
  // };

  return (
    <>
      <IModal
        loading={loading}
        onSubmit={onsubmit}
        buttonTitle="Save"
        open={isConfirmOpen}
        onClose={onConfirmClose}
        heading="Challen Details"
      >
        <Center>
          <Heading>₹{challanState?.amount_paid1}</Heading>
          <Tag.Root ml={"3"} size={"lg"} colorPalette={"purple"}>
            <Tag.Label>{challanState?.method}</Tag.Label>
          </Tag.Root>
        </Center>
      </IModal>

      <IDrawer
        loading={isChecking}
        disabled={loading}
        onSubmit={findChallan}
        buttonTitle="Check"
        onClose={() => {
          onClose();
        }}
        open={open}
        heading="Payment History"
        size={"sm"}
      >
        <VStack w={"full"} h={"full"} justifyContent={"space-between"}>
          <VStack gap={0} w={"full"} h={"full"}>
            {selectedFeeDetails[0]?.payment_history?.map((history) => {
              return <HistoryItem key={history.id} {...{ history }} />;
            })}
          </VStack>
          <VStack
            px={"5"}
            py={"3"}
            w={"full"}
            borderTopWidth={"thin"}
            borderTopColor={"border.emphasized"}
            position={"sticky"}
            bottom={"0"}
          >
            <VStack
              borderBottomWidth={"thin"}
              borderBottomColor={"border"}
              py={"2"}
              gap={"3"}
              w={"full"}
              align={"start"}
            >
              <Heading size={"md"}>
                {selectedFeeDetails[0]?.name} - {selectedFeeDetails[0]?.regno}
              </Heading>
              <Stat.Root>
                <Stat.Label>Total Amount</Stat.Label>
                <Stat.ValueText>
                  {parseInt(state.total).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </Stat.ValueText>
                <Stat.HelpText>
                  You can update total amount directly in students details
                  drawer
                </Stat.HelpText>
              </Stat.Root>
              {selectedFeeDetails[0]?.payment_history?.length > 0 && (
                <HStack w={"full"}>
                  <Button
                    w={"full"}
                    asChild
                    variant={"surface"}
                    colorPalette={"purple"}
                  >
                    <Link
                      download
                      target={"_blank"}
                      href={
                        process.env.NEXT_PUBLIC_ADMIN_URL +
                        `feedownload.php?college=${user?.college}&id=${selectedFeeDetails[0]?.id}&acadyear=${acadYear}`
                      }
                    >
                      <LuFileDown className="text-xl" />
                      Download Payments History
                    </Link>
                  </Button>
                </HStack>
              )}
            </VStack>

            <VStack
              w={"full"}
              align={"start"}
              py={"2"}
              justifyContent={"space-between"}
            >
              <NumberInput.Root
                onValueChange={({ value }) => setChallanId(value)}
                value={challanId}
                variant={"subtle"}
                w={"full"}
                size={"lg"}
              >
                <NumberInput.Input
                  autoFocus
                  fontWeight={"bold"}
                  placeholder="Enter Challan Number"
                />
              </NumberInput.Root>
              <Text fontSize={"sm"} color={"fg.muted"}>
                Update payments by challan ID of this student
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}
