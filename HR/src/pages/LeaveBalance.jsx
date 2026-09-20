import React, { useEffect } from "react";
import axios from "axios";

const LeaveBalance = () => {

  useEffect(() => {

    const runTest = async () => {

      console.log("========== START ==========");

      // 1. Get user
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      console.log("USER =", user);

      // 2. Get employee ID
      const employeeId = user?.employeeId;

      console.log(
        "EMPLOYEE ID =",
        employeeId
      );

      // 3. Get token
      const token =
        localStorage.getItem("token");

      console.log(
        "TOKEN =",
        token
      );

      console.log(
        "TOKEN EXISTS =",
        !!token
      );

      // 4. Check JWT
      if (token) {
        console.log(
          "JWT DOT COUNT =",
          token.split(".").length - 1
        );
      }

      // 5. Stop if employee ID missing
      if (!employeeId) {
        console.error(
          "❌ EMPLOYEE ID IS MISSING"
        );
        return;
      }

      // 6. Stop if token missing
      if (!token) {
        console.error(
          "❌ TOKEN IS MISSING"
        );
        return;
      }

      try {

        console.log(
          "========== SENDING REQUEST =========="
        );

        console.log(
          "URL = http://localhost:8080/api3/leaveBalance"
        );

        console.log(
          "PARAMS =",
          {
            employeeId: employeeId
          }
        );

        const response = await axios.get(
          "http://localhost:8080/api3/leaveBalance",
          {
            params: {
              employeeId: employeeId
            },

            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log(
          "========== SUCCESS =========="
        );

        console.log(
          "STATUS =",
          response.status
        );

        console.log(
          "DATA =",
          response.data
        );

      } catch (error) {

        console.log(
          "========== ERROR =========="
        );

        console.log(
          "ERROR =",
          error
        );

        console.log(
          "MESSAGE =",
          error.message
        );

        if (error.response) {

          console.log(
            "STATUS =",
            error.response.status
          );

          console.log(
            "DATA =",
            error.response.data
          );

          console.log(
            "HEADERS =",
            error.response.headers
          );
        }

      }

    };

    runTest();

  }, []);

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold">
        Leave Balance Test
      </h1>

      <p className="mt-4">
        Open browser console and check the result.
      </p>

    </div>
  );
};

export default LeaveBalance;