import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import moment from 'moment';
import React from 'react';
import { Job } from '../interface/job.interface';

interface JobTableProps {
  jobs: Job[];
  isLoading?: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: number) => void;
}

const JobTable: React.FC<JobTableProps> = ({ jobs, isLoading, onEdit, onDelete ,canEdit, canDelete}) => {
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Job, b: Job) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Job, b: Job) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Job, b: Job) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Job) => (
        <Space>
          {canEdit && onEdit && <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />}
          {canDelete && onDelete && <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(record.id)} />}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={jobs}
      loading={isLoading}
      rowKey="id"
      pagination={{ pageSize: 10, showSizeChanger: true }}
    />
  );
};

export default JobTable;