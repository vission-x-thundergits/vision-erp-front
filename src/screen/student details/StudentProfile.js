import React from "react";
import "../../Css/StudentProfile.css";
import { Tab, TabPanel } from "../../components/TabComponent";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams hook
import { BASE_URL } from "../../appconfig";
import { useState, useEffect } from "react";
import Checkout from "../../components/checkout";

export default function StudentProfile() {
  const { studentId } = useParams(); // Retrieve studentId parameter from URL
  const navigate = useNavigate();
  const [feeDetails, setFeeDetails] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [selectedFees, setSelectedFees] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);


  const Status = {
    PAID: 'Paid',
    PARTIALLY_PAID: 'Partially Paid',
    UNPAID: 'Unpaid'
  };

  function calculateFeeTypeStatus(feeType, payments) {
    const totalAmountPaid = payments.reduce((total, payment) => {
      if (payment.feeType === feeType) {
        return total + payment.amount;
      }
      return total;
    }, 0);

    // Compare total paid amount with fee amount
    if (totalAmountPaid === feeType.amount) {
      return Status.PAID;
    } else if (totalAmountPaid > 0 && totalAmountPaid < feeType.amount) {
      return Status.PARTIALLY_PAID;
    } else {
      return Status.UNPAID;
    }
  }
  function calculateFeeStatus(studentFeeProfile) {
    const feeTypes = studentFeeProfile.feeStructures;
    const payments = studentFeeProfile.payments;

    const feeStatus = {};

    feeTypes.forEach(feeType => {
      feeStatus[feeType.name] = calculateFeeTypeStatus(feeType, payments);
    });

    return feeStatus;
  }

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}api/student/getStudent/${studentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          fetchFeeDetails()
          setStudentData(data);
          console.log(data); // Log student profile data

        } else {
          console.error("Error fetching student profile:", response.status);
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      }
    };
    const fetchFeeDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}api/student/feeProfile/${studentId}`, // Update URL with the correct endpoint
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },

          }
        );
        if (response.ok) {
          const data = await response.json();
          setFeeDetails(data);
          console.log("Fee details:", data);
        } else {
          console.error("Error fetching fee details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching fee details:", error);
      }
    };
    fetchStudentProfile();
  }, [studentId]);



  // Function to handle selecting/deselecting fees
  const handleFeeSelection = (feeGroup) => {
    if (!isSelected(feeGroup)) {
      setSelectedFees([...selectedFees, feeGroup]);
    } else {
      setSelectedFees(selectedFees.filter((fee) => fee !== feeGroup));
    }
  };

  // Function to check if a fee group is selected
  const isSelected = (feeGroup) => {
    return selectedFees.some((fee) => fee._id === feeGroup._id);
  };

  const setStatusForFeeGroups = (feeType, dueDat, payments) => {


    // Find if there's a payment entry for this fee type
    const paymentForFeeType = payments.find((payment) => {
      return payment.feePaid.some((feePaid) => feePaid.feeType === feeType);
    });
    // If payment found, check due status based on due date
    if (!paymentForFeeType) {
      const currentDate = new Date();
      const dueDate = new Date(dueDat);

      if (currentDate > dueDate) {
        return <span className="overdue">OverDue</span>;
      } else {
        return <span className="due">Due</span>;
      }
    } else {
      return <span className="paid">Paid</span>;
    }


  };



  // Function to format date to dd-mm-yyyy format
  const formatDate = (dateString) => {
    // Create a new Date object from the dateString
    const date = new Date(dateString);
    // Extract day, month, and year components
    const day = date.getDate();
    // Add leading zero if day is less than 10
    const formattedDay = day < 10 ? `0${day}` : day;
    const month = date.getMonth() + 1; // Month is zero-based
    // Add leading zero if month is less than 10
    const formattedMonth = month < 10 ? `0${month}` : month;
    const year = date.getFullYear();
    // Return formatted date string in dd-mm-yyyy format
    return `${formattedDay}-${formattedMonth}-${year}`;
  };

  // Function to handle master checkbox in header
  const handleMasterCheckboxChange = (event) => {
    if (event.target.checked) {
      // If master checkbox is checked, select all fees
      const allFeeIds = feeDetails.feeStructures.reduce((acc, feeStructure) => {
        return [
          ...acc,
          ...feeStructure.feeGroups.map((feeGroup) => feeGroup._id),
        ];
      }, []);
      setSelectedFees(allFeeIds);
    } else {
      // If master checkbox is unchecked, deselect all fees
      setSelectedFees([]);
    }
  };

  async function handlePaySelected() {
    // You can handle the logic to show the checkout modal here
    setShowCheckoutModal(true);
  }


  // Render loading message while fetching data
  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="studentprofileContainer">
      <div className="studentprofile">
        <div className="student-profile py-4">
          <div className="student">
            <div className="row">
              <img src={studentData.student_Photo} alt="Student" />
              <h3>
                {studentData.first_Name} {studentData.last_Name}
              </h3>
            </div>

            <div className="info">
              {/* Render student ID */}
              <p className="info-1">
                <strong className="pr-1">Student ID:</strong>
                {studentData.admission_Number}
              </p>
              {/* Render student class and section */}
              <p className="info-2">
                <strong className="pr-1">Class:</strong>
                {studentData.class_Id.name}
              </p>
              <p className="info-3">
                <strong className="pr-1">Section:</strong>
                {studentData.section}
              </p>
              {/* Render student email */}
              <p className="info-4">
                <strong className="pr-1">Father's Name</strong>
                {studentData.father_Name}
              </p>
              {/* Render student email */}
              {/* <p className="info-4">
                <strong className="pr-1">Email</strong>
                {studentData.email}
              </p> */}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Tab>
          <TabPanel label="Profile">
            <div className="panel-1">
              <div className="student-data">
                <h2>Student Information</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Admission Date</th>
                      <th>Aadhaar Number</th>
                      <th>Date of Birth</th>
                      <th>Category</th>
                      <th>Mobile Number</th>
                      <th>Religion</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {studentData.first_Name} {studentData.last_Name}
                      </td>
                      <td>{formatDate(studentData.date_Of_Admission)}</td>
                      <td>{studentData.aadhar_number}</td>
                      <td>{formatDate(studentData.date_Of_Birth)}</td>
                      <td>{studentData.category}</td>
                      <td>{studentData.contact_Number}</td>
                      <td>{studentData.religion}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="student-data">
                <h2>Address</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Current Address</th>
                      <th>Permanent Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{studentData.address_For_Correspondence}</td>
                      <td>{studentData.permanent_Address}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="student-data">
                <h2>Parents Detail</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Father's Name</th>
                      <th>Father Phone</th>
                      <th>Father Occupation</th>
                      <th>Mother Name</th>
                      <th>Mother Occupation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{studentData.father_Name}</td>
                      <td>{studentData.contact_Number}</td>
                      <td>{studentData.father_Occupation}</td>
                      <td>{studentData.mother_Name}</td>
                      <td>{studentData.mother_Occupation}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabPanel>
          <TabPanel label="Fee Details">
            <div className="panel">
              <button style={{ float: "right" }} onClick={handlePaySelected}>Pay Selected</button>
              <div className="fee-details">
                <h2>Fees Details</h2>
                {feeDetails && feeDetails.feeStructures.map((feeStructure) => (
                  <div key={feeStructure._id}>

                    <table>
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              onChange={handleMasterCheckboxChange}
                            />
                          </th>

                          <th>Fees Structure</th>
                          <th>Fees Type</th>
                          <th>Due Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Discount</th>
                          <th>Fine</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {feeStructure.feeGroups.map((feeGroup) => (
                          <tr key={feeGroup._id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={isSelected(feeGroup)}
                                onChange={() => handleFeeSelection(feeGroup)}
                              />

                            </td>
                            <td>{feeStructure.name}</td>
                            <td>{feeGroup.feeType}</td>
                            <td>{formatDate(feeGroup.dueDate)}</td>
                            <td>{feeGroup.amount}</td>
                            <td>{setStatusForFeeGroups(feeGroup.feeType, feeGroup.dueDate, feeDetails.payments)}</td>
                            <td>0</td>
                            <td>0</td>
                            


                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </Tab>

        {showCheckoutModal && (
          <Checkout
            studentName={studentData.first_Name + " " + studentData.last_Name}
            studentID={studentData._id}
            grade={studentData.class_Id.name}
            section={studentData.section}
            contactInfo={studentData.email}
            roll_Number={studentData.roll_Number}
            paymentMethod="Online" // You can change this
            billingContact={studentData.contact_Number}
            feesData={selectedFees} // Pass the selectedFees array directly
            closeModal={setShowCheckoutModal}
          />
        )}

      </div>
    </div>
  );
}
