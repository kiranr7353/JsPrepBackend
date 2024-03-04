const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const db = admin.firestore();

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
exports.getTopicsFromCategories = async (req, res) => {
    try {
        const { categoryId } = req.params;
        console.log(categoryId);
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
        const topicsFromResponse = topicsData?.length > 0 && topicsData?.map(el => ({ topicId: el.topicId, topicName: el.topicName }));
        res.status(200).json({
            success: true,
            topics: topicsFromResponse
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