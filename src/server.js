"use strict"

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

const { EVENT_IDS } = require('../data/event_ids.js')

app.get('/api/rally/getids/:year', function(req, res) {

    const year = req.params.year;

    res.send(EVENT_IDS[year])

})

app.get('/api/rally/:name/:year/:id?', function(req, res) {

    let rallyYear = req.params.year;
    let rallyName, rallyId;
    
    if ((req.params.name).includes('-')) {
        rallyName = req.params.name;
    } else {
        rallyName = EVENT_IDS[rallyYear][req.params.name].name; 
    }
    
    if (!req.params.id) {
        rallyId = EVENT_IDS[rallyYear][req.params.name].id;
    } else {
        rallyId = req.params.id
    }

    let url = `https://www.ewrc-results.com/results/${rallyId}-${rallyName}-${rallyYear}/`

    console.log(url);

    request(url, function(error, response, html){


        if(!error){

            let $ = cheerio.load(html);

            let driver, codriver, difference, splitDriver, splitCodriver, entry;
            let json = { 
                topTen : []
            }

            for(var i = 1; i < 11;) {
                

                $(`.stage-results-after .table_sude:nth-child(${i}) a`).filter(function() {
                    let data = $(this).text();
                    let pair = data.split(' - ');
                    driver = pair[0];
                    codriver = pair[1];
                })

                $(`.stage-results-after .table_sude:nth-child(${i}) .stage-results-lost`).filter(function() {
                    let data = $(this).text();
                    let time = data.split('+')
                    difference = '+' + time[1]
                })

                splitDriver = driver.split(' ')
                driver = splitDriver[1] + ' ' + splitDriver[0];
                splitCodriver = codriver.split(' ')
                codriver = splitCodriver[1] + ' ' + splitCodriver[0];

                entry = { driver : driver, codriver : codriver, difference: difference };
                (json.topTen).push(entry);

                i++;


                $(`.stage-results-after .table_liche:nth-child(${i}) a`).filter(function() {
                    let data = $(this).text();
                    let pair = data.split(' - ');
                    driver = pair[0];
                    codriver = pair[1];
                })

                $(`.stage-results-after .table_liche:nth-child(${i}) .stage-results-lost`).filter(function() {
                    let data = $(this).text();
                    let time = data.split('+')
                    difference = '+' + time[1]
                })

                splitDriver = driver.split(' ')
                driver = splitDriver[1] + ' ' + splitDriver[0];
                splitCodriver = codriver.split(' ')
                codriver = splitCodriver[1] + ' ' + splitCodriver[0];

                entry = { driver : driver, codriver : codriver, difference: difference };
                (json.topTen).push(entry);

                i++;
            }

            res.send(json);
        }
    })


})


app.get('/api/championship/:year', function(req, res) {

    let year = req.params.year; 
    let url = `https://www.ewrc-results.com/season/${year}/1-wrc/`

    console.log(url);

    request(url, function(error, response, html){

        if(!error){

            let $ = cheerio.load(html);

            let driver, pointsTotal, splitDriver, entry;
            let json = { 
                topTen : []
            }

            for(var i = 2; i < 12;) {
                        

                $(`.table_sude:nth-child(${i}) a`).filter(function() {
                    driver = $(this).text();
                })

                $(`#points+ .table_h .table_sude:nth-child(${i}) .points-total`).filter(function() {
                    pointsTotal = $(this).text();
                })

                splitDriver = driver.split(' ')
                driver = splitDriver[1] + ' ' + splitDriver[0];

                entry = { driver : driver, points : pointsTotal };
                (json.topTen).push(entry);

                i++;

                $(`.table_liche:nth-child(${i}) a`).filter(function() {
                    driver = $(this).text();
                })

                $(`#points+ .table_h .table_liche:nth-child(${i}) .points-total`).filter(function() {
                    pointsTotal = $(this).text();
                })

                splitDriver = driver.split(' ')
                driver = splitDriver[1] + ' ' + splitDriver[0];

                entry = { driver : driver, points : pointsTotal };
                (json.topTen).push(entry);

                i++;
            }

            res.send(json);
        }
    })
})

app.listen(process.env.PORT || '8081')

exports = module.exports = app;