const { FieldValue } = require('firebase-admin/firestore');
const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const { handleValidations } = require('../utils/handleValidation');
const db = admin.firestore();


exports.addSnippets = async (req, res) => {
    try {
        const { categoryId, topicId, titleId, title, data } = req.body;
        let errorObj = handleValidations(res, [ {'titleId': titleId}, {'data': data}, {'title': title}, {'categoryId': categoryId}, {'topicId': topicId} ]);
        if(Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let titleRef = await db.collection('snippets').where('title', '==', title).get();
        if (!titleRef.empty) {
            res.status(404).json({
                message: 'Duplicate Entry',
                detail: `Dunplicate question found for ${title}`
            })
            return;
        }
        const payload = { categoryId: categoryId, topicId: topicId, titleId: titleId, title: title, data: data, enabled: true, createdAt: FieldValue.serverTimestamp() }
        const docRef = db.collection('snippets').doc(titleId);
        await docRef.set(payload);
        res.status(201).json({
            success: true,
            message: 'Snippet Added Successfully'
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.updateSnippet = async (req, res) => {
    try {
        const { titleId, data, title, enabled } = req.body;
        let errorObj = handleValidations(res, [ {'titleId': titleId}, {'data': data}, {'title': title}, {'enabled': enabled} ]);
        if(Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let titleRef = await db.collection('snippets').where('titleId', '==', titleId).get();
        if (titleRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${titleId}`
            })
            return;
        }
        titleRef.forEach(doc => {
            let docData = doc.data();
            let updateData = { ...docData, title: title, data: data, enabled: enabled, updatedAt: FieldValue.serverTimestamp() }
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

exports.deleteSnippet = async (req, res) => {
    try {
        const { titleId } = req.body;
        let errorObj = handleValidations(res, [ {'titleId': titleId} ]);
        if(Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let titleRef = await db.collection('snippets').where('titleId', '==', titleId).get();
        if (titleRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${titleId}`
            })
            return;
        }
        const deleteQuery = db.collection('snippets').where('titleId', '==', titleId);
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

exports.getSnippetsData = async (req, res) => {
    try {
        const { topicId, categoryId, pageSize, pageNumber } = req.body;
        let errorObj = handleValidations(res, [ {'topicId': topicId}, {'categoryId': categoryId}, {'pageSize': pageSize}, {'pageNumber': pageNumber} ]);
        if(Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let titlRef = await db.collection('snippets').where('topicId', '==', topicId).where('categoryId', '==', categoryId).orderBy('createdAt').limit(pageSize).offset(pageSize * (pageNumber - 1)).get();
        let count = await db.collection('snippets').where('topicId', '==', topicId).where('categoryId', '==', categoryId).count().get();
        let totalSize = count.data().count;
        if (titlRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${topicId} and ${categoryId}`
            })
            return;
        }
        const snippetData = [];
        titlRef.forEach(doc => {
            snippetData.push(doc.data());
        });
        const snippetFromResponse = snippetData?.length > 0 && snippetData?.map(el => ({ title: el?.title, titleId: el?.titleId, data: el?.data, enabled: el?.enabled }));
        res.status(200).json({
            success: true,
            data: snippetFromResponse,
            totalCount: totalSize
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.bookmarkSnippet = async (req, res) => {
    try {
        const { titleId } = req.body;
        const user = req?.user;
        let errorObj = handleValidations(res, [ {'titleId': titleId} ]);
        if(Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let titleRef = await db.collection('snippets').where('titleId', '==', titleId).get();
        if (titleRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${titleId}`
            })
            return;
        }
        titleRef.forEach(doc => {
            let docData = doc.data();
            if (docData?.bookmarkedUser && docData?.bookmarkedUser?.length > 0) {
                const isUserPresent = docData?.bookmarkedUser?.filter(el => el === user);
                if (isUserPresent && isUserPresent?.length > 0) {
                    res.status(400).json({
                        success: false,
                        message: 'Snippet already bookmarked',
                        detail: 'Snippet already bookmarked'
                    })
                    return;
                } else {
                    let bookmarkUser = [...docData?.bookmarkedUser, user];
                    let updateData = {...docData, bookmarkedUser: bookmarkUser };
                    doc.ref.update(updateData);
                }
            } else {
                let bookmarkUser = [user];
                let updateData = {...docData, bookmarkedUser: bookmarkUser };
                doc.ref.update(updateData);
            }
        });
        res.status(201).json({
            success: true,
            message: 'Bookmarked Successfully'
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.removebookmarkedSnippet = async (req, res) => {
    try {
        const { titleId } = req.body;
        const user = req?.user;
        let errorObj = handleValidations(res, [ {'titleId': titleId} ]);
        if(Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let titleRef = await db.collection('snippets').where('titleId', '==', titleId).get();
        if (titleRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${titleId}`
            })
            return;
        }
        titleRef.forEach(doc => {
            let docData = doc.data();
            if (docData?.bookmarkedUser && docData?.bookmarkedUser?.length > 0) {
                let bookmarkedUser = docData?.bookmarkedUser;
                const bookmarkedItemIndex = docData?.bookmarkedUser?.findIndex(el => el === user);
                if(bookmarkedItemIndex > -1) {
                    bookmarkedUser?.splice(bookmarkedItemIndex);
                }
                let updatedData = {...docData, bookmarkedUser: bookmarkedUser};
                doc.ref.update(updatedData);
            }
        });
        res.status(201).json({
            success: true,
            message: 'Bookmarked Removed Successfully'
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.getBookmarkedSnippet = async (req, res) => {
    try {
        const { topicId, categoryId, pageSize, pageNumber } = req.body;
        let errorObj = handleValidations(res, [ {'topicId': topicId}, {'categoryId': categoryId}, {'pageSize': pageSize}, {'pageNumber': pageNumber} ]);
        if(Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        const user = req?.user;
        let titleRef = await db.collection('snippets').where('topicId', '==', topicId).where('categoryId', '==', categoryId).where('bookmarkedUser', 'array-contains', user).orderBy('createdAt').limit(pageSize).offset(pageSize * (pageNumber - 1)).get();
        let count = await db.collection('snippets').where('topicId', '==', topicId).where('categoryId', '==', categoryId).where('bookmarkedUser', 'array-contains', user).count().get();
        let totalSize = count.data().count;
        if (titleRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found`
            })
            return;
        }
        const snippetData = [];
        titleRef.forEach(doc => {
            snippetData.push(doc.data());
        });
        const snippetFromResponse = snippetData?.length > 0 && snippetData?.map(el => ({ title: el?.title, titleId: el?.titleId, data: el?.data, enabled: el?.enabled }));
        res.status(200).json({
            success: true,
            data: snippetFromResponse,
            totalCount: totalSize
        })
    } catch (error) {
        handleFailError(res, error);
    }
}