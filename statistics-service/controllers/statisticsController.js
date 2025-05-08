const Grade = require('../models/Grade');
const { Sequelize } = require('sequelize');

const getStatistics = async (req, res) => {
    try {
        const [total, average, min, max] = await Promise.all([
            Grade.count(),
            Grade.findAll({
                attributes: [[Sequelize.fn('AVG', Sequelize.col('grade')), 'average']],
                raw: true
            }),
            Grade.min('grade'),
            Grade.max('grade'),
        ]);

        res.json({
            total,
            average: parseFloat(average[0].average),
            min,
            max,
        });
    } catch (err) {
        console.error('Error fetching statistics:', err);
        res.status(500).json({ error: 'Failed to retrieve statistics' });
    }
};

module.exports = { getStatistics };
