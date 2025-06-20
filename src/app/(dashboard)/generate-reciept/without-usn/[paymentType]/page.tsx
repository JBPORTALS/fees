"use client";
import {
  Button,
  HStack,
  IconButton,
  InputGroup,
  SimpleGrid,
  Switch,
  Input,
  VStack,
  useDisclosure,
  Tag,
  Field as ChakraField,
} from "@chakra-ui/react";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { useAppSelector } from "@/store";
import { Field } from "@/components/ui/Field";
import moment from "moment";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { useState } from "react";
import { useUser } from "@/utils/auth";
import { toaster } from "@/components/ui/toaster";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc-cleint";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";

const initialValues = {
  name: "", //✅
  branch: "", //✅
  sem: "", //✅
  year: "",
  category: "", //✅
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
  byApplicationId: false,
  appid: "",
};

const FormikContextProvider = () => {
  const { values, setFieldValue, handleReset } =
    useFormikContext<typeof initialValues>();
  const [appId, setAppId] = useState("");
  const [loading, setIsloading] = useState(false);
  const user = useUser();
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
      formData.append("acadYear", acadYear);
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
        setFieldValue("byApplicationId", true);
        setFieldValue("appid", appId);
      }
    } catch (e: any) {
      toaster.error({
        title: "Invalid Application ID",
        description: "Unable to find the Applicantion ID",
      });
    }
    setIsloading(false);
  }

  return (
    <React.Fragment>
      <InputGroup
        endElement={
          <IconButton
            {...{ loading }}
            onClick={findStudent}
            aria-label="search"
            colorPalette="blue"
            variant={"ghost"}
          >
            {<AiOutlineSearch />}
          </IconButton>
        }
        startElement={
          values.byApplicationId && (
            <Tag.Root colorPalette="gray">
              <Tag.Label>By App. ID</Tag.Label>
              <Tag.CloseTrigger
                onClick={() => {
                  setFieldValue("byApplicationId", false);
                  handleReset();
                }}
              />
            </Tag.Root>
          )
        }
      >
        <Input
          w={"full"}
          pl={values.byApplicationId ? "32" : undefined}
          onChange={(e) => setAppId(e.target.value)}
          value={appId}
          onKeyDown={(e) => e.key == "Enter" && findStudent()}
          placeholder="Enter Application ID here to find the applicant..."
        />
      </InputGroup>
    </React.Fragment>
  );
};

