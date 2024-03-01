const router = require('express').Router();

const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorUtils');
const friendlyService = require('../services/friendlyService');


router.get('/dashboard', async (req, res) => {
    const friendly = await friendlyService.getAll();
 
    res.render('friendly/dashboard', { friendly }); 
 });

 router.get('/create', isAuth, (req, res) => {
    res.render('friendly/create');
 });
 
 router.post('/create', isAuth, async (req, res) => {
    const friendlyData = req.body;
 
    try {
       await friendlyService.create(req.user._id, friendlyData); //calling our service, creatin db and validation and create our data, req.user_id --> req.user_id
    } catch (error) {
       return res.status(400).render('friendly/create', {...friendlyData, error: getErrorMessage(error) }); //when we have mistake to return in same page with the error message
    }
 
    res.redirect('/friendly/dashboard');
 });

 router.get('/:animalId/details', async (req, res) => {
    const friendly = await friendlyService.getOne(req.params.animalId); 
 
    const isOwner = friendly.owner == req.user?._id;
    
    const isDonated = friendly.donations?.some(id => id == req.user._id); 
 
    res.render('friendly/details', { ...friendly, isOwner, isDonated }); 
 });

 router.get('/:animalId/donate', isAuth, async (req, res) => {
    try{
       await friendlyService.donate(req.user._id, req.params.animalId);
    }catch(error){
       return res.status(400).render('404', {error: getErrorMessage(error)});
    }
   
    res.redirect(`/friendly/${req.params.animalId}/details`);
 });

 router.get('/:animalId/edit', isAuth, async (req, res) => {
    const friendly = await friendlyService.getOne(req.params.animalId);
 
    res.render('friendly/edit', { ...friendly });
 });
 
 
 router.post('/:animalId/edit', isAuth, async (req, res) => {
    const friendlyData = req.body;

    try{
        await friendlyService.edit(req.params.animalId, friendlyData); 
 
        res.redirect(`/friendly/${req.params.animalId}/details`);
    }catch(error){
        return res.render('friendly/edit', { ...friendlyData, error: getErrorMessage(error)});
    }
    
 })

 router.get('/:animalId/delete', isAuth, async (req, res) => {
    await friendlyService.delete(req.params.animalId);

    res.redirect('/friendly/dashboard')
 })

 router.get('/search', async (req, res) => {
    const { location } = req.query;
    const friendly = await friendlyService.search(location);
 
    res.render('friendly/search', { friendly, location });
 });
 

module.exports = router;