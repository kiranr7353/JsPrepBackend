const { FieldValue } = require('firebase-admin/firestore');
const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const db = admin.firestore();
const { formidable } = require('formidable');
const uuid = require('uuid-v4');

const bucket = admin.storage().bucket();

exports.getCategoriesList = async (req, res) => {
    try {
        const categoryListRef = db.collection('categoryList');
        const snapshot = await categoryListRef.get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No category list found',
                detail: "No categories ist found"
            })
            return;
        }
        const categoriesList = [];
        snapshot.forEach(doc => {
            categoriesList.push(doc.data())
        });
        res.status(200).json({
            success: true,
            categoriesList
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.getCategories = async (req, res) => {
    try {
        const categoryRef = db.collection('categories');
        const snapshot = await categoryRef.get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No categories found',
                detail: "No categories found"
            })
            return;
        }
        const categories = [];
        snapshot.forEach(doc => {
            categories.push(doc.data())
        });
        res.status(200).json({
            success: true,
            categories
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.getCategoriesFromList = async (req, res) => {
    try {
        const { categoryList } = req.params;
        if (categoryList && categoryList !== 'all') {
            let docref = await db.collection('categoryList').doc(`${categoryList + '_category_852471JsPrep'}`).get();
            let categoriesRef = await db.collection('categories').where('categoryList', '==', docref.ref).get();
            if (categoriesRef.empty) {
                res.status(404).json({
                    message: 'No categories found',
                    detail: `No categories found for ${categoryList}`
                })
                return;
            }
            const categories = [];
            categoriesRef.forEach(doc => {
                categories.push(doc.data())
            });
            const categoriesFromResponse = categories?.length > 0 && categories?.map(el => ({ categoryName: el.categoryName, categoryId: el.categoryId, imageUrl: el.imageUrl, enabled: el.enabled, description: el.description }));
            res.status(200).json({
                success: true,
                categories: categoriesFromResponse
            })
        } else {
            const categoryRef = db.collection('categories');
            const snapshot = await categoryRef.get();
            if (snapshot.empty) {
                res.status(404).json({
                    message: 'No categories found',
                    detail: "No categories found"
                })
                return;
            }
            const categories = [];
            snapshot.forEach(doc => {
                categories.push(doc.data())
            });
            const categoriesFromResponse = categories?.length > 0 && categories?.map(el => ({ categoryName: el.categoryName, categoryId: el.categoryId, imageUrl: el.imageUrl, enabled: el.enabled, description: el.description }));
            res.status(200).json({
                success: true,
                categories: categoriesFromResponse
            })
        }
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.getTopicsFromCategories = async (req, res) => {
    try {
        const { categoryId } = req.params;
        let docref = await db.collection('categories').doc(`${categoryId + '_cat852471JsPrep'}`).get();
        let topics = await db.collection('topics').where('categoryId', '==', docref.ref).get();
        if (topics.empty) {
            res.status(404).json({
                message: 'No topics found',
                detail: `No topics found for ${categoryId}`
            })
            return;
        }
        const topicsData = [];
        topics.forEach(doc => {
            topicsData.push(doc.data());
        });
        const topicsFromResponse = topicsData?.length > 0 && topicsData?.map(el => ({ topicId: el.topicId, topicName: el.topicName, imageUrl: el.imageUrl, displayOrder: el?.displayOrder, description: el?.description, enabled: el?.enabled }));
        res.status(200).json({
            success: true,
            topics: topicsFromResponse
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

const handleValidation = (payload) => {

}

exports.createInterviewQuestions = async (req, res) => {
    try {
        const { categoryId, topicId, questionId, question, data } = req.body;
        let questions = await db.collection('interviewQ&A').where('question', '==', question).get();
        if (!questions.empty) {
            res.status(404).json({
                message: 'Duplicate Entry',
                detail: `Dunplicate question found for ${question}`
            })
            return;
        }
        const payload = { categoryId: categoryId, topicId: topicId, questionId: questionId, question: question, data: data, enabled: true, createdAt: FieldValue.serverTimestamp() }
        const docRef = db.collection('interviewQ&A').doc(questionId);
        await docRef.set(payload);
        res.status(201).json({
            success: true,
            message: 'QA Added Successfully'
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.updateInterviewQuestion = async (req, res) => {
    try {
        const { questionId, data } = req.body;
        let question = await db.collection('interviewQ&A').where('questionId', '==', questionId).get();
        if (question.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${questionId}`
            })
            return;
        }
        question.forEach(doc => {
            let docData = doc.data();
            let updateData = {...docData, data: data}
            doc.ref.update(updateData);
        });
        res.status(201).json({
            success: true,
            message: 'Updated Successfully'
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.deleteInterviewQuestion = async (req, res) => {
    try {
        const { questionId } = req.body;
        let question = await db.collection('interviewQ&A').where('questionId', '==', questionId).get();
        if (question.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${questionId}`
            })
            return;
        }
        const deleteQuery = db.collection('interviewQ&A').where('questionId', '==', questionId);
        deleteQuery.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.delete();
            })
            res.status(201).json({
                message: 'Deleted Successfully',
                detail: `Deleted successfully`
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

exports.getInterviewQuestionsData = async (req, res) => {
    try {
        const { topicId, categoryId } = req.params;
        let questions = await db.collection('interviewQ&A').where('topicId', '==', topicId).where('categoryId', '==', categoryId).get();
        if (questions.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${topicId} and ${categoryId}`
            })
            return;
        }
        const questionsData = [];
        questions.forEach(doc => {
            console.log(doc.data());
            questionsData.push(doc.data());
        });
        const questionsFromResponse = questionsData?.length > 0 && questionsData?.map(el => ({ question: el?.question, questionId: el?.questionId, data: el?.data }));
        res.status(200).json({
            success: true,
            data: questionsFromResponse
        })
    } catch (error) {
        handleFailError(res, error);
    }
}
exports.setFavoriteTopic = async (req, res) => {
    try {
        const { topicId } = req.body;

    } catch (error) {
        handleFailError(res, error);
    }
}

exports.setFavoriteQuestion = async (req, res) => {
    try {
        const { questionNumber } = req.body;

    } catch (error) {
        handleFailError(res, error);
    }
}

const handleAddCategoryValidation = (categoryId, categoryName, enabled, imageUrl) => {

}

exports.addCategory = async (req, res) => {
    try {
        const { categoryId, categoryName, enabled, imageUrl } = req.body;
        handleAddCategoryValidation(categoryId, categoryName, enabled, imageUrl);
        const categoryData = { categoryId, categoryName, enabled, imageUrl }
        const categoryRef = db.collection('categories');
        const snapshot = await categoryRef.get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No categories found',
                detail: "No categories found"
            })
            return;
        }
        const categories = [];
        snapshot.forEach(doc => {
            categories.push(doc.data())
        });
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categoryId === categoryId || categories[i].categoryName === categoryName) {
                res.status(400).json({
                    message: 'Duplicate Category',
                    detail: `${categoryName} already exists`
                })
                return;
            }
        }
        const docRef = db.collection('categories').doc(`${categoryId + `_cat852471JsPrep`}`);
        await docRef.set(categoryData);
        res.status(201).json({
            success: true,
            message: `${categoryName} added successfully`
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.editCategory = async (req, res) => {
    try {
        const { categoryId, categoryName, enabled, imageUrl, description } = req.body;
        handleAddCategoryValidation(categoryId, categoryName, enabled, imageUrl);
        let category = await db.collection('categories').where('categoryId', '==', categoryId).get();
        if (category.empty) {
            res.status(404).json({
                message: `Not Found`,
                detail: `${categoryName} not found`
            })
            return;
        }
        category.forEach(doc => {
            let docData = doc.data();
            let catData = { ...docData, categoryName: categoryName, enabled: enabled, imageUrl: imageUrl, description: description };
            doc.ref.update(catData);
        });
        res.status(201).json({
            success: true,
            message: `${categoryName} Updated Successfully`
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

const handleAddTopicValidation = (topicId, topicName, imageUrl, categoryId) => {

}

exports.addTopic = async (req, res) => {
    try {
        const { topicId, topicName, imageUrl, categoryId, description, displayOrder } = req.body;
        handleAddTopicValidation(topicId, topicName, imageUrl, categoryId);
        let topicData = { topicId, topicName, imageUrl, description, displayOrder }
        const topicsRef = db.collection('topics');
        const snapshot = await topicsRef.get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No topics found',
                detail: "No topics found"
            })
            return;
        }
        const topics = [];
        snapshot.forEach(doc => {
            topics.push(doc.data())
        });
        for (let i = 0; i < topics.length; i++) {
            if (topics[i].topicId === topicId || topics[i].topicName === topicName) {
                res.status(400).json({
                    message: 'Duplicate Topic',
                    detail: `${topicName} already exists`
                })
                return;
            }
        }
        const docRef = db.collection('topics').doc(`${topicId + `_cat_${categoryId}852471JsPrep`}`);
        topicData.categoryId = db.doc(`/categories/${categoryId}_cat852471JsPrep`);
        await docRef.set(topicData);
        res.status(201).json({
            success: true,
            message: `${topicName} added successfully`
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.editTopic = async (req, res) => {
    try {
        const { topicId, topicName, imageUrl, categoryId, description, enabled } = req.body;
        handleAddTopicValidation(topicId, topicName, imageUrl, categoryId, description);
        let topic = await db.collection('topics').where('topicId', '==', topicId).get();
        if (topic.empty) {
            res.status(404).json({
                message: `Not Found`,
                detail: `${topicName} not found`
            })
            return;
        }
        topic.forEach(doc => {
            let docData = doc.data();
            let data = { ...docData, topicName: topicName, imageUrl: imageUrl, description: description, enabled: enabled }
            doc.ref.update(data);
        });
        res.status(201).json({
            success: true,
            message: `Updated Successfully`
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.deleteTopic = async (req, res) => {
    try {
        const { topicId, topicName, categoryId } = req.body;
        let topic = await db.collection('topics').where('topicId', '==', topicId).get();
        if (topic.empty) {
            res.status(404).json({
                message: `Not Found`,
                detail: `${topicName} not found`
            })
            return;
        }
        await db.collection('topics').doc(`${topicId}_cat_${categoryId}852471JsPrep`).delete();
        res.status(200).json({
            message: 'Success',
            detail: `${topicName} deleted successfully`
        })
    } catch (error) {
        handleFailError(res, error);
    }
}