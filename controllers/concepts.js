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
        });
        const conceptsFromResponse = conceptsData?.length > 0 && conceptsData?.map(el => ({ id: el.id, data: el.data, title: el.title }));
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
        let snap = await db.collection('topics').doc(`${payload.topicId + `_cat_${payload.categoryId}852471JsPrep`}`).get();
        if (!snap.exists) {
            res.status(404).json({
                message: 'No concepts found',
                detail: `No concepts found for ${payload.topicId} in ${payload.categoryId}`
            })
            return;
        } else if (snap.data().topicId !== payload.topicId) {
            res.status(404).json({
                message: 'No concepts found',
                detail: `No concepts found for ${payload.topicId} in ${payload.categoryId}`
            })
            return;
        }
        let concepts = await db.collection('concepts').where('topicId', '==', snap.ref).get();
        const conceptsData = [];
        concepts.forEach(doc => {
            conceptsData.push(doc.data())
        });
        const conceptsFromResponse = conceptsData?.length > 0 && conceptsData?.map(el => ({ id: el.id, description: el.description, title: el.title, imageUrl: el.imageUrl, points: el.points, tableData: el.tableData, hasPoints: el.hasPoints, hasTable: el.hasTable, columnHeader: el.columnHeader }));
        for (let i = 0; i < conceptsFromResponse.length; i++) {
            console.log(conceptsFromResponse[i].title === payload.title);
            if (conceptsFromResponse[i].title === payload.title) {
                res.status(400).json({
                    message: 'Duplicate Concept',
                    detail: `${payload.title} already exists`
                })
                return;
            }
        }
        const docRef = db.collection('concepts').doc(`${payload.topicId + `${payload.title}_concept_${payload.categoryId}852471JsPrep`}`);
        payload.topicId = db.doc(`/topics/${payload.topicId}_cat_${payload.categoryId}852471JsPrep`);
        await docRef.set(payload);
        res.status(201).json({
            success: true,
            message: `${payload.title} added successfully`
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.editConcepts = async (req, res) => {
    try {
        const { payload } = req.body;
        let snap = await db.collection('topics').doc(`${payload.topicId + `_cat_${payload.categoryId}852471JsPrep`}`).get();
        if (!snap.exists) {
            res.status(404).json({
                message: 'No concepts found',
                detail: `No concepts found for ${payload.topicId} in ${payload.categoryId}`
            })
            return;
        } else if (snap.data().topicId !== payload.topicId) {
            res.status(404).json({
                message: 'No concepts found',
                detail: `No concepts found for ${payload.topicId} in ${payload.categoryId}`
            })
            return;
        }
        let concepts = await db.collection('concepts').where('title', '==', snap.ref).get();
        const conceptsData = [];
        concepts.forEach(doc => {
            conceptsData.push(doc.data())
        });
        const conceptsFromResponse = conceptsData?.length > 0 && conceptsData?.map(el => ({ id: el.id, description: el.description, title: el.title, imageUrl: el.imageUrl, points: el.points, tableData: el.tableData, hasPoints: el.hasPoints, hasTable: el.hasTable, columnHeader: el.columnHeader }));
        for (let i = 0; i < conceptsFromResponse.length; i++) {
            console.log(conceptsFromResponse[i].title === payload.title);
            if (conceptsFromResponse[i].title === payload.title) {
                res.status(400).json({
                    message: 'Duplicate Concept',
                    detail: `${payload.title} already exists`
                })
                return;
            }
        }
        const docRef = db.collection('concepts').doc(`${payload.topicId + `${payload.title}_concept_${payload.categoryId}852471JsPrep`}`);
        payload.topicId = db.doc(`/topics/${payload.topicId}_cat_${payload.categoryId}852471JsPrep`);
        await docRef.set(payload);
        res.status(201).json({
            success: true,
            message: `${payload.title} added successfully`
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.editDescriptionInSection = async (req, res) => {
        const { categoryId, data, sectionId, topicId, title } = req.body;
        let snap = await db.collection('topics').doc(`${topicId + `_cat_${categoryId}852471JsPrep`}`).get();
        if (!snap.exists) {
            res.status(404).json({
                message: 'No concepts found',
                detail: `No concepts found for ${topicId} in ${categoryId}`
            })
            return;
        } else if (snap.data().topicId !== topicId) {
            res.status(404).json({
                message: 'No concepts found',
                detail: `No concepts found for ${topicId} in ${categoryId}`
            })
            return;
        }
        // let concepts = await db.collection('concepts').where('title', '==', payload?.title).get();
        // const conceptsData = [];
        // concepts.forEach(doc => {
        //     conceptsData.push(doc.data())
        // });
        // console.log(conceptsData);
        let docRef = db.collection('concepts').doc(`${topicId}${title}_concept_${categoryId}852471JsPrep`);
        docRef.update({ 
           data: data
        }).then(resp => {
            res.status(201).json({
                message: 'Updated Successfully',
                detail: `${title} updated successfully`
            })
            return;
        }).catch(err => {
            res.status(400).json({
                message: 'Update failed',
                detail: `${title} update failed`
            })
            return;
        })
}