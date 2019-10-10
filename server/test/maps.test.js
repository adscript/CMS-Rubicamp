'use strict'

const chai = require('chai');
const chaiHTTP = require('chai-http');

const server = require('../app');
const Map = require("../models/map");

const should = chai.should();
const { expect } = require('chai')
chai.use(chaiHTTP);

describe('maps', function () {

    beforeEach(function (done) {
        let map = new Map({
            title: "Trans Studio Mall",
            lat: -6.9261257,
            lng: 107.6343728
        });

        map.save(function (err) {
            if (err) console.log(err)
            else
                done();
        })
    })

    afterEach(function (done) {
        Map.collection.drop();
        done();
    });

    // ==================================================== TEST BROWSE ====================================================
    it('seharusnya mendapatkan daftar data map jika search title dengan metode post', function (done) {
        chai.request(server)
            .post('/api/maps/search')
            .send({
                'title': 'Trans Studio Mall',
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('lat');
                res.body[0].should.have.property('lng');
                res.body[0].title.should.equal('Trans Studio Mall');
                res.body[0].lat.should.equal(-6.9261257);
                res.body[0].lng.should.equal(107.6343728);
                done();
            })
    })
    // =========================================== END BROWSE TEST =====================================================

    // =========================================== START TEST READ =====================================================
    it('seharusnya mendapatkan daftar map yang ada di table map dengan metode get', function (done) {
        chai.request(server)
            .get('/api/maps/')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('lat');
                res.body[0].should.have.property('lng');
                res.body[0].title.should.equal('Trans Studio Mall');
                res.body[0].lat.should.equal(-6.9261257);
                res.body[0].lng.should.equal(107.6343728);
                done();
            })
    })
    // ============================================ END TEST READ ======================================================

    // ============================================ EDIT DATA TEST =====================================================
    it('seharusnya berhasil edit data dari map yang ada di table dengan metode PUT', function (done) {
        chai.request(server)
            .post(`/api/maps/search`)
            .send({
                title: 'Trans Studio Mall'
            })
            .end(function (err, data) {
                chai.request(server)
                    .put(`/api/maps/${data.body[0]._id}`)
                    .send({
                        title: 'Cihampelas Walk',
                        lat: -6.8965475,
                        lng: 107.6103536
                    })
                    .end(function (error, response) {
                        response.should.have.status(201);
                        response.body.should.be.a('object');
                        response.body.should.have.property('success');
                        response.body.should.have.property('message');
                        response.body.should.have.property('data');
                        response.body.data.should.have.property('_id');
                        response.body.data.should.have.property('title');
                        response.body.data.should.have.property('lat');
                        response.body.data.should.have.property('lng');
                        response.body.success.should.equal(true);
                        response.body.data.title.should.equal('Cihampelas Walk');
                        response.body.data.lat.should.equal(-6.8965475);
                        response.body.data.lng.should.equal(107.6103536);
                        done();
                    });
            })
    });
    // ============================================ END EDIT DATA TEST =====================================================

    // ============================================ ADD DATA TEST ==========================================================
    it('seharusnya berhasil tambah data map di table map dengan metode POST', function (done) {
        chai.request(server)
            .post(`/api/maps`)
            .send({
                title: 'Cihampelas Walk',
                lat: -6.8965475,
                lng: 107.6103536
            })
            .end(function (err, response) {
                response.should.have.status(201);
                response.body.should.be.a('object');
                response.body.should.have.property('success');
                response.body.should.have.property('message');
                response.body.should.have.property('data');
                response.body.data.should.have.property('_id');
                response.body.data.should.have.property('title');
                response.body.data.should.have.property('lat');
                response.body.data.should.have.property('lng');
                response.body.success.should.equal(true);
                response.body.data.title.should.equal('Cihampelas Walk');
                response.body.data.lat.should.equal(-6.8965475);
                response.body.data.lng.should.equal(107.6103536);
                done();
            })
    });
    // ============================================ END ADD DATA TEST ==========================================================

    // ============================================ DELETE DATA TEST ==========================================================
    it('Seharusnya berhasil hapus map di table map dengan metode GET', function (done) {
        chai.request(server)
            .post(`/api/maps/search`)
            .send({
                title: 'Trans Studio Mall'
            })
            .end(function (err, data) {
                chai.request(server)
                    .delete(`/api/maps/${data.body[0]._id}`)
                    .end(function (err, response) {
                        response.should.have.status(201);
                        response.body.should.be.a('object');
                        response.body.should.have.property('success');
                        response.body.should.have.property('message');
                        response.body.should.have.property('data');
                        response.body.data.should.have.property('_id');
                        response.body.data.should.have.property('title');
                        response.body.data.should.have.property('lat');
                        response.body.data.should.have.property('lng');
                        response.body.success.should.equal(true);
                        response.body.data.title.should.equal('Trans Studio Mall');
                        response.body.data.lat.should.equal(-6.9261257);
                        response.body.data.lng.should.equal(107.6343728);
                        done();
                    })
            })
    })
    // ============================================ END DELETE DATA TEST ==========================================================

    // ============================================ FIND DATA TEST ==========================================================
    it('Seharusnya berhasil find data di table data dengan metode GET', function (done) {
        chai.request(server)
            .post(`/api/maps/search`)
            .send({
                title: 'Trans Studio Mall'
            })
            .end(function (err, data) {
                chai.request(server)
                    .get(`/api/maps/${data.body[0]._id}`)
                    .end(function (error, response) {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('success');
                        response.body.should.have.property('message');
                        response.body.should.have.property('data');
                        response.body.data.should.have.property('_id');
                        response.body.data.should.have.property('title');
                        response.body.data.should.have.property('lat');
                        response.body.data.should.have.property('lng');
                        response.body.success.should.equal(true);
                        response.body.data.title.should.equal('Trans Studio Mall');
                        response.body.data.lat.should.equal(-6.9261257);
                        response.body.data.lng.should.equal(107.6343728);
                        done();
                    })
            })
    })
    // ============================================ END FIND DATA TEST ==========================================================

})