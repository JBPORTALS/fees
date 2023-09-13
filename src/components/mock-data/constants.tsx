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

export const CATS = [
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
