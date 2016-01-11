/**
 * Created by dougritzinger on 10/20/15.
 */
app.controller('MyTripsController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){

    console.log('reached the My Trips controller');

    $scope.noTripsSelected=true;  //default to don't display trip info and headers

    var loggedInAs = $rootScope.loggedInAs;
    $scope.loggedInAs = loggedInAs;

    var userProfile = {};
    $scope.tripsImTaking =[];

    //get the mongo__id of the trips being taken from the user's profile
    $http.get('users/getUser/'+loggedInAs).then(function(response) {
        userProfile = response.data;
        mongoTripIds = userProfile.takingTrips;

        //get the trip information for each trip
        //so the trip names can be retrieved from the trip db entries and listed
        for (var i=0;i<mongoTripIds.length;i++) {
            var tripId=mongoTripIds[i];
            $http.get('db/getTrip/' + tripId).then(function (response) {
                var tripNameAndId =[response.data.trip,response.data._id];
                //populate array of trips being taken taken
                $scope.tripsImTaking.push(tripNameAndId);
            })
        }
    });





    //a trip has been clicked on, get the trip info and display it

    $scope.showTripInfo = function() {
        $scope.noTripsSelected = false;  //display trip info and headers
        console.log('MyTripsController: Saw showTripInfo click');
        $http.get('db/getTrip/' + this.trip[1]).then(function (response) {
            $scope.trip = response.data;
        });
    };


    // View trip information button has been clicked.
    // Open the file in the browser if pdf
    // Automatically moves it into the downloads folder if not pdf

    //get the extension from a filename, rtn includes the "."
    // -for use when working with mongoose-generated filenames
    // -not currently being used
    function getExtension(stringIn){
        var extStart=0;
        for (var i=(stringIn.length-1);i>0;i--){
            if(stringIn.charAt(i)==".")extStart=i;
        }
        return stringIn.slice(extStart);
    }

    $scope.openAttachment = function() {
        console.log('MyTripsController: saw openAttachment click');
        var doc_href = "tripInfo/"+this.attachment;

        //create path to attached document
        doc_href = "tripInfo/"+this.attachment[1];

        //Access the trip document
        window.open(doc_href,'resizable, scrollbars');
    }


}]);