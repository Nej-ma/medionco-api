import messageThreadDAO from '../DAO/messageThreadDAO.js';

export const getAllMessageThreads = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming req.user is populated from the authenticateToken middleware
    const threads = await messageThreadDAO.findAllForUser(userId);
    res.json(threads);
  } catch (error) {
    next(error);
  }
};




export const getMessageThreadById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const thread = await messageThreadDAO.findById(id);
    if (thread) {
      res.json(thread);
    } else {
      res.status(404).send('Message Thread not found');
    }
  } catch (error) {
    next(error);
  }
};

export const findOrCreateThread = async (req, res, next) => {
  try {
    console.log("findOrCreateThread req.params: ", req.params);
      const { receiverId } = req.params;
      // Assuming senderId and receiverId are already user IDs. 
      // If they are doctor IDs, you'll need to convert them to user IDs first.
      const senderId = req.user.id; // Assuming req.user is populated from the authenticateToken middleware
      const thread = await messageThreadDAO.findOrCreate(senderId, receiverId);

      if (thread) {
          res.json({ threadId: thread.id });
          console.log("threadId: ", thread.id);
      } else {
          res.status(400).send('Unable to find or create a message thread.');
      }
  } catch (error) {
      console.error("Error in findOrCreateThread:", error);
      next(error);
  }
};

export const createMessageThread = async (req, res, next) => {
  try {
    const { participant1, participant2 } = req.body; // Ensure this data is validated and sanitized
    const newThread = await messageThreadDAO.findOrCreate(participant1, participant2);
    res.status(201).json(newThread);
  } catch (error) {
    next(error);
  }
};

export const deleteMessageThread = async (req, res, next) => {
  try {
    const { id } = req.params;
    await messageThreadDAO.softDelete(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
