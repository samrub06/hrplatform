import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space, Table, TablePaginationConfig, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { Job } from '../interface/job.interface';

interface JobTableProps {
  jobs: Job[];
  isLoading?: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
  currentUserId?: string;
  pagination?: TablePaginationConfig;
}

const JobTable: React.FC<JobTableProps> = ({ jobs, isLoading, onEdit, onDelete, canEdit, canDelete, currentUserId, pagination }) => {
  const getBadgeColor = (yearsRequired: number) => {
    if (yearsRequired <= 2) return 'green';
    if (yearsRequired <= 5) return 'blue';
    if (yearsRequired <= 8) return 'orange';
    return 'red';
  };

  const columns = [
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
      title: 'Skills Required ',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: { name: string; years_required: number }[]) => (
        <Space className='flex flex-wrap min-w-40' >
          {skills?.map((skill, index) => (
            <Tag key={index} color={getBadgeColor(skill?.years_required)}>
              {skill?.name} ({skill?.years_required} years)
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Salary Offered',
      dataIndex: 'salary_offered',
      key: 'salary_offered',
    },
    {
      title: 'Global Year Experience',
      dataIndex: 'global_year_experience',
      key: 'global_year_experience',
    },
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: 'Company Type',
      dataIndex: 'company_type',
      key: 'company_type',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Job, b: Job) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm'),
    },
    ...(canEdit || canDelete ? [{
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Job) => (
        <Space>
          {canEdit && onEdit && record.userId === currentUserId && 
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          }
          {canDelete && onDelete && record.userId === currentUserId && 
            <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(record.id.toString())} />
          }
        </Space>
      ),  
    }] : []),
  ];

  return (
    <Table
      columns={columns}
      dataSource={jobs}
      loading={isLoading}
      rowKey="id"
      pagination={pagination}
    />
  );
};

export default JobTable;