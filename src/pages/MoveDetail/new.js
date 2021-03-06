import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocId } from "../../api";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import moment from "moment";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import AddProductInput from "../../components/AddProductInput";
import StockSelect from "../../components/StockSelect";
import StockFromSelect from "../../components/StockFromSelect";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  InputNumber,
  TreeSelect,
  Checkbox,
  Dropdown,
  DatePicker,
  Switch,
  Select,
  Spin,
  Tag,
  Divider,
  Menu,
  Drawer,
  Typography,
  Statistic,
  Popconfirm,
} from "antd";
import DocTable from "../../components/DocTable";
import DocButtons from "../../components/DocButtons";
import { message } from "antd";
import { saveDoc } from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
const { Option, OptGroup } = Select;
let customPositions = [];

function NewMove() {
  const queryClient = useQueryClient();
  const { docPage, docCount, docSum, outerDataSource } = useTableCustom();
  const {
    docstock,
    docfromstock,
    setDocStock,
    docmark,
    setDocMark,
    setLoadingForm,
  } = useCustomForm();
  const [positions, setPositions] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [editId, setEditId] = useState(null);

  const onClose = () => {
    message.destroy();
  };
  const columns = useMemo(() => {
    return [
      {
        title: "№",
        dataIndex: "Order",
        className: "orderField",
        editable: false,
        isVisible: true,
        render: (text, record, index) => index + 1 + 100 * docPage,
      },
      {
        title: "Adı",
        dataIndex: "Name",
        className: "max_width_field_length",
        editable: false,
        isVisible: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
      },
      {
        title: "Barkodu",
        dataIndex: "BarCode",
        isVisible: true,
        className: "max_width_field_length",
        editable: false,
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.BarCode - b.BarCode,
      },
      {
        title: "Miqdar",
        dataIndex: "Quantity",
        isVisible: true,
        className: "max_width_field",
        editable: true,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },

      {
        title: "Maya",
        dataIndex: "Price",
        isVisible: true,
        className: "max_width_field",
        editable: false,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },
      {
        title: "Məbləğ",
        dataIndex: "TotalPrice",
        isVisible: true,
        editable: false,
        className: "max_width_field",
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },

      {
        title: "Sil",
        className: "orderField printField",
        dataIndex: "operation",
        isVisible: true,
        editable: false,
        render: (_, record) => (
          <Typography.Link>
            <Popconfirm
              title="Silməyə əminsinizmi?"
              okText="Bəli"
              cancelText="Xeyr"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a className="deletePosition">Sil</a>
            </Popconfirm>
          </Typography.Link>
        ),
      },
    ];
  });

  useEffect(() => {
    setLoadingForm(false);
  }, []);
  const handleFinish = async (values) => {
    values.stocktoid = docstock;
    values.stockfromid = docfromstock;
    values.positions = outerDataSource;
    values.mark = docmark;
    values.moment = values.moment._i;
    console.log(values);

    message.loading({ content: "Loading...", key: "doc_update" });

    const res = await saveDoc(values, "moves");
    if (res.Headers.ResponseStatus === "0") {
      message.success({
        content: "Saxlanildi",
        key: "doc_update",
        duration: 2,
      });
      setEditId(res.Body.ResponseService);
      setRedirect(true);
    } else {
      message.error({
        content: (
          <span className="error_mess_wrap">
            Saxlanılmadı... {res.Body}{" "}
            {<CloseCircleOutlined onClick={onClose} />}
          </span>
        ),
        key: "doc_update",
        duration: 0,
      });
    }
  };

  if (redirect) return <Redirect to={`/editMove/${editId}`} />;

  return (
    <div>
      <DocButtons />
      <Form
        id="myForm"
        className="doc_forms"
        name="basic"
        onFinish={handleFinish}
        layout="horizontal"
      >
        <Form.Item
          label="Move Number"
          name="name"
          className="doc_number_form_item"
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item label="Created Moment" name="moment">
          <DatePicker
            showTime={{ format: "HH:mm:ss" }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>

        <Form.Item label="Mark" name="mark">
          <StatusSelect defaultValue={null} />
        </Form.Item>
        <Form.Item label="Stock To" name="stocktoid">
          <StockSelect defaultValue={null} />
        </Form.Item>
        <Form.Item label="Stock From" name="stockfromid">
          <StockFromSelect defaultValue={null} />
        </Form.Item>
        <Form.Item
          label="Status"
          className="docComponentStatus"
          name="status"
          valuePropName="checked"
        >
          <Checkbox name="status"></Checkbox>
        </Form.Item>
      </Form>

      <AddProductInput />
      <DocTable headers={columns} datas={positions} />
      <div>
        <Statistic
          groupSeparator=" "
          className="doc_info_text total"
          title=""
          value={docSum}
          prefix={"Yekun məbləğ: "}
          suffix={"₼"}
        />
        <Statistic
          groupSeparator=" "
          className="doc_info_text doc_info_secondary quantity"
          title=""
          value={docCount}
          prefix={"Miqdar: "}
          suffix={"əd"}
        />
      </div>
    </div>
  );
}

export default NewMove;
