import React, { useState, useEffect } from "react";
import "./styles.css"; // Import the CSS file

const GET_API_URL = "/master/getAllTenants"; // Use relative path
// const POST_API_URL = "/master/save"; // Use relative path

export default function TenantForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    businessName: "",
    aliasName: "",
    firstMobileNumber: "",
    secondMobileNumber: "",
    address: "",
    gstNo: "",
    
  });
 
  const [tenants, setTenants] = useState([]); // tenants list
  const [loading, setLoading] = useState(false); // Loading 
  const [error, setError] = useState(null); // Error message
  const [success, setSuccess] = useState(""); // Success message
  const [currentPage, setCurrentPage] = useState(1); //current page number
  const [rowsPerPage] = useState(3); // three rows per page 

  // Clear tenant list on component mount (page refresh)
  useEffect(() => {
    console.log("Component mounted or refreshed");
    setTenants([]); // Clear data from table on page refresh
  }, []);

  // Function to fetch tenants
  const loadTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(GET_API_URL, {
        headers: {
          "Cache-Control": "no-cache", // Disable caching
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Data:", data); // Debugging line
      setTenants(data); // Set the fetched data
    } catch (err) {
      setError("Error fetching tenants: " + err.message);
    } finally {
      setLoading(false);
    }
    
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const indexOfLastRow =currentPage* rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tenants.slice(indexOfFirstRow, indexOfLastRow);

  //hande page change 
  const handleNextPage = (pageNumber) => {
  if (currentPage < Math.ceil(tenants.length / rowsPerPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePreviousPage = (pageNumber) => {
    if(currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
}

  // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccess("");
//     setError(null);
//     try {
//       console.log("Request Payload:", JSON.stringify(formData));
//       const response = await fetch(POST_API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       setSuccess("Tenant added successfully!");
//       loadTenants(); // Refresh tenant list after submission
//       setFormData({
//         fullName: "",
//         email: "",
//         businessName: "",
//         aliasName: "",
//         firstMobileNumber: "",
//         secondMobileNumber: "",
//         address: "",
//         gstNo: "",
//       });
//     } catch (err) {
//       setError("Error submitting data: " + err.message);
//     }
//   };

  return (
    <div className="container">
      {/* <div className="form-container">
        <h2>Add New Details</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} required />
          <input type="text" name="aliasName" placeholder="Alias Name" value={formData.aliasName} onChange={handleChange} />
          <input type="text" name="firstMobileNumber" placeholder="First Mobile" value={formData.firstMobileNumber} onChange={handleChange} required />
          <input type="text" name="secondMobileNumber" placeholder="Second Mobile" value={formData.secondMobileNumber} onChange={handleChange} />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          <input type="text" name="gstNo" placeholder="GST No" value={formData.gstNo} onChange={handleChange} />
          <button type="submit">Submit</button>
        </form>
      </div> */}
       <div className="tenant-list">
        <h2> List Of Details</h2>
        {loading ? (
          <p className="loading-message">Loading...</p>
        ) : (
          <>
            <button onClick={loadTenants} className="refresh-button">
              Refresh Data
            </button>
            <table className="tenant-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Business Name</th>
                  <th>Alias Name</th>
                  <th>First Mobile</th>
                  <th>Second Mobile</th>
                  <th>GST No</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((tenant) => (
                    <tr key={tenant.id}>
                      <td>{tenant.id}</td>
                      <td>{tenant.tenantName}</td>
                      <td>{tenant.aliasName}</td>
                      <td>{tenant.firstMobileNo}</td>
                      <td>{tenant.secondMobileNo}</td>
                      <td>{tenant.gstNo}</td>
                      <td>{tenant.address}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="page-number">
                Page {currentPage} of {Math.ceil(tenants.length / rowsPerPage)}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === Math.ceil(tenants.length / rowsPerPage)}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}