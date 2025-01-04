const express = require('express');
const router = express.Router();

// Insert UserStory
router.post('/userstories', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { id, title, description } = req.body;

        if (!id || !title || !description) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const result = await db.collection('userstories').insertOne({ id, title, description });
        res.status(201).json({ message: 'UserStory inserted successfully.', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update UserStory by ID
router.put('/userstories/:id', async (req, res) => {
    try {
        const db = req.app.get('db');
        const id = parseInt(req.params.id);
        const { title, description } = req.body;

        const result = await db.collection('userstories').findOneAndUpdate(
            { id },
            { $set: { title, description } },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            return res.status(404).json({ error: 'UserStory not found.' });
        }

        res.json({ message: 'UserStory updated successfully.', result: result.value });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete UserStory by ID
router.delete('/userstories/:id', async (req, res) => {
    try {
        const db = req.app.get('db');
        const id = parseInt(req.params.id);

        const result = await db.collection('userstories').deleteOne({ id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'UserStory not found.' });
        }

        res.json({ message: 'UserStory deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clear all UserStories
router.delete('/userstories', async (req, res) => {
    try {
        const db = req.app.get('db');
        await db.collection('userstories').deleteMany({});
        res.json({ message: 'All UserStories cleared.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read UserStory by ID
router.get('/userstories/:id', async (req, res) => {
    try {
        const db = req.app.get('db');
        const id = parseInt(req.params.id);

        const result = await db.collection('userstories').findOne({ id });
        if (!result) {
            return res.status(404).json({ error: 'UserStory not found.' });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all UserStories
router.get('/userstories', async (req, res) => {
    try {
        const db = req.app.get('db');

        const results = await db.collection('userstories').find().toArray();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
