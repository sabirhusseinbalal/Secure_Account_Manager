import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const notify = () => toast("Wow so easy!");
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    sitename: "",
    password: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch accounts from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/accounts")
      .then((response) => setAccounts(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Handle form submission (for adding or editing accounts)
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let response;

      if (editId) {
        // Update account
        response = await axios.put(
          `http://localhost:5000/accounts/${editId}`,
          formData
        );
        setEditId(null);
      } else {
        // Add new account
        response = await axios.post("http://localhost:5000/accounts", formData);
      }

      // Reset the form fields after successful response
      setFormData({ username: "", sitename: "", password: "" });
      fetchAccounts(); // Refresh the list

      if (response.status === 201) {
        toast("Account created successfully");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message); // Username already exists
      } else {
        toast.error("An error occurred");
      }
    }
  };

  // Fetch updated accounts list
  const fetchAccounts = () => {
    axios
      .get("http://localhost:5000/accounts")
      .then((response) => setAccounts(response.data))
      .catch((error) => console.error(error));
      toast("List Updated");
  };

  // Handle edit
  const handleEdit = (account) => {
    setFormData({
      username: account.username,
      sitename: account.sitename,
      password: account.password,
    });
    setEditId(account._id);
    toast("Ready For Editing");
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm("Do you want to proceed?")) {
      // User clicked OK
      await axios.delete(`http://localhost:5000/accounts/${id}`);
      fetchAccounts(); // Refresh the list
      toast("Account deleted successfully");
  } else {
      // User clicked Cancel
      toast("User canceled the action.");
  }
   
  };

  return (
  
    <div className="App">
    <ToastContainer 
        autoClose={2000} // Default time for all toasts (300 ms = 3 seconds)
      />
      {/* Form */}
      <div className="form_sub">
      <div className="content">
  <h1>Secure Account Manager</h1>
  <p>Manage and update your credentials with ease. All details are securely stored and accessible anytime.</p>
  <h3>Add or Edit Account Info:</h3>
</div>

      <form onSubmit={handleSubmit}>
        {/* Site Name */}
        <input
          type="text"
          placeholder="Site Name"
          value={formData.sitename}
          required
          onChange={(e) =>
            setFormData({ ...formData, sitename: e.target.value })
          }
        />
        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          required
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          required
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button className="button-89" type="submit"
        >{editId ? "Update" : "Add"} Account</button>
        
      </form>
      </div>
      {/* Display table */}
      <div className="table-container">
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Site Name</th>
        <th>Username</th>
        <th>Password</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {accounts.map((account, index) => (
        <tr key={account._id}>
          <td>{index + 1}</td>
          <td>
            <a href={account.sitename} target="_blank" rel="noopener noreferrer">
              {account.sitename}
            </a>
          </td>
          <td>{account.username}</td>
          <td>{account.password}</td>
          <td className="actions">
            <button onClick={() => handleEdit(account)}> <lord-icon title="Edit"
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon></button>
            <button onClick={() => handleDelete(account._id)}>  <lord-icon title="Delete"
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon></button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
}

export default App;
