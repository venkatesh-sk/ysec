import React, { useState, Fragment } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import data from "./mock-data.json";
import ReadOnlyRow from "./components/ReadOnlyRow";
import EditableRow from "./components/EditableRow";

const App = () => {
  
  const [contacts, setContacts] = useState(data);
  const [addFormData, setAddFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [editContactId, setEditContactId] = useState(null);

  const [searchTerm,setSearchTerm] = useState("")
  const [searchResult , setSearchResults] =useState([])


  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    

    setAddFormData(newFormData);
    
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    const newContact = {
      id: nanoid(),
      fullName: addFormData.fullName,
      address: addFormData.address,
      phoneNumber: addFormData.phoneNumber,
      email: addFormData.email,
    };

    const newContacts = [...contacts, newContact];
    setContacts(newContacts);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedContact = {
      id: editContactId,
      fullName: editFormData.fullName,
      address: editFormData.address,
      phoneNumber: editFormData.phoneNumber,
      email: editFormData.email,
    };

    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.id === editContactId);

    newContacts[index] = editedContact;

    setContacts(newContacts);
    setEditContactId(null);
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);

    const formValues = {
      fullName: contact.fullName,
      address: contact.address,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
    };

    setEditFormData(formValues);
    
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.id === contactId);

    newContacts.splice(index, 1);

    setContacts(newContacts);
  };
  
  const searchHandler=(e)=>{
    e.preventDefault();
    setSearchTerm(e.target.value);
    if(searchTerm !== ""){
      const newContactList = contacts.filter((contact)=>{
        return Object.values(contact)
        .join(" ")
        .toLowerCase() 
        .includes(searchTerm.toLowerCase())     
      })
      console.log(newContactList)
      setSearchResults(newContactList)
      console.log(searchResult)
    }else{
      setSearchResults(contacts)
    }
    
  }
  // const [order,setOrder] = useState("ASC")
  // const sortedData=(col)=>{
  //   if(order === "ASC"){
  //    const sorted = contacts.sort((a,b)=>{
  //      a[col].toLowerCase() > b[col].toLowerCase() ? 1:-1
  //    })
  //     setContacts(sortedData)
  //     setOrder("DSC")
  //   }
  // }
  const [order,setOrder] =useState("ASC")
  const sortedData = (col)=>{
    if(order ==="ASC"){
      const sorted =[...contacts].sort((a,b)=>{
        return a.fullName.toLocaleLowerCase() > b.fullName.toLocaleLowerCase() ? 1:-1
      });
      
      setContacts(sorted);
      setSearchResults(sorted);
      setOrder("DSC")
    }

    if(order === "DSC"){
      const sorted=[...contacts].sort((a,b)=>{
        return a.fullName.toLowerCase() < b.fullName.toLocaleLowerCase() ? 1: -1
      })
      setContacts(sorted);
      setSearchResults(sorted);
      setOrder("ASC")    
    }
   
  }
  return (
    <div className="app-container">
      <h1>User List</h1>
      <div className="search-icon">
        <input type="text" 
        placeholder="Search Contact"
        
        onChange={(e)=>searchHandler(e)} />
        {/* search icon */}
      </div>
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr >
              <th onClick={()=>{sortedData("fullname")}}>Name</th>
            
              <th>Address</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchTerm.length < 1 ? contacts.map((contact) => (
              <>
                {editContactId === contact.id ? (
                  <EditableRow
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <ReadOnlyRow
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                ) 
}
              </>
            )): searchResult.map(contact=>{
            
                return <Fragment>
                  
                {editContactId === contact.id ? (
                  <EditableRow
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <ReadOnlyRow
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                ) 
            }
              </Fragment>
            })
            }

          </tbody>
        </table>
      </form>

      <h2>Add a Contact</h2>
      <form onSubmit={handleAddFormSubmit}>
        <input
          type="text"
          name="fullName"
          required="required"
          placeholder="Enter a name..."
          onChange={handleAddFormChange}
        />
         
        <input
          type="text"
          name="address"
          required="required"
          placeholder="Enter an addres..."
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="phoneNumber"
          required="required"
          placeholder="Enter a phone number..."
          onChange={handleAddFormChange}
        />
        <input
          type="email"
          name="email"
          required="required"
          placeholder="Enter an email..."
          onChange={handleAddFormChange}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default App;
