/**
 * Created by dougritzinger on 10/21/15.
 */
app.controller('AdminController', ['$scope', "$http", function($scope, $http){

    console.log('reached the Admin controller');
    $scope.message = "Welcome to the admin page.";


//create a time
    var timeNow = new Date();
    $scope.timenow = timeNow;

    var timeFuture = new Date(2016, 04, 02);
    $scope.othertime = timeFuture;

    var difference = timeFuture - timeNow;
    $scope.difference = difference;



//create a trip
$scope.submitTrip = function(){
    console.log('Saw Submit Trip Click');
    console.log("date input: ",$scope.dateInput);
    var rawDate=new Date($scope.dateInput);  //2016, 03, 23 //year, month: 0~11, day: 1:31
    var date =rawDate.toDateString();
    var dateMs =rawDate.getTime();
    var tripData                = {};
        tripData.id             = $scope.id;
        tripData.linkId         = $scope.linkId;
        tripData.trip           = $scope.trip;
        tripData.date           = date;
        tripData.dateMs         = dateMs;
        tripData.difficulty     = $scope.difficulty;
        tripData.description    = $scope.description;
        tripData.leader         = $scope.leader;
        tripData.attachments    = [];
        //tripData.attachments[0] = "I am attachment 1";
        //tripData.attachments[1] = "I am attachment 2";
        //tripData.attachments[2] = "I am attachment 3";
        tripData.putInMap       = "https://www.google.com/maps/@46.250736,-93.5515915,6.44z?hl=en";
        tripData.shuttleMap     = "https://www.google.com/maps/@46.250736,-93.5515915,6.44z?hl=en";
        tripData.attending      = [];

    console.log(tripData);

    $http({
        method: "POST",
        url: "db/addTrip",
        data: tripData
    }).then(function (response) {
        console.log('client reg response ', response);
        if(response.status == "200") {
            console.log("client: trip added succesfully");
        } else {
            console.log('There was an error registering')
        }
    });
}




//create a home page message
    function createHomeMessage(){
        var message={};
            message.content = "Thanks for paddling with us in 2015.  Check back with us in the spring for the 2016 season of trips.";
        console.log(message);
        $http({
            method: "POST",
            url: "db/addHomeMessage",
            data: message
        }).then(function (response) {
            console.log('client reg response ', response);
            if(response.status == "200") {
                console.log("client: home message added successfully");
            } else {
                console.log('There was an error saving this message')
            }
        });
    }
//createHomeMessage();



//create a message
    function createMessage(){
        var message={};
            message.date = "10/22/2015"
            message.content = "Hey, its Doug.  Does anyone from the northeast metro want to carpool this Saturday?";
        console.log(message);
        $http({
            method: "POST",
            url: "db/addMessage",
            data: message
        }).then(function (response) {
            console.log('client reg response ', response);
            if(response.status == "200") {
                console.log("client: message added successfully");
            } else {
                console.log('There was an error saving this message')
            }
        });
    }
//createMessage();




}]);