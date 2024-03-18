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
  IconButton,
  Input,
  Tag,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineCheckCircle, AiOutlineFileProtect } from "react-icons/ai";
import IDrawer from "../ui/utils/IDrawer";
import IModal from "../ui/utils/IModal";
import { MdRemove, MdRemoveCircle } from "react-icons/md";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
  isForCoadmin?: boolean;
  regno: string;
  id: string;
}

export default function ViewFeeDetailsModal({ children, regno, id }: props) {
  const { isOpen, onClose, onOpen: onModalOpen } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onClose: onConfirmClose,
    onOpen: onConfirmOpen,
  } = useDisclosure();
  const {
    isOpen: isConfirmDeleteOpen,
    onClose: onConfirmDeleteClose,
    onOpen: onConfirmDeleteOpen,
  } = useDisclosure();
  const selectedFeeDetails = useAppSelector(
    (state) => state.fees.selected_fee.data
  ) as SelectedFee[];
  const error = useAppSelector((state) => state.fees.selected_fee.error);
  const isLoading = useAppSelector(
    (state) => state.fees.selected_fee.pending
  ) as boolean;
  const dispatch = useAppDispatch();
  const [challanId, setChallanId] = useState("");
  const [state, setState] = useState({ total: "" });
  const [isUpdating, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const user = useAppSelector((state) => state.fees.user);
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
      toast.error(e.response?.data?.msg);
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
      if (!error) onConfirmClose();
    });
    onOpen();
  };

  const onUpdateTotal = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("regno", selectedFeeDetails[0].regno);
    formData.append("total", state.total);
    formData.append("college", user?.college!);
    formData.append("acadYear", acadYear);
    try {
      await axios(process.env.NEXT_PUBLIC_ADMIN_URL + "feeupdatetotal.php", {
        method: "POST",
        data: formData,
      });
      toast.success("Total fee updated successfully", {
        position: "top-right",
      });
      dispatch(
        fetchFeeDetails({
          branch: selectedFeeDetails[0].branch,
          year: selectedFeeDetails[0].year,
          college: user?.college!,
        })
      );
    } catch (e: any) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const onRemoveChallan = async (history_id: string) => {
    setIsDeleting(true);
    const formData = new FormData();
    formData.append("id", selectedFeeDetails[0].id);
    formData.append("college", user?.college!);
    formData.append("acadYear", acadYear);
    formData.append("history_id", history_id);
    try {
      await axios(process.env.NEXT_PUBLIC_ADMIN_URL + "feeremove.php", {
        method: "POST",
        data: formData,
      });
      toast.success("Fee updated Successfully", {
        position: "top-right",
      });
      dispatch(
        fetchFeeDetails({
          branch: selectedFeeDetails[0].branch,
          year: selectedFeeDetails[0].year,
          college: user?.college!,
        })
      );
    } catch (e: any) {
      console.log(e);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <IModal
        isLoading={isLoading}
        onSubmit={onsubmit}
        buttonTitle="Save"
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        heading="Challen Details"
      >
        <Center>
          <Heading>₹{challanState?.amount_paid1}</Heading>
          <Tag ml={"3"} size={"lg"} colorScheme={"purple"}>
            {challanState?.method}
          </Tag>
        </Center>
      </IModal>

      <IDrawer
        isLoading={isChecking}
        isDisabled={isLoading}
        onSubmit={findChallan}
        buttonTitle="Check"
        onClose={() => {
          onClose();
        }}
        isOpen={isOpen}
        heading="Payment History"
        size={"sm"}
      >
        <VStack w={"full"} h={"full"} justifyContent={"space-between"}>
          <VStack spacing={0} w={"full"} h={"full"}>
            {selectedFeeDetails[0]?.payment_history?.map((history) => {
              return (
                <>
                  <IModal
                    isLoading={isDeleting}
                    onSubmit={() => onRemoveChallan(history.id)}
                    buttonTitle="Remove"
                    isOpen={isConfirmDeleteOpen}
                    onClose={onConfirmDeleteClose}
                    heading="Are you sure?"
                    colorBtn="red"
                  >
                    <Center>
                      <p>
                        Are you sure to remove this payment? This action cannot
                        be undone.
                      </p>
                    </Center>
                  </IModal>
                  <HStack
                    key={history.paymentno}
                    w={"full"}
                    className={"border-b border-b-lightgray"}
                    bg={"gray.50"}
                    px={"5"}
                    py={"2"}
                    gap={"3"}
                    justifyContent={"space-between"}
                  >
                    <VStack flex={1} alignItems={"start"}>
                      <HStack>
                        <h1 className="text-md">{history.paymentno}</h1>
                        <Tag
                          size={"sm"}
                          whiteSpace={"nowrap"}
                          variant={"outline"}
                          colorScheme={"teal"}
                          fontWeight={"bold"}
                        >
                          CH No. {history.challan_id}
                        </Tag>
                      </HStack>
                      <span className="text-sm">{history.date}</span>
                    </VStack>
                    <VStack flex={1} alignItems={"end"}>
                      <h1 className="text-lg font-bold text-green-600">
                        ₹ {history.amount_paid}
                      </h1>
                      <span className="text-sm font-medium">
                        <i>{history.method}</i>
                      </span>
                    </VStack>
                    <IconButton
                      aria-label="remove"
                      icon={<MdRemove />}
                      colorScheme="red"
                      size={"sm"}
                      variant={"outline"}
                      onClick={onConfirmDeleteOpen}
                    />
                  </HStack>
                </>
              );
            })}
          </VStack>
          <VStack
            px={"5"}
            py={"3"}
            w={"full"}
            className="border-t bg-secondary"
            position={"sticky"}
            bottom={"0"}
          >
            <HStack
              borderBottom={"1px"}
              borderColor={"gray.200"}
              py={"2"}
              w={"full"}
              justifyContent={"center"}
            >
              <span className="font-medium">
                {selectedFeeDetails[0]?.name} - {selectedFeeDetails[0]?.regno}
              </span>
            </HStack>
            {user?.can_update_total && (
              <>
                <HStack w={"full"} justifyContent={"space-between"}>
                  <h1>Total Amount</h1>
                  <Input
                    fontSize={"lg"}
                    fontWeight={"bold"}
                    value={state.total}
                    type={"number"}
                    w={"50%"}
                    onChange={(e) => {
                      const value = Math.max(
                        0,
                        Math.min(1500000, Number(e.target.value))
                      );
                      setState((prev) => ({
                        ...prev,
                        total: value.toString(),
                      }));
                    }}
                    variant={"flushed"}
                  />
                </HStack>
                <HStack w={"full"}>
                  <Button
                    w={"full"}
                    onClick={onUpdateTotal}
                    colorScheme={"green"}
                    isLoading={isUpdating}
                    leftIcon={<AiOutlineCheckCircle className="text-xl" />}
                  >
                    Update Total Fee
                  </Button>
                </HStack>
              </>
            )}
            {selectedFeeDetails[0]?.payment_history?.length && (
              <HStack w={"full"}>
                <Button
                  w={"full"}
                  as={"a"}
                  download
                  target={"_blank"}
                  href={
                    process.env.NEXT_PUBLIC_ADMIN_URL +
                    `feedownload.php?college=${user?.college}&id=${selectedFeeDetails[0]?.id}&acadYear=${acadYear}`
                  }
                  colorScheme={"purple"}
                  leftIcon={<AiOutlineFileProtect className="text-xl" />}
                >
                  Download Invoice
                </Button>
              </HStack>
            )}

            <HStack w={"full"} py={"2"} justifyContent={"space-between"}>
              <h1>Challan Id:</h1>
              <Input
                onChange={(e) => setChallanId(e.target.value)}
                variant={"flushed"}
                fontSize={"xl"}
                placeholder={"000000"}
                type={"number"}
                w={"50%"}
              />
            </HStack>
          </VStack>
        </VStack>
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}
