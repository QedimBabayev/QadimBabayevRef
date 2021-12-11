import { useState } from "react";
import { Select, Drawer, Input, Divider, Button, Spin } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useTableCustom } from "../contexts/TableContext";
import { useCustomForm } from "../contexts/FormContext";

import { editMarks, fetchMarks } from "../api";
const { Option, OptGroup } = Select;
function StatusSelect({ defaultvalue }) {
  const { marks, setMarkLocalStorage, setMark } = useTableCustom();
  const { docmark, setDocMark } = useCustomForm();
  const [statusName, setStatusName] = useState(null);
  const [statusColor, setStatusColor] = useState(null);
  const [markLoading, setMarkLoading] = useState(false);
  var obj;
  marks ? (obj = marks) : (obj = JSON.parse(localStorage.getItem("marks")));
  console.log(docmark);
  const options = obj.map((m) => (
    <Option key={m.Id} value={m.Id}>
      <span>{m.Name}</span>
      <span className="mark_option_icons_wrapper">
        <EditOutlined
          style={{ marginRight: "8px", color: "#0288d1" }}
          id={m.Id}
          // onClick={(e) =>
          //   this.handleEditMark(e, mark.Id, mark.Name, mark.Color)
          // }
        />
        <DeleteOutlined
          style={{ color: "red" }}
          // onClick={(e) => this.handleDeleteMark(e, mark.Id)}
        />
      </span>
    </Option>
  ));
  const onChange = (mark) => {
    setDocMark(mark);
  };

  const handleName = (e) => {
    setStatusName(e.target.value);
  };
  const handleColor = (e) => {
    setStatusColor(e.target.value);
  };

  const saveMark = async () => {
    setMarkLoading(true);
    const markResponse = await editMarks(statusName, statusColor);
    console.log(markResponse);
    if (
      markResponse.Body.ResponseStatus &&
      markResponse.Body.ResponseStatus === "0"
    ) {
      const get = await fetchMarks();
      setMark(get.Body.List);
      setMarkLocalStorage(get.Body.List);
      setMarkLoading(false);
      setDocMark(markResponse.Body.ResponseService);
    } else {
      console.log("saxlanilmadi");
    }
  };

  return (
    <>
      <Select
        showSearch
        showArrow={false}
        defaultValue={Number(defaultvalue)}
        filterOption={false}
        onChange={onChange}
        className="customSelect"
        allowClear={true}
        notFoundContent={<Spin size="small" />}
        dropdownRender={(menu) => (
          <div className="site-drawer-render-in-current-wrapper customDrawer">
            {menu}
            <Divider style={{ margin: "4px 0" }} />
            <Drawer
              title="Status adı"
              placement="right"
              closable={false}
              getContainer={false}
              style={{ position: "absolute" }}
            >
              <Input style={{ width: "115px" }} />
              <Input type="color" />
              <Button>Yadda saxla</Button>
            </Drawer>
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                padding: 8,
                flexDirection: "column",
              }}
            >
              <Input
                style={{ flex: "auto" }}
                onChange={(e) => handleName(e)}
                placeholder="Status adı"
              />
              <Input
                type="color"
                onChange={(e) => handleColor(e)}
                defaultValue="#0288d1"
              />
              <a
                style={{
                  flex: "none",
                  padding: "8px",
                  display: "block",
                  cursor: "pointer",
                }}
                onClick={() => saveMark()}
              >
                <PlusOutlined /> Əlavə et
              </a>
            </div>
          </div>
        )}
      >
        {markLoading ? [] : options}
      </Select>
    </>
  );
}

export default StatusSelect;
