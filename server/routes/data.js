var express = require('express');
var router = express.Router();
const Data = require('../models/data');

// ============================ READ DATA LIST =================================
router.get('/', function (req, res) {
    Data.find().then((data) => {
        res.json(data);
    }).catch(err => {
        res.status(400).json(response);
    })
})

// ============================ ADD DATA  ======================================
router.post('/', function (req, res) {
    let response = {
        success: false,
        message: '',
        data: {
            _id: '',
            letter: '',
            frequency: null
        }
    }

    let { letter, frequency } = req.body;
    if (letter != undefined || frequency != undefined) {
        const data = new Data({
            letter, frequency
        })
        data.save().then(result => {
            response.success = true;
            response.message = 'data have been added';
            response.data._id = result._id;
            response.data.letter = result.letter;
            response.data.frequency = result.frequency;
            res.status(201).json(response);
        }).catch(err => {
            response.message = 'failed to add'
            res.status(400).json(response);
        })
    } else {
        response.message = 'letter and frequency cannot empty';
        res.status(400).json(response);
    }
})

// ================================= BROWSE DATA ================================
router.post('/search', (req, res) => {
    let { letter, frequency } = req.body;
    if (letter != undefined || frequency.toString() != 'NaN') {
        let filterData = {};
        letter ? filterData.letter = {$regex : letter, $options: 'i'} : undefined;
        frequency.length > 0 ? filterData.frequency = Number(frequency) : undefined;

        Data.find(filterData).then(data => {
            res.json(data);
        }).catch(err => res.status(400).json(err));
    }
})

// ================================== EDIT DATA =================================
router.put('/:id', (req, res) => {
    let id = req.params.id;
    let response = {
        success: false,
        message: '',
        data: {}
    }

    let { letter, frequency } = req.body;
    if (letter != undefined || frequency != undefined) {
        let updateData = {};
        letter ? updateData.letter = letter : '';
        frequency ? updateData.frequency = frequency : '';

        Data.findByIdAndUpdate(id, updateData).exec().then(before => {
            response.success = true;
            response.message = 'data have been update';
            response.data._id = id;
            response.data.letter = letter || before.letter;
            response.data.frequency = frequency || before.frequency;
            res.status(201).json(response);
        })
    } else {
        response.message = 'cant be empty';
        res.status(400).json(response);
    };
});

// ================================== DELETE DATA =================================
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    let response = {
        success: false,
        message: '',
        data: {}
    }

    Data.findByIdAndDelete(id).exec().then(before => {
        if (before) {
            response.success = true;
            response.message = 'data have been deleted';
            response.data._id = id;
            response.data.letter = before.letter;
            response.data.frequency = before.frequency;
            res.status(201).json(response);
        } else {
            response.message = 'deleted failed, no data found';
            res.status(400).json(response);
        }
    })
})

// ================================== FIND DATA =================================
router.get('/:id', (req, res) => {
    let id = req.params.id;
    let response = {
        success: false,
        message: '',
        data: {}
    }

    Data.findById(id).exec().then(result => {
        if (result) {
            response.success = true;
            response.message = 'data found';
            response.data._id = id;
            response.data.letter = result.letter;
            response.data.frequency = result.frequency;
            res.status(200).json(response);
        } else {
            response.message = 'data not found';
            res.status(400).json(response);
        }
    })
})

module.exports = router;