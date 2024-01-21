import manga from './manga.js';

const initRoutes = (app) => {    
    app.use('/manga', manga);
};

export default initRoutes;