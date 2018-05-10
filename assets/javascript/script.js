"use strict";

var database = firebase.database();
var trainData = [];

// SCREW MOMENT.JS BECAUSE I CAN MATH... maybe
// below is time conversion logic

// this returns the current time of day in minutes elapsed since midnight
var timeMinutes = function() {
    var d = new Date();
    return(60*d.getHours()+d.getMinutes());
};

// this returns the time of day that a given train leaves in minutes elapsed since midnight
var whenIsTrainInService = function(i) {
    var trainTime = trainData[i].trainFirstArrival.replace(":", "");
    var hours = parseInt(trainTime.slice(0,2));
    var minutes = parseInt(trainTime.slice(2));
    return (60*hours+minutes);
};

// returns true if the train has started running today, else false
var isTrainRunningYet = function(i) {
    if (timeMinutes() >= whenIsTrainInService(i)) {
        return true;
    }
    if (timeMinutes() < whenIsTrainInService(i)) {
        return false;
    };
};

// this calculates the number of minutes until the next train leaves
var whenIsTheNextTrain = function(i) {
    if (isTrainRunningYet(i) === true) {
        var freq = parseInt(trainData[i].trainFrequency);
        var currentTime = timeMinutes();
        var originalDepartureTime = whenIsTrainInService(i);
        var newDepartureTime = originalDepartureTime;
        while (currentTime >= newDepartureTime) {
            newDepartureTime += freq;
        };
        return(newDepartureTime - currentTime);
    }
    else if (isTrainRunningYet(i) === false) {
        return(whenIsTrainInService(i) - timeMinutes());
    };
};

