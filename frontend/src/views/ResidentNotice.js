import React, { useState, useEffect } from "react";
import {
    Row,
    Col
} from "reactstrap";
import { getNotice, } from "api/Notice/noticeApi";
import NoticeItem from "components/Items/residentNoticeItem";


function Notice() {

    const [noticeList, setNoticeList] = useState({
        "success": true,
        "notices": []
    })

    const fetchAllNotices = async () => {
        const response = await getNotice();
        if (response.success) {
            console.log(response);
            setNoticeList(response);
        } else {
            console.log(response);
        }
    }

    useEffect(() => {
        fetchAllNotices();
    }, [])

    return (
        <>
            <div className="content w-auto h-auto">
                <Row>
                    {noticeList?.notices.length === 0 ? <p>No notice present</p>:<>
                    {noticeList?.notices?.map((notice) => {
                        return <>
                            <NoticeItem notice={notice} ></NoticeItem>
                        </>
                    })}</>}
                </Row>
            </div>
        </>
    );
}

export default Notice;
