/**
 * Created by dougritzinger on 10/20/15.
 */
app.controller('RiversController', ['$scope', '$rootScope', '$http', '$location', '$anchorScroll', function($scope, $rootScope, $http, $location, $anchorScroll){


    console.log('reached the Rivers controller');


    //get and display list of trips in database
    $http.get('db/getTrip').then(function(response) {
        $scope.rivers = response.data;
    });


    //respond to the Get Info button
    $scope.reqInfo = function(){
        console.log('RiversController: saw Request Info click');

        //they must be logged in to request info
        if((typeof $rootScope.loggedInAs == 'undefined') || (typeof $rootScope.loggedInAs != 'string')) {
            alert('Please register or sign in before requesting trip information.  Thank you!');
            $location.path('/loginorregister');
        } else {
            //create new attendee
            var updateAttending = {
                id : this.river._id,
                username: $rootScope.loggedInAs,
                sent: "not sent",
                declined: "not declined"
                };
            //update the database with new attendee
            $http({method:"POST", url:"/db/updateTripAdd", data:updateAttending}).then(
                alert('Thank you for your request, it has been sent to the trip leader.'))
        }
    }

}]);