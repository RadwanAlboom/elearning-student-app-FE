import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import ItemsTable from './itemsTable';

const styles = StyleSheet.create({
    page: {
        fontSize: 11,
        flexDirection: 'column',
    },
});

const Table = ({ data }) => (
    <View size="A4" style={styles.page}>
        <ItemsTable data={data} />
    </View>
);

export default Table;
