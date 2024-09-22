import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import DashboardCard from "../components/DashboardCard";
import { BASE_URL } from "../appconfig";
import { BarChart } from "../components/BarChart";
import { CategoryScale } from "chart.js";


export default function Dashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [sectionCount, setSectionCount] = useState(0);
  const [feesDues, setFeesDues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPayments, setTotalPayments] = useState(0);
  Chart.register(CategoryScale);

  // Example data structure for chartData
  const chartData = {
    labels: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"],
    datasets: [
      {
        label: "Fees Dues",
        data: [2000, 2500, 1800, 3000, 2200], // Example fees dues for each class
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)"
        ]
      }
    ]
  };




  useEffect(() => {
    // Fetch student count
    fetch(`${BASE_URL}api/student/getStudents`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch student data");
        }
        return res.json();
      })
      .then((result) => {
        setStudentCount(result.length);
      })
      .catch((err) => {
        setError(err.message);
      });

    // Fetch class data
    fetch(`${BASE_URL}api/class/getAll`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch class data");
        }
        return res.json();
      })
      .then((result) => {
        setClassCount(result.length);
        // Calculate total section count
        let totalSections = 0;
        result.forEach((cls) => {
          totalSections += cls.sections.length;
        });
        setSectionCount(totalSections);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
    // Fetch total number of payments
 


    // Fetch fees dues data
    // fetch(`${BASE_URL}api/fees/dues`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": localStorage.getItem("token")
    //   },
    // })
    // .then((res) => {
    //   if (!res.ok) {
    //     throw new Error("Failed to fetch fees dues data");
    //   }
    //   return res.json();
    // })
    // .then((result) => {
    //   setFeesDues(result);
    //   setIsLoading(false);
    // })
    // .catch((err) => {
    //   setError(err.message);
    //   setIsLoading(false);
    // });

  }, []);

  // Prepare data for fees dues chart
  // const feesDuesData = {
  //   labels: feesDues.map((dues) => dues.studentName),
  //   datasets: [
  //     {
  //       label: "Fees Dues",
  //       backgroundColor: "rgba(255, 99, 132, 0.6)",
  //       borderColor: "rgba(255, 99, 132, 1)",
  //       borderWidth: 1,
  //       hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
  //       hoverBorderColor: "rgba(255, 99, 132, 1)",
  //       data: sampleFeesDues.map((dues) => dues.amountDue)
  //     }
  //   ]
  // };

  return (
    <div className="dashboard">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="cards">
          <DashboardCard
            takeme="/studentDeepDetails/all/all"
            count={studentCount}
            heading="Students"
            subHeading="Total Students"
          />
          <DashboardCard
            heading="Classes"
            count={classCount}
            subHeading="Total Classes"
          />
          <DashboardCard
            heading="Sections"
            count={sectionCount}
            subHeading="Total Sections"
          />
          <DashboardCard
            heading="Payments"
            count={totalPayments}
            subHeading="Total Payments"
          />

          {/* Fees Dues Chart */}
          <div className="chart">

            {chartData && <BarChart chartData={chartData} />}

          </div>

        </div>
      )}
    </div>
  );
}
