/*
 * Smart Contract for Students Record System.
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class StudentRecord extends Contract {

    async InitLedger(ctx) {
        const students = [
            {
                ID: 'student1',
                Fname: 'Akshay',
                Lname: 'Verma',
                Email: 'akverma@mail.com',
                Mobile: 1111111111,
                Address:'Harinagar',
                City: 'Delhi',
            },
            {
                ID: 'student2',
                Fname: 'Mohit',
                Lname: 'Sharma',
                Email: 'mk@mail.com',
                Mobile: 1111111112,
                Address:'Santnagar',
                City: 'Delhi',
            },
            {
                ID: 'student3',
                Fname: 'Harshit',
                Lname: 'Desai',
                Email: 'hd@mail.com',
                Mobile: 1111111113,
                Address:'Harinagar',
                City: 'Mumbai',
            },
            {
                ID: 'student4',
                Fname: 'Rohan',
                Lname: 'Gupta',
                Email: 'rg@mail.com',
                Mobile: 1111111114,
                Address:'Sulemanpur',
                City: 'Lucknow',
            },
            {
                ID: 'student5',
                Fname: 'Diya',
                Lname: 'Goyal',
                Email: 'dg@mail.com',
                Mobile: 1111111115,
                Address:'Harinagar',
                City: 'Patna',
            },
            
        ];

        for (const student of students) {
            student.docType = 'student';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(student.ID, Buffer.from(stringify(sortKeysRecursive(student))));
        }
    }

    // CreateStudent issues a new student record to the world state with given details.
    async CreateStudent(ctx, id, fname, lname, email, mobile, address, city) {
        const exists = await this.StudentExists(ctx, id);
        if (exists) {
            throw new Error(`The student ${id} already exists`);
        }

        const student = {
            ID: id,
            Fname: fname,
            Lname: lname,
            Email: email,
            Mobile: mobile,
            Address: address,
            City: city,
        };
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(student))));
        return JSON.stringify(student);
    }

    // ReadStudent returns the student stored in the world state with given id.
    async ReadStudent(ctx, id) {
        const studentJSON = await ctx.stub.getState(id); // get the studnet from chaincode state
        if (!studentJSON || studentJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return studentJSON.toString();
    }

    // UpdateStudent updates an existing studnet in the world state with provided parameters.
    async UpdateStudent(ctx, id, fname, lname, email, mobile, address,city) {
        const exists = await this.StudentExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original student with new student
        const updatedStudent = {
            ID: id,
            Fname: fname,
            Lname: lname,
            Email: email,
            Mobile: mobile,
            Address: address,
            City: city
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedStudent))));
    }

    

    // StudentExists returns true when asset with given ID exists in world state.
    async StudentExists(ctx, id) {
        const studentJSON = await ctx.stub.getState(id);
        return studentJSON && studentJSON.length > 0;
    }

    

    // GetAllStudentRecords returns all assets found in the world state.
    async GetAllStudentRecords(ctx) {
        const allStudentRecords = [];
        // range query with empty string for startKey and endKey does an open-ended query of all students in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allStudentRecords.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allStudentRecords);
    }
}

module.exports = StudentRecord;

