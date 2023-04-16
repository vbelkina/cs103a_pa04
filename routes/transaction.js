const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction')
const User = require('../models/User')


isLoggedIn = (req,res,next) => {
    if (res.locals.loggedIn) {
      next()
    } else {
      res.redirect('/login')
    }
  }

// get the value associated to the key
router.get('/transaction/',
  isLoggedIn,
  async (req, res, next) => {
    let items=[]
    items = 
        await Transaction.find({userId:req.user._id})
        .sort({date:-1, amount:1});
    res.render('transactionList',{items});
});

/* add the value in the body to the list associated to the key */
router.post('/transaction',
  isLoggedIn,
  async (req, res, next) => {
      const transaction = new Transaction(
        {description:req.body.description,
         createdAt: new Date(),
         date: req.body.date,
         userId: req.user._id,
         edit: false,
         category: req.body.category,
         amount: req.body.amount
        })
      await transaction.save();
      res.redirect('/transaction')
});

router.get('/transaction/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/remove/:itemId")
      await Transaction.deleteOne({_id:req.params.itemId});
      res.redirect('/transaction')
});

router.get('/transaction/edit/:itemId',
  isLoggedIn,
  async (req, res, next) => {
        console.log("inside /transaction/edit/:itemId")
        await Transaction.findOneAndUpdate(
            {_id:req.params.itemId},
            {
              $set: {edit:true}} 
            );        
        res.redirect('/transaction');
});

router.post('/transaction/finish_edit/:itemId', 
    isLoggedIn, 
    async (req, res, next) => {
    try {
        const itemId = req.params.itemId;
        const updatedItem = {
        description: req.body.edit_description,
        category: req.body.edit_category,
        amount: req.body.edit_amount,
        date: req.body.edit_date,
        edit: false
        };
        const result = await Transaction.findByIdAndUpdate(itemId, updatedItem, { new: true });
        res.redirect('/transaction');
    } catch (error) {
        next(error);
    }
});

router.get('/transaction/sortByCategory/',
    isLoggedIn,
    async (req, res, next) => {
        let items=[]
        items = 
            await Transaction.find({userId:req.user._id})
            .sort({category:1});
        res.render('transactionList',{items});
});

router.get('/transaction/sortByAmount/',
    isLoggedIn,
    async (req, res, next) => {
        let items=[]
        items = 
            await Transaction.find({userId:req.user._id})
            .sort({amount:-1});
        res.render('transactionList',{items});
});

router.get('/transaction/sortByDescription/',
    isLoggedIn,
    async (req, res, next) => {
        let items=[]
        items = 
            await Transaction.find({userId:req.user._id})
            .sort({description:1});
        res.render('transactionList',{items});
});

router.get('/transaction/sortByDate/',
    isLoggedIn,
    async (req, res, next) => {
        let items=[]
        items = 
            await Transaction.find({userId:req.user._id})
            .sort({date:-1});
        res.render('transactionList',{items});
});

router.get('/transaction/groupByCategory/',
    isLoggedIn,
    async (req, res, next) => {
    let results =
        await Transaction.aggregate(
            [ {$match: {userId: new mongoose.Types.ObjectId(req.user._id)}},
                {$group:{
                _id: '$category',
                total:{$sum:'$amount'},
                }},
              {$sort:{total:-1}},              
            ])
          
    res.render('trans_groupByCategory', {results})

});



module.exports = router;
