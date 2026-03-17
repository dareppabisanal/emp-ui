import { useState } from "react";
import { postRequest } from "../api/apiService.jsx";

export const useCreateDept = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const crudDept = async (data, url) => {
    try {
      setLoading(true);
      setError(null);

      const result = await postRequest(data, url);
      return result;
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong";
      setError(message);
      throw new Error(message);

    } finally {
      setLoading(false);
    }
  };

  return { crudDept, loading };
};