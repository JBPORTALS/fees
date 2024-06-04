"use client";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuIcon,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Switch,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import type { Schema } from "yup";
import React, {
  HTMLAttributes,
  HTMLInputTypeAttribute,
  useEffect,
  useState,
} from "react";
import { Field, FieldProps } from "@/components/ui/Field";
import moment from "moment";
import { useParams, useSearchParams } from "next/navigation";
import {
  AiOutlineCheck,
  AiOutlineDelete,
  AiOutlineFileDone,
  AiOutlineFileText,
  AiOutlineMore,
  AiOutlineSearch,
} from "react-icons/ai";
import axios from "axios";
import {
  ACADYEARS,
  BANKS,
  CATS,
  PAYMENTMODES,
  SEMS,
} from "@/components/mock-data/constants";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/store";
import { FaInfoCircle } from "react-icons/fa";
import { trpc } from "@/utils/trpc-cleint";
import { Link } from "@chakra-ui/next-js";

const initialValues = {
  usn: "", //✅
  name: "",
  sem: "",
  year: "",
  branch: "",
  category: "", //✅
  misc_category: "", //✅
  chaAcadYear: "", //✅
  tuitionFee: 0, //✅
  collegeFee: 0, //✅
  labFee: 0, //✅
  vtuFee: 0, //✅
  bank: "", //✅
  paymentMode: "", //✅
  date: moment(new Date(Date.now())).format("yyyy-MM-DD"), //✅
  transactionId: "",
  chequeNo: "", //✅
  busFee: 0, //✅
  excessFee: 0, //✅
  securityDeposit: 0, //✅
  hostelFee: 0, //✅
  total: 0, //✅
  total_fee: 0, //
  remaining_fee: 0, //
};

const FormikContextProvider = () => {
  const { values, setFieldValue } = useFormikContext<typeof initialValues>();
  const [usn, setUsn] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const user = useAppSelector((state) => state.fees.user);
  const acadYear = useAppSelector((state) => state.fees.acadYear);
  const searchParams = useSearchParams();
  const challan_id = searchParams.get("challan_id");
  const { data } = trpc.getChallanDetails.useQuery(
    {
      acadYear,
      challan_id: challan_id!,
      college: user?.college!,
    },
    {
      enabled: !!challan_id,
    }
  );

  useEffect(() => {
    if (data) {
      setFieldValue("usn", data[0]?.usn);
      setFieldValue("name", data[0]?.name);
      setFieldValue("sem", data[0]?.sem);
      setFieldValue("year", data[0]?.year);
      setFieldValue("chaAcadYear", data[0]?.acad_year);
      setFieldValue("branch", data[0]?.branch);
      setFieldValue("category", data[0]?.stu_category);
      setFieldValue("total_fee", data[0]?.total_fee);
      setFieldValue("remaining_fee", data[0]?.remaining_fee);
      setFieldValue("excessFee", data[0]?.excess);
      setFieldValue("total", data[0]?.amount_paid);
      setFieldValue("tuitionFee", data[0]?.tuition);
      setFieldValue("vtuFee", data[0]?.vtu);
      setFieldValue("collegeFee", data[0]?.college_fee);
      setFieldValue("labFee", data[0]?.lab);
      setFieldValue("busFee", data[0]?.bus);
      setFieldValue("bank", data[0]?.bank);
      setFieldValue("paymentMode", data[0]?.method);
      setFieldValue("chequeNo", data[0]?.trans_id);
      setFieldValue("date", data[0]?.trans_date);
    }
  }, [data, challan_id]);

  useEffect(() => {
    setFieldValue(
      "total",
      +(
        +values.collegeFee +
        +values.tuitionFee +
        +values.vtuFee +
        +values.labFee +
        +values.excessFee
      )
    );
  }, [
    values.collegeFee,
    values.tuitionFee,
    values.vtuFee,
    values.labFee,
    values.excessFee,
    setFieldValue,
  ]);

  async function findStudent() {
    setIsloading(true);
    try {
      const formData = new FormData();
      formData.append("usn", usn);
      formData.append("college", user?.college!);
      formData.append("acadYear", acadYear);
      const res = await axios(
        process.env.NEXT_PUBLIC_ADMIN_URL + "retrievestudentdetails.php",
        {
          method: "POST",
          data: formData,
        }
      );

      if (res.status !== 402) {
        setFieldValue("usn", res.data[0]?.usn);
        setFieldValue("name", res.data[0]?.name);
        setFieldValue("sem", res.data[0]?.sem);
        setFieldValue("year", res.data[0]?.year);
        setFieldValue("branch", res.data[0]?.branch);
        setFieldValue("category", res.data[0]?.category);
        setFieldValue("total_fee", res.data[0]?.total_fee);
        setFieldValue("excessFee", res.data[0]?.remaining_fee);
      }
    } catch (e: any) {
      toast.error(e.response.data?.msg, { position: "bottom-center" });
    }
    setIsloading(false);
  }

  if (challan_id) return null;

  return (
    <React.Fragment>
      <InputGroup>
        <Input
          colorScheme="whiteAlpha"
          bg={"white"}
          onChange={(e) => setUsn(e.target.value)}
          value={usn}
          onKeyDown={(e) => e.key == "Enter" && findStudent()}
          placeholder="Enter USN here to find the student..."
        />
        <InputRightElement>
          <IconButton
            {...{ isLoading }}
            onClick={findStudent}
            aria-label="search"
            colorScheme="blue"
            variant={"ghost"}
            icon={<AiOutlineSearch />}
          />
        </InputRightElement>
      </InputGroup>
    </React.Fragment>
  );
};

