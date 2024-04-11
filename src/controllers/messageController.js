import messageDAO from '../DAO/messageDAO.js';
import messageThreadDAO from '../DAO/messageThreadDAO.js';
export const getMessagesByThreadId = async (req, res, next) => {
    try {
        const { threadId } = req.params;
        const messages = await messageDAO.findAllByThreadId(threadId);
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

export const getMessageById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = await messageDAO.findById(id);
        if (message) {
            res.json(message);
        } else {
            res.status(404).send('Message not found');
        }
    } catch (error) {
        next(error);
    }
};


export const createMessage = async (req, res, next) => {
    try {
        const senderId = req.user.id; // Extracted from authenticateToken middleware
        const receiverId = req.body.receiverId; // ID of the message receiver
        const content = req.body.content;
        console.log("senderId, receiverId, content: ", senderId, receiverId, content);

        // Correct the findOrCreate usage by removing the duplicate definition in messageThreadDAO.
        const thread = await messageThreadDAO.findOrCreate(senderId, receiverId);

        // Ensure thread creation is successful before proceeding.
        if (!thread) {
            return res.status(400).send('Failed to create or find message thread.');
        }

        // Once the thread is ensured, proceed to create a message in that thread
        const newMessage = await messageDAO.create({ threadId: thread.id, senderId, content });
        
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error creating message: ", error);
        next(error);
    }
};



export const deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        await messageDAO.softDelete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
