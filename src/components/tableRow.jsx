import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#ffff4d',
        borderBottom: '1px dashed black',
    },
    xyz: {
        textAlign: 'center',
        padding: '10px',
        width: '20%',
        borderRight: '1px dashed black',
    },
});

const TableRow = ({ items }) => {
    const rows = items.map((item) => (
        <View style={styles.row} key={item.id.toString()}>
            <Text style={styles.xyz}>{item.studentName}</Text>
            <Text style={styles.xyz}>{item.successRate}</Text>
            <Text style={styles.xyz}>{item.actualSuccessRate}</Text>
            <Text style={styles.xyz}>{item.grade}</Text>
            <Text style={styles.xyz}>{item.actualGrade}</Text>
        </View>
    ));
    return <Fragment>{rows}</Fragment>;
};

export default TableRow;
