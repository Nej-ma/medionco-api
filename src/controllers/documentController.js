import documentDAO from '../DAO/documentDAO.js';

// src/controllers/documentController.js


export const getAllDocuments = async (req, res, next) => {
    try {
        const documents = await documentDAO.findAll();
        res.json(documents);
    } catch (error) {
        next(error);
    }
};

export const getDocumentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const document = await documentDAO.findById(id);
        if (document) {
            res.json(document);
        } else {
            res.status(404).send('Document not found');
        }
    } catch (error) {
        next(error);
    }
};

export const createDocument = async (req, res, next) => {
    try {
        const newDocument = await documentDAO.create(req.body);
        res.status(201).json(newDocument);
    } catch (error) {
        next(error);
    }
};

export const updateDocument = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedDocument = await documentDAO.update(id, req.body);
        if (updatedDocument) {
            res.json(updatedDocument);
        } else {
            res.status(404).send('Document not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteDocument = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await documentDAO.softDelete(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Document not found');
        }
    } catch (error) {
        next(error);
    }
};

export const restoreDocument = async (req, res, next) => {
    try {
        const id = req.params.id;
        await documentDAO.restore(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
