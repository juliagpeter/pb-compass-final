const { faker } = require('@faker-js/faker');

async function generateMovie() {
    const title = faker.lorem.words(4); 
    const description = faker.lorem.sentence();
    const launchdate = faker.date.future();
    const showtimes = [
        faker.date.future().toISOString(),
        faker.date.future().toISOString()
    ];

    return {
        title,
        description,
        launchdate: launchdate.toISOString(),
        showtimes
    };
}

module.exports = generateMovie; 
