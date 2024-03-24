import React from 'react';
import {
    Page,
    Text,
    View,
    Image,
    Document,
    StyleSheet,
} from '@react-pdf/renderer';

import Table from './table';
import HeaderRow from './headerRow';
import logo from '../assets/logo.png';
// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        borderBottom: '1px solid black',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: '50px',
        padding: 10,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    space: {
        marginTop: '20px',
    },
});

const header = {
    items: [
        {
            sr: 1,
            studentName: 'Name',
            successRate: 'Success Rate',
            examSuccessRate: 'Exam Success Rate',
            grade: 'Grade',
            examGrade: 'Exam Grade',
        },
    ],
};

// Create Document Component
const MyDocument = ({ exams, name, description }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View style={styles.section}>
                    <View style={styles.center}>
                        <Image style={styles.image} src={logo} />
                        <Text>Done-With-It</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.center}>
                        <Text style={{ marginBottom: '5px' }}>{name}</Text>
                        <Text>{description}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.center}>
                        <Text>Date: {new Date().toLocaleDateString()}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.space}>
                <HeaderRow items={header.items} />
                <Table data={exams} />
            </View>
        </Page>
    </Document>
);

export default MyDocument;
