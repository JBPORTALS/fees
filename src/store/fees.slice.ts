import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RootState } from ".";

export const fetchFeeDetails = createAsyncThunk<
  Fee[],
  {
    year: string;
    branch: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchFeeDetails",
  async (payload, { fulfillWithValue, rejectWithValue, dispatch }) => {
    var data;
    try {
      const formData = new FormData();
      formData.append("branch", payload.branch);
      formData.append("year", payload.year);
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
  void,
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchbranchview",
  async (_payload, { fulfillWithValue, rejectWithValue, dispatch }) => {
    var data;
    try {
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feebranchview.php",
        method: "POST",
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
  void,
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchoverallfee",
  async (_payload, { fulfillWithValue, rejectWithValue, dispatch }) => {
    var data;
    try {
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feeoverall.php",
        method: "POST",
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
  { branch: string },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchyearview",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    var data;
    try {
      const formData = new FormData();
      formData.append("branch", payload.branch);
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
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/fees/fetchSelectedFeeDeatails",
  async (payload, { fulfillWithValue, rejectWithValue, dispatch }) => {
    var data;
    try {
      const formData = new FormData();
      formData.append("regno", payload.regno);
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

export const updateFeeDetail = createAsyncThunk<
  { msg: string },
  {
    method: string;
    paid: string;
    challan_id:string;
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
      const selectedFee = state.fees.selected_fee.data;
      formData.append("regno", selectedFee[0].regno);
      formData.append("method", payload.method);
      formData.append("paid", payload.paid);
      formData.append("challan_id", payload.challan_id);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMIN_URL + "feeupdate.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      dispatch(fetchSelectedFeeDeatails({ regno: selectedFee[0].regno }));
      dispatch(
        fetchFeeDetails({
          branch: selectedFee[0].branch,
          year: selectedFee[0].year,
        })
      );
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

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
}

export interface OverallFee extends Omit<BranchFee, "branch"> {}

export interface YearFee extends Omit<BranchFee, "branch"> {
  year: string;
}

export interface Fee {
  regno: string;
  name: string;
  branch: string;
  year: string;
  total: number;
  paid: number;
  remaining: number;
  status: "FULLY PAID" | "PARTIALLY PAID" | "NOT PAID";
}

export interface PaymentHistory {
  paymentno: string;
  date: string;
  method: string;
  amount_paid: string;
  challan_id:string;
}

export interface SelectedFee extends Fee {
  payment_history: PaymentHistory[];
}

interface FeesIntialState {
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
    data: [];
    pending: boolean;
    error: null | string;
  };
  year_fee: {
    data: [];
    pending: boolean;
    error: null | string;
  };
  overall_fee: {
    data: [];
    pending: boolean;
    error: null | string;
  };
}

const initialState: FeesIntialState = {
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
};

export const FeesSlice = createSlice({
  name: "fees",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchFeeDetails.pending.toString()]: (state, action) => {
      state.all_fee.pending = true;
    },
    [fetchFeeDetails.fulfilled.toString()]: (state, action) => {
      state.all_fee.pending = false;
      state.all_fee.data = action.payload;
    },
    [fetchFeeDetails.rejected.toString()]: (state, action) => {
      state.all_fee.pending = false;
      state.all_fee.error = action.payload?.msg;
      toast.error(action.payload?.msg);
    },
    [fetchSelectedFeeDeatails.pending.toString()]: (state, action) => {
      state.selected_fee.pending = true;
    },
    [fetchSelectedFeeDeatails.fulfilled.toString()]: (state, action) => {
      state.selected_fee.pending = false;
      state.selected_fee.data = action.payload;
    },
    [fetchSelectedFeeDeatails.rejected.toString()]: (state, action) => {
      state.selected_fee.pending = false;
      state.selected_fee.error = action.payload?.msg;
      toast.error(action.payload?.msg);
    },
    [updateFeeDetail.pending.toString()]: (state, action) => {
      state.selected_fee.pending = true;
    },
    [updateFeeDetail.fulfilled.toString()]: (state, action) => {
      state.selected_fee.pending = false;
      toast.success(action.payload?.msg);
    },
    [updateFeeDetail.rejected.toString()]: (state, action) => {
      state.selected_fee.pending = false;
      state.selected_fee.error = action.payload?.msg;
      toast.error(action.payload?.msg);
    },
    [fetchBranchFeeDetails.pending.toString()]: (state, action) => {
      state.branch_fee.pending = true;
    },
    [fetchBranchFeeDetails.fulfilled.toString()]: (state, action) => {
      state.branch_fee.pending = false;
      state.branch_fee.data = action.payload;
    },
    [fetchBranchFeeDetails.rejected.toString()]: (state, action) => {
      state.branch_fee.pending = false;
      state.branch_fee.error = action.payload?.msg;
      toast.error(action.payload?.msg);
    },
    [fetchOverAllFee.pending.toString()]: (state, action) => {
      state.overall_fee.pending = true;
    },
    [fetchOverAllFee.fulfilled.toString()]: (state, action) => {
      state.overall_fee.pending = false;
      state.overall_fee.data = action.payload;
    },
    [fetchOverAllFee.rejected.toString()]: (state, action) => {
      state.overall_fee.pending = false;
      state.overall_fee.error = action.payload?.msg;
      toast.error(action.payload?.msg);
    },
    [fetchFeeYearView.pending.toString()]: (state, action) => {
      state.year_fee.pending = true;
    },
    [fetchFeeYearView.fulfilled.toString()]: (state, action) => {
      state.year_fee.pending = false;
      state.year_fee.data = action.payload;
    },
    [fetchFeeYearView.rejected.toString()]: (state, action) => {
      state.year_fee.pending = false;
      state.year_fee.error = action.payload?.msg;
      toast.error(action.payload?.msg);
    },
  },
});