export default function WithUSNDynamicPage() {
  const toast = useToast({
    position: "bottom-left",
  });

  const branchList = useAppSelector((state) => state.fees.branch_list.data) as {
    branch: string;
  }[];
  const [isMutable, setIsMustable] = useState(false);

  const user = useAppSelector((state) => state.fees.user);
  const acadYear = useAppSelector((state) => state.fees.acadYear);
  const params = useParams();
  const searchParams = useSearchParams();
  const challan_id = searchParams.get("challan_id");
  const { data } = trpc.getChallanDetails.useQuery(
    {
      acadYear,
      challan_id: challan_id!,
      college: user?.college!,
    },
    {
      enabled: !!challan_id,
    }
  );

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isLinkedOpen,
    onClose: onLinkedClose,
    onOpen: onLinkedOpen,
  } = useDisclosure();
  const paymentType = params.paymentType as
    | "FEE"
    | "MISCELLANEOUS"
    | "BUS_FEE"
    | "EXCESS_FEE"
    | "SECURITY_DEPOSIT"
    | "HOSTEL_FEE";

  useEffect(() => {
    if (isMutable)
      toast({
        colorScheme: "blue",
        variant: "subtle",
        position: "top",
        icon: <FaInfoCircle />,
        description:
          "Notice: Automatic Fee Updation is enabled; student fees will be updated upon challan generation.",
        title: "Automatic fee updation turned on",
      });
  }, [isMutable]);

  const feeTemplate: FieldProps[] = [
    {
      name: "usn",
      label:
        user?.college == "KSPT" || user?.college == "KSPU" ? "REG NO." : "USN",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
    },
    {
      name: "branch",
      label: "Branch",
      type: "select",
      placeholder: "Select Branch",
      validateField: Yup.string().required("Fill the field !"),
      options: branchList.map((value) => ({
        value: value.branch,
        option: value.branch,
      })),
    },
    {
      name: "sem",
      label: user?.college == "KSPU" ? "Year" : "Sem",
      type: "select",
      placeholder: "Select",
      validateField: Yup.string().required("Fill the field !"),
      options: SEMS(user?.college),
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      placeholder: "Select Category",
      validateField: Yup.string().required("Fill the field !"),
      options: CATS(user?.college),
    },
    {
      name: "chaAcadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: ACADYEARS(),
      isReadonly: challan_id ? true : false,
      description: challan_id ? "You can't modify in edit mode" : undefined,
    },
    {
      name: "total_fee",
      label: "Total Fee Fixed",
      type: "text",
      hidden: challan_id ? true : false,
      isReadonly: true,
      validateField: Yup.number()
        .typeError("invalid number")
        .min(0, "minimum amount should be 0")
        .when((_, schema, __) =>
          challan_id ? schema.optional() : schema.required("Field required !")
        ),
    },
    {
      name: "remaining_fee",
      label: "Balance",
      type: "text",
      isReadonly: true,
      hidden: challan_id ? true : false,
      validateField: Yup.number()
        .typeError("invalid number")
        .min(0, "minimum amount should be 0")
        .when((_, schema, __) =>
          challan_id ? schema.optional() : schema.required("Field required !")
        ),
    },
    {
      name: "tuitionFee",
      label: "Tuition Fee",
      type: "text",
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .min(0, "minimum amount should be 0"),
    },
    {
      name: "vtuFee",
      label:
        user?.college == "KSPT"
          ? "Admission Fee"
          : user?.college == "KSPU"
          ? "PU Board Fee"
          : "VTU/DTE/DDPI/GP.INS/ IRC Fee",
      type: "text",
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .min(0, "minimum amount should be 0"),
    },
    {
      name: "collegeFee",
      label: "College & Other Fee",
      type: "text",
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .min(0, "minimum amount should be 0"),
    },
    {
      name: "labFee",
      label:
        user?.college == "KSPT"
          ? "Development Fee"
          : user?.college == "KSPU"
          ? "Exam Fee"
          : "Skill Lab Fee",
      type: "text",
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .min(0, "minimum amount should be 0"),
    },
    {
      name: "excessFee",
      label: "Excess Fee",
      type: "text",
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .min(0, "minimum amount should be 0"),
    },
    {
      name: "total",
      label: "Total Fee",
      type: "text",
      isReadonly: true,
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .moreThan(0, "Total amount should be more than 0"),
    },
    {
      name: "bank",
      label: "Bank",
      type: "select",
      placeholder: "Select Bank",
      options: BANKS(user?.college),
      validateField: Yup.string().required("Fill the field !"),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: PAYMENTMODES(user?.college),
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const miscellaneousTemplate: FieldProps[] = [
    {
      name: "usn",
      label:
        user?.college == "KSPT" || user?.college == "KSPU" ? "REG NO." : "USN",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
    },
    {
      name: "branch",
      label: "Branch",
      type: "select",
      placeholder: "Select Branch",
      validateField: Yup.string().required("Fill the field !"),
      options: branchList.map((value) => ({
        value: value.branch,
        option: value.branch,
      })),
    },
    {
      name: "sem",
      label: user?.college == "KSPU" ? "Year" : "Sem",
      type: "select",
      placeholder: "Select Sem",
      validateField: Yup.string().required("Fill the field !"),
      options: SEMS(user?.college),
    },
    {
      name: "misc_category",
      label: "Category",
      type: "select",
      placeholder: "Select Category",
      validateField: Yup.string().required("Fill the field !"),
      options: [
        {
          value: "Registration Fee",
          option: "Registration Fee",
        },
        {
          value: "Library Fine",
          option: "Library Fine",
        },
        {
          value: "Certificates",
          option: "Certificates",
        },
        {
          value: "Attestation",
          option: "Attestation",
        },
        {
          value: "Lab Breakage",
          option: "Lab Breakage",
        },
        {
          value: "Application",
          option: "Application",
        },
        {
          value: "Miscellaneous",
          option: "Miscellaneous",
        },
        {
          value: "ID Card",
          option: "ID Card",
        },
        {
          value: "Uniform",
          option: "Uniform",
        },
        {
          value: "Books",
          option: "Books",
        },
        {
          value: "Duplicate Halltickets",
          option: "Duplicate Halltickets",
        },
        {
          value: "Others",
          option: "Others",
        },
      ],
    },
    {
      name: "total",
      label: "Total Amount",
      type: "number",
      validateField: Yup.number()
        .typeError("Invalid amount")
        .moreThan(0, "Amount should be more than 0")
        .required(),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: [
        {
          option: "Online",
          value: "ONLINE",
        },
        {
          option: "Cash",
          value: "CASH",
        },
        {
          option: "Cheque",
          value: "CHEQUE",
        },
      ],
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const busFeeTemplate: FieldProps[] = [
    {
      name: "usn",
      label:
        user?.college == "KSPT" || user?.college == "KSPU" ? "REG NO." : "USN",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
    },
    {
      name: "branch",
      label: "Branch",
      type: "select",
      placeholder: "Select Branch",
      validateField: Yup.string().required("Fill the field !"),
      options: branchList.map((value) => ({
        value: value.branch,
        option: value.branch,
      })),
    },
    {
      name: "sem",
      label: user?.college == "KSPU" ? "Year" : "Sem",
      type: "select",
      placeholder: "Select Sem",
      validateField: Yup.string().required("Fill the field !"),
      options: SEMS(user?.college),
    },
    {
      name: "chaAcadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: ACADYEARS(),
    },
    {
      name: "bank",
      label: "Bank",
      type: "select",
      placeholder: "Select Bank",
      options: BANKS(user?.college),
      validateField: Yup.string().required("Fill the field !"),
    },
    {
      name: "busFee",
      label: "Total Bus Fee Amount",
      type: "number",
      validateField: Yup.number()
        .typeError("Invalid amount")
        .moreThan(0, "Amount should be more than 0")
        .required(),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: PAYMENTMODES(user?.college),
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const excessFeeTemplate: FieldProps[] = [
    {
      name: "usn",
      label:
        user?.college == "KSPT" || user?.college == "KSPU" ? "REG NO." : "USN",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
    },
    {
      name: "branch",
      label: "Branch",
      type: "select",
      placeholder: "Select Branch",
      validateField: Yup.string().required("Fill the field !"),
      options: branchList.map((value) => ({
        value: value.branch,
        option: value.branch,
      })),
    },
    {
      name: "sem",
      label: user?.college == "KSPU" ? "Year" : "Sem",
      type: "select",
      placeholder: "Select Sem",
      validateField: Yup.string().required("Fill the field !"),
      options: SEMS(user?.college),
    },
    {
      name: "chaAcadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: ACADYEARS(),
    },
    {
      name: "excessFee",
      label: "Total Excess Fee Amount",
      type: "number",
      validateField: Yup.number()
        .typeError("Invalid amount")
        .moreThan(0, "Amount should be more than 0")
        .required(),
    },
    {
      name: "bank",
      label: "Bank",
      type: "select",
      placeholder: "Select Bank",
      options: BANKS(user?.college),
      validateField: Yup.string().required("Fill the field !"),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: PAYMENTMODES(user?.college),
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const securityFeeTemplate: FieldProps[] = [
    {
      name: "usn",
      label:
        user?.college == "KSPT" || user?.college == "KSPU" ? "REG NO." : "USN",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
    },
    {
      name: "branch",
      label: "Branch",
      type: "select",
      placeholder: "Select Branch",
      validateField: Yup.string().required("Fill the field !"),
      options: branchList.map((value) => ({
        value: value.branch,
        option: value.branch,
      })),
    },
    {
      name: "sem",
      label: user?.college == "KSPU" ? "Year" : "Sem",
      type: "select",
      placeholder: "Select Sem",
      validateField: Yup.string().required("Fill the field !"),
      options: SEMS(user?.college),
    },
    {
      name: "chaAcadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: ACADYEARS(),
    },
    {
      name: "securityDeposit",
      label: "Total Security Deposit Amount",
      type: "number",
      validateField: Yup.number()
        .typeError("Invalid amount")
        .moreThan(0, "Amount should be more than 0")
        .required(),
    },
    {
      name: "bank",
      label: "Bank",
      type: "select",
      placeholder: "Select Bank",
      options: BANKS(user?.college),
      validateField: Yup.string().required("Fill the field !"),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: PAYMENTMODES(user?.college),
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const hostelFeeTemplate: FieldProps[] = [
    {
      name: "usn",
      label:
        user?.college == "KSPT" || user?.college == "KSPU" ? "REG NO." : "USN",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(
          /^[Aa-zZ0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      validateField: Yup.string()
        .required("Field required !")
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
    },
    {
      name: "branch",
      label: "Branch",
      type: "select",
      placeholder: "Select Branch",
      validateField: Yup.string().required("Fill the field !"),
      options: branchList.map((value) => ({
        value: value.branch,
        option: value.branch,
      })),
    },
    {
      name: "sem",
      label: user?.college == "KSPU" ? "Year" : "Sem",
      type: "select",
      placeholder: "Select Sem",
      validateField: Yup.string().required("Fill the field !"),
      options: SEMS(user?.college),
    },
    {
      name: "chaAcadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: ACADYEARS(),
    },
    {
      name: "hostelFee",
      label: "Total Security Deposit Amount",
      type: "number",
      validateField: Yup.number()
        .typeError("Invalid amount")
        .moreThan(0, "Amount should be more than 0")
        .required(),
    },
    {
      name: "bank",
      label: "Bank",
      type: "select",
      placeholder: "Select Bank",
      options: BANKS(user?.college),
      validateField: Yup.string().required("Fill the field !"),
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      placeholder: "Select Payment Mode",
      options: PAYMENTMODES(user?.college),
      validateField: Yup.string().required("Fill the field !"),
    },
  ];

  const chequeTemplate: FieldProps[] = [
    {
      name: "chequeNo",
      label: "Cheque No.",
      type: "text",
      validateField: Yup.string()
        .required("Fill the field!")
        .matches(
          /^[a-z0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "date",
      label: "Payment Date",
      type: "date",
      validateField: Yup.date()
        .required("Fill the field!")
        .typeError("Not valid date"),
    },
  ];

  const cashTemplate: FieldProps[] = [
    {
      name: "date",
      label: "Payment Date",
      type: "date",
      validateField: Yup.date()
        .required("Fill the field!")
        .typeError("Not valid date"),
    },
  ];

  const onlineTemplate: FieldProps[] = [
    {
      name: "chequeNo",
      label: "Transaction ID",
      type: "text",
      validateField: Yup.string()
        .required("Fill the field!")
        .matches(
          /^[a-z0-9,]+$/i,
          "Only [a-z],[0-9] or `,` are allowed for this field"
        ),
    },
    {
      name: "date",
      label: "Payment Date",
      type: "date",
      validateField: Yup.date()
        .required("Fill the field!")
        .typeError("Not valid date"),
    },
  ];

  const ddTemplate: FieldProps[] = [
    {
      name: "chequeNo",
      label: "DD No.",
      type: "text",
      validateField: Yup.string()
        .required("Fill the field!")
        .matches(
          /^[a-z0-9]+$/i,
          "Only alphanumaric values are allowed for this field"
        ),
    },
    {
      name: "date",
      label: "Payment Date",
      type: "date",
      validateField: Yup.date()
        .required("Fill the field!")
        .typeError("Not valid date"),
    },
  ];

  async function generateReciept(state: typeof initialValues) {
    try {
      const filename =
        state.paymentMode == "ONLINE" &&
        paymentType !== "MISCELLANEOUS" &&
        user?.college !== "KSPT"
          ? "feegenerateonlinewithusn.php"
          : paymentType == "MISCELLANEOUS"
          ? "feegeneratemiscellaneouswithusn.php"
          : user?.college == "KSPT" || user?.college == "KSSA"
          ? "feekspreceipt.php"
          : "feegeneraterecieptwithusn.php";

      const response = await axios.get(
        process.env.NEXT_PUBLIC_ADMIN_URL +
          `${filename}?${Object.keys(state)
            .map(
              (key, index) =>
                `${key}=${
                  key == "date"
                    ? moment(state[key]).format("yyyy-MM-DD")
                    : Object.values(state)[index]
                }`
            )
            .join("&")}&paymentType=${paymentType}&college=${
            user?.college
          }&mutable=${isMutable}`
      );

      if (response.status == 402) return new Error(response.data.msg);

      window.open(
        process.env.NEXT_PUBLIC_ADMIN_URL +
          `${filename}?${Object.keys(state)
            .map(
              (key, index) =>
                `${key}=${
                  key == "date"
                    ? moment(state[key]).format("yyyy-MM-DD")
                    : Object.values(state)[index]
                }`
            )
            .join("&")}&paymentType=${paymentType}&college=${
            user?.college
          }&mutable=${isMutable}`,
        "_blank"
      );
    } catch (e: any) {
      toast({
        title: e.response?.data?.msg ?? e,
        status: "error",
        position: "bottom",
      });
    }
  }

  async function updateReciept(state: typeof initialValues) {
    try {
      const formData = new FormData();
      formData.append("challan_no", challan_id!);
      formData.append("college", user?.college!);
      formData.append("usn", state.usn);
      formData.append("name", state.name);
      formData.append("stu_category", state.category);
      formData.append("sem", state.sem);
      formData.append("year", state.year);
      formData.append("branch", state.branch);
      formData.append("bank", state.bank);
      formData.append("method", state.paymentMode);
      formData.append("type", paymentType);
      formData.append("trans_id", state.chequeNo);
      formData.append("trans_date", state.date);
      formData.append("tuition", state.tuitionFee.toString());
      formData.append("vtu", state.vtuFee.toString());
      formData.append("college_fee", state.collegeFee.toString());
      formData.append("tuition", state.tuitionFee.toString());
      formData.append("lab", state.labFee.toString());
      formData.append("bus", state.busFee.toString());
      formData.append("excess", state.excessFee.toString());
      formData.append("security_deposit", state.securityDeposit.toString());
      formData.append("hostel", state.hostelFee.toString());
      formData.append("amount_paid", state.total.toString());
      formData.append("acad_year", state.chaAcadYear);
      formData.append("linked", data[0].linked);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_ADMIN_URL + `feechallanupdate.php`,
        formData
      );

      if (response.status == 402) return new Error(response.data.msg);
      toast({
        title: "Your changes has been saved",
        status: "info",
        position: "bottom",
      });
    } catch (e: any) {
      toast({
        title: e.response?.data?.msg ?? e,
        status: "error",
        position: "bottom",
      });
    }
  }

  return (
    <VStack spacing={"0"} w={"full"} h={"fit-content"} position={"relative"}>
      <Formik
        {...{ initialValues }}
        enableReinitialize
        validateOnChange
        validateOnBlur
        validateOnMount
        onSubmit={async (state) => {
          if (challan_id) {
            await updateReciept(state);
          } else {
            await generateReciept(state);
          }
        }}
      >
        {({
          values: { paymentMode },
          errors,
          handleSubmit,
          isSubmitting,
          isValidating,
        }) => {
          const checkOnPamentModeTemplate =
            paymentMode == "CHEQUE"
              ? chequeTemplate
              : paymentMode == "CASH"
              ? cashTemplate
              : paymentMode == "ONLINE"
              ? onlineTemplate
              : paymentMode == "UPI SCAN"
              ? onlineTemplate
              : paymentMode == "DD"
              ? ddTemplate
              : undefined;

          const checkOnPaymentType =
            paymentType == "FEE"
              ? feeTemplate
              : paymentType == "MISCELLANEOUS"
              ? miscellaneousTemplate
              : paymentType == "BUS_FEE"
              ? busFeeTemplate
              : paymentType == "EXCESS_FEE"
              ? excessFeeTemplate
              : paymentType == "SECURITY_DEPOSIT"
              ? securityFeeTemplate
              : paymentType == "HOSTEL_FEE"
              ? hostelFeeTemplate
              : undefined;

          return (
            <React.Fragment>
              <FormikContextProvider />
              <SimpleGrid
                columns={3}
                gap={"5"}
                w={"full"}
                h={"fit-content"}
                py={"7"}
              >
                {checkOnPaymentType?.map((field) => {
                  return (
                    <Field
                      {...field}
                      key={field?.name}
                      validate={(value) => {
                        let error;
                        if (field?.validateField) {
                          try {
                            field?.validateField
                              .validateSync(value)
                              ?.toString();
                          } catch (e: any) {
                            error = e.message;
                          }
                        }
                        return error;
                      }}
                    />
                  );
                })}
                {paymentType &&
                  checkOnPamentModeTemplate?.map((cashFields) => (
                    <Field
                      key={cashFields.name}
                      validate={(value) => {
                        let error;
                        if (cashFields.validateField) {
                          try {
                            cashFields.validateField
                              .validateSync(value)
                              ?.toString();
                          } catch (e: any) {
                            error = e.message;
                          }
                        }
                        return error;
                      }}
                      {...cashFields}
                    />
                  ))}
              </SimpleGrid>

              <HStack
                position={"sticky"}
                bottom={"0"}
                justifyContent={"end"}
                w={"full"}
                p={"4"}
                zIndex={"modal"}
                className="border-t border-gray-300 backdrop-blur-sm"
              >
                {!challan_id ? (
                  <>
                    <HStack>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="fee-mutation" mb="0">
                          Auto Fee Updation
                        </FormLabel>
                        <Switch
                          isChecked={isMutable}
                          onChange={(e) => {
                            setIsMustable(!isMutable);
                          }}
                          id="fee-mutation"
                        />
                      </FormControl>
                    </HStack>
                    <Button
                      size={"lg"}
                      isLoading={isSubmitting || isValidating}
                      onClick={() => {
                        if (isMutable) {
                          onOpen();
                        } else {
                          handleSubmit();
                        }
                      }}
                      isDisabled={
                        Object.keys(errors).length > 0 ||
                        isSubmitting ||
                        isValidating
                      }
                      colorScheme="purple"
                      leftIcon={<AiOutlineFileDone className="text-xl" />}
                    >
                      Generate Reciept
                    </Button>
                  </>
                ) : (
                  <HStack width={"100%"} justifyContent={"space-between"}>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        size={"lg"}
                        variant={"outline"}
                        icon={<AiOutlineMore className="text-2xl" />}
                        aria-label="More-icon"
                      />
                      <MenuList className="hover:no-underline ">
                        <MenuItem
                          onClick={() => {
                            window.open(
                              `${process.env.NEXT_PUBLIC_ADMIN_URL}feedownloadreciept.php?challan_id=${challan_id}&acadyear=${acadYear}&college=${user?.college}`
                            );
                          }}
                        >
                          <MenuIcon className="mr-2">
                            <AiOutlineFileText className="text-lg" />
                          </MenuIcon>
                          Download Reciept
                        </MenuItem>
                        <MenuItem color={"darkred"}>
                          <MenuIcon className="mr-2">
                            <AiOutlineDelete className="text-lg" />
                          </MenuIcon>
                          Delete Challan
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    <Button
                      size={"lg"}
                      isLoading={isSubmitting || isValidating}
                      onClick={() => {
                        const isLinked = data[0].linked;
                        if (isLinked) {
                          onLinkedOpen();
                        } else {
                          handleSubmit();
                        }
                      }}
                      isDisabled={
                        Object.keys(errors).length > 0 ||
                        isSubmitting ||
                        isValidating
                      }
                      colorScheme="purple"
                      rightIcon={<AiOutlineCheck className="text-xl" />}
                    >
                      Save
                    </Button>
                  </HStack>
                )}
              </HStack>
              <Modal onClose={onClose} isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>📢 Are you sure?</ModalHeader>
                  <ModalBody>
                    {`Generating the receipt will permanently alter the student's
                    total fee. Confirm only after reviewing the details
                    carefully.`}
                  </ModalBody>
                  <ModalFooter gap={3}>
                    <Button onClick={onClose} variant={"ghost"}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="facebook"
                      onClick={() => {
                        handleSubmit();
                        onClose();
                      }}
                    >
                      Yes, Generate
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Modal onClose={onLinkedClose} isOpen={isLinkedOpen}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>📢 Are you sure?</ModalHeader>
                  <ModalBody>
                    {`Updating the receipt will unlink the challan from student transactions, it may lead you to again link the challan to respective student.`}
                  </ModalBody>
                  <ModalFooter gap={3}>
                    <Button onClick={onLinkedClose} variant={"ghost"}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="facebook"
                      onClick={() => {
                        handleSubmit();
                        onLinkedClose();
                      }}
                    >
                      Save Changes
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </React.Fragment>
          );
        }}
      </Formik>
    </VStack>
  );
}