export default function WithoutUSNDynamicPage() {
  const branchList = useAppSelector((state) => state.fees.branch_list.data) as {
    branch: string;
  }[];

  const user = useUser();
  const { open, onClose, onToggle, onOpen } = useDisclosure();
  const [isAutoAddEnabled, setIsAutoAddEnabled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const paymentType = params.paymentType;
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
  const {
    open: isDeleteConfirmOpen,
    onToggle: onDeleteConfirmClose,
    onOpen: onDeleteConfirmOpen,
  } = useDisclosure();
  const {
    open: isLinkedOpen,
    onToggle: onLinkedClose,
    onOpen: onLinkedOpen,
  } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    if (isAutoAddEnabled)
      toaster.info({
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
      name: "chaAcadYear",
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
      readOnly: true,
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
      name: "chaAcadYear",
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
      readOnly: true,
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
      name: "chaAcadYear",
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
      name: "chaAcadYear",
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

  async function generateReciept(state: typeof initialValues) {
    try {
      const filename =
        state.paymentMode == "ONLINE" && paymentType === "REGISTRATION_FEE"
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
          }&auto_add=${isAutoAddEnabled}&acadYear=${acadYear}`
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
        }&auto_add=${isAutoAddEnabled}&acadYear=${acadYear}`;
      link.setAttribute("download", "Fee Reciept Offline.pdf");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
    } catch (e: any) {
      toaster.error({
        title: e.response?.data?.msg,
      });
    }
  }

  async function updateReciept(state: typeof initialValues) {
    try {
      const formData = new FormData();
      formData.append("challan_no", challan_id!);
      formData.append("college", user?.college!);
      formData.append("name", state.name);
      formData.append("stu_category", state.category);
      formData.append("sem", state.sem);
      formData.append("year", state.year);
      formData.append("branch", state.branch);
      formData.append("bank", state.bank);
      formData.append("method", state.paymentMode);
      formData.append("type", paymentType as string);
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
      toaster.info({
        title: "Your changes has been saved",
      });
    } catch (e: any) {
      toaster.error({
        title: e.response?.data?.msg ?? e,
      });
    }
  }

  async function deleteReciept() {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("challan_id", challan_id!);
      formData.append("college", user?.college!);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_ADMIN_URL + `feedeletechallan.php`,
        formData
      );

      if (response.status == 402) return new Error(response.data.msg);
      toaster.info({ title: "Challan Deleted Successfully" });
      router.back();
    } catch (e: any) {
      toaster.error({
        title: e.response?.data?.msg ?? e,
      });
    }
    setIsDeleting(false);
  }

  return (
    <VStack gap={"0"} w={"full"} h={"fit-content"} position={"relative"}>
      <Formik
        {...{ initialValues }}
        onSubmit={async (state) => {
          if (challan_id) {
            await updateReciept(state);
          } else {
            await generateReciept(state);
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
                px={"4"}
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
              {/* <pre>{JSON.stringify(errors, undefined, 3)}</pre> */}

              {!challan_id ? (
                <HStack
                  position={"sticky"}
                  bottom={"0"}
                  justifyContent={"end"}
                  w={"full"}
                  p={"4"}
                  borderTopWidth={"thin"}
                  backdropFilter={"blur(5px)"}
                >
                  <HStack px={"5"}>
                    <ChakraField.Root display="flex" alignItems="center">
                      <Switch.Root
                        id="fee-mutation"
                        onCheckedChange={({ checked }) =>
                          setIsAutoAddEnabled(checked)
                        }
                        checked={isAutoAddEnabled}
                      >
                        <Switch.Label>Auto Add Student</Switch.Label>
                        <Switch.HiddenInput />
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch.Root>
                    </ChakraField.Root>
                  </HStack>
                  <Button
                    size={"lg"}
                    loading={isSubmitting || isValidating}
                    onClick={() => {
                      if (isAutoAddEnabled) {
                        onOpen();
                      } else {
                        handleSubmit();
                      }
                    }}
                    disabled={
                      Object.keys(errors).length > 0 ||
                      isSubmitting ||
                      isValidating
                    }
                  >
                    <AiOutlineFileDone className="text-xl" />
                    Generate Reciept
                  </Button>
                </HStack>
              ) : (
                <HStack width={"100%"} justifyContent={"end"}>
                  <MenuRoot>
                    <MenuTrigger asChild>
                      <IconButton
                        size={"lg"}
                        variant={"surface"}
                        aria-label="More-icon"
                      >
                        <AiOutlineMore className="text-2xl" />
                      </IconButton>
                    </MenuTrigger>
                    <MenuContent className="hover:no-underline ">
                      <MenuItem
                        value="download-reciept"
                        onClick={() => {
                          window.open(
                            `${process.env.NEXT_PUBLIC_ADMIN_URL}feedownloadreciept.php?challan_id=${challan_id}&acadyear=${acadYear}&college=${user?.college}`
                          );
                        }}
                      >
                        <AiOutlineFileText className="text-lg" />
                        Download Reciept
                      </MenuItem>
                      <MenuItem
                        value="delete-challen"
                        color={"darkred"}
                        onClick={onDeleteConfirmOpen}
                      >
                        <AiOutlineDelete className="text-lg" />
                        Delete Challan
                      </MenuItem>
                    </MenuContent>
                  </MenuRoot>
                  <Button
                    size={"lg"}
                    loading={isSubmitting || isValidating}
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={
                      Object.keys(errors).length > 0 ||
                      isSubmitting ||
                      isValidating
                    }
                  >
                    Save <AiOutlineCheck className="text-xl" />
                  </Button>
                </HStack>
              )}

              {/* Delete confirmation */}
              <DialogRoot
                onOpenChange={onDeleteConfirmClose}
                open={isDeleteConfirmOpen}
              >
                <DialogContent>
                  <DialogHeader fontSize={"medium"}>
                    📢 Are you sure, you want to delete this challan?
                  </DialogHeader>
                  <DialogBody>{`This is irreversable action, you can't undo this action at anytime.`}</DialogBody>
                  <DialogFooter gap={3}>
                    <Button onClick={onDeleteConfirmClose} variant={"ghost"}>
                      Cancel
                    </Button>
                    <Button
                      loading={isDeleting}
                      colorPalette="red"
                      onClick={() => {
                        deleteReciept();
                        onDeleteConfirmClose();
                      }}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </DialogRoot>

              <DialogRoot onOpenChange={onToggle} open={open}>
                <DialogContent>
                  <DialogHeader>📢 Are you sure?</DialogHeader>
                  <DialogBody>
                    {`Generating the receipt will create new student record.`}
                  </DialogBody>
                  <DialogFooter gap={3}>
                    <Button variant={"ghost"}>Cancel</Button>
                    <Button
                      colorPalette="facebook"
                      onClick={() => {
                        handleSubmit();
                        onClose();
                      }}
                    >
                      Yes, Generate
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </DialogRoot>
            </React.Fragment>
          );
        }}
      </Formik>
    </VStack>
  );
}