// this calculates the time that the next train leaves
// lolo after writing this, I totally get why moment.js exists
// NEVER AGAIN https://twitter.com/cool3dworld/status/696726669931970560
var timeOfNextTrain = function(i) {
    var timeNextTrain = (timeMinutes() + whenIsTheNextTrain(i)) % 1440;
    if (timeNextTrain < 720) {
        var hours = Math.floor(timeNextTrain/60);
        var min = timeNextTrain % 60;
        if (min < 10) {
            min = "0" + min;
        };
        if (hours === 0) {
            hours = "12";
        };
        return(hours + ":" + min + " AM");
    }
    else if (timeNextTrain === 720) {
        return("12:00 PM");
    }
    else if (timeNextTrain <= 779) {
        var min = timeNextTrain - 720;
        if (min < 10) {
            min = "0" + minutes;
        };
        if (hours === 0) {
            hours = "12";
        };
        return("12:" + min + " PM");
    }
    else if (timeNextTrain > 779) {
        var hours = (Math.floor(timeNextTrain/60)) - 12;
        var min = timeNextTrain % 60;
        if (min < 10) {
            min = "0" + min;
        };
        return(hours + ":" + min + " PM");
    }
    // TODO: handle timeNextTrain >= 1440 here
    // jk omg lol why handle it here lmao, rofl that would have been stupid wtf duh
    // handled with % 1440 near the start of this function gg ez
};
// end time logic
$(function() {
    // populate table on page with info contained in trainData
    // this function gets called by readFromFirebase() and form subimssion
    var populateTable = function() {
        $("#trainSchedule").empty();
        for (var i = 0; i < trainData.length; i++) {
            var newRow = $("<tr>");
            var tName = $("<td>");
            var tDest = $("<td>");
            var tFreq = $("<td>");
            var tNA = $("<td>"); // next arrival
            var tMinAway = $("<td>"); // minutes away
            var tStart = $("<td>");
            
            tName.text(trainData[i].trainName);
            tDest.text(trainData[i].trainDestination);
            tFreq.text(trainData[i].trainFrequency);
            tNA.text(timeOfNextTrain(i));
            // tStart.text(trainData[i].trainFirstArrival);
            tMinAway.text(whenIsTheNextTrain(i));
            
            newRow.append(tName);
            newRow.append(tDest);
            newRow.append(tFreq);
            // newRow.append(tStart);
            newRow.append(tNA);
            newRow.append(tMinAway);

            // append to the table!
            $("#trainSchedule").append(newRow);
        };
    };

    // firebase functions...
    // read from Firebase and populate table
    var readFromFirebase = function() {
        database.ref().on("value", function(snapshot) {
        // console.log(snapshot.val());
        // write what Firebase gave us into trainData
        trainData = snapshot.val().trains;
        populateTable(); // wanted to have this not live here but JavaScript's async nature strikes again!
        }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
        });
    };

    // every 60 seconds
    var readFromFirebase60 = setInterval(function() {
        database.ref().on("value", function(snapshot) {
        // console.log(snapshot.val());
        // write what Firebase gave us into trainData
        trainData = snapshot.val().trains;
        populateTable(); // wanted to have this not live here but JavaScript's async nature strikes again!
        }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
        });
    }, 60000);

    // write to Firebase
    var writeToFirebase = function() {
        database.ref().set({trains: trainData});
    };

    // ------------- let's start with some function calls -------------

    // to start off, we should read from Firebase
    readFromFirebase();

    // ------------- this part handles what happens when the user submits data via the form -------------

    // grab values on form submission
    $(document).on("click", "#trainSubmit", function(event) {
        
        event.preventDefault(); // NO REFRESH!

        // sanity check our user inputs... do not allow empty fields
        if (!$("#trainName").val() ||
        !$("#trainDestination").val() ||
        !$("#trainFirstArrival").val() ||
        !$("#trainFrequency").val()) {
            alert("aw dood fill out the empty fields first")
        }

        else {
            // set variable values based on user input
            var localTrainName = $("#trainName").val().trim();
            var localDestination = $("#trainDestination").val().trim();
            var localTrainFirstArrival = $("#trainFirstArrival").val();
            var localFrequency = $("#trainFrequency").val();

            // console logging to assist development
            // console.log("var localTrainName is: " + localTrainName);
            // console.log("var localDestination is: " + localDestination);
            // console.log("var localTrainFirstArrival is: " + localTrainFirstArrival);
            // console.log("var localFrequency is: " + localFrequency);

            // check for dupes
            var isDupe = false;
            for (var i = 0; i < trainData.length; i++) {
                if (trainData[i].trainName === localTrainName) {
                    // set isDupe = true if it is a dupe
                    isDupe = true;
                    // console.log(isDupe);
                };
            };

            // if isDupe === true, alert the user, clear out only the trainName entry box, reset isDupe to false
            if (isDupe === true) {
                $("#trainName").val("");
                // flip isDupe = false so we don't get stuck 4evaaa
                isDupe = false;
                alert("Please use a different train name; the one you just used is a duplicate.")
            }

            // otherwise, isDupe === false and we accept the input
            else if (isDupe === false) {
                // construct object and push to array
                trainData.push(new TrainObjectBuilder(localTrainName, localDestination, localTrainFirstArrival, localFrequency));
                console.log(trainData);
                // clear form because we love our users and we love good UX
                $("#trainName").val("");
                $("#trainDestination").val("");
                $("#trainFirstArrival").val("");
                $("#trainFrequency").val("");

                // rebuild the table every time the user successfully adds train data
                populateTable();

                // write to FireBase
                writeToFirebase();
            };
        };

    });

    // Object constructor for train data
    // I realize this defeats the point of the homework by vastly simplifying how I interact with Firebase
    // HAUEHUAHEUAHEUAUUHAHUEHUAUHAHUEHUAUHEHUAHAHUEAHAOEHOOOHOAHOEUAHE
    var TrainObjectBuilder = function(name, destination, firstArrival, freq) {
        this.trainName = name;
        this.trainDestination = destination;
        this.trainFirstArrival = firstArrival;
        this.trainFrequency = freq;
    };

    // why is this even here
    var audio = new Audio("assets/audio/annoying.webm");
    document.getElementById("THOMASSS").addEventListener('click', function() {
        audio.pause(); // so spam clicking Thomas won't wreck innocent ears
        audio.play();
        document.getElementById("toldU").textContent = "Pause functionality was deemed to be below the line.  Sorry.  Maybe next sprint aka never.";
    });

});