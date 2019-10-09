'use strict'

const chai = require('chai');
const chaiHTTP = require('chai-http');

const server = require('../app');
const User = require("../models/user");

const should = chai.should();
const { expect } = require('chai')
chai.use(chaiHTTP);

describe('users', function () {

    // setiap sebelum melakukan test, table ditambahkan satu data "belajar TDD"
    beforeEach(function (done) {
        let user = new User({
            email: "adnanradjam@gmail.com",
            password: "AdnanGanteng12#",
            token: ""
        });

        user.save(function (err) {
            if (err) console.log(err)
            else
                done();
        })
    })

    // setiap setelah melakukan test, table di drop
    afterEach(function (done) {
        User.collection.drop();
        done();
    });


    it('seharusnya mendapatkan semua daftar User yang ada di table users dengan metode GET', function (done) {
        chai.request(server)
            .get('/api/users/list')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('email');
                res.body[0].should.have.property('password');
                res.body[0].should.have.property('token');
                res.body[0].email.should.equal('adnanradjam@gmail.com');
                done();
            })
    })

    it('seharusnya menambahkan satu user dengan metode POST', function (done) {
        chai.request(server)
            .post('/api/users/register')
            .send({ 'email': 'testmail@gmail.com', 
                    'password': 'AdnanGanteng12#', 
                    'retypePassword' : 'AdnanGanteng12#' })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.should.have.property('token');
                expect(res.body.token).to.exist;
                res.body.status.should.equal(true);
                res.body.message.should.equal('Register Successfull');
                res.body.data.email.should.equal('testmail@gmail.com');
                done();
            });
    });

    it('seharusnya berhasil login dengan metode POST', function (done) {
        chai.request(server)
            .post('/api/users/login')
            .send({ 'email': 'adnanradjam@gmail.com', 
                    'password': 'AdnanGanteng12#'})
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.should.have.property('token');
                expect(res.body.token).to.exist;
                res.body.status.should.equal(true);
                res.body.message.should.equal('Logged in successfully');
                res.body.data.email.should.equal('adnanradjam@gmail.com');
                done();
            });
    });

})