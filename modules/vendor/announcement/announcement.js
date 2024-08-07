import Announcement from '../../../models/announcementModel.js';
import AppError from '../../../utils/AppError.js';

export const fetchAnnouncements = async (req,res) => {
  try {
    const announcements = await Announcement.findAll({
      order: [['ordering', 'ASC']],
    });
    res.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error);
  }
};



export const addAnnouncement = async (req, res) => {
    try {
        const { title, description, order } = req.body;

        if (!title || !description) {
            throw new AppError('Not enough information', 400);
        }

        // Create a new announcement
        const newAnnouncement = await Announcement.create({
            title,
            description,
            ordering: order || 1
        });

        // Fetch all announcements ordered by the `ordering` field
        const announcements = await Announcement.findAll({
            order: [['ordering', 'ASC']]
        });

        // Respond with the list of announcements
        res.json({ data: announcements });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};



export const editAnnouncement = async (req, res) => {
    try {
        const { id, title, description, order } = req.body;

        if (!id || !title || !description || order === undefined) {
            throw new AppError('Not enough information', 400);
        }

        // Find the announcement by ID
        const updateAnnouncement = await Announcement.findByPk(id);

        if (!updateAnnouncement) {
            throw new AppError('Announcement not found', 400);
        }

        // Update the announcement fields
        updateAnnouncement.title = title;
        updateAnnouncement.description = description;
        updateAnnouncement.ordering = order;

        // Save the updated announcement
        const result = await updateAnnouncement.save();

        if (result) {
            // Fetch all announcements ordered by the `ordering` field
            const announcements = await Announcement.findAll({
                order: [['ordering', 'ASC']]
            });

            // Respond with the list of announcements
            res.json({ data: announcements });
        } else {
            throw new AppError('Cannot be saved', 500);
        }
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }    
};



export const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            throw new AppError('Not enough information', 400);
        }

        // Find the announcement by ID
        const findAnnouncement = await Announcement.findByPk(id);

        if (!findAnnouncement) {
            throw new AppError('Announcement not found', 400);
        }

        // Delete the announcement
        await findAnnouncement.destroy();

        // Fetch all announcements ordered by the `ordering` field
        const announcements = await Announcement.findAll({
            order: [['ordering', 'ASC']]
        });

        // Respond with the list of remaining announcements
        res.json({ data: announcements });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};



