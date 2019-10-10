var express = require('express');
var router = express.Router();
const Map = require('../models/map');

// ================================= BROWSE DATA ================================
router.post('/search', (req, res) => {
    let response = [];
    let title = req.body.title;
    if (title != undefined) {
        Map.find({ title }).then(data => {
            res.status(200).json(data);
        }).catch(err => res.status(400).json(err));
    } else {
        response.message = 'Tidak boleh kosong';
        res.status(400).json(response);
    }
})

// ============================ READ DATA LIST =================================
router.get('/', function (req, res) {
    Map.find().then((data) => {
        res.json(data);
    }).catch(err => {
        res.status(400).json(err);
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

    let { title, lat, lng } = req.body;
    if (title != undefined || lat != undefined || lng != undefined) {
        let updateData = {};
        title ? updateData.title = title : '';
        lat ? updateData.lat = lat : '';
        lng ? updateData.lng = lng : '';

        Map.findByIdAndUpdate(id, updateData).exec().then(before => {
            response.success = true;
            response.message = 'data have been update';
            response.data._id = id;
            response.data.title = title || before.title;
            response.data.lat = lat || before.lat;
            response.data.lng = lng || before.lng;
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
            title: '',
            lat: null,
            lng: null
        }
    }

    let { title, lat, lng } = req.body;
    if (title != undefined || lat != undefined || lng != undefined) {
        const map = new Map({
            title, lat, lng
        })
        map.save().then(result => {
            response.success = true;
            response.message = 'data have been added';
            response.data._id = result._id;
            response.data.title = result.title;
            response.data.lat = result.lat;
            response.data.lng = result.lng;
            res.status(201).json(response);
        }).catch(err => {
            response.message = 'failed to add'
            res.status(400).json(response);
        })
    } else {
        response.message = 'data cannot empty';
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

    Map.findByIdAndDelete(id).exec().then(before => {
        if (before) {
            response.success = true;
            response.message = 'data have been deleted';
            response.data._id = id;
            response.data.title = before.title;
            response.data.lat = before.lat;
            response.data.lng = before.lng;
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

    Map.findById(id).exec().then(result => {
        if (result) {
            response.success = true;
            response.message = 'data found';
            response.data._id = id;
            response.data.title = result.title;
            response.data.lat = result.lat;
            response.data.lng = result.lng;
            res.status(200).json(response);
        } else {
            response.message = 'data not found';
            res.status(400).json(response);
        }
    })
})

module.exports = router;