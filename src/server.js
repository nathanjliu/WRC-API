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

app.get('/api/driver/getids/:surname', function(req, res) {

    const searchQuery = req.params.surname;

    let url = `https://www.ewrc-results.com/search/?find=${searchQuery}`

    request(url, function(error, response, html){

        if(!error) {
            let $ = cheerio.load(html);

            let id, splitDriver, driver, entry;
            let json = {
                results : []
            };

            for(var i = 1; i < 21; i++) {
                $(`.search-event-driver:nth-child(1) tr:nth-child(${i}) .flag-s+ a`).filter(function() {
                    let text = $(this).text();
                    console.log(text)
                        text = text.replace(/[$-/]/g, "")
                        splitDriver = text.split(' ');
                        driver = splitDriver[2] + ' ' + splitDriver[1];

                        let link = $(this).attr('href');
                        id = link.replace(/[A-Za-z$-/]/g, "");
                })

                entry = { id : id, driver : driver };
                (json.results).push(entry);

                if(i > 1 && id == json.results[i-2].id) { (json.results).pop(); break; };
            }

            res.send(json);
            
        }

    })

})

app.get('/api/driver/:id/:firstname/:surname', function(req, res) {

    const id = req.params.id;
    const name = req.params.firstname + '-' + req.params.surname;

    let url = `https://www.ewrc-results.com/profile/${id}-${name}/1`

    request(url, function(error, response, html){

        if(!error) {
            let $ = cheerio.load(html);
            
            let json = {
                wrcResults : {
                    startsTotal : "",
                    retirements: "",
                    victoriesTotal : "",
                    podiums: "",
                    firstEvent: "",
                    lastEvent: "",
                }
            };

            for (var i = 0; i < 6; i++) {

                $(`.profile-stats-item:nth-child(1) tr:nth-child(${i+1}) .bold`).filter(function() {
                    let data = $(this).text();
                    json.wrcResults[Object.keys(json.wrcResults)[i]] = data;
                })
            }

            res.send(json);
            
        }

    })

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
    
    if (year > 1978) {

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
    } else {
        res.send('Date not supported');
    }
})

app.listen(process.env.PORT || '8081')

exports = module.exports = app;