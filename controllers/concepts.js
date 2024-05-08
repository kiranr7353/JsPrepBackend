const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const db = admin.firestore();


exports.getConcepts = async (req, res) => {
    try {
        const { topicId, categoryId } = req.params;
        let docref = await db.collection('topics').doc(`${topicId + `_cat_${categoryId}852471JsPrep`}`).get();
        let concepts = await db.collection('concepts').where('topicId', '==', docref.ref).get();
        if (concepts.empty) {
            res.status(404).json({
                message: 'No concepts found',
                detail: `No concepts found for ${topicId} in ${categoryId}`
            })
            return;
        }
        const conceptsData = [];
        concepts.forEach(doc => {
            conceptsData.push(doc.data());
            console.log(doc.data());
        });
        const conceptsFromResponse = conceptsData?.length > 0 && conceptsData?.map(el => ({ id: el.id, description: el.description, title: el.title, imageUrl: el.imageUrl, points: el.points, tableData: el.tableData, hasPoints: el.hasPoints, hasTable: el.hasTable, columnHeader: el.columnHeader }));
        res.status(200).json({
            success: true,
            concepts: conceptsFromResponse
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

const handleConceptValidation = (payload) => {

}

exports.addConcepts = async (req, res) => {
    try {
        const { payload } = req.body;
        console.log(payload);
        handleConceptValidation(payload);
        let docref = await db.collection('topics').doc(`${payload.topicId + `_cat_${payload.categoryId}852471JsPrep`}`).get();
        let concepts = await db.collection('concepts').where('topicId', '==', docref.ref).get();
        console.log(concepts);
        if (concepts.empty) {
            res.status(404).json({
                message: 'No concepts found',
                detail: `No concepts found for ${topicId} in ${categoryId}`
            })
            return;
        }
        const conceptsData = [];
        concepts.forEach(doc => {
            // conceptsData.push(doc.data())
            console.log(doc.data());
        });
        // const conceptsFromResponse = conceptsData?.length > 0 && conceptsData?.map(el => ({ id: el.id, description: el.description, title: el.title, imageUrl: el.imageUrl, points: el.points, tableData: el.tableData, hasPoints: el.hasPoints, hasTable: el.hasTable, columnHeader: el.columnHeader }));
        // for (let i = 0; i < conceptsFromResponse.length; i++) {
        //     if (conceptsFromResponse[i].title === payload.title) {
        //         res.status(400).json({
        //             message: 'Duplicate Concept',
        //             detail: `${payload.title} already exists`
        //         })
        //         return;
        //     }
        // }
        // // const docRef = db.collection('concepts').doc(`${topicId + `${payload.title}_concept_${categoryId}852471JsPrep`}`);
        // payload.topicId = db.doc(`/topics/${topicId}_cat_${categoryId}852471JsPrep`);
        // console.log(payload);
        // await docRef.set(payload);
        // res.status(201).json({
        //     success: true,
        //     message: `${payload.title} added successfully`
        // })
    } catch (error) {
        handleFailError(res, error);
    }
}