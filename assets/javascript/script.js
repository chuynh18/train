"use strict";

var trainData = [];

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
                isDupe = true;
                console.log(isDupe);
            };
        };

        // if it's a dupe, alert the user, clear out only the trainName entry box, reset isDupe to false
        if (isDupe === true) {
            $("#trainName").val("");
            isDupe = false;
            alert("Please use a different train name; the one you just used is a duplicate.")
        }

        // else, accept it
        else {
            // construct object and push to array
            trainData.push(new TrainObjectBuilder(localTrainName, localDestination, localTrainFirstArrival, localFrequency));
            console.log(trainData);
            // clear form because we love our users and we love good UX
            $("#trainName").val("");
            $("#trainDestination").val("");
            $("#trainFirstArrival").val("");
            $("#trainFrequency").val("");
        };
    };

});

// makes an object for each train
var TrainObjectBuilder = function(name, destination, firstArrival, freq) {
    this.trainName = name;
    this.trainDestination = destination;
    this.trainFirstArrival = firstArrival;
    this.trainFrequency = freq;
};