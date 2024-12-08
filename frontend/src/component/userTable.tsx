import { DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { UserData } from '../interface/user.interface';

interface UserTableProps {
  users: UserData[];
  isLoading: boolean;
  onEdit: (user: UserData) => void;
  onDelete: (userId: number) => void;
  onDownloadCv: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, isLoading, onEdit, onDelete, onDownloadCv }) => {
 
  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'green';
      case 'intermediate':
        return 'blue';
      case 'advanced':
        return 'orange';
      case 'expert':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: UserData, b: UserData) => a.id - b.id,
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      sorter: (a: UserData, b: UserData) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      sorter: (a: UserData, b: UserData) => a.last_name.localeCompare(b.last_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: UserData, b: UserData) => a.email.localeCompare(b.email),
    },
    {
      title: 'Desired Position',
      dataIndex: 'desired_position',
      key: 'desired_position',
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: { name: string; level: string; years_of_experience: number }[]) => (
        <Space>
        {skills.map((skill, index) => (
          <Tag key={index} color={getBadgeColor(skill.level)}>
            {skill.name} ({skill.level}  Expected: {skill.years_of_experience} years)
          </Tag>
        ))}
      </Space>
      ),
      sorter: (a: UserData, b: UserData) => a.skills.length - b.skills.length,

    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a: UserData, b: UserData) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserData) => (
        <Space>
          <Button icon={<DownloadOutlined />} onClick={() => onDownloadCv(record.id)} disabled={!record.cv}>
            CV
          </Button>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(record.id)} />
        </Space>
      ),
    },
  ];



  return (
    <Table
      columns={columns}
      dataSource={users}
      loading={isLoading}
      rowKey="id"
      pagination={{ pageSize: 10, showSizeChanger: true }}
    />
  );
};

export default UserTable;