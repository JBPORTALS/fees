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
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdRemove } from "react-icons/md";
import IModal from "./utils/IModal";
import { useUser } from "@/utils/auth";

export default function HistoryItem({ history }: { history: PaymentHistory }) {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const selectedFeeDetails = useAppSelector(
    (state) => state.fees.selected_fee.data
  ) as SelectedFee[];
  const user = useUser();
  const acadYear = useAppSelector((state) => state.fees.acadYear);
  const {
    open: isConfirmDeleteOpen,
    onClose: onConfirmDeleteClose,
    onOpen: onConfirmDeleteOpen,
  } = useDisclosure();

  const containerRef = useRef<HTMLDivElement | null>(null);

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
      onConfirmDeleteClose();
    } catch (e: any) {
      toast.error("unable to remove challan", {
        position: "top-right",
      });
    }
    setIsDeleting(false);
  };

  return (
    <HStack
      ref={containerRef}
      key={history.id}
      w={"full"}
      className={"border-b border-b-lightgray"}
      px={"5"}
      py={"2"}
      gap={"3"}
      justifyContent={"space-between"}
      borderBottomWidth={"thin"}
      borderBottomColor={"border.muted"}
    >
      <IModal
        loading={isDeleting}
        onSubmit={() => onRemoveChallan(history.id, history.challan_id)}
        buttonTitle="Remove"
        open={isConfirmDeleteOpen}
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
          <Tag.Root
            size={"sm"}
            whiteSpace={"nowrap"}
            variant={"outline"}
            colorPalette={"teal"}
            fontWeight={"bold"}
          >
            <Tag.Label>CH No. {history.challan_id}</Tag.Label>
          </Tag.Root>
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
        colorPalette="red"
        size={"sm"}
        variant={"outline"}
        onClick={() => {
          onConfirmDeleteOpen();
        }}
      >
        <MdRemove />
      </IconButton>
    </HStack>
  );
}
