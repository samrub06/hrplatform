import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space, Table, TablePaginationConfig } from 'antd';
import moment from 'moment';
import React from 'react';
import { Alumni } from '../interface/job.interface';

interface AlumniTableProps {
  alumni: Alumni[];
  isLoading?: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onEdit?: (alumni: Alumni) => void;
  onDelete?: (alumniId: string) => void;
  currentUserId?: string;
  pagination?: TablePaginationConfig;
}

const AlumniTable: React.FC<AlumniTableProps> = ({ alumni, isLoading, onEdit, onDelete, canEdit, canDelete, currentUserId, pagination }) => {
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
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Current Position',
      dataIndex: 'current_position',
      key: 'current_position',
    },
    {
      title: 'Link Referral',
      dataIndex: 'link_referral',
      key: 'link_referral',
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
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Alumni, b: Alumni) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm'),
    },
    ...(canEdit || canDelete ? [{
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Alumni) => (
        <Space>
          {canEdit && onEdit && record.id === currentUserId && 
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          }
            {canDelete && onDelete && record.id === currentUserId && 
            <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(record.id.toString())} />
          }
        </Space>
      ),  
    }] : []),
  ];

  return (
    <Table
      columns={columns}
      dataSource={alumni}
      loading={isLoading}
      rowKey="id"
      pagination={pagination}
    />
  );
};

export default AlumniTable;