import connection from '../middleware/db.js';

// Get chat history with pagination
const getChatHistory = async (req, res, next) => {
    const { room } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const [rows] = await connection.query(
            'SELECT * FROM chat_messages WHERE room = ? ORDER BY timestamp ASC LIMIT ? OFFSET ?',
            [room, parseInt(limit), parseInt(offset)]
        );

        const [[{ total }]] = await connection.query(
            'SELECT COUNT(*) as total FROM chat_messages WHERE room = ?',
            [room]
        );

        res.json({
            messages: rows,
            metadata: {
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                limit: parseInt(limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// Send a new message
const sendMessage = async (req, res, next) => {
    const { room, sender, message } = req.body;

    try {
        if (!room || !sender || !message) {
            return res.status(400).json({ error: 'Room, sender, and message are required' });
        }

        const [result] = await connection.query(
            'INSERT INTO chat_messages (room, sender, message) VALUES (?, ?, ?)',
            [room, sender, message]
        );

        res.status(201).json({ id: result.insertId, room, sender, message, timestamp: new Date() });
    } catch (error) {
        next(error);
    }
};

// Delete a message
const deleteMessage = async (req, res, next) => {
    const { messageId } = req.params;

    try {
        const [result] = await connection.query(
            'DELETE FROM chat_messages WHERE id = ?',
            [messageId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Mark messages as read
const markAsRead = async (req, res, next) => {
    const { room, reader } = req.body;

    try {
        const [result] = await connection.query(
            'UPDATE chat_messages SET read_status = 1 WHERE room = ? AND sender != ?',
            [room, reader]
        );

        res.status(200).json({ updated: result.affectedRows });
    } catch (error) {
        next(error);
    }
};

// Search messages by keyword
const searchMessages = async (req, res, next) => {
    const { room } = req.params;
    const { keyword } = req.query;

    try {
        const [rows] = await connection.query(
            'SELECT * FROM chat_messages WHERE room = ? AND message LIKE ? ORDER BY timestamp ASC',
            [room, `%${keyword}%`]
        );

        res.json(rows);
    } catch (error) {
        next(error);
    }
};

// Get unread message count
const getUnreadCount = async (req, res, next) => {
    const { room, reader } = req.params;

    try {
        const [[{ unread }]] = await connection.query(
            'SELECT COUNT(*) as unread FROM chat_messages WHERE room = ? AND sender != ? AND read_status = 0',
            [room, reader]
        );

        res.json({ unread });
    } catch (error) {
        next(error);
    }
};

export default {
    getChatHistory,
    sendMessage,
    deleteMessage,
    markAsRead,
    searchMessages,
    getUnreadCount,
};
