"use client";

import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  PaymentHistory,
  SelectedFee,
  fetchFeeDetails,
} from "@/store/fees.slice";
import {
  Center,
  HStack,
  IconButton,
  Tag,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdRemove } from "react-icons/md";
import IModal from "./utils/IModal";

export default function HistoryItem({ history }: { history: PaymentHistory }) {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const selectedFeeDetails = useAppSelector(
    (state) => state.fees.selected_fee.data
  ) as SelectedFee[];
  const user = useAppSelector((state) => state.fees.user);
  const acadYear = useAppSelector((state) => state.fees.acadYear);
  const {
    isOpen: isConfirmDeleteOpen,
    onClose: onConfirmDeleteClose,
    onOpen: onConfirmDeleteOpen,
  } = useDisclosure();

  const onRemoveChallan = async (history_id: string, challan_id: string) => {
    setIsDeleting(true);
    const formData = new FormData();
    formData.append("id", selectedFeeDetails[0].id);
    formData.append("college", user?.college!);
    formData.append("acadYear", acadYear);
    formData.append("history_id", history_id);
    formData.append("challan_id", challan_id);
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
    <HStack
      key={history.id}
      w={"full"}
      className={"border-b border-b-lightgray"}
      bg={"gray.50"}
      px={"5"}
      py={"2"}
      gap={"3"}
      justifyContent={"space-between"}
    >
      <IModal
        isLoading={isDeleting}
        onSubmit={() => onRemoveChallan(history.id, history.challan_id)}
        buttonTitle="Remove"
        isOpen={isConfirmDeleteOpen}
        onClose={onConfirmDeleteClose}
        heading="Are you sure?"
        colorBtn="red"
      >
        <Center>
          <p>
            Are you sure to remove this payment? This action cannot be undone.
          </p>
        </Center>
      </IModal>
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
        onClick={() => {
          onConfirmDeleteOpen();
        }}
      />
    </HStack>
  );
}
