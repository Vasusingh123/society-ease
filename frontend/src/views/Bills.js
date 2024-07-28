import React, { useRef, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { getAllBills, addBill } from "api/Bills/billApi";
import { getUserDetails } from "utility/cookiesUtil";
import { getUserType } from "utility/cookiesUtil";

function Bills() {
  const closeref = useRef();
  const addRef = useRef();
  const [billData, setBillData] = useState({
    billRoomNumber: "",
    billType: "",
    billAmount: ""
  })
  
  const [catBill, setCatBill] = useState([
    {
      billRoomNumber: "",
      electricity_Dues: 0,
      water_Dues: 0,
      maintenance_Dues: 0,
      wifi_Dues: 0,
      total_Dues: 0
    }
  ])

  const handleChange = (e) => {
    setBillData({ ...billData, [e.target.name]: e.target.value })
  }

  const showSuccessMessage = (msg) => {
    toast.success(msg, {
        position: toast.POSITION.TOP_RIGHT
    });
  };

  const showErrorMessage = (msg)=>{
    toast.error(msg, {
      position: toast.POSITION.TOP_RIGHT
    });
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await addBill(billData);
    if (response.success) {
      console.log(response);
      closeref.current.click();
      showSuccessMessage("Bill Created Successfully")
      fetchAllBills();
    } else {
      closeref.current.click()
      showErrorMessage("An Error Occurred")
    }
  }

  const groupBillsByRoomNumber = (bills) => {
    const mp = new Map();
    bills.map((bill) => {
      if (bill.billType === 'Water') {
        if (mp.has(bill.billRoomNumber)) {
          let obj = mp.get(bill.billRoomNumber);
          mp.set(bill.billRoomNumber, { ...obj, water_Dues: bill.billDue, total_Dues: obj.total_Dues + bill.billDue })
        } else {
          mp.set(bill.billRoomNumber, { billRoomNumber: bill.billRoomNumber, water_Dues: bill.billDue, total_Dues: bill.billDue });
        }
      } else if (bill.billType === 'Maintenance') {
        if (mp.has(bill.billRoomNumber)) {
          let obj = mp.get(bill.billRoomNumber);
          mp.set(bill.billRoomNumber, { ...obj, maintenance_Dues: bill.billDue, total_Dues: obj.total_Dues + bill.billDue })
        } else {
          mp.set(bill.billRoomNumber, { billRoomNumber: bill.billRoomNumber, maintenance_Dues: bill.billDue, total_Dues: bill.billDue });
        }
      } else if (bill.billType === 'Electricity') {
        if (mp.has(bill.billRoomNumber)) {
          let obj = mp.get(bill.billRoomNumber);
          mp.set(bill.billRoomNumber, { ...obj, electricity_Dues: bill.billDue, total_Dues: obj.total_Dues + bill.billDue })
        } else {
          mp.set(bill.billRoomNumber, { billRoomNumber: bill.billRoomNumber, electricity_Dues: bill.billDue, total_Dues: bill.billDue });
        }
      } else if (bill.billType === 'Wifi') {
        if (mp.has(bill.billRoomNumber)) {
          let obj = mp.get(bill.billRoomNumber);
          mp.set(bill.billRoomNumber, { ...obj, wifi_Dues: bill.billDue, total_Dues: obj.total_Dues + bill.billDue })
        } else {
          mp.set(bill.billRoomNumber, { billRoomNumber: bill.billRoomNumber, wifi_Dues: bill.billDue, total_Dues: bill.billDue });
        }
      }
    })

    let fl = []
    for (const [key, value] of mp) {
      fl.push(value)
    }
    console.log(fl)

    setCatBill(fl)
  }

  const fetchAllBills = async () => {
    const response = await getAllBills();
    if (response.success) {
      console.log(response)
      groupBillsByRoomNumber(response.bills)
    } else console.log(response)
  }

  useEffect(() => {
    fetchAllBills();
  }, [])

  const userDetails = JSON.parse(getUserDetails())
  const userType = getUserType()

  return (
    <>
    {userType==='admin' && userDetails? 
      <>
      <ToastContainer></ToastContainer>
      <div className="content w-auto h-auto">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Add Bill <FontAwesomeIcon icon={faCirclePlus} onClick={() => { addRef.current.click() }} style={{ marginLeft: "10px", color: "#7a7a7a", }} /></CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Room No.</th>
                      <th>Electricity Dues</th>
                      <th>Water Dues</th>
                      <th>Maintenance Dues</th>
                      <th>Wifi Dues</th>
                      <th>Total Dues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catBill.map((bill) => {
                      return <tr>
                        <td>{bill.billRoomNumber}</td>
                        <td>{bill.electricity_Dues ? bill.electricity_Dues : 0}</td>
                        <td>{bill.water_Dues ? bill.water_Dues : 0}</td>
                        <td >{bill.maintenance_Dues ? bill.maintenance_Dues : 0}</td>
                        <td >{bill.wifi_Dues ? bill.wifi_Dues : 0}</td>
                        <td >{bill.total_Dues ? bill.total_Dues : 0}</td>
                      </tr>
                    })}

                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal activation buttons */}
      <button className="btn d-none" ref={addRef} data-target="#editModal" data-toggle="modal">edit</button>
      {/* <button className="btn d-none"  ref= {delRef} data-target="#deleteModal" data-toggle="modal">delete</button> */}

      <div>
        <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModal" aria-hidden="true">
          <div className="modal-dialog custom-modal-box">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Bill</h5>
                <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="row modal-body">
                <div className="log popup-form">
                  <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="form-box popup-form-box" style={{ height: "auto", width: "100%" }}>
                      <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-12 mb-4">
                          <label htmlFor="subject" className="form-label mb-2">Room Number*</label>
                          <input type="text" name="billRoomNumber" onChange={handleChange} className="form-control" id="inputAddress" required placeholder="" />
                        </div>

                        <div className="col-6 mb-4">
                          <label htmlFor="billtype" className="form-label mb-2">Bill Type*</label>
                          <select name="billType" onChange={handleChange} className="custom-select mr-sm-2" id="inlineFormCustomSelect">
                            <option value="" selected>Choose..</option>
                            <option value="Electricity">Electricty</option>
                            <option value="Water">Water</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Wifi">Wifi</option>
                          </select>
                          {/* <input type="text" name="billType"  className="form-control" id="inputAddress" required placeholder="" /> */}
                        </div>
                        <div className="col-6 mb-4">
                          <label htmlFor="billamount" className="form-label mb-2">Bill Amount*</label>
                          <input type="text" name="billAmount" onChange={handleChange} className="form-control" id="inputAddress" required placeholder="" />
                        </div>

                        <div className="col-12">
                          <button ref={closeref} type="button" className="btn" data-dismiss="modal">Close</button>
                          <button type="submit" className="btn btn-success"> Add Bill</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
          :<><div className="content">Not Authorised</div></>}
    </>
  );
}

export default Bills;
