export const BANKS = (college: string | undefined) => {
  if (college == "KSPU")
    return [
      {
        option: "ICICI",
        value: "ICICI",
      },
      {
        option: "UNION",
        value: "UNION",
      },
    ];
  else if (college == "KSPT")
    return [
      {
        option: "UNION",
        value: "UNION",
      },
      {
        option: "AXIS",
        value: "AXIS",
      },
      {
        option: "OFFICE",
        value: "OFFICE",
      },
    ];
  else if (college == "KSSA")
    return [
      {
        option: "AXIS",
        value: "AXIS",
      },
    ];
  else if (college == "KSSEM")
    return [
      {
        option: "AXIS",
        value: "AXIS",
      },
    ];
  else if (college == "KSIT" || college == "KSSEM" || college == "KSSA")
    return [
      {
        option: "AXIS",
        value: "AXIS",
      },
      {
        option: "UNION",
        value: "UNION",
      },
    ];
  else
    return [
      {
        option: "UNION",
        value: "UNION",
      },
      {
        option: "AXIS",
        value: "AXIS",
      },
      {
        option: "ICICI",
        value: "ICICI",
      },
      {
        option: "OFFICE",
        value: "OFFICE",
      },
    ];
};

export const CATS = (college: string | undefined) => {
  if (college == "KSSA")
    return [
      {
        value: "2AG", option: "2AG"
      },
      {
        value: "2BG", option: "2BG"
      },
      {
        value: "3AG", option: "3AG"
      },
      {
        value: "3AGR", option: "3AGR"
      },
      {
        value: "3BG", option: "3BG"
      },
      {
        value: "SCG", option: "SCG"
      },
      {
        value: "SCGR", option: "SCGR"
      },
      {
        value: "GMH", option: "GMH"
      }
    ]
  else return [
    {
      value: "CET",
      option: "CET",
    },
    {
      value: "SNQ",
      option: "SNQ",
    },
    {
      value: "MANAGEMENT",
      option: "MANAGEMENT",
    },
    {
      value: "COMEDK",
      option: "COMEDK",
    },
    {
      value: "GM",
      option: "GM",
    },
    {
      value: "SC",
      option: "SC",
    },
    {
      value: "ST",
      option: "ST",
    },
    {
      value: "CAT-I",
      option: "CAT-I",
    },
    {
      value: "DIP-LE",
      option: "DIP-LE",
    },
    {
      value: "DCET",
      option: "DCET",
    },
    {
      value: "OTHERS",
      option: "OTHERS",
    },
  ];
}

export const PAYMENTMODES = (college: string | undefined) => {
  if (college == "KSSEM")
    return [
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
      {
        option: "DD",
        value: "DD",
      },
      {
        option: "UPI SCAN",
        value: "UPI SCAN",
      },
    ]
  else
    return [
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
      {
        option: "DD",
        value: "DD",
      },
    ]
}


export const SEMS = (college: string | undefined) => {
  if (college == "KSPU")
    return [
      { option: "New Admission", value: "NEW_ADMISSION" },
      ...new Array(2)
        .fill(0)
        .map((_value, index) => ({
          value: (index + 1).toString(),
          option: (index + 1).toString(),
        })),
    ]
  else if (college == "KSSA")
    return [
      { option: "New Admission", value: "NEW_ADMISSION" },
      ...new Array(10)
        .fill(0)
        .map((_value, index) => ({
          value: (index + 1).toString(),
          option: (index + 1).toString(),
        })),
    ]
  else
    return [
      { option: "New Admission", value: "NEW_ADMISSION" },
      ...new Array(8)
        .fill(0)
        .map((_value, index) => ({
          value: (index + 1).toString(),
          option: (index + 1).toString(),
        })),
    ]
}