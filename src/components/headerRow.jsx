import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#ffff4d',
        border: '2px solid black',
        borderRight: '0px solid black',
        height: '45px',
    },
    xyz: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
        height: '100%',
        fontSize: '11px',
        borderRight: '2px solid black',
    },
});

const HeaderRow = ({ items }) => {
    const rows = items.map((item) => (
        <View style={styles.row} key={item.sr.toString()}>
            <View style={styles.xyz}>
                <Text>{item.studentName}</Text>
            </View>
            <View style={styles.xyz}>
                <Text>{item.successRate}</Text>
            </View>
            <View style={styles.xyz}>
                <Text>{item.examSuccessRate}</Text>
            </View>
            <View style={styles.xyz}>
                <Text>{item.grade}</Text>
            </View>
            <View style={styles.xyz}>
                <Text>{item.examGrade}</Text>
            </View>
        </View>
    ));
    return <Fragment>{rows}</Fragment>;
};

export default HeaderRow;
