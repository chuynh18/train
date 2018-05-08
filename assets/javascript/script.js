"use strict";

var database = firebase.database();
var trainData = [];

// populate table on page with info contained in trainData
var populateTable = function() {
    $("#trainSchedule").empty();
    for (var i = 0; i < trainData.length; i++) {
        var newRow = $("<tr>");
        var tName = $("<td>");
        var tDest = $("<td>");
        var tFreq = $("<td>");
        var tNA = $("<td>"); // next arrival
        var tMinAway = $("<td>"); // minutes away
        
        tName.text(trainData[i].trainName);
        tDest.text(trainData[i].trainDestination);
        tFreq.text(trainData[i].trainFrequency);
        // text for next arrival
        // text for minutes away
        
        newRow.append(tName);
        newRow.append(tDest);
        newRow.append(tFreq);
        // append first arrival - need to do the logic for that first
        // append minutes away - need to do the logic for that first

        // append to the table!
        $("#trainSchedule").append(newRow);
    };
};

// firebase functions...
// read from Firebase and populate table
var readFromFirebase = function() {
    database.ref().on("value", function(snapshot) {
    console.log(snapshot.val());
    // write what Firebase gave us into trainData
    trainData = snapshot.val().trains;
    populateTable();
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
    });
};

// ------------- let's start with some function calls -------------

// write to Firebase
var writeToFirebase = function() {
    database.ref().set({trains: trainData});
};

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
        console.log("var localTrainName is: " + localTrainName);
        console.log("var localDestination is: " + localDestination);
        console.log("var localTrainFirstArrival is: " + localTrainFirstArrival);
        console.log("var localFrequency is: " + localFrequency);

        // check for dupes
        var isDupe = false;
        for (var i = 0; i < trainData.length; i++) {
            if (trainData[i].trainName === localTrainName) {
                // set isDupe = true if it is a dupe
                isDupe = true;
                console.log(isDupe);
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
var TrainObjectBuilder = function(name, destination, firstArrival, freq) {
    this.trainName = name;
    this.trainDestination = destination;
    this.trainFirstArrival = firstArrival;
    this.trainFrequency = freq;
};
