import { Box } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import BoxHeader from '../DashboardContent/BoxHeader';
import BreadCrumbs from '../DashboardContent/BreadCrumbs';
import Tabs from '../DashboardContent/Tabs';
import Form from '../DashboardContent/Form';
import { fieldsData } from '../../../fieldsData';
import { crudFieldsData } from '../../../crudFieldData';
import CRUD from '../DashboardContent/CRUD';

function TodoSubpage() {
  const { page } = useParams();
  const formatPageName = (page) => page.replace(/-/g, '_');
  const title = page.replace(/-/g, ' ');

  const tabsData = [
    { id: 1, name: 'API', content: <Form page={formatPageName(page)} fieldsData={fieldsData} /> },
    { id: 2, name: 'CRUD', content: <CRUD page={formatPageName(page)} fieldsData={crudFieldsData} /> },
  ];

  return (
    <Box className="body">
      <BreadCrumbs main_page="To Do" redirectTo="../todo" />
      <Box className="content">
        <BoxHeader title={title} />
        <Box className="body">
          <Tabs data={tabsData} />
        </Box>
      </Box>
    </Box>
  );
}

export default TodoSubpage;
