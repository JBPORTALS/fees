import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RootState } from ".";
import { AuthSession } from "@supabase/supabase-js";
import { SC } from "@/utils/supabase";

export const fetchFeeDetails = createAsyncThunk<
  Fee[],
  {
    year: string;
    branch: string;
    college: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchFeeDetails",
  async (payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      formData.append("acadYear", acadyear);
      formData.append("branch", payload.branch);
      formData.append("year", payload.year);
      formData.append("college", payload.college);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feeclassview.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchBranchFeeDetails = createAsyncThunk<
  BranchFee[],
  { college: string },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchbranchview",
  async (_payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      formData.append("acadYear", acadyear);
      formData.append("college", _payload.college);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feebranchview.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchOverAllFee = createAsyncThunk<
  OverallFee[],
  {
    college: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchoverallfee",
  async (_payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      formData.append("acadYear", acadyear);
      formData.append("college", _payload.college);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feeoverall.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

interface SearchResultProps {
  sl_no: string;
  challan_id: string;
  usn: string;
  name: string;
  branch: string;
  sem: string;
  date: string;
  particulars: string;
  amount_paid1: string;
  college: string;
}

export const fetchSearchByMode = createAsyncThunk<
  SearchResultProps[],
  {
    branch: string;
    year: string;
    mode: string;
    fromDate: string;
    toDate: string;
    feeType: string;
    college: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchsearchresults",
  async (payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      formData.append("acadYear", acadyear);
      formData.append("branch", payload.branch);
      formData.append("year", payload.year);
      formData.append("mode", payload.mode);
      formData.append("fromdate", payload.fromDate);
      formData.append("todate", payload.toDate);
      formData.append("type", payload.feeType);
      formData.append("college", payload.college);

      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feefilter.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchSearchRecord = createAsyncThunk<
  any,
  {
    query: string;
    college: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchSearchBymode",
  async (payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      formData.append("acadYear", acadyear);
      formData.append("searchdata", payload.query);
      formData.append("college", payload.college);

      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feesearchsutdent.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchFeeYearView = createAsyncThunk<
  YearFee[],
  { branch: string; college: string },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchyearview",
  async (payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      formData.append("acadYear", acadyear);
      formData.append("branch", payload.branch);
      formData.append("college", payload.college);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feeyearview.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchSelectedFeeDeatails = createAsyncThunk<
  SelectedFee[],
  {
    regno: string;
    id: string;
    college: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchSelectedFeeDeatails",
  async (payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      formData.append("acadYear", acadyear);
      formData.append("regno", payload.regno);
      formData.append("id", payload.id);
      formData.append("college", payload.college);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feestudentview.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchSelectedFeeSearchDetails = createAsyncThunk<
  SelectedFee[],
  {
    regno: string;
    id: string;
    college: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchSelectedFeeSearchDeatails",
  async (payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      formData.append("acadYear", acadyear);
      formData.append("id", payload.id);
      formData.append("regno", payload.regno);
      formData.append("college", payload.college);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "studentview.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const updateFeeDetail = createAsyncThunk<
  { msg: string },
  {
    method: string;
    paid: string;
    challan_id: string;
    college: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/updateFeeDetail",
  async (
    payload,
    { fulfillWithValue, rejectWithValue, dispatch, getState }
  ) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      const selectedFee = state.fees.selected_fee.data;
      formData.append("acadYear", acadyear);
      formData.append("id", selectedFee[0].id);
      formData.append("regno", selectedFee[0].regno);
      formData.append("name", selectedFee[0].name);
      formData.append("method", payload.method);
      formData.append("paid", payload.paid);
      formData.append("challan_id", payload.challan_id);
      formData.append("college", payload.college);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feeupdate.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      dispatch(
        fetchSelectedFeeDeatails({
          regno: selectedFee[0].regno,
          id: selectedFee[0].id,
          college: payload.college,
        })
      );
      dispatch(
        fetchFeeDetails({
          branch: selectedFee[0].branch,
          year: selectedFee[0].year,
          college: payload.college,
        })
      );
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const updateUSN = createAsyncThunk<
  { msg: string },
  {
    challan_no: string;
    usn: string;
    college: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/updateUSN",
  async (payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      formData.append("acadYear", acadyear);
      formData.append("challan_no", payload.challan_no);
      formData.append("usn", payload.usn);
      formData.append("college", payload.college);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feeupdateusn.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchBranchList = createAsyncThunk<
  [],
  { college: string },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchBranchList",
  async (payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      formData.append("acadYear", acadyear);
      formData.append("college", payload.college);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "retrievebranches.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchYearList = createAsyncThunk<
  [],
  { college: string },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchYears",
  async (payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const acadyear = state.fees.acadYear;
      formData.append("acadYear", acadyear);
      formData.append("college", payload.college);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "retrieveyears.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchUser = createAsyncThunk<
  {
    email: string | undefined;
    last_login_at?: string;
    username?: string;
    session?: AuthSession | null;
    can_update_total?: boolean;
    college?: string;
  } | null,
  void,
  {
    rejectValue: {
      msg: string;
    };
  }
>("/fees/fetchUser", async (payload, { fulfillWithValue, rejectWithValue }) => {
  try {
    const { data } = await SC().auth.getSession();
    const { data: User } = await SC()
      .from("profiles")
      .select("username,last_login_at,can_update_total,college")
      .eq("id", data.session?.user.id)
      .single();
    return fulfillWithValue({
      session: data.session,
      ...User,
      email: data.session?.user.email,
    });
  } catch (error: any) {
    return rejectWithValue({ msg: error.response.data.msg });
  }
});

export interface BranchFee {
  branch: string;
  total_students: string;
  total: string;
  paid: string;
  remaining: string;
  total1: string;
  paid1: string;
  remaining1: string;
  paid_percentage: string;
  remaining_percentage: string;
  college: string;
}

export interface OverallFee extends Omit<BranchFee, "branch"> {}

export interface YearFee extends Omit<BranchFee, "branch"> {
  year: string;
}

export interface Fee {
  id: string;
  regno: string;
  name: string;
  branch: string;
  year: string;
  total: number;
  paid: number;
  remaining: number;
  status: "FULLY PAID" | "PARTIALLY PAID" | "NOT PAID";
  category: string;
  sem: string;
  college: string;
}

export interface PaymentHistory {
  paymentno: string;
  date: string;
  method: string;
  amount_paid: string;
  challan_id: string;
}

export interface SelectedFee extends Fee {
  payment_history: PaymentHistory[];
}

interface FeesIntialState {
  acadYear: string;
  year_list: [];
  all_fee: {
    data: Fee[];
    pending: boolean;
    error: string | null;
  };
  selected_fee: {
    data: SelectedFee[];
    pending: boolean;
    error: string | null;
  };
  branch_fee: {
    data: BranchFee[];
    pending: boolean;
    error: null | string;
  };
  year_fee: {
    data: YearFee[];
    pending: boolean;
    error: null | string;
  };
  overall_fee: {
    data: OverallFee[];
    pending: boolean;
    error: null | string;
  };
  branch_list: {
    data: [];
    pending: boolean;
    error: null | string;
  };
  update_usn: {
    pending: boolean;
    error: null | string;
  };
  search_by_mode: {
    data: SearchResultProps[];
    error: null | string;
    pending: boolean;
  };
  user: {
    email: string | undefined;
    last_login_at?: string;
    username?: string;
    session?: AuthSession | null;
    can_update_total?: boolean;
    college?: string;
  } | null;
}

const initialState: FeesIntialState = {
  acadYear: "2023",
  year_list: [],
  all_fee: {
    data: [],
    error: null,
    pending: false,
  },
  selected_fee: {
    data: [],
    error: null,
    pending: false,
  },
  branch_fee: {
    data: [],
    error: null,
    pending: false,
  },
  year_fee: {
    data: [],
    error: null,
    pending: false,
  },
  overall_fee: {
    data: [],
    error: null,
    pending: false,
  },
  branch_list: {
    data: [],
    error: null,
    pending: false,
  },
  update_usn: {
    error: null,
    pending: false,
  },
  search_by_mode: {
    data: [],
    error: null,
    pending: false,
  },
  user: null,
};

export const FeesSlice = createSlice({
  name: "fees",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUser.pending, (state, _action) => {
        state.user = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      }),
      builder
        .addCase(fetchFeeDetails.pending, (state, _action) => {
          state.all_fee.pending = true;
        })
        .addCase(fetchFeeDetails.fulfilled, (state, action) => {
          state.all_fee.pending = false;
          state.all_fee.data = action.payload;
        })
        .addCase(fetchFeeDetails.rejected, (state, action) => {
          state.all_fee.pending = false;
          state.all_fee.error = action.payload?.msg ?? null;
          toast.error(action.payload?.msg ?? "");
        }),
      builder
        .addCase(fetchSearchRecord.pending, (state, _action) => {
          state.search_by_mode.pending = true;
        })
        .addCase(fetchSearchRecord.fulfilled, (state, action) => {
          state.search_by_mode.pending = false;
          state.all_fee.data = [];
          state.search_by_mode.data = action.payload;
        })
        .addCase(fetchSearchRecord.rejected, (state, action) => {
          state.search_by_mode.pending = false;
          state.search_by_mode.error = action.payload?.msg ?? null;
          toast.error(action.payload?.msg ?? "");
        }),
      builder
        .addCase(fetchSelectedFeeDeatails.pending, (state, action) => {
          state.selected_fee.pending = true;
        })
        .addCase(fetchSelectedFeeDeatails.fulfilled, (state, action) => {
          state.selected_fee.pending = false;
          state.selected_fee.data = action.payload;
        })
        .addCase(fetchSelectedFeeDeatails.rejected, (state, action) => {
          state.selected_fee.pending = false;
          state.selected_fee.error = action.payload?.msg ?? null;
          toast.error(action.payload?.msg ?? "");
        }),
      builder
        .addCase(fetchSelectedFeeSearchDetails.pending, (state, action) => {
          state.selected_fee.pending = true;
        })
        .addCase(fetchSelectedFeeSearchDetails.fulfilled, (state, action) => {
          state.selected_fee.pending = false;
          state.selected_fee.data = action.payload;
        })
        .addCase(fetchSelectedFeeSearchDetails.rejected, (state, action) => {
          state.selected_fee.pending = false;
          state.selected_fee.error = action.payload?.msg ?? null;
        }),
      builder
        .addCase(updateFeeDetail.pending, (state, _action) => {
          state.selected_fee.error = null;
          state.selected_fee.pending = true;
        })
        .addCase(updateFeeDetail.fulfilled, (state, action) => {
          state.selected_fee.pending = false;
          toast.success(action.payload?.msg);
        })
        .addCase(updateFeeDetail.rejected, (state, action) => {
          state.selected_fee.pending = false;
          state.selected_fee.error = action.payload?.msg ?? null;
          toast.error(action.payload?.msg ?? "");
        }),
      builder
        .addCase(updateUSN.pending, (state, _action) => {
          state.update_usn.pending = true;
        })
        .addCase(updateUSN.fulfilled, (state, action) => {
          state.update_usn.pending = false;
          toast.success(action.payload?.msg);
        })
        .addCase(updateUSN.rejected, (state, action) => {
          state.update_usn.pending = false;
          toast.error(action.payload?.msg ?? "");
        }),
      builder
        .addCase(fetchBranchFeeDetails.pending, (state, _action) => {
          state.branch_fee.pending = true;
        })
        .addCase(fetchBranchFeeDetails.fulfilled, (state, action) => {
          state.branch_fee.pending = false;
          state.branch_fee.data = action.payload;
        })
        .addCase(fetchBranchFeeDetails.rejected, (state, action) => {
          state.branch_fee.pending = false;
          state.branch_fee.error = action.payload?.msg ?? null;
          toast.error(action.payload?.msg ?? "");
        }),
      builder
        .addCase(fetchOverAllFee.pending, (state, _action) => {
          state.overall_fee.pending = true;
        })
        .addCase(fetchOverAllFee.fulfilled, (state, action) => {
          state.overall_fee.pending = false;
          state.overall_fee.data = action.payload;
        })
        .addCase(fetchOverAllFee.rejected, (state, action) => {
          state.overall_fee.pending = false;
          state.overall_fee.error = action.payload?.msg ?? null;
          toast.error(action.payload?.msg ?? "");
        }),
      builder
        .addCase(fetchFeeYearView.pending, (state, _action) => {
          state.year_fee.pending = true;
        })
        .addCase(fetchFeeYearView.fulfilled, (state, action) => {
          state.year_fee.pending = false;
          state.year_fee.data = action.payload;
        })
        .addCase(fetchFeeYearView.rejected, (state, action) => {
          state.year_fee.pending = false;
          state.year_fee.error = action.payload?.msg ?? "";
          toast.error(action.payload?.msg ?? "");
        });

    builder
      .addCase(fetchBranchList.pending, (state, action) => {
        state.branch_list.pending = true;
      })
      .addCase(fetchBranchList.fulfilled, (state, action) => {
        state.branch_list.pending = false;
        state.branch_list.data = action.payload;
      })
      .addCase(fetchBranchList.rejected, (state, action) => {
        state.branch_list.pending = false;
        state.branch_list.error = action.payload?.msg ?? null;
      });

    builder
      .addCase(fetchYearList.pending, (state, action) => {
        state.year_list = [];
      })
      .addCase(fetchYearList.fulfilled, (state, action) => {
        state.year_list = action.payload;
      })
      .addCase(fetchYearList.rejected, (state, action) => {
        state.year_list = [];
      });

    builder
      .addCase(fetchSearchByMode.pending, (state, action) => {
        state.search_by_mode.pending = true;
      })
      .addCase(fetchSearchByMode.fulfilled, (state, action) => {
        state.search_by_mode.pending = false;
        state.search_by_mode.data = action.payload;
      })
      .addCase(fetchSearchByMode.rejected, (state, action) => {
        state.search_by_mode.data = [];
        state.search_by_mode.pending = false;
        state.search_by_mode.error = action.payload?.msg ?? null;
      });
  },
});
