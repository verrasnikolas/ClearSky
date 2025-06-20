const { addUsersFromExcel } = require('../services/addUsersFromExcel');

const handleEvent = async (event) => {
    switch (event.type) {
        case 'initial_grades_parsed': {
            const { extractedUsers } = event.data;
            await addUsersFromExcel(extractedUsers);
        }
    }
};

module.exports = {handleEvent};
