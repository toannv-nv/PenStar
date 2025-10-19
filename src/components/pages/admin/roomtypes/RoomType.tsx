import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Table,
  message,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import QuillEditor from "@/components/common/QuillEditor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoomType,
  deleteRoomType,
  getRoomTypes,
  updateRoomType,
} from "@/services/roomTypeApi";

type RoomTypeItem = { id: number; name: string; description: string };

const RoomType = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RoomTypeItem | null>(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: types = [], isLoading } = useQuery({
    queryKey: ["room_types"],
    queryFn: getRoomTypes,
  });

  const filteredTypes = types.filter((t: RoomTypeItem) => {
    const q = String(searchTerm ?? "")
      .trim()
      .toLowerCase();
    if (!q) return true;
    return String(t.name ?? "")
      .toLowerCase()
      .includes(q);
  });

  const createMut = useMutation({
    mutationFn: (payload: { name: string; description: string }) =>
      createRoomType(payload),
    onSuccess: () => {
      message.success("Room type created");
      queryClient.invalidateQueries({ queryKey: ["room_types"] });
      setOpen(false);
      form.resetFields();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to create";
      message.error(msg);
    },
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: { name: string; description: string };
    }) => updateRoomType(id, payload),
    onSuccess: () => {
      message.success("Room type updated");
      queryClient.invalidateQueries({ queryKey: ["room_types"] });
      setOpen(false);
      setEditing(null);
      form.resetFields();
    },
    onError: () => message.error("Failed to update"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number | string) => deleteRoomType(id),
    onSuccess: () => {
      message.success("Room type deleted");
      queryClient.invalidateQueries({ queryKey: ["room_types"] });
    },
    onError: (err: unknown) => {
      const serverMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      const msg = serverMsg || "Failed to delete";
      message.error(msg);
    },
  });

  const onCreate = () => {
    form.validateFields().then((values) => {
      if (editing) {
        updateMut.mutate({ id: editing.id, payload: values });
      } else {
        createMut.mutate(values);
      }
    });
  };

  const columns: ColumnsType<RoomTypeItem> = [
    {
      title: "STT",
      key: "stt",
      render: (_v, _r, idx) => idx + 1 + (currentPage - 1) * pageSize,
      width: 80,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Action",
      key: "action",
      render: (_v, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record);
              form.setFieldsValue({
                name: record.name,
                description: record.description,
              });
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete?"
            onConfirm={() => deleteMut.mutate(record.id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">ROOM TYPES</h1>
        <div className="flex items-center gap-3">
          <Input.Search
            placeholder="Search by name"
            allowClear
            style={{ width: 260 }}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null);
              form.resetFields();
              setOpen(true);
            }}
          >
            New
          </Button>
        </div>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredTypes}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: pageSize,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>

      <Modal
        title={editing ? "Edit Room Type" : "New Room Type"}
        open={open}
        onOk={onCreate}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Name required" },
              {
                validator: async (_rule, value) => {
                  const name = String(value ?? "").trim();
                  if (!name) return Promise.reject(new Error("Name required"));
                  const excludeId = editing?.id;
                  try {
                    const exists = await (
                      await import("@/services/roomTypeApi")
                    ).checkRoomTypeNameExists(name, excludeId);
                    if (exists)
                      return Promise.reject(new Error("Name already exists"));
                    return Promise.resolve();
                  } catch {
                    return Promise.reject(new Error("Name validation failed"));
                  }
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            valuePropName="value"
          >
            <QuillEditor />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomType;
