'use strict'

const chai = require('chai');
const chaiHTTP = require('chai-http');

const server = require('../app');
const Data = require("../models/data");

const should = chai.should();
const { expect } = require('chai')
chai.use(chaiHTTP);

describe('data', function () {

    beforeEach(function (done) {
        let data = new Data({
            letter: "A",
            frequency: 1.1
        });

        data.save(function (err) {
            if (err) console.log(err)
            else
                done();
        })
    })

    afterEach(function (done) {
        Data.collection.drop();
        done();
    });

    // ==================================================== TEST BROWSE ====================================================
    it('seharusnya mendapatkan daftar data yang ada di table data jika search letter dan frequency dengan metode post', function (done) {
        chai.request(server)
            .post('/api/data/search')
            .send({
                'letter': 'A',
                'frequency': 1.1
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('letter');
                res.body[0].should.have.property('frequency');
                res.body[0].letter.should.equal('A');
                res.body[0].frequency.should.equal(1.1);
                done();
            })
    })

    it('seharusnya mendapatkan daftar data yang ada di table data jika search letter dengan metode post', function (done) {
        chai.request(server)
            .post('/api/data/search')
            .send({
                'letter': 'A'
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('letter');
                res.body[0].should.have.property('frequency');
                res.body[0].letter.should.equal('A');
                res.body[0].frequency.should.equal(1.1);
                done();
            })
    })

    it('seharusnya mendapatkan daftar data yang ada di table data jika search frequency dengan metode post', function (done) {
        chai.request(server)
            .post('/api/data/search')
            .send({
                'frequency': 1.1
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('letter');
                res.body[0].should.have.property('frequency');
                res.body[0].letter.should.equal('A');
                res.body[0].frequency.should.equal(1.1);
                done();
            })
    })
    // =========================================== END BROWSE TEST =====================================================

    // =========================================== START TEST READ =====================================================
    it('seharusnya mendapatkan daftar data yang ada di table data dengan metode get', function (done) {
        chai.request(server)
            .get('/api/data/')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('letter');
                res.body[0].should.have.property('frequency');
                res.body[0].letter.should.equal('A');
                res.body[0].frequency.should.equal(1.1);
                done();
            })
    })
    // ============================================ END TEST READ ======================================================

    // ============================================ EDIT DATA TEST =====================================================
    it('seharusnya berhasil edit data dari daftar data yang ada di table data dengan metode PUT', function (done) {
        chai.request(server)
            .post(`/api/data/search`)
            .send({
                letter: 'A'
            })
            .end(function (err, data) {
                chai.request(server)
                    .put(`/api/data/${data.body[0]._id}`)
                    .send({ 'letter': 'B' })
                    .end(function (error, response) {
                        response.should.have.status(201);
                        response.body.should.be.a('object');
                        response.body.should.have.property('success');
                        response.body.should.have.property('message');
                        response.body.should.have.property('data');
                        response.body.data.should.have.property('_id');
                        response.body.data.should.have.property('letter');
                        response.body.data.should.have.property('frequency');
                        response.body.data.frequency.should.equal(1.1);
                        response.body.data.letter.should.equal('B');
                        done();
                    });
            })
    });
    // ============================================ END EDIT DATA TEST =====================================================

    // ============================================ ADD DATA TEST ==========================================================
    it('seharusnya berhasil tambah data  di table data dengan metode POST', function (done) {
        chai.request(server)
            .post(`/api/data`)
            .send({
                letter: "B",
                frequency: 1.2
            })
            .end(function (err, response) {
                response.should.have.status(201);
                response.body.should.be.a('object');
                response.body.should.have.property('success');
                response.body.should.have.property('message');
                response.body.should.have.property('data');
                response.body.data.should.have.property('_id');
                response.body.data.should.have.property('letter');
                response.body.data.should.have.property('frequency');
                response.body.data.frequency.should.equal(1.2);
                response.body.data.letter.should.equal('B');
                done();
            })
    });
    // ============================================ END ADD DATA TEST ==========================================================

    // ============================================ DELETE DATA TEST ==========================================================
    it('Seharusnya berhasil hapus data di table data dengan metode GET', function (done) {
        chai.request(server)
            .post(`/api/data/search`)
            .send({
                letter: 'A'
            })
            .end(function (err, data) {
                chai.request(server)
                    .delete(`/api/data/${data.body[0]._id}`)
                    .end(function (err, response) {
                        response.should.have.status(201);
                        response.body.should.be.a('object');
                        response.body.should.have.property('success');
                        response.body.should.have.property('message');
                        response.body.should.have.property('data');
                        response.body.data.should.have.property('_id');
                        response.body.data.should.have.property('letter');
                        response.body.data.should.have.property('frequency');
                        response.body.success.should.equal(true);
                        response.body.message.should.equal("data have been deleted");
                        response.body.data.frequency.should.equal(1.1);
                        response.body.data.letter.should.equal('A');
                        done();
                    })
            })
    })
    // ============================================ END DELETE DATA TEST ==========================================================

    // ============================================ FIND DATA TEST ==========================================================
    it('Seharusnya berhasil find data di table data dengan metode GET', function (done) {
        chai.request(server)
            .post(`/api/data/search`)
            .send({
                letter: 'A'
            })
            .end(function (err, data) {
                chai.request(server)
                    .get(`/api/data/${data.body[0]._id}`)
                    .end(function (error, response) {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('success');
                        response.body.should.have.property('message');
                        response.body.should.have.property('data');
                        response.body.data.should.have.property('_id');
                        response.body.data.should.have.property('letter');
                        response.body.data.should.have.property('frequency');
                        response.body.success.should.equal(true);
                        response.body.message.should.equal("data found");
                        response.body.data.frequency.should.equal(1.1);
                        response.body.data.letter.should.equal('A');
                        done();
                    })
            })
    })
    // ============================================ END FIND DATA TEST ==========================================================
})