import React, { useEffect, useState } from 'react';
import LoadingIndicator from 'components/LoadingIndicator';
import Wrapper from 'components/List/Wrapper';
import Ul from 'components/List/Ul';
import styled from 'styled-components';

const CustomersPage = () => {
  const [customersData, setCustomersData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCustomersData() {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/v1/customers/', {
          'content-type': 'application/json',
          method: 'GET',
        });
        const { data } = await response.json();
        setCustomersData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomersData();
  }, []);

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
      }}
    >
      {customersData.map(item => (
        <ListItem item={item} key={item.customer.id} />
      ))}
    </div>
  );
};

const ListItem = ({ item }) => {
  return (
    <StyledListItem>
      <pre>
        <code>{JSON.stringify(item, null, 2)}</code>
      </pre>
    </StyledListItem>
  );
};

const StyledListItem = styled.div`
  background-color: papayawhip;
  border-radius: 5px;
  margin-top: 3px;
  height: 300px;
  width: 50%;
  overflow-y: scroll;
  padding: 5px;
  border: 1px solid black;
`;

export default CustomersPage;
