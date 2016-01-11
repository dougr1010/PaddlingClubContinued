/**
 * Created by dougritzinger on 10/20/15.
 */
app.controller('HomeController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){

    console.log('reached the home controller');

    $scope.showMessageEdit = ($rootScope.isPresident || $rootScope.isTripLeader || $rootScope.isWebMaster);


    // Get the description for the next upcoming trip //
    $http.get('db/getTrip').then(function(response) {


        var numTrips=response.data.length;
        var today = new Date();
        var todayMs = today.getTime();

        //start with delta to first trip on the list
        var nearestTripIndex = 0;
        var nearestTripDelta = response.data[0].dateMs - todayMs;
        var currentDelta = 0;

        // loop through the trips and find the nearest future trip
        for (var i=0; i<numTrips; i++){
            currentDelta =response.data[i].dateMs-todayMs;
            if ((currentDelta < nearestTripDelta)&&(currentDelta > 0)){
                nearestTripIndex=i;
                nearestTripDelta=currentDelta;
            }
        }

        // display the nearest trip //
        $scope.nextTripDate = response.data[nearestTripIndex].date;
        $scope.nextTripTitle = response.data[nearestTripIndex].trip;
        $scope.nextTrip = response.data[nearestTripIndex].description;
        $scope.mongoId = response.data[nearestTripIndex]._id;
    });


    // Get the and display club message //
    $http.get('db/getHomeMessage').then(function(response) {
        $scope.homeMessage = response.data[0].content;
        $scope.homeMessageId = response.data[0]._id;
    });



    // Handle information request //
    $scope.reqInfo = function(){
        console.log('HomeController: saw Request Information click');

        //they must be logged in to request info
        if($rootScope.loggedInAs == 'undefined') {
            alert('Please register or sign in before requesting trip information.  Thanks :)');
            $location.path('/loginorregister');
        } else {
            //create new attendee
            var updateAttending = {
                id : $scope.mongoId,
                username: $rootScope.loggedInAs,
                sent: "not sent",
                declined: "not declined"
            };
            // update the database and add their username to the trip attendees array
            $http({method:"POST", url:"/db/updateTripAdd", data:updateAttending}).then(
                console.log('HomeController: added new request to attending list'));

            alert('Thank you for your request, it has been sent to the trip leader.');
        }
    };



    $scope.saveMessage = function(){
        console.log('HomeController: **** saw Save Message click ****');
        $scope.homeMessage = $scope.messageEditBox;
        var jString={
            _id : $scope.homeMessageId,
            content : $scope.messageEditBox
        };
        $http({method:"post", url: "db/updateHomeMessage", data:jString});
    }

}]);