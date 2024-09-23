import React, { useState, useEffect } from "react";
import "../Css/AddClassForm.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../appconfig";

export default function AddClassForm() {
  const [className, setClassName] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [numSections, setNumSections] = useState("");
  const navigate = useNavigate();

  // Toast function
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  // Fetch class data from API on component mount
  useEffect(() => {
    fetchClasses()
  }, []);


  const fetchClasses = () => {
    fetch(`${BASE_URL}api/class/getAll`, {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem("token")
      }

    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
        notifyError("An error occurred while fetching classes.");
      });
  };

  const handleEditClick = (classData) => {
    setEditingClass(classData);
    setClassName(classData.className);
    setNumSections(classData.numSections);
  };

  const handleDeleteClick = (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      fetch(`${BASE_URL}classes/${classId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Class deleted successfully:", data);
          notifySuccess("Class deleted successfully.");
          fetchClasses(); // Fetch updated class data
        })
        .catch((error) => {
          console.error("Error deleting class:", error);
          notifyError("An error occurred while deleting the class.");
        });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!className || selectedSections.length === 0) {
      notifyError("Please fill in all fields.");
      return;
    }

    // Send data to server
    fetch("https://backend.vissionclasses.in/api/class/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      },
      body: JSON.stringify({
        name: className,
        sections: selectedSections,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle success
        console.log("Data posted successfully:", data);
        notifySuccess("Class added successfully.");
        // Reset the form
        fetchClasses(); // Fetch updated class data
        resetForm();
        // navigate("/admin/dashboard");
      })
      .catch((error) => {
        // Handle errors
        console.error("Error posting data:", error);
        notifyError("An error occurred while adding the class.");
      });
  };

  const handleCancelEdit = () => {
    setEditingClass(null);
    resetForm();
  };
  const resetForm = () => {
    setClassName("");
    setNumSections("");
  };
  const handleUpdateClass = () => {
    // Implement logic to update class
    // This could be similar to the handleSubmit logic but using PUT instead of POST
    // After updating, reset the form and set editingClass back to null
  };


  const handleCheckboxChange = (e) => {
    const section = e.target.value;
    if (e.target.checked) {
      setSelectedSections([...selectedSections, section]);
    } else {
      setSelectedSections(selectedSections.filter((s) => s !== section));
    }
  };

  return (
    <div className="class">
      <div className="add-form">
        <h1>Add Class</h1>
        <form id="addClassForm" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="className">Class Name</label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>

          <div className="form-control">

            <label >Select Sections</label>
            <div className="section-box">
              {["A", "B", "C", "D", "E", "F", "G"].map((section) => (
                <div key={section}>
                  <input
                    key={section}
                    type="checkbox"
                    id={`section-${section}`}
                    value={section}
                    checked={selectedSections.includes(section)}
                    onChange={handleCheckboxChange}
                  />
                  <label key={`section-${section}`} htmlFor={`section-${section}`}>{`${section}`}</label>
                </div>
              ))}
            </div>

          </div>
          <input type="submit" className="btn" value="Add Class" />
        </form>
      </div>
      <div className="classes-table">
        <h2>Class List</h2>
        {classes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Number of Sections</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classData) => (
                <tr key={classData._id}>
                  <td>{classData.name}</td>
                  <td className="section-cell">{classData.sections}</td>
                  <td>
                    <button onClick={() => handleEditClick(classData)}>Edit</button>
                    <button onClick={() => handleDeleteClick(classData._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No classes available.</p>
        )}
      </div>
    </div>

  );
}
