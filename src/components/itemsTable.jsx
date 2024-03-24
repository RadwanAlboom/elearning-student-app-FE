import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';

import TableRow from './tableRow';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

const ItemsTable = ({ data }) => (
    <View style={styles.tableContainer}>
        <TableRow items={data} />
    </View>
);

export default ItemsTable;
