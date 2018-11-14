"use strict"

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

const { EVENT_IDS } = require('./event_ids.js')

app.get('/api/rally/getids/:year', function(req, res) {

    const year = req.params.year;

    res.send(EVENT_IDS[year])

})

app.get('/api/rally/:shortname/:year', function(req, res) {
    //console.log(req.params)

    const rallyYear = req.params.year;
    const rallyName = EVENT_IDS[rallyYear][req.params.shortname].name; 
    const rallyId = EVENT_IDS[rallyYear][req.params.shortname].id;

    let url = `https://www.ewrc-results.com/results/${rallyId}-${rallyName}-${rallyYear}/`

    console.log(url);

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            let $ = cheerio.load(html);

            let driver, codriver, difference, splitDriver;
            let json = { 
                topTen : [
                    { driver : "", codriver : "", difference: "" },
                    { driver : "", codriver : "", difference: "" },
                    { driver : "", codriver : "", difference: "" },
                    { driver : "", codriver : "", difference: "" },
                    { driver : "", codriver : "", difference: "" },
                    { driver : "", codriver : "", difference: "" },
                    { driver : "", codriver : "", difference: "" },
                    { driver : "", codriver : "", difference: "" },
                    { driver : "", codriver : "", difference: "" },
                    { driver : "", codriver : "", difference: "" },
                ]
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

                json.topTen[i-1].driver = driver;
                json.topTen[i-1].codriver = codriver;
                json.topTen[i-1].difference = difference;

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

                json.topTen[i-1].driver = driver;
                json.topTen[i-1].codriver = codriver;
                json.topTen[i-1].difference = difference;

                i++;
            }

            // Finally, we'll define the variables we're going to capture

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

            let driver, pointsTotal, splitDriver;
            let json = { 
                topTen : [
                    { driver : "", points : ""},
                    { driver : "", points : ""},
                    { driver : "", points : ""},
                    { driver : "", points : ""},
                    { driver : "", points : ""},
                    { driver : "", points : ""},
                    { driver : "", points : ""},
                    { driver : "", points : ""},
                    { driver : "", points : ""},
                    { driver : "", points : ""},
                ]
            }

            for(var i = 2; i < 12;) {
                        

                $(`.table_sude:nth-child(${i}) a`).filter(function() {
                    driver = $(this).text();
                })

                $(`.table_sude:nth-child(${i}) .points-total`).filter(function() {
                    pointsTotal = $(this).text();
                })

                splitDriver = driver.split(' ')
                driver = splitDriver[1] + ' ' + splitDriver[0];

                json.topTen[i-2].driver = driver;
                json.topTen[i-2].points = pointsTotal;

                i++;


                $(`.table_liche:nth-child(${i}) a`).filter(function() {
                    driver = $(this).text();
                })

                $(`.table_liche:nth-child(${i}) .points-total`).filter(function() {
                    pointsTotal = $(this).text();
                })

                splitDriver = driver.split(' ')
                driver = splitDriver[1] + ' ' + splitDriver[0];

                json.topTen[i-2].driver = driver;
                json.topTen[i-2].points = pointsTotal;

                i++;
            }

            res.send(json);
        }
    })
})

app.listen(process.env.PORT|| '8081')

console.log('Running on port 8081')

exports = module.exports = app;