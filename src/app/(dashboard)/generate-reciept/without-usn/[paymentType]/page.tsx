"use client";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Switch,
  Input,
  VStack,
  useDisclosure,
  useToast,
  InputLeftElement,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { useAppSelector } from "@/store";
import { Field } from "@/components/ui/Field";
import moment from "moment";
import { useParams } from "next/navigation";
import { AiOutlineFileDone, AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import {
  ACADYEARS,
  BANKS,
  CATS,
  PAYMENTMODES,
  SEMS,
} from "@/components/mock-data/constants";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

const initialValues = {
  name: "", //✅
  branch: "", //✅
  sem: "", //✅
  category: "", //✅
  acadYear: "", //✅
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
  byApplicationId: false,
};

const FormikContextProvider = () => {
  const { values, setFieldValue, handleReset } =
    useFormikContext<typeof initialValues>();
  const [appId, setAppId] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const user = useAppSelector((state) => state.fees.user);
  const toast = useToast();
  const acadYear = useAppSelector((state) => state.fees.acadYear);

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

  useEffect(() => {
    if (appId.length == 0) {
      setFieldValue("byApplicationId", false);
      handleReset();
    }
  }, [appId]);

  async function findStudent() {
    setIsloading(true);
    try {
      const formData = new FormData();
      formData.append("appid", appId);
      formData.append("college", user?.college!);
      formData.append("acadyear", acadYear);
      const res = await axios(
        process.env.NEXT_PUBLIC_ADMIN_URL +
          "retrievestudentdetailsusingappid.php",
        {
          method: "POST",
          data: formData,
        }
      );

      if (res.status !== 402) {
        setFieldValue("name", res.data[0]?.name);
        setFieldValue("sem", res.data[0]?.sem);
        setFieldValue("year", res.data[0]?.year);
        setFieldValue("branch", res.data[0]?.branch);
        setFieldValue("category", res.data[0]?.category);
        setFieldValue("total_fee", res.data[0]?.total_fee);
        setFieldValue("remaining_fee", res.data[0]?.remaining_fee);
        setFieldValue("byApplicationId", true);
      }
    } catch (e: any) {
      toast({
        status: "error",
        title: "Invalid Application ID",
        description: "Unable to find the Applicantion ID",
      });
    }
    setIsloading(false);
  }

  return (
    <React.Fragment>
      <InputGroup>
        {values.byApplicationId && (
          <InputLeftElement px={"2"} w={"fit-content"}>
            <Tag colorScheme="gray">
              <TagLabel>By App. ID</TagLabel>
              <TagCloseButton
                onClick={() => {
                  setFieldValue("byApplicationId", false);
                  handleReset();
                }}
              />
            </Tag>
          </InputLeftElement>
        )}
        <Input
          w={"full"}
          pl={values.byApplicationId ? "32" : undefined}
          colorScheme="whiteAlpha"
          bg={"white"}
          onChange={(e) => setAppId(e.target.value)}
          value={appId}
          onKeyDown={(e) => e.key == "Enter" && findStudent()}
          placeholder="Enter Application ID here to find the applicant..."
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

export default function WithoutUSNDynamicPage() {
  const branchList = useAppSelector((state) => state.fees.branch_list.data) as {
    branch: string;
  }[];

  const toast = useToast({
    position: "bottom-left",
  });

  const user = useAppSelector((state) => state.fees.user);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isAutoAddEnabled, setIsAutoAddEnabled] = useState(false);
  const params = useParams();
  const paymentType = params.paymentType;
  const acadYear = useAppSelector((state) => state.fees.acadYear);

  useEffect(() => {
    if (isAutoAddEnabled)
      toast({
        colorScheme: "blue",
        variant: "subtle",
        position: "top",
        icon: <FaInfoCircle />,
        description:
          "Notice: Automatic Add Student is enabled; student data will be updated in database upon challan generation.",
        title: "Automatic add student turned on",
      });
  }, [isAutoAddEnabled]);

  const feeTemplate = [
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
      name: "acadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: ACADYEARS(),
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

  const feeByApplicationIdTemplate = [
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
      name: "acadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: ACADYEARS(),
    },

    {
      name: "total_fee",
      label: "Total Fee Fixed",
      type: "text",
      isReadonly: true,
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .min(0, "minimum amount should be 0"),
    },
    {
      name: "remaining_fee",
      label: "Balance",
      type: "text",
      isReadonly: true,
      validateField: Yup.number()
        .typeError("invalid number")
        .required("Field required !")
        .min(0, "minimum amount should be 0"),
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

  const miscellaneousTemplate = [
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

  const busFeeTemplate = [
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
      name: "acadYear",
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

  const securityFeeTemplate = [
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
      name: "acadYear",
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

  const hostelFeeTemplate = [
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
      name: "acadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: ACADYEARS(),
    },
    {
      name: "hostelFee",
      label: "Total Amount",
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

  const registrationFeeTemplate = [
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
      name: "acadYear",
      label: "Academic Year",
      type: "select",
      placeholder: "Select Academic Year",
      validateField: Yup.string().required("Fill the field !"),
      options: ACADYEARS(),
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

  const chequeTemplate = [
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

  const cashTemplate = [
    {
      name: "date",
      label: "Payment Date",
      type: "date",
      validateField: Yup.date()
        .required("Fill the field!")
        .typeError("Not valid date"),
    },
  ];

  const onlineTemplate = [
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

  const ddTemplate = [
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

  return (
    <VStack spacing={"0"} w={"full"} h={"fit-content"} position={"relative"}>
      <Formik
        {...{ initialValues }}
        onSubmit={async (state) => {
          try {
            const filename =
              state.paymentMode == "ONLINE" &&
              paymentType === "REGISTRATION_FEE"
                ? "feegenerateonlineregistarionfee.php"
                : paymentType === "REGISTRATION_FEE"
                ? "feegenerateregistarionfee.php"
                : state.paymentMode == "ONLINE" &&
                  paymentType !== "MISCELLANEOUS" &&
                  user?.college !== "KSPT"
                ? "feegenerateonlinewithoutusn.php"
                : paymentType == "MISCELLANEOUS"
                ? "feegeneratemiscellaneouswithoutusn.php"
                : user?.college == "KSPT" || user?.college == "KSSA"
                ? "feekspreceipt.php"
                : "feegeneraterecieptwithoutusn.php";

            await axios.get(
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
                }&auto_add=${isAutoAddEnabled}`
            );
            const link = document.createElement("a");
            link.href =
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
              }&auto_add=${isAutoAddEnabled}`;
            link.setAttribute("download", "Fee Reciept Offline.pdf");
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
          } catch (e: any) {
            toast({
              title: e.response?.data?.msg,
              status: "error",
            });
          }
        }}
      >
        {({
          values: { paymentMode, byApplicationId },
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
            paymentType == "FEE" && !byApplicationId
              ? feeTemplate
              : paymentType == "FEE" && byApplicationId
              ? feeByApplicationIdTemplate
              : paymentType == "MISCELLANEOUS"
              ? miscellaneousTemplate
              : paymentType == "BUS_FEE"
              ? busFeeTemplate
              : paymentType == "SECURITY_DEPOSIT"
              ? securityFeeTemplate
              : paymentType == "HOSTEL_FEE"
              ? hostelFeeTemplate
              : paymentType == "REGISTRATION_FEE"
              ? registrationFeeTemplate
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
                      key={field.name}
                      validate={(value) => {
                        let error;
                        if (field.validateField) {
                          try {
                            field.validateField.validateSync(value)?.toString();
                          } catch (e: any) {
                            error = e.message;
                          }
                        }
                        return error;
                      }}
                      {...field}
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
                className="border-t border-gray-300 backdrop-blur-sm"
              >
                <HStack>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="fee-mutation" mb="0">
                      Auto Add Student
                    </FormLabel>
                    <Switch
                      id="fee-mutation"
                      isChecked={isAutoAddEnabled}
                      onChange={(e) => {
                        setIsAutoAddEnabled(!isAutoAddEnabled);
                      }}
                    />
                  </FormControl>
                </HStack>
                <Button
                  size={"lg"}
                  isLoading={isSubmitting || isValidating}
                  onClick={() => {
                    if (isAutoAddEnabled) {
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
              </HStack>
              <Modal onClose={onClose} isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>📢 Are you sure?</ModalHeader>
                  <ModalBody>
                    {`Generating the receipt will create new student record.`}
                  </ModalBody>
                  <ModalFooter gap={3}>
                    <Button variant={"ghost"}>Cancel</Button>
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
            </React.Fragment>
          );
        }}
      </Formik>
    </VStack>
  );
}
