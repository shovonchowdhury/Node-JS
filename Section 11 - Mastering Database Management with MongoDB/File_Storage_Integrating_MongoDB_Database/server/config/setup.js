import { client, connectDB } from "./DB.js";

const db = await connectDB();

try{

    
        await db.command({
            collMod : "directories",
            validator : {
                $jsonSchema: {
                required: [
                    "_id",
                    "name",
                    "userId",
                    "parentDirId"
                ],
                properties: {
                    _id: {
                    bsonType: "objectId"
                    },
                    name: {
                    bsonType: "string"
                    },
                    userId: {
                    bsonType: "objectId"
                    },
                    parentDirId: {
                    bsonType: [
                        "objectId",
                        "null"
                    ]
                    }
                },
                additionalProperties: false
                }
            },
            validationAction : "error",
            validationLevel : "strict"

            
        })

        await db.command({
            collMod : "files",
            validator : {
                $jsonSchema: {
                required: [
                    '_id',
                    'extension',
                    'name',
                    'parentDirId',
                    'userId'
                ],
                properties: {
                    _id: {
                    bsonType: 'objectId'
                    },
                    extension: {
                    bsonType: 'string'
                    },
                    name: {
                    bsonType: 'string'
                    },
                    parentDirId: {
                    bsonType: 'objectId'
                    },
                    userId: {
                    bsonType: 'objectId'
                    }
                },
                additionalProperties: false
                }
            },
            validationAction : 'error',
            validationLevel : 'strict'
            
        })

        await db.command({
            collMod : "users",
            validator : {
                $jsonSchema: {
                required: [
                    "_id",
                    "name",
                    "email",
                    "password",
                    "rootDirId"
                ],
                properties: {
                    _id: {
                    bsonType: "objectId"
                    },
                    name: {
                    bsonType: "string",
                    minLength: 3,
                    description : "Name problem"
                    },
                    email: {
                    bsonType: "string",
                    pattern: "^[\\w.-]+@[a-zA-Z\\d.-]+\\.[a-zA-Z]{2,}$",
                    description : "email problem"
                    },
                    password: {
                    bsonType: "string",
                    minLength: 4,
                    description : "pass problem"
                    },
                    rootDirId: {
                    bsonType: "objectId"
                    }
                },
                additionalProperties: false
                }
            },
            validationAction : "error",
            validationLevel : "strict"
            
        })

}
catch(err){
    console.log(err);
}


await client.close();