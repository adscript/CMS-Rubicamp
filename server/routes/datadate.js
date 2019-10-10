var express = require('express');
var router = express.Router();
const dataDate = require('../models/datadate');

// ================================= BROWSE DATA ================================
router.post('/search', (req, res) => {
    let response = [];
    let { letter, frequency } = req.body;
    if (letter != undefined || frequency != undefined) {
        let filterDate = {};
        letter ? filterDate.letter = letter : '';
        frequency ? filterDate.frequency = frequency : '';
        dataDate.find(filterDate).then(date => {
            res.status(200).json(date);
        }).catch(err => res.status(400).json(err));
    } else {
        response.message = 'Tidak boleh kosong';
        res.status(400).json(response);
    }
})

// ============================ READ DATA LIST =================================
router.get('/', function (req, res) {
    dataDate.find().then((date) => {
        res.json(date);
    }).catch(err => {
        res.status(400).json(response);
    })
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

        dataDate.findByIdAndUpdate(id, updateData).exec().then(before => {
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
        const date = new dataDate({
            letter, frequency
        })
        date.save().then(result => {
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

// ================================== DELETE DATA =================================
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    let response = {
        success: false,
        message: '',
        data: {}
    }

    dataDate.findByIdAndDelete(id).exec().then(before => {
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

    dataDate.findById(id).exec().then(result => {
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