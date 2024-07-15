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
        const topicsFromResponse = topicsData?.length > 0 && topicsData?.map(el => ({ topicId: el.topicId, topicName: el.topicName, imageUrl: el.imageUrl, displayOrder: el?.displayOrder, description: el?.description }));
        res.status(200).json({
            success: true,
            topics: topicsFromResponse
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

const handleFileUpload = async (filepath, destination) => {
    try {
        const metadata = {
            metadata: {
                // This line is very important. It's to create a download token.
                firebaseStorageDownloadTokens: uuid()
            },
            contentType: 'image/png',
            cacheControl: 'public, max-age=31536000',
        };
        await bucket.upload(filepath, {
            // Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,
            metadata: metadata,
            destination: destination
        });
    } catch (error) {

    }
}

exports.getTest = async (req, res) => {
    try {
        const form = formidable({});
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                return;
            }
            // for (let i = 0; i < files?.image?.length; i++) {
            //     const filepath = files?.image[i]?.filepath;
            //     const fileName = files?.image[i]?.newFilename;
            //     let designation = `JavaScriptInterviewQA/Question1/${fileName}`;
            //     handleFileUpload(filepath, designation)
            // }
            console.log(JSON.parse(fields.answersData))
            res.json({ fields, files });
        });
    } catch (error) {
        console.log(error);
    }
}

const handleValidation = (payload) => {

}

exports.createInterviewQuestions = async (req, res) => {
    try {
        const { payload, topicId } = req.body;
        handleValidation(payload);
        const snapshot = await db.collection('topics').doc(`${topicId + `InterviewQuestion_cat_${topicId}852471JsPrep`}`).get();
        let questions = await db.collection('interviewQ&A').where('topicId', '==', snapshot.ref).get();
        if (questions.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${topicId}`
            })
            return;
        }
        const questionNumbers = [];
        const question = [];
        questions.forEach(doc => {
            questionNumbers.push(doc.data()?.questionNumber);
            question.push(doc.data()?.questionTitle);
        });
        if (questionNumbers.includes(payload?.questionNumber) || question.includes(payload?.questionTitle)) {
            res.status(400).json({
                message: 'Duplicate question number or Duplicate question',
                detail: `Question already exists. Please try again with different question or different question number`
            })
            return;
        }
        payload.topicId = db.doc(`/topics/${topicId}InterviewQuestion_cat_${topicId}852471JsPrep`);
        const docRef = db.collection('interviewQ&A').doc(`${topicId + `question` + payload?.questionNumber}`);
        await docRef.set(payload);
        res.status(201).json({
            success: true,
            message: 'Question Added Successfully'
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.updateInterviewQuestion = async (req, res) => {
    try {
        const { payload, topicId, questionNumber } = req.body;
        handleValidation(payload);
        const snapshot = await db.collection('topics').doc(`${topicId + `InterviewQuestion_cat_${topicId}852471JsPrep`}`).get();
        let questions = await db.collection('interviewQ&A').where('topicId', '==', snapshot.ref).get();
        if (questions.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${topicId}`
            })
            return;
        }
        let question = await db.collection('interviewQ&A').where('topicId', '==', snapshot.ref).where('questionNumber', '==', questionNumber).get();
        if (question.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for question ${questionNumber}`
            })
            return;
        }
        payload.topicId = db.doc(`/topics/${topicId}InterviewQuestion_cat_${topicId}852471JsPrep`);
        question.forEach(doc => {
            doc.ref.update(payload);
        });
        res.status(201).json({
            success: true,
            message: 'Updated Successfully'
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.getInterviewQuestionsData = async (req, res) => {
    try {
        const { topicId } = req.params;
        let docref = await db.collection('topics').doc(`${topicId + `InterviewQuestion_cat_${topicId}852471JsPrep`}`).get();
        let questions = await db.collection('interviewQ&A').where('topicId', '==', docref.ref).get();
        if (questions.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${topicId}`
            })
            return;
        }
        const questionsData = [];
        questions.forEach(doc => {
            console.log(doc.data());
            questionsData.push(doc.data());
        });
        const questionsFromResponse = questionsData?.length > 0 && questionsData?.map(el => ({ questionNumber: el?.questionNumber, questionTitle: el?.questionTitle, answersData: el?.answersData }));
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
        const { categoryId, categoryName, enabled, imageUrl } = req.body;
        handleAddCategoryValidation(categoryId, categoryName, enabled, imageUrl);
        const categoryData = { categoryId, categoryName, enabled, imageUrl }
        let category = await db.collection('categories').where('categoryId', '==', categoryId).get();
        if (category.empty) {
            res.status(404).json({
                message: `Not Found`,
                detail: `${categoryName} not found`
            })
            return;
        }
        category.forEach(doc => {
            doc.ref.update(categoryData);
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
        const { topicId, topicName, imageUrl, categoryId } = req.body;
        handleAddTopicValidation(topicId, topicName, imageUrl, categoryId);
        let topicData = { topicId, topicName, imageUrl }
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
        const { topicId, topicName, imageUrl, categoryId } = req.body;
        handleAddTopicValidation(topicId, topicName, imageUrl, categoryId);
        let topicData = { topicId, topicName, imageUrl }
        let topic = await db.collection('topics').where('topicId', '==', topicId).get();
        if (topic.empty) {
            res.status(404).json({
                message: `Not Found`,
                detail: `${topicName} not found`
            })
            return;
        }
        topicData.categoryId = db.doc(`/categories/${categoryId}_cat852471JsPrep`);
        topic.forEach(doc => {
            doc.ref.update(topicData);
        });
        res.status(201).json({
            success: true,
            message: `${topicName} Updated Successfully`
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