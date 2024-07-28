
import React, {useEffect, useState } from "react";
import {
  Row,
  Col
} from "reactstrap";
import MaintenanceItem from "components/Items/residentMaintenanceItem";
import { getMaintenance} from "api/Maintenance/maintenanceApi";

function Tables() {

  const [mntList, setMntList] = useState({
    "success": true,
    "maintenance": []
  })


  const fetchAllMaintenance = async () => {
    const response = await getMaintenance();
    if (response.success) {
      console.log(response);
      setMntList(response);
    } else {
      console.log(response);
    }
  }

  useEffect(() => {
    fetchAllMaintenance();
  }, [])


  return (
    <>
      <div className="content w-auto h-auto">
        <Row>
          {mntList?.maintenance.length === 0? <p> No maintenance record present</p>:<>
          {mntList?.maintenance?.map((mnt)=>{
            return <>
              <MaintenanceItem mnt={mnt}></MaintenanceItem>
            </>
          })}</>}
        </Row>
      </div>

    </>
  );
}

export default Tables;
