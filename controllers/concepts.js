const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const { handleValidations } = require('../utils/handleValidation');
const db = admin.firestore();


exports.getConcepts = async (req, res) => {
    try {
        const { topicId, categoryId } = req.params;
        let errorObj = handleValidations(res, [{ 'topicId': topicId }, { 'categoryId': categoryId }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
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

exports.addConcepts = async (req, res) => {
    try {
        const { categoryId, topicId, id, title, data } = req.body;
        let errorObj = handleValidations(res, [{ 'topicId': topicId }, { 'categoryId': categoryId }, { 'id': id }, { 'title': title }, { 'data': data }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let payload = { categoryId, topicId, id, title, data };
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

exports.editConcept = async (req, res) => {
    try {
        const { currentTitle, changedTitle, topicId, categoryId } = req.body;
        let errorObj = handleValidations(res, [{ 'topicId': topicId }, { 'categoryId': categoryId }, { 'currentTitle': currentTitle }, { 'changedTitle': changedTitle }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
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
        let docQuery = db.collection('concepts').doc(`${topicId}${currentTitle}_concept_${categoryId}852471JsPrep`);
        docQuery.get().then(doc => {
            if (doc && doc.exists) {
                let dataFromDoc = doc.data();
                let data = { ...dataFromDoc, title: changedTitle }
                db.collection('concepts').doc(`${topicId}${changedTitle}_concept_${categoryId}852471JsPrep`).set(data).then(resp => {
                    db.collection('concepts').doc(`${topicId}${currentTitle}_concept_${categoryId}852471JsPrep`).delete();
                }).catch(err => {
                    res.status(500).json({
                        message: 'Something went wrong. Please try again later',
                        detail: `${err}`
                    })
                });
            }
            res.status(201).json({
                message: 'Updated Successfully',
                detail: `${changedTitle} updated successfully`
            })
        }).catch(err => {
            res.status(500).json({
                message: 'Something went wrong. Please try again later',
                detail: `${err}`
            })
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.deleteConcept = async (req, res) => {
    const { topicId, categoryId, title } = req.body;
    let errorObj = handleValidations(res, [{ 'topicId': topicId }, { 'categoryId': categoryId }, { 'title': title }]);
    if (Object.keys(errorObj).length > 0) {
        res.status(400).json({
            message: errorObj?.message,
            detail: errorObj?.detail
        })
        return;
    }
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
    let docQuery = db.collection('concepts').where('title', '==', title);
    docQuery.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            doc.ref.delete();
        })
        res.status(201).json({
            message: 'Concept Deleted Successfully',
            detail: `${title} deleted successfully`
        })
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong. Please try again later',
            detail: `${err}`
        })
    })
}

exports.editDescriptionInSection = async (req, res) => {
    const { categoryId, data, topicId, title } = req.body;
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
        console.log(err)
        res.status(400).json({
            message: 'Update failed',
            detail: err ? err?.details : `${title} update failed`
        })
        return;
    })
}