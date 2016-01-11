/**
 * Created by dougritzinger on 10/20/15.
 */
app.controller('TripLeaderController', ['$scope','$rootScope','$http', "Upload", function($scope, $rootScope, $http, Upload){

    console.log('reached the Trip Leader controller');

    var tripLeaderProfile ={};
    $scope.description="";

    //get trip leader's profile and find out what trips they lead
    function loadThisPage() {
        $http.get('users/getUser/' + $rootScope.loggedInAs).then(function (response) {
            tripLeaderProfile = response.data;

            var numTrips = tripLeaderProfile.leadingTrips.length;
            var tripIds = tripLeaderProfile.leadingTrips;
            var tripId = tripIds[0];

            //get the data for that trip and display it
            $http({
                method: "POST",  //really a get with params in request body
                url: 'db/getTripByParam',
                data: {id: tripId}
            }).then(function (response) {
                $scope.tripID = response.data._id;
                $scope.date = response.data.date;
                $scope.trip = response.data.trip;
                $scope.description = response.data.description;
                $scope.attachments = response.data.attachments;
                $scope.attending = response.data.attending;
                $scope.putInMap = response.data.putInMap;
                $scope.shuttleMap = response.data.shuttleMap;

                //set up the trip data edit box default
                //$scope.editTripDescription = $scope.description; //load the db description as initial text

            });
        });
    }
    loadThisPage();


    // Done with page load, now respond to buttons //


    // save edited trip description to the database
    $scope.saveTripDescriptionEdits = function(){
        console.log('TripLeaderController: saw Trip Description - save edits click');
        var txData = {id:$scope.tripID, description:$scope.editedTripDescription};
        $http({
            method: "POST",  //really a get with params in request body
            url: 'db/updateTripDescription',
            data: txData
        }).then(function(response){
            //update the html page
            $scope.description = $scope.editedTripDescription;
        });
    };


    // respond to send info button
    $scope.sendInfo = function(){
        console.log('TripLeaderController: saw Send Info click');

        //get username and tripID
        var username = this.attendee.username;
        var updateTrips={
            username: this.attendee.username,
            tripId:   $scope.tripID
        };

        //add this trip to the users profile - takingTrips list
        $http({method:"POST", url:"/users/updateUser", data:updateTrips}).then(
            console.log('TripLeaderController: trip added to the users trip list'));

        //update trip list to show that the data has been sent

        //get trip
        $http({
            method: "POST",  //really a get with params in request body
            url: 'db/getTripByParam',
            data: {_id : $scope.tripID}
        }).then(function(response){
            $scope.attending = response.data.attending;

            //find the correct user in the attending array
            // and change the status from not sent to sent
            for (var i= 0;i<$scope.attending.length;i++){
                if($scope.attending[i].username == username){
                    $scope.attending[i].sent = "sent";
                }
            }

            // update the array in the db
            $http({
                method: "POST",  //really a get with params in request body
                url: 'db/updateTripAttending',
                data:  {id : $scope.tripID,
                        updateData: $scope.attending}
            }).then(function(response) {
            });
        });
    };


    // add an attachment - trip data pdfs, etc. //
    $scope.addAttachment=function(){
        console.log('TripLeaderControler: saw addAttachment click');
        $scope.upload($scope.file);
    };

    //upload the selected file
    $scope.upload = function (file) {
        Upload.upload({
            url: '/db/addAttachment',
            data: {file: file, tripId:$scope.tripID} //, swatchData: $scope.swatchForm}
        }).then(function (resp) {
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        }).then(function(){
            loadThisPage();
        });
    };



    // respond to add Put In map button //
    $scope.savePutInMap = function(){
        $http({
            method: "POST",
            url: 'db/putInMap',
            data:  {id : $scope.tripID,
                putInMapString: $scope.putInMapString}
        });
    };


    // respond to add Shuttle map button  //
    $scope.saveShuttleMap = function(){
        $http({
            method: "POST",
            url: 'db/shuttleMap',
            data:  {id : $scope.tripID,
                shuttleMapString: $scope.shuttleMapString}
        });
    };

}]);